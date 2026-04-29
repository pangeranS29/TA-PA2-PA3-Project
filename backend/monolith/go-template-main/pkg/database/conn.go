package database

import (
	"errors"
	"fmt"

	"github.com/glebarez/sqlite"
	"gorm.io/driver/mysql"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var ErrInvalidArgs = errors.New("nil arg or invalid argument")

var typeDBDriverMapping = map[DBType]string{
	Postgres: postgresDriverName,
	Mysql:    mysqlDriverName,
}

func GetConnection(arg *Args) (db *gorm.DB, err error) {
	if arg == nil || !arg.IsValid() {
		err = ErrInvalidArgs
		return
	}

	driver := typeDBDriverMapping[arg.DBType]
	if driver == "" {
		driver = mysqlDriverName
	}

	urlStr := GetURLString(arg)
	switch driver {
	case postgresDriverName:
		db, err = gorm.Open(postgres.New(postgres.Config{
			DSN:                  urlStr,
			PreferSimpleProtocol: true,
		}), &gorm.Config{})
		if err != nil {
			fallbackDB, fallbackErr := gorm.Open(sqlite.Open("tmp/local.db"), &gorm.Config{})
			if fallbackErr != nil {
				return nil, fmt.Errorf("postgres connection failed: %w; sqlite fallback failed: %v", err, fallbackErr)
			}
			db = fallbackDB
			err = nil
		}
	case mysqlDriverName:
		db, err = gorm.Open(mysql.Open(urlStr), &gorm.Config{})
		if err != nil {
			return
		}
	}

	dbx, err := db.DB()
	dbx.SetConnMaxIdleTime(arg.ConnMaxLifetime)
	dbx.SetConnMaxLifetime(arg.ConnMaxLifetime)
	dbx.SetMaxOpenConns(arg.MaxOpenConns)
	dbx.SetMaxIdleConns(arg.MaxIdleConns)
	return
}

type RWConnection struct {
	Read  *gorm.DB
	Write *gorm.DB
}

func GetReadWriteConnection(read *Args, write *Args) (conn *RWConnection, err error) {
	if read == nil || !read.IsValid() || write == nil || !write.IsValid() {
		err = ErrInvalidArgs
		return
	}

	rConn, err := GetConnection(read)
	if err != nil {
		return
	}

	wConn, err := GetConnection(write)
	if err != nil {
		return
	}

	conn = &RWConnection{
		Read:  rConn,
		Write: wConn,
	}
	return
}
