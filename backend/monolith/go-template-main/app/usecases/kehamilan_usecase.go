package usecases

import (
	"math"
	"monitoring-service/app/models"
	"time"
)

func (m *Main) GetActiveKehamilanDetail(userId uint) (*models.Kehamilan, error) {
	kehamilan, err := m.repository.GetActiveKehamilanByUserId(userId)
	if err != nil {
		return nil, err
	}

	if kehamilan.HPHT != nil {
		now := time.Now()
		duration := now.Sub(*kehamilan.HPHT)
		days := duration.Hours() / 24
		weeks := uint8(math.Floor(days / 7))
		
		kehamilan.UmurKehamilanHPHT = weeks
	}

	return kehamilan, nil
}