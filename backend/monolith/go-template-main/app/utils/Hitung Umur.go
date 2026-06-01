
package utils

import "time"

func HitungUmur(tanggalLahir time.Time) int {

	now := time.Now()

	umur := now.Year() - tanggalLahir.Year()

	// cek apakah ulang tahun tahun ini sudah lewat
	if now.Month() < tanggalLahir.Month() ||
		(now.Month() == tanggalLahir.Month() &&
			now.Day() < tanggalLahir.Day()) {

		umur--
	}

	return umur
}