package main

import (
	"bytes"
	"crypto/hmac"
	"crypto/rand"
	"crypto/sha256"
	"database/sql"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
)

// Handler holds shared dependencies for all endpoint handlers.
type Handler struct {
	db *sql.DB
}

// ── Asset catalog (hardcoded for demo) ───────────────────────────────────────

var assetCatalog = map[string]struct {
	Name          string
	PriceMYR      float64
	ProjectedLift float64
}{
	"barber_chair_v2":     {"Professional Barber Chair", 3000, 0.40},
	"clipper_set_pro":     {"Pro Clipper Set", 850, 0.20},
	"commercial_oven_30l": {"Commercial Oven 30L", 4200, 0.35},
	"packaging_machine":   {"Packaging Machine", 2800, 0.30},
	"dslr_kit":            {"DSLR Photography Kit", 5500, 0.45},
	"motorcycle_wave":     {"Honda Wave 125", 6800, 0.50},
	"led_lighting_kit":    {"LED Lighting Kit", 1200, 0.25},
	"pos_terminal":        {"POS Terminal", 950, 0.15},
}

// ── GET /api/workers/:id ─────────────────────────────────────────────────────

func (h *Handler) GetWorker(c *gin.Context) {
	workerID := c.Param("id")

	var worker struct {
		WorkerID  string    `json:"worker_id"`
		FullName  string    `json:"name"`
		Trade     string    `json:"trade"`
		Zone      string    `json:"zone"`
		JoinedAt  time.Time `json:"joined_at"`
		Score     *int      `json:"score,omitempty"`
		Tier      *string   `json:"tier,omitempty"`
		Drivers   any       `json:"drivers,omitempty"`
	}

	row := h.db.QueryRow(`
		SELECT w.worker_id, w.full_name, w.trade, w.zone, w.joined_at,
		       s.score, s.tier, s.drivers
		FROM workers w
		LEFT JOIN layak_scores s ON s.worker_id = w.worker_id
		WHERE w.worker_id = $1
	`, workerID)

	var driversRaw sql.NullString
	var score sql.NullInt64
	var tier sql.NullString

	if err := row.Scan(&worker.WorkerID, &worker.FullName, &worker.Trade, &worker.Zone,
		&worker.JoinedAt, &score, &tier, &driversRaw); err != nil {
		if err == sql.ErrNoRows {
			c.JSON(404, gin.H{"error": "worker not found"})
			return
		}
		c.JSON(500, gin.H{"error": err.Error()})
		return
	}

	if score.Valid {
		v := int(score.Int64)
		worker.Score = &v
	}
	if tier.Valid {
		worker.Tier = &tier.String
	}
	if driversRaw.Valid {
		var d any
		_ = json.Unmarshal([]byte(driversRaw.String), &d)
		worker.Drivers = d
	}

	// Fetch 6-month monthly earnings for chart
	rows, err := h.db.Query(`
		SELECT DATE_TRUNC('month', occurred_at) AS month,
		       SUM(amount_myr) AS total
		FROM transactions
		WHERE worker_id = $1
		  AND occurred_at >= NOW() - INTERVAL '6 months'
		GROUP BY 1 ORDER BY 1
	`, workerID)
	if err == nil {
		defer rows.Close()
		var earnings []float64
		for rows.Next() {
			var month time.Time
			var total float64
			_ = rows.Scan(&month, &total)
			earnings = append(earnings, total)
		}
		c.JSON(200, gin.H{
			"worker_id":           worker.WorkerID,
			"name":                worker.FullName,
			"trade":               worker.Trade,
			"zone":                worker.Zone,
			"joined_at":           worker.JoinedAt,
			"score":               gin.H{"value": worker.Score, "tier": worker.Tier, "drivers": worker.Drivers},
			"earnings_6mo_monthly": earnings,
		})
		return
	}

	c.JSON(200, worker)
}

// ── GET /api/market/:trade/:zone ─────────────────────────────────────────────

func (h *Handler) GetMarket(c *gin.Context) {
	trade := c.Param("trade")
	zone := c.Param("zone")

	row := h.db.QueryRow(`
		WITH monthly AS (
			SELECT t.worker_id,
			       SUM(t.amount_myr) / 6.0 AS monthly_avg
			FROM transactions t
			JOIN workers w ON w.worker_id = t.worker_id
			WHERE w.trade = $1 AND w.zone = $2
			  AND t.occurred_at >= NOW() - INTERVAL '6 months'
			GROUP BY t.worker_id
		)
		SELECT
			COUNT(*)                                                            AS n_workers,
			COALESCE(AVG(monthly_avg), 0)                                       AS avg_monthly,
			COALESCE(PERCENTILE_CONT(0.25) WITHIN GROUP (ORDER BY monthly_avg), 0) AS p25,
			COALESCE(PERCENTILE_CONT(0.75) WITHIN GROUP (ORDER BY monthly_avg), 0) AS p75
		FROM monthly
	`, trade, zone)

	var n int
	var avg, p25, p75 float64
	if err := row.Scan(&n, &avg, &p25, &p75); err != nil {
		c.JSON(500, gin.H{"error": err.Error()})
		return
	}

	c.JSON(200, gin.H{
		"trade":           trade,
		"zone":            zone,
		"n_workers":       n,
		"avg_monthly_myr": avg,
		"p25_monthly_myr": p25,
		"p75_monthly_myr": p75,
	})
}

// ── POST /api/score/compute ──────────────────────────────────────────────────

func (h *Handler) ComputeScore(c *gin.Context) {
	var req struct {
		WorkerID string `json:"worker_id" binding:"required"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	// Proxy to FastAPI score service
	scoreURL := envOr("SCORE_SERVICE_URL", "http://localhost:8001") + "/score/compute"
	body, _ := json.Marshal(req)

	resp, err := http.Post(scoreURL, "application/json", bytes.NewReader(body))
	if err != nil {
		c.JSON(502, gin.H{"error": "score service unavailable", "detail": err.Error()})
		return
	}
	defer resp.Body.Close()

	respBody, _ := io.ReadAll(resp.Body)
	c.Data(resp.StatusCode, "application/json", respBody)
}

// ── POST /api/bnpl/quote ─────────────────────────────────────────────────────

func (h *Handler) CreateBnplQuote(c *gin.Context) {
	var req struct {
		WorkerID string `json:"worker_id" binding:"required"`
		AssetSKU string `json:"asset_sku" binding:"required"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	asset, ok := assetCatalog[req.AssetSKU]
	if !ok {
		c.JSON(404, gin.H{"error": "unknown asset_sku"})
		return
	}

	// Fetch worker score
	var score sql.NullInt64
	_ = h.db.QueryRow(`SELECT score FROM layak_scores WHERE worker_id = $1`, req.WorkerID).Scan(&score)

	tenorMonths := 12
	monthly := asset.PriceMYR / float64(tenorMonths) * 1.12 // ~12% APR simplified
	approvalStatus := "approved"
	approvalReason := "layak_score_qualifies"
	if score.Valid && score.Int64 < 580 {
		approvalStatus = "declined"
		approvalReason = "layak_score_below_threshold"
	}

	quoteID := "q_" + shortID()
	_, _ = h.db.Exec(`
		INSERT INTO bnpl_quotes (quote_id, worker_id, asset_sku, asset_price_myr,
		                         tenor_months, monthly_myr, projected_lift, approval_status)
		VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
	`, quoteID, req.WorkerID, req.AssetSKU, asset.PriceMYR, tenorMonths,
		roundTo2(monthly), asset.ProjectedLift, approvalStatus)

	c.JSON(200, gin.H{
		"quote_id": quoteID,
		"asset": gin.H{
			"sku":       req.AssetSKU,
			"name":      asset.Name,
			"price_myr": asset.PriceMYR,
		},
		"tenor_months":       tenorMonths,
		"monthly_myr":        roundTo2(monthly),
		"projected_lift_pct": int(asset.ProjectedLift * 100),
		"approval_status":    approvalStatus,
		"approval_reason":    approvalReason,
	})
}

// ── POST /api/credentials/issue ──────────────────────────────────────────────

func (h *Handler) IssueCredential(c *gin.Context) {
	var req struct {
		WorkerID   string   `json:"worker_id" binding:"required"`
		LenderID   string   `json:"lender_id" binding:"required"`
		Scope      []string `json:"scope"`
		TTLSeconds int      `json:"ttl_seconds"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}
	if req.TTLSeconds <= 0 {
		req.TTLSeconds = 3600
	}

	// Fetch worker + score
	var worker struct {
		Trade    string
		Zone     string
		Tenure   int
		JoinedAt time.Time
	}
	var score int
	var tier string
	var driversRaw sql.NullString
	err := h.db.QueryRow(`
		SELECT w.trade, w.zone, w.joined_at,
		       COALESCE(s.score, 0), COALESCE(s.tier, 'building'), s.drivers
		FROM workers w
		LEFT JOIN layak_scores s ON s.worker_id = w.worker_id
		WHERE w.worker_id = $1
	`, req.WorkerID).Scan(&worker.Trade, &worker.Zone, &worker.JoinedAt, &score, &tier, &driversRaw)
	if err != nil {
		c.JSON(404, gin.H{"error": "worker not found"})
		return
	}

	now := time.Now()
	exp := now.Add(time.Duration(req.TTLSeconds) * time.Second)
	credID := "lyk_" + fmt.Sprintf("%d", now.Unix())[:4] + "_" + shortID()

	// Fetch 6-month average earnings
	var earningsAvg float64
	_ = h.db.QueryRow(`
		SELECT COALESCE(SUM(amount_myr) / 6.0, 0)
		FROM transactions
		WHERE worker_id = $1 AND occurred_at >= NOW() - INTERVAL '6 months'
	`, req.WorkerID).Scan(&earningsAvg)

	tenureMonths := int(now.Sub(worker.JoinedAt).Hours() / 720)

	claims := jwt.MapClaims{
		"iss": envOr("LAYAK_ISSUER", "tng.layak.my"),
		"sub": req.WorkerID,
		"iat": now.Unix(),
		"exp": exp.Unix(),
		"jti": credID,
		"credential": map[string]any{
			"score":                  score,
			"tier":                   tier,
			"earnings_6mo_monthly_avg": roundTo2(earningsAvg),
			"tenure_months":          tenureMonths,
			"trade":                  worker.Trade,
			"zone":                   worker.Zone,
		},
		"consent": map[string]any{
			"scope":      req.Scope,
			"lender_id":  req.LenderID,
			"expires_at": exp.Unix(),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	signed, err := token.SignedString([]byte(envOr("JWT_SECRET", "dev-secret")))
	if err != nil {
		c.JSON(500, gin.H{"error": "signing failed"})
		return
	}

	scopeJSON, _ := json.Marshal(req.Scope)
	_, _ = h.db.Exec(`
		INSERT INTO credentials (credential_id, worker_id, lender_id, scope, jwt, issued_at, expires_at)
		VALUES ($1,$2,$3,$4,$5,$6,$7)
	`, credID, req.WorkerID, req.LenderID, scopeJSON, signed, now, exp)

	c.JSON(201, gin.H{
		"credential_id": credID,
		"jwt":           signed,
		"expires_at":    exp.Format(time.RFC3339),
	})
}

// ── GET /api/credentials/pull/:workerId ──────────────────────────────────────

func (h *Handler) PullCredential(c *gin.Context) {
	lenderID := c.GetHeader("X-Lender-Id")
	lenderKey := c.GetHeader("X-Lender-Key")
	workerID := c.Param("workerId")

	// Validate lender key (demo: check against env)
	expectedKey := envOr("LENDER_KEY_"+lenderID, "demo-aeon-key")
	if lenderKey != expectedKey {
		c.JSON(401, gin.H{"error": "invalid lender key"})
		return
	}

	// Find most recent valid credential for this worker+lender
	var credID, signed string
	var issuedAt, expiresAt time.Time
	err := h.db.QueryRow(`
		SELECT credential_id, jwt, issued_at, expires_at
		FROM credentials
		WHERE worker_id = $1 AND lender_id = $2
		  AND revoked_at IS NULL
		  AND expires_at > NOW()
		ORDER BY issued_at DESC
		LIMIT 1
	`, workerID, lenderID).Scan(&credID, &signed, &issuedAt, &expiresAt)

	if err == sql.ErrNoRows {
		// Auto-issue a fresh credential for demo convenience
		c.JSON(404, gin.H{
			"error":  "no active credential found",
			"hint":   "call POST /api/credentials/issue first",
			"worker": workerID,
			"lender": lenderID,
		})
		return
	}
	if err != nil {
		c.JSON(500, gin.H{"error": err.Error()})
		return
	}

	// Parse and verify JWT
	token, err := jwt.Parse(signed, func(t *jwt.Token) (any, error) {
		if _, ok := t.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method")
		}
		return []byte(envOr("JWT_SECRET", "dev-secret")), nil
	})

	sig := hmacHex(signed, envOr("JWT_SECRET", "dev-secret"))

	resp := gin.H{
		"credential_id":       credID,
		"issuer":              envOr("LAYAK_ISSUER", "tng.layak.my"),
		"subject":             workerID,
		"issued_at":           issuedAt.Format(time.RFC3339),
		"expires_at":          expiresAt.Format(time.RFC3339),
		"signature_algorithm": "HS256",
		"signature":           sig,
		"verified":            err == nil && token.Valid,
	}

	if claims, ok := token.Claims.(jwt.MapClaims); ok {
		resp["verified_payload"] = claims["credential"]
	}

	c.JSON(200, resp)
}

// ── Helpers ──────────────────────────────────────────────────────────────────

func shortID() string {
	b := make([]byte, 4)
	_, _ = rand.Read(b)
	return hex.EncodeToString(b)
}

func roundTo2(v float64) float64 {
	return float64(int(v*100+0.5)) / 100
}

func hmacHex(data, secret string) string {
	mac := hmac.New(sha256.New, []byte(secret))
	mac.Write([]byte(data))
	return hex.EncodeToString(mac.Sum(nil))[:16]
}

// Seed ingestion script lives at cmd/seed/main.go (Fiz owns)
