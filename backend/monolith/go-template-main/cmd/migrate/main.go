package main

import (
	"fmt"
	"log"
	"monitoring-service/pkg/config"
	"monitoring-service/pkg/database"

	"gorm.io/gorm"
)

func main() {
	// Load configuration
	cfg := config.NewConfig()

	// Get PostgreSQL write connection config
	postgresConfig := cfg.Database.Postgres.Write

	// Convert to database args
	dbArgs := &database.Args{
		DSN:             postgresConfig.DSN,
		Username:        postgresConfig.Username,
		Password:        postgresConfig.Password,
		Host:            postgresConfig.URL,
		Port:            postgresConfig.Port,
		Database:        postgresConfig.Name,
		Schema:          postgresConfig.Schema,
		Flavor:          postgresConfig.Flavor,
		MaxIdleConns:    postgresConfig.MaxIdleConns,
		MaxOpenConns:    postgresConfig.MaxOpenConns,
		ConnMaxLifetime: postgresConfig.MaxLifetime,
		Location:        postgresConfig.Location,
		Timeout:         postgresConfig.Timeout,
		DBType:          database.Postgres,
		ConnType:        database.WriteConn,
	}

	// Initialize database connection
	db, err := database.GetConnection(dbArgs)
	if err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}

	// Run migration
	if err := migrateRujukanSource(db); err != nil {
		log.Fatalf("Migration failed: %v", err)
	}

	fmt.Println("Migration completed successfully!")
}

func migrateRujukanSource(db *gorm.DB) error {
	// Check if column exists
	var columnExists bool
	err := db.Raw(`
		SELECT EXISTS (
			SELECT 1
			FROM information_schema.columns
			WHERE table_name = 'rujukan'
			AND column_name = 'source'
		)
	`).Scan(&columnExists).Error

	if err != nil {
		return fmt.Errorf("failed to check column existence: %w", err)
	}

	if columnExists {
		fmt.Println("Column 'source' already exists in rujukan table")
		return nil
	}

	// Add the column
	err = db.Exec(`
		ALTER TABLE rujukan
		ADD COLUMN source VARCHAR(50) DEFAULT 'anc'
	`).Error

	if err != nil {
		return fmt.Errorf("failed to add source column: %w", err)
	}

	// Update existing records
	err = db.Exec(`
		UPDATE rujukan SET source = 'anc' WHERE source IS NULL OR source = ''
	`).Error

	if err != nil {
		return fmt.Errorf("failed to update existing records: %w", err)
	}

	// Create index for better filtering performance
	err = db.Exec(`
		CREATE INDEX IF NOT EXISTS idx_rujukan_source ON rujukan(source)
	`).Error

	if err != nil {
		return fmt.Errorf("failed to create index: %w", err)
	}

	fmt.Println("Successfully added 'source' column to rujukan table")
	return nil
}
