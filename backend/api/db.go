package main

import (
	"database/sql"
	"log"

	_ "github.com/lib/pq"
)

func dbConnect(dsn string) *sql.DB {
	db, err := sql.Open("postgres", dsn)
	if err != nil {
		log.Fatalf("db open: %v", err)
	}
	if err := db.Ping(); err != nil {
		log.Fatalf("db ping: %v — is Postgres running? try: make db-up", err)
	}
	db.SetMaxOpenConns(10)
	db.SetMaxIdleConns(5)
	log.Println("DB connected")
	return db
}
