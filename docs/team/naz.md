# Naz — DB · Deploy · CI

**Role:** Database schema, migrations, PostgreSQL local setup, CI pipeline (GitHub Actions), production deployment (Fly.io/Railway), Docker Compose, and Go API infrastructure skeleton.

---

## Module Ownership

| Module | Description |
|--------|-------------|
| `migrations/` | All 5 SQL migration files |
| `docker-compose.yml` | Local dev environment |
| `Makefile` | Dev shortcuts |
| `.github/workflows/ci.yml` | CI pipeline — must stay green on `main` |
| `backend/api/db.go` | Postgres connection + all SQL queries |
| `backend/api/main.go` | Go API entry point + router |
| `backend/api/handlers.go` | Handler stubs (Fiz fills in logic) |
| Deploy config | Fly.io/Railway — scheduled H18–H20 |

---

## Task Tracker

| Task | Status | Hour | Notes |
|------|--------|------|-------|
| Monorepo scaffold (directories, gitignore, env, Makefile) | ✅ Done | H0–H1 | |
| SQL migrations for all 5 tables | ✅ Done | H0–H1 | Applied locally via `make migrate` |
| docker-compose.yml with Postgres + healthcheck | ✅ Done | H0–H1 | |
| CI workflow (.github/workflows/ci.yml) | ✅ Done | H0–H1 | |
| Go API skeleton (main.go + handlers + db) | ✅ Done | H0–H1 | Stubs return mock JSON |
| `.env.example` wired | ✅ Done | H0–H1 | |
| `make db-up && make migrate` produces green output | 🔄 In progress | H1 | |
| Credential JWT signing in Go | ⬜ Todo | H6–H12 | Use `golang-jwt/jwt` |
| `GET /credentials/pull/:workerId` returns real JWT | ⬜ Todo | H12–H18 | |
| Fly.io / Railway deploy | ⬜ Todo | H18–H20 | |
| CI green on main (with deploy URL in README) | ⬜ Todo | H20 | |

---

## Status Updates

### H0–H1 (setup)
- Monorepo scaffold complete. All 5 migrations written.
- `docker-compose.yml` runs Postgres 16 with healthcheck.
- Go API skeleton compiles — all 6 endpoint stubs return mock JSON.
- CI workflow targets: `go build ./...`, `pytest test_score.py`, `npm run build`.
- Next: apply migrations against local Postgres, confirm DB queryable.

---

## Key commands

```bash
# Start DB
make db-up

# Apply migrations
make migrate

# Run API locally
make api     # Go API on :8080

# Run score service
make score   # FastAPI on :8001

# Run frontend
make frontend  # Vite on :5173

# Full CI check locally
make ci
```

---

## Credential signing (H6–H12)

The JWT format is defined in PRD §3.3. Implementation plan:

```go
import "github.com/golang-jwt/jwt/v5"

type LayakClaims struct {
    Credential CredentialPayload `json:"credential"`
    Consent    ConsentPayload    `json:"consent"`
    jwt.RegisteredClaims
}

token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
signed, _ := token.SignedString([]byte(os.Getenv("JWT_SECRET")))
```

---

## Deploy checklist (H18–H20)

- [ ] `fly launch` or `railway up` from repo root
- [ ] Set all env vars in dashboard
- [ ] Run migrations against prod DB
- [ ] Seed data ingested
- [ ] All 6 endpoints respond on prod URL
- [ ] Update README with deploy URL
- [ ] Tell Haziq the URL — he smoke-tests all 6 demo moments
