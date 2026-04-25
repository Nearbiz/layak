package main

import (
	"log"
	"os"

	"github.com/gin-gonic/gin"
)

func main() {
	db := dbConnect(envOr("DATABASE_URL", "postgres://layak:layak@localhost:5432/layak?sslmode=disable"))
	defer db.Close()

	r := gin.Default()
	r.Use(corsMiddleware())

	h := &Handler{db: db}

	api := r.Group("/api")
	{
		api.GET("/workers/:id", h.GetWorker)
		api.GET("/market/:trade/:zone", h.GetMarket)
		api.POST("/score/compute", h.ComputeScore)
		api.POST("/bnpl/quote", h.CreateBnplQuote)
		api.POST("/credentials/issue", h.IssueCredential)
		api.GET("/credentials/pull/:workerId", h.PullCredential)
	}

	r.GET("/health", func(c *gin.Context) { c.JSON(200, gin.H{"status": "ok"}) })

	port := envOr("API_PORT", "8080")
	log.Printf("Layak API starting on :%s", port)
	log.Fatal(r.Run(":" + port))
}

func envOr(key, fallback string) string {
	if v := os.Getenv(key); v != "" {
		return v
	}
	return fallback
}

func corsMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Header("Access-Control-Allow-Origin", "*")
		c.Header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
		c.Header("Access-Control-Allow-Headers", "Content-Type, X-Lender-Id, X-Lender-Key")
		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}
		c.Next()
	}
}
