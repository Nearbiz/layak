package main

import (
	"database/sql"
	"encoding/json"
	"log"
	"os"

	_ "github.com/lib/pq"
)

type Worker struct {
	WorkerID      string `json:"worker_id"`
	FullName      string `json:"full_name"`
	Trade         string `json:"trade"`
	Zone          string `json:"zone"`
	TNGAccountRef string `json:"tng_account_ref"`
	JoinedAt      string `json:"joined_at"`
	Status        string `json:"status"`
}

type Transaction struct {
	TxnID          string  `json:"txn_id"`
	WorkerID       string  `json:"worker_id"`
	AmountMYR      float64 `json:"amount_myr"`
	CounterpartyID string  `json:"counterparty_id"`
	Channel        string  `json:"channel"`
	OccurredAt     string  `json:"occurred_at"`
}

func main() {
	dsn := os.Getenv("DATABASE_URL")
	if dsn == "" {
		dsn = "postgres://layak:layak@localhost:5432/layak?sslmode=disable"
	}

	db, err := sql.Open("postgres", dsn)
	if err != nil {
		log.Fatalf("db open: %v", err)
	}
	defer db.Close()
	if err := db.Ping(); err != nil {
		log.Fatalf("db ping: %v", err)
	}

	seedWorkers(db)
	seedTransactions(db)
	log.Println("Seed complete.")
}

func seedWorkers(db *sql.DB) {
	data, err := os.ReadFile("../../seed/workers.json")
	if err != nil {
		log.Fatalf("read workers.json: %v — generate it first (Aein owns this)", err)
	}

	var workers []Worker
	if err := json.Unmarshal(data, &workers); err != nil {
		log.Fatalf("parse workers.json: %v", err)
	}

	tx, _ := db.Begin()
	stmt, _ := tx.Prepare(`
		INSERT INTO workers (worker_id, full_name, trade, zone, tng_account_ref, joined_at, status)
		VALUES ($1,$2,$3,$4,$5,$6,$7)
		ON CONFLICT (worker_id) DO NOTHING
	`)
	defer stmt.Close()

	for _, w := range workers {
		if w.Status == "" {
			w.Status = "active"
		}
		_, err := stmt.Exec(w.WorkerID, w.FullName, w.Trade, w.Zone, w.TNGAccountRef, w.JoinedAt, w.Status)
		if err != nil {
			log.Printf("insert worker %s: %v", w.WorkerID, err)
		}
	}
	tx.Commit()
	log.Printf("Seeded %d workers", len(workers))
}

func seedTransactions(db *sql.DB) {
	data, err := os.ReadFile("../../seed/transactions.json")
	if err != nil {
		log.Fatalf("read transactions.json: %v — generate it first (Aein owns this)", err)
	}

	var txns []Transaction
	if err := json.Unmarshal(data, &txns); err != nil {
		log.Fatalf("parse transactions.json: %v", err)
	}

	tx, _ := db.Begin()
	stmt, _ := tx.Prepare(`
		INSERT INTO transactions (txn_id, worker_id, amount_myr, counterparty_id, channel, occurred_at)
		VALUES ($1,$2,$3,$4,$5,$6)
		ON CONFLICT (txn_id) DO NOTHING
	`)
	defer stmt.Close()

	for _, t := range txns {
		if t.Channel == "" {
			t.Channel = "tng_qr"
		}
		_, err := stmt.Exec(t.TxnID, t.WorkerID, t.AmountMYR, t.CounterpartyID, t.Channel, t.OccurredAt)
		if err != nil {
			log.Printf("insert txn %s: %v", t.TxnID, err)
		}
	}
	tx.Commit()
	log.Printf("Seeded %d transactions", len(txns))
}
