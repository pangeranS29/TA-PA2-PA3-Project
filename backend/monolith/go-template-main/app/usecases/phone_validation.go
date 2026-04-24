package usecases

import (
	"errors"
	"regexp"
	"strings"
)

var nomorTeleponPattern = regexp.MustCompile(`^(\+62|62|0)8[0-9]{7,12}$`)

func validateNomorTeleponIndonesia(raw string) error {
	nomor := strings.TrimSpace(raw)
	if nomor == "" {
		return errors.New("nomor_telepon wajib diisi")
	}

	nomor = strings.ReplaceAll(nomor, " ", "")
	nomor = strings.ReplaceAll(nomor, "-", "")
	nomor = strings.ReplaceAll(nomor, "(", "")
	nomor = strings.ReplaceAll(nomor, ")", "")

	if !nomorTeleponPattern.MatchString(nomor) {
		return errors.New("format nomor telepon tidak valid")
	}

	return nil
}
