package docs

import "github.com/go-resty/resty/v2"

// Note: Fungsi init ini digunakan agar client terinisialisasi.
// Contoh berikut mencakup keseluruhan endpoint yang ada pada routes.go.

var client = resty.New().
	SetBaseURL("http://localhost:8080").
	SetHeader("Accept", "application/json")

func ExampleSemuaEndpoint() {
	var resp *resty.Response
	var err error

	// GET /health
	resp, err = client.R().
		SetAuthToken("your_token").
		Get("/health")

	// GET /debug-riwayat/:id
	resp, err = client.R().
		SetAuthToken("your_token").
		Get("/debug-riwayat/:id")

	// GET /debug-pemeriksaan/:id
	resp, err = client.R().
		SetAuthToken("your_token").
		Get("/debug-pemeriksaan/:id")

	// GET /debug-antropometri
	resp, err = client.R().
		SetAuthToken("your_token").
		Get("/debug-antropometri")

	// POST /auth/register
	resp, err = client.R().
		SetAuthToken("your_token").
		SetBody(map[string]any{
			"key": "value",
		}).
		Post("/auth/register")

	// POST /auth/login
	resp, err = client.R().
		SetAuthToken("your_token").
		SetBody(map[string]any{
			"key": "value",
		}).
		Post("/auth/login")

	// POST /auth/register/ortu
	resp, err = client.R().
		SetAuthToken("your_token").
		SetBody(map[string]any{
			"key": "value",
		}).
		Post("/auth/register/ortu")

	// GET /auth/me
	resp, err = client.R().
		SetAuthToken("your_token").
		Get("/auth/me")

	// POST /auth/logout
	resp, err = client.R().
		SetAuthToken("your_token").
		SetBody(map[string]any{
			"key": "value",
		}).
		Post("/auth/logout")

	// GET /informasi-umum/:id
	resp, err = client.R().
		SetAuthToken("your_token").
		Get("/informasi-umum/:id")

	// PUT /informasi-umum/:id
	resp, err = client.R().
		SetAuthToken("your_token").
		SetBody(map[string]any{
			"key": "value",
		}).
		Put("/informasi-umum/:id")

	// DELETE /informasi-umum/:id
	resp, err = client.R().
		SetAuthToken("your_token").
		Delete("/informasi-umum/:id")

	// GET /edukasi-imd
	resp, err = client.R().
		SetAuthToken("your_token").
		Get("/edukasi-imd")

	// GET /edukasi-kesehatan-mental
	resp, err = client.R().
		SetAuthToken("your_token").
		Get("/edukasi-kesehatan-mental")

	// GET /edukasi-menyusui-asi
	resp, err = client.R().
		SetAuthToken("your_token").
		Get("/edukasi-menyusui-asi")

	// GET /edukasi-informasi-umum
	resp, err = client.R().
		SetAuthToken("your_token").
		Get("/edukasi-informasi-umum")

	// GET /edukasi-informasi-umum/:id
	resp, err = client.R().
		SetAuthToken("your_token").
		Get("/edukasi-informasi-umum/:id")

	// GET /edukasi-pola-asuh
	resp, err = client.R().
		SetAuthToken("your_token").
		Get("/edukasi-pola-asuh")

	// GET /edukasi-pola-asuh/:id
	resp, err = client.R().
		SetAuthToken("your_token").
		Get("/edukasi-pola-asuh/:id")

	// GET /edukasi-perawatan-anak
	resp, err = client.R().
		SetAuthToken("your_token").
		Get("/edukasi-perawatan-anak")

	// GET /edukasi-perawatan-anak/:id
	resp, err = client.R().
		SetAuthToken("your_token").
		Get("/edukasi-perawatan-anak/:id")

	// GET /edukasi-nifas
	resp, err = client.R().
		SetAuthToken("your_token").
		Get("/edukasi-nifas")

	// GET /edukasi-setelah-melahirkan
	resp, err = client.R().
		SetAuthToken("your_token").
		Get("/edukasi-setelah-melahirkan")

	// GET /edukasi-tanda-melahirkan
	resp, err = client.R().
		SetAuthToken("your_token").
		Get("/edukasi-tanda-melahirkan")

	// GET /edukasi-trimester
	resp, err = client.R().
		SetAuthToken("your_token").
		Get("/edukasi-trimester")

	// GET /edukasi-trimester/:trimester
	resp, err = client.R().
		SetAuthToken("your_token").
		Get("/edukasi-trimester/:trimester")

	// GET /edukasi-trimester/:trimester/:kategori
	resp, err = client.R().
		SetAuthToken("your_token").
		Get("/edukasi-trimester/:trimester/:kategori")

	// GET /superadmin/audit-trail
	resp, err = client.R().
		SetAuthToken("your_token").
		Get("/superadmin/audit-trail")

	// GET /superadmin/audit-trail/summary
	resp, err = client.R().
		SetAuthToken("your_token").
		Get("/superadmin/audit-trail/summary")

	// POST /superadmin/kartu-keluarga
	resp, err = client.R().
		SetAuthToken("your_token").
		SetBody(map[string]any{
			"key": "value",
		}).
		Post("/superadmin/kartu-keluarga")

	// GET /superadmin/kartu-keluarga
	resp, err = client.R().
		SetAuthToken("your_token").
		Get("/superadmin/kartu-keluarga")

	// GET /superadmin/kartu-keluarga/:kartu_keluarga_id
	resp, err = client.R().
		SetAuthToken("your_token").
		Get("/superadmin/kartu-keluarga/:kartu_keluarga_id")

	// PUT /superadmin/kartu-keluarga/:kartu_keluarga_id
	resp, err = client.R().
		SetAuthToken("your_token").
		SetBody(map[string]any{
			"key": "value",
		}).
		Put("/superadmin/kartu-keluarga/:kartu_keluarga_id")

	// PUT /superadmin/kartu-keluarga/:kartu_keluarga_id/anggota/:penduduk_id
	resp, err = client.R().
		SetAuthToken("your_token").
		SetBody(map[string]any{
			"key": "value",
		}).
		Put("/superadmin/kartu-keluarga/:kartu_keluarga_id/anggota/:penduduk_id")

	// POST /superadmin/kartu-keluarga/:kartu_keluarga_id/anggota
	resp, err = client.R().
		SetAuthToken("your_token").
		SetBody(map[string]any{
			"key": "value",
		}).
		Post("/superadmin/kartu-keluarga/:kartu_keluarga_id/anggota")

	// DELETE /superadmin/kartu-keluarga/:kartu_keluarga_id/anggota/:penduduk_id
	resp, err = client.R().
		SetAuthToken("your_token").
		Delete("/superadmin/kartu-keluarga/:kartu_keluarga_id/anggota/:penduduk_id")

	// DELETE /superadmin/kartu-keluarga/:kartu_keluarga_id
	resp, err = client.R().
		SetAuthToken("your_token").
		Delete("/superadmin/kartu-keluarga/:kartu_keluarga_id")

	// GET /superadmin/desa
	resp, err = client.R().
		SetAuthToken("your_token").
		Get("/superadmin/desa")

	// GET /superadmin/desa/:id
	resp, err = client.R().
		SetAuthToken("your_token").
		Get("/superadmin/desa/:id")

	// POST /superadmin/desa
	resp, err = client.R().
		SetAuthToken("your_token").
		SetBody(map[string]any{
			"key": "value",
		}).
		Post("/superadmin/desa")

	// PUT /superadmin/desa/:id
	resp, err = client.R().
		SetAuthToken("your_token").
		SetBody(map[string]any{
			"key": "value",
		}).
		Put("/superadmin/desa/:id")

	// PATCH /superadmin/desa/:id/nonaktif
	resp, err = client.R().
		SetAuthToken("your_token").
		SetBody(map[string]any{
			"key": "value",
		}).
		Patch("/superadmin/desa/:id/nonaktif")

	// GET /superadmin/penduduk
	resp, err = client.R().
		SetAuthToken("your_token").
		Get("/superadmin/penduduk")

	// GET /superadmin/users
	resp, err = client.R().
		SetAuthToken("your_token").
		Get("/superadmin/users")

	// GET /superadmin/users/:id
	resp, err = client.R().
		SetAuthToken("your_token").
		Get("/superadmin/users/:id")

	// POST /superadmin/users/bidan
	resp, err = client.R().
		SetAuthToken("your_token").
		SetBody(map[string]any{
			"key": "value",
		}).
		Post("/superadmin/users/bidan")

	// POST /superadmin/users
	resp, err = client.R().
		SetAuthToken("your_token").
		SetBody(map[string]any{
			"key": "value",
		}).
		Post("/superadmin/users")

	// POST /superadmin/users/admin-desa
	resp, err = client.R().
		SetAuthToken("your_token").
		SetBody(map[string]any{
			"key": "value",
		}).
		Post("/superadmin/users/admin-desa")

	// POST /superadmin/users/kader
	resp, err = client.R().
		SetAuthToken("your_token").
		SetBody(map[string]any{
			"key": "value",
		}).
		Post("/superadmin/users/kader")

	// PATCH /superadmin/users/:id/reset-password
	resp, err = client.R().
		SetAuthToken("your_token").
		SetBody(map[string]any{
			"key": "value",
		}).
		Patch("/superadmin/users/:id/reset-password")

	// PATCH /superadmin/users/:id/role
	resp, err = client.R().
		SetAuthToken("your_token").
		SetBody(map[string]any{
			"key": "value",
		}).
		Patch("/superadmin/users/:id/role")

	// PATCH /superadmin/users/:id/nonaktif
	resp, err = client.R().
		SetAuthToken("your_token").
		SetBody(map[string]any{
			"key": "value",
		}).
		Patch("/superadmin/users/:id/nonaktif")

	// PATCH /superadmin/users/:id/aktif
	resp, err = client.R().
		SetAuthToken("your_token").
		SetBody(map[string]any{
			"key": "value",
		}).
		Patch("/superadmin/users/:id/aktif")

	// GET /superadmin/posyandu
	resp, err = client.R().
		SetAuthToken("your_token").
		Get("/superadmin/posyandu")

	// POST /bidan/posyandu
	resp, err = client.R().
		SetAuthToken("your_token").
		SetBody(map[string]any{
			"key": "value",
		}).
		Post("/bidan/posyandu")

	// GET /bidan/posyandu
	resp, err = client.R().
		SetAuthToken("your_token").
		Get("/bidan/posyandu")

	// GET /bidan/penduduk
	resp, err = client.R().
		SetAuthToken("your_token").
		Get("/bidan/penduduk")

	// GET /bidan/posyandu/:id
	resp, err = client.R().
		SetAuthToken("your_token").
		Get("/bidan/posyandu/:id")

	// PUT /bidan/posyandu/:id
	resp, err = client.R().
		SetAuthToken("your_token").
		SetBody(map[string]any{
			"key": "value",
		}).
		Put("/bidan/posyandu/:id")

	// GET /bidan/dashboard/jadwal-layanan
	resp, err = client.R().
		SetAuthToken("your_token").
		Get("/bidan/dashboard/jadwal-layanan")

	// POST /bidan/dashboard/jadwal-layanan
	resp, err = client.R().
		SetAuthToken("your_token").
		SetBody(map[string]any{
			"key": "value",
		}).
		Post("/bidan/dashboard/jadwal-layanan")

	// GET /bidan/dashboard/jadwal-layanan/:id
	resp, err = client.R().
		SetAuthToken("your_token").
		Get("/bidan/dashboard/jadwal-layanan/:id")

	// PUT /bidan/dashboard/jadwal-layanan/:id
	resp, err = client.R().
		SetAuthToken("your_token").
		SetBody(map[string]any{
			"key": "value",
		}).
		Put("/bidan/dashboard/jadwal-layanan/:id")

	// DELETE /bidan/dashboard/jadwal-layanan/:id
	resp, err = client.R().
		SetAuthToken("your_token").
		Delete("/bidan/dashboard/jadwal-layanan/:id")

	// GET /bidan/vaksin
	resp, err = client.R().
		SetAuthToken("your_token").
		Get("/bidan/vaksin")

	// GET /bidan/vaksin/:id
	resp, err = client.R().
		SetAuthToken("your_token").
		Get("/bidan/vaksin/:id")

	// GET /bidan/dosis-vaksin
	resp, err = client.R().
		SetAuthToken("your_token").
		Get("/bidan/dosis-vaksin")

	// GET /bidan/dosis-vaksin/by-vaksin/:vaksin_id
	resp, err = client.R().
		SetAuthToken("your_token").
		Get("/bidan/dosis-vaksin/by-vaksin/:vaksin_id")

	// GET /bidan/request-perubahan-jadwal-imunisasi
	resp, err = client.R().
		SetAuthToken("your_token").
		Get("/bidan/request-perubahan-jadwal-imunisasi")

	// PUT /bidan/request-perubahan-jadwal-imunisasi/:id/approve
	resp, err = client.R().
		SetAuthToken("your_token").
		SetBody(map[string]any{
			"key": "value",
		}).
		Put("/bidan/request-perubahan-jadwal-imunisasi/:id/approve")

	// PUT /bidan/request-perubahan-jadwal-imunisasi/:id/reject
	resp, err = client.R().
		SetAuthToken("your_token").
		SetBody(map[string]any{
			"key": "value",
		}).
		Put("/bidan/request-perubahan-jadwal-imunisasi/:id/reject")

	// GET /bidan/imunisasi/anak/:anak_id
	resp, err = client.R().
		SetAuthToken("your_token").
		Get("/bidan/imunisasi/anak/:anak_id")

	// PUT /bidan/imunisasi/:id/selesai
	resp, err = client.R().
		SetAuthToken("your_token").
		SetBody(map[string]any{
			"key": "value",
		}).
		Put("/bidan/imunisasi/:id/selesai")

	// GET /bidan/imunisasi/:id
	resp, err = client.R().
		SetAuthToken("your_token").
		Get("/bidan/imunisasi/:id")

	// GET /perkembangan/:id
	resp, err = client.R().
		SetAuthToken("your_token").
		Get("/perkembangan/:id")

	// GET /perkembangan/anak/:anak_id
	resp, err = client.R().
		SetAuthToken("your_token").
		Get("/perkembangan/anak/:anak_id")

	// GET /perkembangan/anak/:anak_id/kategori/:kategori_capaian_id
	resp, err = client.R().
		SetAuthToken("your_token").
		Get("/perkembangan/anak/:anak_id/kategori/:kategori_capaian_id")

	// PUT /perkembangan/:id
	resp, err = client.R().
		SetAuthToken("your_token").
		SetBody(map[string]any{
			"key": "value",
		}).
		Put("/perkembangan/:id")

	// DELETE /perkembangan/:id
	resp, err = client.R().
		SetAuthToken("your_token").
		Delete("/perkembangan/:id")

	// GET /perkembangan/search
	resp, err = client.R().
		SetAuthToken("your_token").
		Get("/perkembangan/search")

	// GET /tenaga-kesehatan/pertumbuhan/anak/:anak_id
	resp, err = client.R().
		SetAuthToken("your_token").
		Get("/tenaga-kesehatan/pertumbuhan/anak/:anak_id")

	// GET /tenaga-kesehatan/pertumbuhan/chart/:anak_id
	resp, err = client.R().
		SetAuthToken("your_token").
		Get("/tenaga-kesehatan/pertumbuhan/chart/:anak_id")

	// POST /tenaga-kesehatan/pertumbuhan
	resp, err = client.R().
		SetAuthToken("your_token").
		SetBody(map[string]any{
			"key": "value",
		}).
		Post("/tenaga-kesehatan/pertumbuhan")

	// PUT /tenaga-kesehatan/pertumbuhan/:id
	resp, err = client.R().
		SetAuthToken("your_token").
		SetBody(map[string]any{
			"key": "value",
		}).
		Put("/tenaga-kesehatan/pertumbuhan/:id")

	// DELETE /tenaga-kesehatan/pertumbuhan/:id
	resp, err = client.R().
		SetAuthToken("your_token").
		Delete("/tenaga-kesehatan/pertumbuhan/:id")

	// GET /tenaga-kesehatan/anak
	resp, err = client.R().
		SetAuthToken("your_token").
		Get("/tenaga-kesehatan/anak")

	// POST /tenaga-kesehatan/anak
	resp, err = client.R().
		SetAuthToken("your_token").
		SetBody(map[string]any{
			"key": "value",
		}).
		Post("/tenaga-kesehatan/anak")

	// POST /tenaga-kesehatan/anak/dengan-penduduk
	resp, err = client.R().
		SetAuthToken("your_token").
		SetBody(map[string]any{
			"key": "value",
		}).
		Post("/tenaga-kesehatan/anak/dengan-penduduk")

	// GET /tenaga-kesehatan/anak/:id
	resp, err = client.R().
		SetAuthToken("your_token").
		Get("/tenaga-kesehatan/anak/:id")

	// PUT /tenaga-kesehatan/anak/:id
	resp, err = client.R().
		SetAuthToken("your_token").
		SetBody(map[string]any{
			"key": "value",
		}).
		Put("/tenaga-kesehatan/anak/:id")

	// DELETE /tenaga-kesehatan/anak/:id
	resp, err = client.R().
		SetAuthToken("your_token").
		Delete("/tenaga-kesehatan/anak/:id")

	// GET /tenaga-kesehatan/pelayanan-kesehatan-anak
	resp, err = client.R().
		SetAuthToken("your_token").
		Get("/tenaga-kesehatan/pelayanan-kesehatan-anak")

	// GET /tenaga-kesehatan/pelayanan-kesehatan-anak/:id
	resp, err = client.R().
		SetAuthToken("your_token").
		Get("/tenaga-kesehatan/pelayanan-kesehatan-anak/:id")

	// POST /tenaga-kesehatan/pelayanan-kesehatan-anak
	resp, err = client.R().
		SetAuthToken("your_token").
		SetBody(map[string]any{
			"key": "value",
		}).
		Post("/tenaga-kesehatan/pelayanan-kesehatan-anak")

	// PUT /tenaga-kesehatan/pelayanan-kesehatan-anak/:id
	resp, err = client.R().
		SetAuthToken("your_token").
		SetBody(map[string]any{
			"key": "value",
		}).
		Put("/tenaga-kesehatan/pelayanan-kesehatan-anak/:id")

	// DELETE /tenaga-kesehatan/pelayanan-kesehatan-anak/:id
	resp, err = client.R().
		SetAuthToken("your_token").
		Delete("/tenaga-kesehatan/pelayanan-kesehatan-anak/:id")

	// GET /tenaga-kesehatan/Neonatus
	resp, err = client.R().
		SetAuthToken("your_token").
		Get("/tenaga-kesehatan/Neonatus")

	// GET /tenaga-kesehatan/Neonatus/:id
	resp, err = client.R().
		SetAuthToken("your_token").
		Get("/tenaga-kesehatan/Neonatus/:id")

	// POST /tenaga-kesehatan/Neonatus
	resp, err = client.R().
		SetAuthToken("your_token").
		SetBody(map[string]any{
			"key": "value",
		}).
		Post("/tenaga-kesehatan/Neonatus")

	// PUT /tenaga-kesehatan/Neonatus/:id
	resp, err = client.R().
		SetAuthToken("your_token").
		SetBody(map[string]any{
			"key": "value",
		}).
		Put("/tenaga-kesehatan/Neonatus/:id")

	// DELETE /tenaga-kesehatan/Neonatus/:id
	resp, err = client.R().
		SetAuthToken("your_token").
		Delete("/tenaga-kesehatan/Neonatus/:id")

	// GET /tenaga-kesehatan/periode-kunjungan
	resp, err = client.R().
		SetAuthToken("your_token").
		Get("/tenaga-kesehatan/periode-kunjungan")

	// GET /tenaga-kesehatan/Pelayanan-Gizi-Anak
	resp, err = client.R().
		SetAuthToken("your_token").
		Get("/tenaga-kesehatan/Pelayanan-Gizi-Anak")

	// GET /tenaga-kesehatan/Pelayanan-Gizi-Anak/:id
	resp, err = client.R().
		SetAuthToken("your_token").
		Get("/tenaga-kesehatan/Pelayanan-Gizi-Anak/:id")

	// POST /tenaga-kesehatan/Pelayanan-Gizi-Anak
	resp, err = client.R().
		SetAuthToken("your_token").
		SetBody(map[string]any{
			"key": "value",
		}).
		Post("/tenaga-kesehatan/Pelayanan-Gizi-Anak")

	// PUT /tenaga-kesehatan/Pelayanan-Gizi-Anak/:id
	resp, err = client.R().
		SetAuthToken("your_token").
		SetBody(map[string]any{
			"key": "value",
		}).
		Put("/tenaga-kesehatan/Pelayanan-Gizi-Anak/:id")

	// DELETE /tenaga-kesehatan/Pelayanan-Gizi-Anak/:id
	resp, err = client.R().
		SetAuthToken("your_token").
		Delete("/tenaga-kesehatan/Pelayanan-Gizi-Anak/:id")

	// GET /tenaga-kesehatan/kategori-umur
	resp, err = client.R().
		SetAuthToken("your_token").
		Get("/tenaga-kesehatan/kategori-umur")

	// GET /tenaga-kesehatan/Pelayanan-Vitamin-ObatCacing
	resp, err = client.R().
		SetAuthToken("your_token").
		Get("/tenaga-kesehatan/Pelayanan-Vitamin-ObatCacing")

	// GET /tenaga-kesehatan/Pelayanan-Vitamin-ObatCacing/:id
	resp, err = client.R().
		SetAuthToken("your_token").
		Get("/tenaga-kesehatan/Pelayanan-Vitamin-ObatCacing/:id")

	// POST /tenaga-kesehatan/Pelayanan-Vitamin-ObatCacing
	resp, err = client.R().
		SetAuthToken("your_token").
		SetBody(map[string]any{
			"key": "value",
		}).
		Post("/tenaga-kesehatan/Pelayanan-Vitamin-ObatCacing")

	// PUT /tenaga-kesehatan/Pelayanan-Vitamin-ObatCacing/:id
	resp, err = client.R().
		SetAuthToken("your_token").
		SetBody(map[string]any{
			"key": "value",
		}).
		Put("/tenaga-kesehatan/Pelayanan-Vitamin-ObatCacing/:id")

	// DELETE /tenaga-kesehatan/Pelayanan-Vitamin-ObatCacing/:id
	resp, err = client.R().
		SetAuthToken("your_token").
		Delete("/tenaga-kesehatan/Pelayanan-Vitamin-ObatCacing/:id")

	// GET /tenaga-kesehatan/Pelayanan-Imunisasi
	resp, err = client.R().
		SetAuthToken("your_token").
		Get("/tenaga-kesehatan/Pelayanan-Imunisasi")

	// GET /tenaga-kesehatan/Pelayanan-Imunisasi/:id
	resp, err = client.R().
		SetAuthToken("your_token").
		Get("/tenaga-kesehatan/Pelayanan-Imunisasi/:id")

	// POST /tenaga-kesehatan/Pelayanan-Imunisasi
	resp, err = client.R().
		SetAuthToken("your_token").
		SetBody(map[string]any{
			"key": "value",
		}).
		Post("/tenaga-kesehatan/Pelayanan-Imunisasi")

	// PUT /tenaga-kesehatan/Pelayanan-Imunisasi/:id
	resp, err = client.R().
		SetAuthToken("your_token").
		SetBody(map[string]any{
			"key": "value",
		}).
		Put("/tenaga-kesehatan/Pelayanan-Imunisasi/:id")

	// DELETE /tenaga-kesehatan/Pelayanan-Imunisasi/:id
	resp, err = client.R().
		SetAuthToken("your_token").
		Delete("/tenaga-kesehatan/Pelayanan-Imunisasi/:id")

	// GET /tenaga-kesehatan/Pemeriksaan-Gigi
	resp, err = client.R().
		SetAuthToken("your_token").
		Get("/tenaga-kesehatan/Pemeriksaan-Gigi")

	// GET /tenaga-kesehatan/Pemeriksaan-Gigi/:id
	resp, err = client.R().
		SetAuthToken("your_token").
		Get("/tenaga-kesehatan/Pemeriksaan-Gigi/:id")

	// POST /tenaga-kesehatan/Pemeriksaan-Gigi
	resp, err = client.R().
		SetAuthToken("your_token").
		SetBody(map[string]any{
			"key": "value",
		}).
		Post("/tenaga-kesehatan/Pemeriksaan-Gigi")

	// PUT /tenaga-kesehatan/Pemeriksaan-Gigi/:id
	resp, err = client.R().
		SetAuthToken("your_token").
		SetBody(map[string]any{
			"key": "value",
		}).
		Put("/tenaga-kesehatan/Pemeriksaan-Gigi/:id")

	// DELETE /tenaga-kesehatan/Pemeriksaan-Gigi/:id
	resp, err = client.R().
		SetAuthToken("your_token").
		Delete("/tenaga-kesehatan/Pemeriksaan-Gigi/:id")

	// GET /tenaga-kesehatan/Pemantauan-Pertumbuhan-Anak
	resp, err = client.R().
		SetAuthToken("your_token").
		Get("/tenaga-kesehatan/Pemantauan-Pertumbuhan-Anak")

	// GET /tenaga-kesehatan/Pemantauan-Pertumbuhan-Anak/:id
	resp, err = client.R().
		SetAuthToken("your_token").
		Get("/tenaga-kesehatan/Pemantauan-Pertumbuhan-Anak/:id")

	// POST /tenaga-kesehatan/Pemantauan-Pertumbuhan-Anak
	resp, err = client.R().
		SetAuthToken("your_token").
		SetBody(map[string]any{
			"key": "value",
		}).
		Post("/tenaga-kesehatan/Pemantauan-Pertumbuhan-Anak")

	// PUT /tenaga-kesehatan/Pemantauan-Pertumbuhan-Anak/:id
	resp, err = client.R().
		SetAuthToken("your_token").
		SetBody(map[string]any{
			"key": "value",
		}).
		Put("/tenaga-kesehatan/Pemantauan-Pertumbuhan-Anak/:id")

	// DELETE /tenaga-kesehatan/Pemantauan-Pertumbuhan-Anak/:id
	resp, err = client.R().
		SetAuthToken("your_token").
		Delete("/tenaga-kesehatan/Pemantauan-Pertumbuhan-Anak/:id")

	// GET /tenaga-kesehatan/Pengukuran-LilA
	resp, err = client.R().
		SetAuthToken("your_token").
		Get("/tenaga-kesehatan/Pengukuran-LilA")

	// GET /tenaga-kesehatan/Pengukuran-LilA/:id
	resp, err = client.R().
		SetAuthToken("your_token").
		Get("/tenaga-kesehatan/Pengukuran-LilA/:id")

	// POST /tenaga-kesehatan/Pengukuran-LilA
	resp, err = client.R().
		SetAuthToken("your_token").
		SetBody(map[string]any{
			"key": "value",
		}).
		Post("/tenaga-kesehatan/Pengukuran-LilA")

	// PUT /tenaga-kesehatan/Pengukuran-LilA/:id
	resp, err = client.R().
		SetAuthToken("your_token").
		SetBody(map[string]any{
			"key": "value",
		}).
		Put("/tenaga-kesehatan/Pengukuran-LilA/:id")

	// DELETE /tenaga-kesehatan/Pengukuran-LilA/:id
	resp, err = client.R().
		SetAuthToken("your_token").
		Delete("/tenaga-kesehatan/Pengukuran-LilA/:id")

	// GET /tenaga-kesehatan/Catatan-Pelayanan
	resp, err = client.R().
		SetAuthToken("your_token").
		Get("/tenaga-kesehatan/Catatan-Pelayanan")

	// GET /tenaga-kesehatan/Catatan-Pelayanan/:id
	resp, err = client.R().
		SetAuthToken("your_token").
		Get("/tenaga-kesehatan/Catatan-Pelayanan/:id")

	// POST /tenaga-kesehatan/Catatan-Pelayanan
	resp, err = client.R().
		SetAuthToken("your_token").
		SetBody(map[string]any{
			"key": "value",
		}).
		Post("/tenaga-kesehatan/Catatan-Pelayanan")

	// PUT /tenaga-kesehatan/Catatan-Pelayanan/:id
	resp, err = client.R().
		SetAuthToken("your_token").
		SetBody(map[string]any{
			"key": "value",
		}).
		Put("/tenaga-kesehatan/Catatan-Pelayanan/:id")

	// DELETE /tenaga-kesehatan/Catatan-Pelayanan/:id
	resp, err = client.R().
		SetAuthToken("your_token").
		Delete("/tenaga-kesehatan/Catatan-Pelayanan/:id")

	// GET /tenaga-kesehatan/keluhan-anak/:anak_id
	resp, err = client.R().
		SetAuthToken("your_token").
		Get("/tenaga-kesehatan/keluhan-anak/:anak_id")

	// GET /tenaga-kesehatan/keluhan-anak/detail/:id
	resp, err = client.R().
		SetAuthToken("your_token").
		Get("/tenaga-kesehatan/keluhan-anak/detail/:id")

	// POST /tenaga-kesehatan/keluhan-anak
	resp, err = client.R().
		SetAuthToken("your_token").
		SetBody(map[string]any{
			"key": "value",
		}).
		Post("/tenaga-kesehatan/keluhan-anak")

	// PUT /tenaga-kesehatan/keluhan-anak/:id
	resp, err = client.R().
		SetAuthToken("your_token").
		SetBody(map[string]any{
			"key": "value",
		}).
		Put("/tenaga-kesehatan/keluhan-anak/:id")

	// DELETE /tenaga-kesehatan/keluhan-anak/:id
	resp, err = client.R().
		SetAuthToken("your_token").
		Delete("/tenaga-kesehatan/keluhan-anak/:id")

	// GET /tenaga-kesehatan/pemantauan-anak/history
	resp, err = client.R().
		SetAuthToken("your_token").
		Get("/tenaga-kesehatan/pemantauan-anak/history")

	// GET /tenaga-kesehatan/pemantauan-anak/rentang-usia
	resp, err = client.R().
		SetAuthToken("your_token").
		Get("/tenaga-kesehatan/pemantauan-anak/rentang-usia")

	// GET /tenaga-kesehatan/pemantauan-anak/kategori/:rentang_id
	resp, err = client.R().
		SetAuthToken("your_token").
		Get("/tenaga-kesehatan/pemantauan-anak/kategori/:rentang_id")

	// POST /tenaga-kesehatan/pemantauan-anak
	resp, err = client.R().
		SetAuthToken("your_token").
		SetBody(map[string]any{
			"key": "value",
		}).
		Post("/tenaga-kesehatan/pemantauan-anak")

	// DELETE /tenaga-kesehatan/pemantauan-anak/:id
	resp, err = client.R().
		SetAuthToken("your_token").
		Delete("/tenaga-kesehatan/pemantauan-anak/:id")

	// PUT /tenaga-kesehatan/pemantauan-anak/:id/verifikasi
	resp, err = client.R().
		SetAuthToken("your_token").
		SetBody(map[string]any{
			"key": "value",
		}).
		Put("/tenaga-kesehatan/pemantauan-anak/:id/verifikasi")

	// POST /tenaga-kesehatan/pemantauan-anak/indikator
	resp, err = client.R().
		SetAuthToken("your_token").
		SetBody(map[string]any{
			"key": "value",
		}).
		Post("/tenaga-kesehatan/pemantauan-anak/indikator")

	// PUT /tenaga-kesehatan/pemantauan-anak/indikator/:id
	resp, err = client.R().
		SetAuthToken("your_token").
		SetBody(map[string]any{
			"key": "value",
		}).
		Put("/tenaga-kesehatan/pemantauan-anak/indikator/:id")

	// DELETE /tenaga-kesehatan/pemantauan-anak/indikator/:id
	resp, err = client.R().
		SetAuthToken("your_token").
		Delete("/tenaga-kesehatan/pemantauan-anak/indikator/:id")

	// GET /tenaga-kesehatan/kategori-capaian
	resp, err = client.R().
		SetAuthToken("your_token").
		Get("/tenaga-kesehatan/kategori-capaian")

	// GET /tenaga-kesehatan/kategori-capaian/:id
	resp, err = client.R().
		SetAuthToken("your_token").
		Get("/tenaga-kesehatan/kategori-capaian/:id")

	// POST /tenaga-kesehatan/kategori-capaian
	resp, err = client.R().
		SetAuthToken("your_token").
		SetBody(map[string]any{
			"key": "value",
		}).
		Post("/tenaga-kesehatan/kategori-capaian")

	// PUT /tenaga-kesehatan/kategori-capaian/:id
	resp, err = client.R().
		SetAuthToken("your_token").
		SetBody(map[string]any{
			"key": "value",
		}).
		Put("/tenaga-kesehatan/kategori-capaian/:id")

	// DELETE /tenaga-kesehatan/kategori-capaian/:id
	resp, err = client.R().
		SetAuthToken("your_token").
		Delete("/tenaga-kesehatan/kategori-capaian/:id")

	// GET /tenaga-kesehatan/perawatan
	resp, err = client.R().
		SetAuthToken("your_token").
		Get("/tenaga-kesehatan/perawatan")

	// GET /tenaga-kesehatan/perawatan/:id
	resp, err = client.R().
		SetAuthToken("your_token").
		Get("/tenaga-kesehatan/perawatan/:id")

	// POST /tenaga-kesehatan/perawatan
	resp, err = client.R().
		SetAuthToken("your_token").
		SetBody(map[string]any{
			"key": "value",
		}).
		Post("/tenaga-kesehatan/perawatan")

	// PUT /tenaga-kesehatan/perawatan/:id
	resp, err = client.R().
		SetAuthToken("your_token").
		SetBody(map[string]any{
			"key": "value",
		}).
		Put("/tenaga-kesehatan/perawatan/:id")

	// DELETE /tenaga-kesehatan/perawatan/:id
	resp, err = client.R().
		SetAuthToken("your_token").
		Delete("/tenaga-kesehatan/perawatan/:id")

	// GET /tenaga-kesehatan/kesehatan-lingkungan
	resp, err = client.R().
		SetAuthToken("your_token").
		Get("/tenaga-kesehatan/kesehatan-lingkungan")

	// POST /tenaga-kesehatan/kesehatan-lingkungan
	resp, err = client.R().
		SetAuthToken("your_token").
		SetBody(map[string]any{
			"key": "value",
		}).
		Post("/tenaga-kesehatan/kesehatan-lingkungan")

	// GET /tenaga-kesehatan/kesehatan-lingkungan/:id
	resp, err = client.R().
		SetAuthToken("your_token").
		Get("/tenaga-kesehatan/kesehatan-lingkungan/:id")

	// PUT /tenaga-kesehatan/kesehatan-lingkungan/:id
	resp, err = client.R().
		SetAuthToken("your_token").
		SetBody(map[string]any{
			"key": "value",
		}).
		Put("/tenaga-kesehatan/kesehatan-lingkungan/:id")

	// DELETE /tenaga-kesehatan/kesehatan-lingkungan/:id
	resp, err = client.R().
		SetAuthToken("your_token").
		Delete("/tenaga-kesehatan/kesehatan-lingkungan/:id")

	// GET /tenaga-kesehatan/kesehatan-lingkungan/:id/catatan-kader
	resp, err = client.R().
		SetAuthToken("your_token").
		Get("/tenaga-kesehatan/kesehatan-lingkungan/:id/catatan-kader")

	// POST /tenaga-kesehatan/kesehatan-lingkungan/:id/catatan-kader
	resp, err = client.R().
		SetAuthToken("your_token").
		SetBody(map[string]any{
			"key": "value",
		}).
		Post("/tenaga-kesehatan/kesehatan-lingkungan/:id/catatan-kader")

	// PUT /tenaga-kesehatan/kesehatan-lingkungan/:id/catatan-kader/:catatanId
	resp, err = client.R().
		SetAuthToken("your_token").
		SetBody(map[string]any{
			"key": "value",
		}).
		Put("/tenaga-kesehatan/kesehatan-lingkungan/:id/catatan-kader/:catatanId")

	// DELETE /tenaga-kesehatan/kesehatan-lingkungan/:id/catatan-kader/:catatanId
	resp, err = client.R().
		SetAuthToken("your_token").
		Delete("/tenaga-kesehatan/kesehatan-lingkungan/:id/catatan-kader/:catatanId")

	// PUT /tenaga-kesehatan/kesehatan-lingkungan/:id/catatan-kader/:catatanId/kirim-mobile
	resp, err = client.R().
		SetAuthToken("your_token").
		SetBody(map[string]any{
			"key": "value",
		}).
		Put("/tenaga-kesehatan/kesehatan-lingkungan/:id/catatan-kader/:catatanId/kirim-mobile")

	// GET /lingkungan/kategori
	resp, err = client.R().
		SetAuthToken("your_token").
		Get("/lingkungan/kategori")

	// GET /lingkungan/history
	resp, err = client.R().
		SetAuthToken("your_token").
		Get("/lingkungan/history")

	// GET /lingkungan/detail/:id
	resp, err = client.R().
		SetAuthToken("your_token").
		Get("/lingkungan/detail/:id")

	// POST /lingkungan/submit
	resp, err = client.R().
		SetAuthToken("your_token").
		SetBody(map[string]any{
			"key": "value",
		}).
		Post("/lingkungan/submit")

	// POST /tenaga-kesehatan/lingkungan/kategori
	resp, err = client.R().
		SetAuthToken("your_token").
		SetBody(map[string]any{
			"key": "value",
		}).
		Post("/tenaga-kesehatan/lingkungan/kategori")

	// DELETE /tenaga-kesehatan/lingkungan/kategori/:id
	resp, err = client.R().
		SetAuthToken("your_token").
		Delete("/tenaga-kesehatan/lingkungan/kategori/:id")

	// POST /tenaga-kesehatan/lingkungan/kategori/:id/indikator
	resp, err = client.R().
		SetAuthToken("your_token").
		SetBody(map[string]any{
			"key": "value",
		}).
		Post("/tenaga-kesehatan/lingkungan/kategori/:id/indikator")

	// DELETE /tenaga-kesehatan/lingkungan/indikator/:id
	resp, err = client.R().
		SetAuthToken("your_token").
		Delete("/tenaga-kesehatan/lingkungan/indikator/:id")

	// DELETE /tenaga-kesehatan/lingkungan/:id
	resp, err = client.R().
		SetAuthToken("your_token").
		Delete("/tenaga-kesehatan/lingkungan/:id")

	// GET /tenaga-kesehatan/edukasi-informasi-umum
	resp, err = client.R().
		SetAuthToken("your_token").
		Get("/tenaga-kesehatan/edukasi-informasi-umum")

	// GET /tenaga-kesehatan/edukasi-informasi-umum/:id
	resp, err = client.R().
		SetAuthToken("your_token").
		Get("/tenaga-kesehatan/edukasi-informasi-umum/:id")

	// POST /tenaga-kesehatan/edukasi-informasi-umum
	resp, err = client.R().
		SetAuthToken("your_token").
		SetBody(map[string]any{
			"key": "value",
		}).
		Post("/tenaga-kesehatan/edukasi-informasi-umum")

	// PUT /tenaga-kesehatan/edukasi-informasi-umum/:id
	resp, err = client.R().
		SetAuthToken("your_token").
		SetBody(map[string]any{
			"key": "value",
		}).
		Put("/tenaga-kesehatan/edukasi-informasi-umum/:id")

	// DELETE /tenaga-kesehatan/edukasi-informasi-umum/:id
	resp, err = client.R().
		SetAuthToken("your_token").
		Delete("/tenaga-kesehatan/edukasi-informasi-umum/:id")

	// GET /tenaga-kesehatan/edukasi-trimester
	resp, err = client.R().
		SetAuthToken("your_token").
		Get("/tenaga-kesehatan/edukasi-trimester")

	// POST /tenaga-kesehatan/edukasi-trimester
	resp, err = client.R().
		SetAuthToken("your_token").
		SetBody(map[string]any{
			"key": "value",
		}).
		Post("/tenaga-kesehatan/edukasi-trimester")

	// GET /tenaga-kesehatan/edukasi-trimester/:id
	resp, err = client.R().
		SetAuthToken("your_token").
		Get("/tenaga-kesehatan/edukasi-trimester/:id")

	// PUT /tenaga-kesehatan/edukasi-trimester/:id
	resp, err = client.R().
		SetAuthToken("your_token").
		SetBody(map[string]any{
			"key": "value",
		}).
		Put("/tenaga-kesehatan/edukasi-trimester/:id")

	// DELETE /tenaga-kesehatan/edukasi-trimester/:id
	resp, err = client.R().
		SetAuthToken("your_token").
		Delete("/tenaga-kesehatan/edukasi-trimester/:id")

	// GET /tenaga-kesehatan/edukasi-tanda-melahirkan
	resp, err = client.R().
		SetAuthToken("your_token").
		Get("/tenaga-kesehatan/edukasi-tanda-melahirkan")

	// POST /tenaga-kesehatan/edukasi-tanda-melahirkan
	resp, err = client.R().
		SetAuthToken("your_token").
		SetBody(map[string]any{
			"key": "value",
		}).
		Post("/tenaga-kesehatan/edukasi-tanda-melahirkan")

	// GET /tenaga-kesehatan/edukasi-tanda-melahirkan/:id
	resp, err = client.R().
		SetAuthToken("your_token").
		Get("/tenaga-kesehatan/edukasi-tanda-melahirkan/:id")

	// PUT /tenaga-kesehatan/edukasi-tanda-melahirkan/:id
	resp, err = client.R().
		SetAuthToken("your_token").
		SetBody(map[string]any{
			"key": "value",
		}).
		Put("/tenaga-kesehatan/edukasi-tanda-melahirkan/:id")

	// DELETE /tenaga-kesehatan/edukasi-tanda-melahirkan/:id
	resp, err = client.R().
		SetAuthToken("your_token").
		Delete("/tenaga-kesehatan/edukasi-tanda-melahirkan/:id")

	// GET /tenaga-kesehatan/edukasi-imd
	resp, err = client.R().
		SetAuthToken("your_token").
		Get("/tenaga-kesehatan/edukasi-imd")

	// POST /tenaga-kesehatan/edukasi-imd
	resp, err = client.R().
		SetAuthToken("your_token").
		SetBody(map[string]any{
			"key": "value",
		}).
		Post("/tenaga-kesehatan/edukasi-imd")

	// GET /tenaga-kesehatan/edukasi-imd/:id
	resp, err = client.R().
		SetAuthToken("your_token").
		Get("/tenaga-kesehatan/edukasi-imd/:id")

	// PUT /tenaga-kesehatan/edukasi-imd/:id
	resp, err = client.R().
		SetAuthToken("your_token").
		SetBody(map[string]any{
			"key": "value",
		}).
		Put("/tenaga-kesehatan/edukasi-imd/:id")

	// DELETE /tenaga-kesehatan/edukasi-imd/:id
	resp, err = client.R().
		SetAuthToken("your_token").
		Delete("/tenaga-kesehatan/edukasi-imd/:id")

	// GET /tenaga-kesehatan/edukasi-setelah-melahirkan
	resp, err = client.R().
		SetAuthToken("your_token").
		Get("/tenaga-kesehatan/edukasi-setelah-melahirkan")

	// POST /tenaga-kesehatan/edukasi-setelah-melahirkan
	resp, err = client.R().
		SetAuthToken("your_token").
		SetBody(map[string]any{
			"key": "value",
		}).
		Post("/tenaga-kesehatan/edukasi-setelah-melahirkan")

	// GET /tenaga-kesehatan/edukasi-setelah-melahirkan/:id
	resp, err = client.R().
		SetAuthToken("your_token").
		Get("/tenaga-kesehatan/edukasi-setelah-melahirkan/:id")

	// PUT /tenaga-kesehatan/edukasi-setelah-melahirkan/:id
	resp, err = client.R().
		SetAuthToken("your_token").
		SetBody(map[string]any{
			"key": "value",
		}).
		Put("/tenaga-kesehatan/edukasi-setelah-melahirkan/:id")

	// DELETE /tenaga-kesehatan/edukasi-setelah-melahirkan/:id
	resp, err = client.R().
		SetAuthToken("your_token").
		Delete("/tenaga-kesehatan/edukasi-setelah-melahirkan/:id")

	// GET /tenaga-kesehatan/edukasi-menyusui-asi
	resp, err = client.R().
		SetAuthToken("your_token").
		Get("/tenaga-kesehatan/edukasi-menyusui-asi")

	// POST /tenaga-kesehatan/edukasi-menyusui-asi
	resp, err = client.R().
		SetAuthToken("your_token").
		SetBody(map[string]any{
			"key": "value",
		}).
		Post("/tenaga-kesehatan/edukasi-menyusui-asi")

	// GET /tenaga-kesehatan/edukasi-menyusui-asi/:id
	resp, err = client.R().
		SetAuthToken("your_token").
		Get("/tenaga-kesehatan/edukasi-menyusui-asi/:id")

	// PUT /tenaga-kesehatan/edukasi-menyusui-asi/:id
	resp, err = client.R().
		SetAuthToken("your_token").
		SetBody(map[string]any{
			"key": "value",
		}).
		Put("/tenaga-kesehatan/edukasi-menyusui-asi/:id")

	// DELETE /tenaga-kesehatan/edukasi-menyusui-asi/:id
	resp, err = client.R().
		SetAuthToken("your_token").
		Delete("/tenaga-kesehatan/edukasi-menyusui-asi/:id")

	// GET /tenaga-kesehatan/edukasi-pola-asuh
	resp, err = client.R().
		SetAuthToken("your_token").
		Get("/tenaga-kesehatan/edukasi-pola-asuh")

	// POST /tenaga-kesehatan/edukasi-pola-asuh
	resp, err = client.R().
		SetAuthToken("your_token").
		SetBody(map[string]any{
			"key": "value",
		}).
		Post("/tenaga-kesehatan/edukasi-pola-asuh")

	// GET /tenaga-kesehatan/edukasi-pola-asuh/:id
	resp, err = client.R().
		SetAuthToken("your_token").
		Get("/tenaga-kesehatan/edukasi-pola-asuh/:id")

	// PUT /tenaga-kesehatan/edukasi-pola-asuh/:id
	resp, err = client.R().
		SetAuthToken("your_token").
		SetBody(map[string]any{
			"key": "value",
		}).
		Put("/tenaga-kesehatan/edukasi-pola-asuh/:id")

	// DELETE /tenaga-kesehatan/edukasi-pola-asuh/:id
	resp, err = client.R().
		SetAuthToken("your_token").
		Delete("/tenaga-kesehatan/edukasi-pola-asuh/:id")

	// GET /tenaga-kesehatan/edukasi-kesehatan-mental
	resp, err = client.R().
		SetAuthToken("your_token").
		Get("/tenaga-kesehatan/edukasi-kesehatan-mental")

	// POST /tenaga-kesehatan/edukasi-kesehatan-mental
	resp, err = client.R().
		SetAuthToken("your_token").
		SetBody(map[string]any{
			"key": "value",
		}).
		Post("/tenaga-kesehatan/edukasi-kesehatan-mental")

	// GET /tenaga-kesehatan/edukasi-kesehatan-mental/:id
	resp, err = client.R().
		SetAuthToken("your_token").
		Get("/tenaga-kesehatan/edukasi-kesehatan-mental/:id")

	// PUT /tenaga-kesehatan/edukasi-kesehatan-mental/:id
	resp, err = client.R().
		SetAuthToken("your_token").
		SetBody(map[string]any{
			"key": "value",
		}).
		Put("/tenaga-kesehatan/edukasi-kesehatan-mental/:id")

	// DELETE /tenaga-kesehatan/edukasi-kesehatan-mental/:id
	resp, err = client.R().
		SetAuthToken("your_token").
		Delete("/tenaga-kesehatan/edukasi-kesehatan-mental/:id")

	// GET /tenaga-kesehatan/edukasi-perawatan-anak
	resp, err = client.R().
		SetAuthToken("your_token").
		Get("/tenaga-kesehatan/edukasi-perawatan-anak")

	// POST /tenaga-kesehatan/edukasi-perawatan-anak
	resp, err = client.R().
		SetAuthToken("your_token").
		SetBody(map[string]any{
			"key": "value",
		}).
		Post("/tenaga-kesehatan/edukasi-perawatan-anak")

	// GET /tenaga-kesehatan/edukasi-perawatan-anak/:id
	resp, err = client.R().
		SetAuthToken("your_token").
		Get("/tenaga-kesehatan/edukasi-perawatan-anak/:id")

	// PUT /tenaga-kesehatan/edukasi-perawatan-anak/:id
	resp, err = client.R().
		SetAuthToken("your_token").
		SetBody(map[string]any{
			"key": "value",
		}).
		Put("/tenaga-kesehatan/edukasi-perawatan-anak/:id")

	// DELETE /tenaga-kesehatan/edukasi-perawatan-anak/:id
	resp, err = client.R().
		SetAuthToken("your_token").
		Delete("/tenaga-kesehatan/edukasi-perawatan-anak/:id")

	// GET /tenaga-kesehatan/edukasi-mpasi
	resp, err = client.R().
		SetAuthToken("your_token").
		Get("/tenaga-kesehatan/edukasi-mpasi")

	// POST /tenaga-kesehatan/edukasi-mpasi
	resp, err = client.R().
		SetAuthToken("your_token").
		SetBody(map[string]any{
			"key": "value",
		}).
		Post("/tenaga-kesehatan/edukasi-mpasi")

	// GET /tenaga-kesehatan/edukasi-mpasi/:id
	resp, err = client.R().
		SetAuthToken("your_token").
		Get("/tenaga-kesehatan/edukasi-mpasi/:id")

	// PUT /tenaga-kesehatan/edukasi-mpasi/:id
	resp, err = client.R().
		SetAuthToken("your_token").
		SetBody(map[string]any{
			"key": "value",
		}).
		Put("/tenaga-kesehatan/edukasi-mpasi/:id")

	// DELETE /tenaga-kesehatan/edukasi-mpasi/:id
	resp, err = client.R().
		SetAuthToken("your_token").
		Delete("/tenaga-kesehatan/edukasi-mpasi/:id")

	// GET /tenaga-kesehatan/edukasi-mpasi-aturan-porsi
	resp, err = client.R().
		SetAuthToken("your_token").
		Get("/tenaga-kesehatan/edukasi-mpasi-aturan-porsi")

	// POST /tenaga-kesehatan/edukasi-mpasi-aturan-porsi
	resp, err = client.R().
		SetAuthToken("your_token").
		SetBody(map[string]any{
			"key": "value",
		}).
		Post("/tenaga-kesehatan/edukasi-mpasi-aturan-porsi")

	// GET /tenaga-kesehatan/edukasi-mpasi-aturan-porsi/:id
	resp, err = client.R().
		SetAuthToken("your_token").
		Get("/tenaga-kesehatan/edukasi-mpasi-aturan-porsi/:id")

	// PUT /tenaga-kesehatan/edukasi-mpasi-aturan-porsi/:id
	resp, err = client.R().
		SetAuthToken("your_token").
		SetBody(map[string]any{
			"key": "value",
		}).
		Put("/tenaga-kesehatan/edukasi-mpasi-aturan-porsi/:id")

	// DELETE /tenaga-kesehatan/edukasi-mpasi-aturan-porsi/:id
	resp, err = client.R().
		SetAuthToken("your_token").
		Delete("/tenaga-kesehatan/edukasi-mpasi-aturan-porsi/:id")

	// GET /tenaga-kesehatan/edukasi-mpasi-jadwal-harian
	resp, err = client.R().
		SetAuthToken("your_token").
		Get("/tenaga-kesehatan/edukasi-mpasi-jadwal-harian")

	// POST /tenaga-kesehatan/edukasi-mpasi-jadwal-harian
	resp, err = client.R().
		SetAuthToken("your_token").
		SetBody(map[string]any{
			"key": "value",
		}).
		Post("/tenaga-kesehatan/edukasi-mpasi-jadwal-harian")

	// GET /tenaga-kesehatan/edukasi-mpasi-jadwal-harian/:id
	resp, err = client.R().
		SetAuthToken("your_token").
		Get("/tenaga-kesehatan/edukasi-mpasi-jadwal-harian/:id")

	// PUT /tenaga-kesehatan/edukasi-mpasi-jadwal-harian/:id
	resp, err = client.R().
		SetAuthToken("your_token").
		SetBody(map[string]any{
			"key": "value",
		}).
		Put("/tenaga-kesehatan/edukasi-mpasi-jadwal-harian/:id")

	// DELETE /tenaga-kesehatan/edukasi-mpasi-jadwal-harian/:id
	resp, err = client.R().
		SetAuthToken("your_token").
		Delete("/tenaga-kesehatan/edukasi-mpasi-jadwal-harian/:id")

	// GET /tenaga-kesehatan/edukasi-mpasi-resep
	resp, err = client.R().
		SetAuthToken("your_token").
		Get("/tenaga-kesehatan/edukasi-mpasi-resep")

	// POST /tenaga-kesehatan/edukasi-mpasi-resep
	resp, err = client.R().
		SetAuthToken("your_token").
		SetBody(map[string]any{
			"key": "value",
		}).
		Post("/tenaga-kesehatan/edukasi-mpasi-resep")

	// GET /tenaga-kesehatan/edukasi-mpasi-resep/:id
	resp, err = client.R().
		SetAuthToken("your_token").
		Get("/tenaga-kesehatan/edukasi-mpasi-resep/:id")

	// PUT /tenaga-kesehatan/edukasi-mpasi-resep/:id
	resp, err = client.R().
		SetAuthToken("your_token").
		SetBody(map[string]any{
			"key": "value",
		}).
		Put("/tenaga-kesehatan/edukasi-mpasi-resep/:id")

	// DELETE /tenaga-kesehatan/edukasi-mpasi-resep/:id
	resp, err = client.R().
		SetAuthToken("your_token").
		Delete("/tenaga-kesehatan/edukasi-mpasi-resep/:id")

	// GET /tenaga-kesehatan/pemantauan-indikator
	resp, err = client.R().
		SetAuthToken("your_token").
		Get("/tenaga-kesehatan/pemantauan-indikator")

	// POST /tenaga-kesehatan/pemantauan-indikator
	resp, err = client.R().
		SetAuthToken("your_token").
		SetBody(map[string]any{
			"key": "value",
		}).
		Post("/tenaga-kesehatan/pemantauan-indikator")

	// PUT /tenaga-kesehatan/pemantauan-indikator/:id
	resp, err = client.R().
		SetAuthToken("your_token").
		SetBody(map[string]any{
			"key": "value",
		}).
		Put("/tenaga-kesehatan/pemantauan-indikator/:id")

	// DELETE /tenaga-kesehatan/pemantauan-indikator/:id
	resp, err = client.R().
		SetAuthToken("your_token").
		Delete("/tenaga-kesehatan/pemantauan-indikator/:id")

	// POST /admin/bidan/:id/akun
	resp, err = client.R().
		SetAuthToken("your_token").
		SetBody(map[string]any{
			"key": "value",
		}).
		Post("/admin/bidan/:id/akun")

	// POST /admin/kader/:id/akun
	resp, err = client.R().
		SetAuthToken("your_token").
		SetBody(map[string]any{
			"key": "value",
		}).
		Post("/admin/kader/:id/akun")

	// GET /tenaga-kesehatan/kategori-capaian/rentang-usia/:rentang_usia
	resp, err = client.R().
		SetAuthToken("your_token").
		Get("/tenaga-kesehatan/kategori-capaian/rentang-usia/:rentang_usia")

	// GET /tenaga-kesehatan/lembar-pemantauan
	resp, err = client.R().
		SetAuthToken("your_token").
		Get("/tenaga-kesehatan/lembar-pemantauan")

	// GET /tenaga-kesehatan/lembar-pemantauan/:id
	resp, err = client.R().
		SetAuthToken("your_token").
		Get("/tenaga-kesehatan/lembar-pemantauan/:id")

	// POST /tenaga-kesehatan/lembar-pemantauan
	resp, err = client.R().
		SetAuthToken("your_token").
		SetBody(map[string]any{
			"key": "value",
		}).
		Post("/tenaga-kesehatan/lembar-pemantauan")

	// PUT /tenaga-kesehatan/lembar-pemantauan/:id
	resp, err = client.R().
		SetAuthToken("your_token").
		SetBody(map[string]any{
			"key": "value",
		}).
		Put("/tenaga-kesehatan/lembar-pemantauan/:id")

	// DELETE /tenaga-kesehatan/lembar-pemantauan/:id
	resp, err = client.R().
		SetAuthToken("your_token").
		Delete("/tenaga-kesehatan/lembar-pemantauan/:id")

	// PATCH /tenaga-kesehatan/lembar-pemantauan/:id/verifikasi
	resp, err = client.R().
		SetAuthToken("your_token").
		SetBody(map[string]any{
			"key": "value",
		}).
		Patch("/tenaga-kesehatan/lembar-pemantauan/:id/verifikasi")

	// POST /tenaga-kesehatan/ibu
	resp, err = client.R().
		SetAuthToken("your_token").
		SetBody(map[string]any{
			"key": "value",
		}).
		Post("/tenaga-kesehatan/ibu")

	// GET /tenaga-kesehatan/ibu
	resp, err = client.R().
		SetAuthToken("your_token").
		Get("/tenaga-kesehatan/ibu")

	// GET /tenaga-kesehatan/ibuk
	resp, err = client.R().
		SetAuthToken("your_token").
		Get("/tenaga-kesehatan/ibuk")

	// GET /tenaga-kesehatan/ibu/by-penduduk/:pendudukId
	resp, err = client.R().
		SetAuthToken("your_token").
		Get("/tenaga-kesehatan/ibu/by-penduduk/:pendudukId")

	// GET /tenaga-kesehatan/ibu/:id
	resp, err = client.R().
		SetAuthToken("your_token").
		Get("/tenaga-kesehatan/ibu/:id")

	// PUT /tenaga-kesehatan/ibu/:id
	resp, err = client.R().
		SetAuthToken("your_token").
		SetBody(map[string]any{
			"key": "value",
		}).
		Put("/tenaga-kesehatan/ibu/:id")

	// DELETE /tenaga-kesehatan/ibu/:id
	resp, err = client.R().
		SetAuthToken("your_token").
		Delete("/tenaga-kesehatan/ibu/:id")

	// POST /tenaga-kesehatan/kehamilan
	resp, err = client.R().
		SetAuthToken("your_token").
		SetBody(map[string]any{
			"key": "value",
		}).
		Post("/tenaga-kesehatan/kehamilan")

	// GET /tenaga-kesehatan/kehamilan/all
	resp, err = client.R().
		SetAuthToken("your_token").
		Get("/tenaga-kesehatan/kehamilan/all")

	// GET /tenaga-kesehatan/kehamilan/:id
	resp, err = client.R().
		SetAuthToken("your_token").
		Get("/tenaga-kesehatan/kehamilan/:id")

	// GET /tenaga-kesehatan/kehamilan
	resp, err = client.R().
		SetAuthToken("your_token").
		Get("/tenaga-kesehatan/kehamilan")

	// PUT /tenaga-kesehatan/kehamilan/:id
	resp, err = client.R().
		SetAuthToken("your_token").
		SetBody(map[string]any{
			"key": "value",
		}).
		Put("/tenaga-kesehatan/kehamilan/:id")

	// DELETE /tenaga-kesehatan/kehamilan/:id
	resp, err = client.R().
		SetAuthToken("your_token").
		Delete("/tenaga-kesehatan/kehamilan/:id")

	// PUT /tenaga-kesehatan/kehamilan/:id/status
	resp, err = client.R().
		SetAuthToken("your_token").
		SetBody(map[string]any{
			"key": "value",
		}).
		Put("/tenaga-kesehatan/kehamilan/:id/status")

	// POST /tenaga-kesehatan/pemeriksaan-kehamilan
	resp, err = client.R().
		SetAuthToken("your_token").
		SetBody(map[string]any{
			"key": "value",
		}).
		Post("/tenaga-kesehatan/pemeriksaan-kehamilan")

	// GET /tenaga-kesehatan/pemeriksaan-kehamilan/:id
	resp, err = client.R().
		SetAuthToken("your_token").
		Get("/tenaga-kesehatan/pemeriksaan-kehamilan/:id")

	// GET /tenaga-kesehatan/pemeriksaan-kehamilan
	resp, err = client.R().
		SetAuthToken("your_token").
		Get("/tenaga-kesehatan/pemeriksaan-kehamilan")

	// PUT /tenaga-kesehatan/pemeriksaan-kehamilan/:id
	resp, err = client.R().
		SetAuthToken("your_token").
		SetBody(map[string]any{
			"key": "value",
		}).
		Put("/tenaga-kesehatan/pemeriksaan-kehamilan/:id")

	// DELETE /tenaga-kesehatan/pemeriksaan-kehamilan/:id
	resp, err = client.R().
		SetAuthToken("your_token").
		Delete("/tenaga-kesehatan/pemeriksaan-kehamilan/:id")

	// GET /tenaga-kesehatan/pemeriksaan-kehamilan/grafik-anc
	resp, err = client.R().
		SetAuthToken("your_token").
		Get("/tenaga-kesehatan/pemeriksaan-kehamilan/grafik-anc")

	// POST /tenaga-kesehatan/evaluasi-kesehatan-ibu
	resp, err = client.R().
		SetAuthToken("your_token").
		SetBody(map[string]any{
			"key": "value",
		}).
		Post("/tenaga-kesehatan/evaluasi-kesehatan-ibu")

	// GET /tenaga-kesehatan/evaluasi-kesehatan-ibu/:id
	resp, err = client.R().
		SetAuthToken("your_token").
		Get("/tenaga-kesehatan/evaluasi-kesehatan-ibu/:id")

	// GET /tenaga-kesehatan/evaluasi-kesehatan-ibu
	resp, err = client.R().
		SetAuthToken("your_token").
		Get("/tenaga-kesehatan/evaluasi-kesehatan-ibu")

	// PUT /tenaga-kesehatan/evaluasi-kesehatan-ibu/:id
	resp, err = client.R().
		SetAuthToken("your_token").
		SetBody(map[string]any{
			"key": "value",
		}).
		Put("/tenaga-kesehatan/evaluasi-kesehatan-ibu/:id")

	// DELETE /tenaga-kesehatan/evaluasi-kesehatan-ibu/:id
	resp, err = client.R().
		SetAuthToken("your_token").
		Delete("/tenaga-kesehatan/evaluasi-kesehatan-ibu/:id")

	// POST /tenaga-kesehatan/riwayat-kehamilan-lalu
	resp, err = client.R().
		SetAuthToken("your_token").
		SetBody(map[string]any{
			"key": "value",
		}).
		Post("/tenaga-kesehatan/riwayat-kehamilan-lalu")

	// GET /tenaga-kesehatan/riwayat-kehamilan-lalu/:id
	resp, err = client.R().
		SetAuthToken("your_token").
		Get("/tenaga-kesehatan/riwayat-kehamilan-lalu/:id")

	// GET /tenaga-kesehatan/riwayat-kehamilan-lalu
	resp, err = client.R().
		SetAuthToken("your_token").
		Get("/tenaga-kesehatan/riwayat-kehamilan-lalu")

	// PUT /tenaga-kesehatan/riwayat-kehamilan-lalu/:id
	resp, err = client.R().
		SetAuthToken("your_token").
		SetBody(map[string]any{
			"key": "value",
		}).
		Put("/tenaga-kesehatan/riwayat-kehamilan-lalu/:id")

	// DELETE /tenaga-kesehatan/riwayat-kehamilan-lalu/:id
	resp, err = client.R().
		SetAuthToken("your_token").
		Delete("/tenaga-kesehatan/riwayat-kehamilan-lalu/:id")

	// POST /tenaga-kesehatan/pemeriksaan-dokter-t1
	resp, err = client.R().
		SetAuthToken("your_token").
		SetBody(map[string]any{
			"key": "value",
		}).
		Post("/tenaga-kesehatan/pemeriksaan-dokter-t1")

	// GET /tenaga-kesehatan/pemeriksaan-dokter-t1/:id
	resp, err = client.R().
		SetAuthToken("your_token").
		Get("/tenaga-kesehatan/pemeriksaan-dokter-t1/:id")

	// GET /tenaga-kesehatan/pemeriksaan-dokter-t1
	resp, err = client.R().
		SetAuthToken("your_token").
		Get("/tenaga-kesehatan/pemeriksaan-dokter-t1")

	// PUT /tenaga-kesehatan/pemeriksaan-dokter-t1/:id
	resp, err = client.R().
		SetAuthToken("your_token").
		SetBody(map[string]any{
			"key": "value",
		}).
		Put("/tenaga-kesehatan/pemeriksaan-dokter-t1/:id")

	// DELETE /tenaga-kesehatan/pemeriksaan-dokter-t1/:id
	resp, err = client.R().
		SetAuthToken("your_token").
		Delete("/tenaga-kesehatan/pemeriksaan-dokter-t1/:id")

	// POST /tenaga-kesehatan/pemeriksaan-lab-jiwa
	resp, err = client.R().
		SetAuthToken("your_token").
		SetBody(map[string]any{
			"key": "value",
		}).
		Post("/tenaga-kesehatan/pemeriksaan-lab-jiwa")

	// GET /tenaga-kesehatan/pemeriksaan-lab-jiwa/:id
	resp, err = client.R().
		SetAuthToken("your_token").
		Get("/tenaga-kesehatan/pemeriksaan-lab-jiwa/:id")

	// GET /tenaga-kesehatan/pemeriksaan-lab-jiwa
	resp, err = client.R().
		SetAuthToken("your_token").
		Get("/tenaga-kesehatan/pemeriksaan-lab-jiwa")

	// PUT /tenaga-kesehatan/pemeriksaan-lab-jiwa/:id
	resp, err = client.R().
		SetAuthToken("your_token").
		SetBody(map[string]any{
			"key": "value",
		}).
		Put("/tenaga-kesehatan/pemeriksaan-lab-jiwa/:id")

	// DELETE /tenaga-kesehatan/pemeriksaan-lab-jiwa/:id
	resp, err = client.R().
		SetAuthToken("your_token").
		Delete("/tenaga-kesehatan/pemeriksaan-lab-jiwa/:id")

	// POST /tenaga-kesehatan/catatan-pelayanan-t1
	resp, err = client.R().
		SetAuthToken("your_token").
		SetBody(map[string]any{
			"key": "value",
		}).
		Post("/tenaga-kesehatan/catatan-pelayanan-t1")

	// GET /tenaga-kesehatan/catatan-pelayanan-t1/:id
	resp, err = client.R().
		SetAuthToken("your_token").
		Get("/tenaga-kesehatan/catatan-pelayanan-t1/:id")

	// GET /tenaga-kesehatan/catatan-pelayanan-t1
	resp, err = client.R().
		SetAuthToken("your_token").
		Get("/tenaga-kesehatan/catatan-pelayanan-t1")

	// PUT /tenaga-kesehatan/catatan-pelayanan-t1/:id
	resp, err = client.R().
		SetAuthToken("your_token").
		SetBody(map[string]any{
			"key": "value",
		}).
		Put("/tenaga-kesehatan/catatan-pelayanan-t1/:id")

	// DELETE /tenaga-kesehatan/catatan-pelayanan-t1/:id
	resp, err = client.R().
		SetAuthToken("your_token").
		Delete("/tenaga-kesehatan/catatan-pelayanan-t1/:id")

	// POST /tenaga-kesehatan/catatan-pelayanan-t2
	resp, err = client.R().
		SetAuthToken("your_token").
		SetBody(map[string]any{
			"key": "value",
		}).
		Post("/tenaga-kesehatan/catatan-pelayanan-t2")

	// GET /tenaga-kesehatan/catatan-pelayanan-t2/:id
	resp, err = client.R().
		SetAuthToken("your_token").
		Get("/tenaga-kesehatan/catatan-pelayanan-t2/:id")

	// GET /tenaga-kesehatan/catatan-pelayanan-t2
	resp, err = client.R().
		SetAuthToken("your_token").
		Get("/tenaga-kesehatan/catatan-pelayanan-t2")

	// PUT /tenaga-kesehatan/catatan-pelayanan-t2/:id
	resp, err = client.R().
		SetAuthToken("your_token").
		SetBody(map[string]any{
			"key": "value",
		}).
		Put("/tenaga-kesehatan/catatan-pelayanan-t2/:id")

	// DELETE /tenaga-kesehatan/catatan-pelayanan-t2/:id
	resp, err = client.R().
		SetAuthToken("your_token").
		Delete("/tenaga-kesehatan/catatan-pelayanan-t2/:id")

	// POST /tenaga-kesehatan/catatan-pelayanan-t3
	resp, err = client.R().
		SetAuthToken("your_token").
		SetBody(map[string]any{
			"key": "value",
		}).
		Post("/tenaga-kesehatan/catatan-pelayanan-t3")

	// GET /tenaga-kesehatan/catatan-pelayanan-t3/:id
	resp, err = client.R().
		SetAuthToken("your_token").
		Get("/tenaga-kesehatan/catatan-pelayanan-t3/:id")

	// GET /tenaga-kesehatan/catatan-pelayanan-t3
	resp, err = client.R().
		SetAuthToken("your_token").
		Get("/tenaga-kesehatan/catatan-pelayanan-t3")

	// PUT /tenaga-kesehatan/catatan-pelayanan-t3/:id
	resp, err = client.R().
		SetAuthToken("your_token").
		SetBody(map[string]any{
			"key": "value",
		}).
		Put("/tenaga-kesehatan/catatan-pelayanan-t3/:id")

	// DELETE /tenaga-kesehatan/catatan-pelayanan-t3/:id
	resp, err = client.R().
		SetAuthToken("your_token").
		Delete("/tenaga-kesehatan/catatan-pelayanan-t3/:id")

	// POST /tenaga-kesehatan/catatan-pelayanan-nifas
	resp, err = client.R().
		SetAuthToken("your_token").
		SetBody(map[string]any{
			"key": "value",
		}).
		Post("/tenaga-kesehatan/catatan-pelayanan-nifas")

	// GET /tenaga-kesehatan/catatan-pelayanan-nifas/:id
	resp, err = client.R().
		SetAuthToken("your_token").
		Get("/tenaga-kesehatan/catatan-pelayanan-nifas/:id")

	// GET /tenaga-kesehatan/catatan-pelayanan-nifas
	resp, err = client.R().
		SetAuthToken("your_token").
		Get("/tenaga-kesehatan/catatan-pelayanan-nifas")

	// PUT /tenaga-kesehatan/catatan-pelayanan-nifas/:id
	resp, err = client.R().
		SetAuthToken("your_token").
		SetBody(map[string]any{
			"key": "value",
		}).
		Put("/tenaga-kesehatan/catatan-pelayanan-nifas/:id")

	// DELETE /tenaga-kesehatan/catatan-pelayanan-nifas/:id
	resp, err = client.R().
		SetAuthToken("your_token").
		Delete("/tenaga-kesehatan/catatan-pelayanan-nifas/:id")

	// POST /tenaga-kesehatan/grafik-evaluasi-kehamilan
	resp, err = client.R().
		SetAuthToken("your_token").
		SetBody(map[string]any{
			"key": "value",
		}).
		Post("/tenaga-kesehatan/grafik-evaluasi-kehamilan")

	// GET /tenaga-kesehatan/grafik-evaluasi-kehamilan/grafik
	resp, err = client.R().
		SetAuthToken("your_token").
		Get("/tenaga-kesehatan/grafik-evaluasi-kehamilan/grafik")

	// GET /tenaga-kesehatan/grafik-evaluasi-kehamilan/:id
	resp, err = client.R().
		SetAuthToken("your_token").
		Get("/tenaga-kesehatan/grafik-evaluasi-kehamilan/:id")

	// GET /tenaga-kesehatan/grafik-evaluasi-kehamilan
	resp, err = client.R().
		SetAuthToken("your_token").
		Get("/tenaga-kesehatan/grafik-evaluasi-kehamilan")

	// PUT /tenaga-kesehatan/grafik-evaluasi-kehamilan/:id
	resp, err = client.R().
		SetAuthToken("your_token").
		SetBody(map[string]any{
			"key": "value",
		}).
		Put("/tenaga-kesehatan/grafik-evaluasi-kehamilan/:id")

	// DELETE /tenaga-kesehatan/grafik-evaluasi-kehamilan/:id
	resp, err = client.R().
		SetAuthToken("your_token").
		Delete("/tenaga-kesehatan/grafik-evaluasi-kehamilan/:id")

	// POST /tenaga-kesehatan/grafik-peningkatan-bb
	resp, err = client.R().
		SetAuthToken("your_token").
		SetBody(map[string]any{
			"key": "value",
		}).
		Post("/tenaga-kesehatan/grafik-peningkatan-bb")

	// GET /tenaga-kesehatan/grafik-peningkatan-bb/:id
	resp, err = client.R().
		SetAuthToken("your_token").
		Get("/tenaga-kesehatan/grafik-peningkatan-bb/:id")

	// GET /tenaga-kesehatan/grafik-peningkatan-bb
	resp, err = client.R().
		SetAuthToken("your_token").
		Get("/tenaga-kesehatan/grafik-peningkatan-bb")

	// PUT /tenaga-kesehatan/grafik-peningkatan-bb/:id
	resp, err = client.R().
		SetAuthToken("your_token").
		SetBody(map[string]any{
			"key": "value",
		}).
		Put("/tenaga-kesehatan/grafik-peningkatan-bb/:id")

	// DELETE /tenaga-kesehatan/grafik-peningkatan-bb/:id
	resp, err = client.R().
		SetAuthToken("your_token").
		Delete("/tenaga-kesehatan/grafik-peningkatan-bb/:id")

	// POST /tenaga-kesehatan/penjelasan-hasil-grafik
	resp, err = client.R().
		SetAuthToken("your_token").
		SetBody(map[string]any{
			"key": "value",
		}).
		Post("/tenaga-kesehatan/penjelasan-hasil-grafik")

	// GET /tenaga-kesehatan/penjelasan-hasil-grafik/:id
	resp, err = client.R().
		SetAuthToken("your_token").
		Get("/tenaga-kesehatan/penjelasan-hasil-grafik/:id")

	// GET /tenaga-kesehatan/penjelasan-hasil-grafik
	resp, err = client.R().
		SetAuthToken("your_token").
		Get("/tenaga-kesehatan/penjelasan-hasil-grafik")

	// PUT /tenaga-kesehatan/penjelasan-hasil-grafik/:id
	resp, err = client.R().
		SetAuthToken("your_token").
		SetBody(map[string]any{
			"key": "value",
		}).
		Put("/tenaga-kesehatan/penjelasan-hasil-grafik/:id")

	// DELETE /tenaga-kesehatan/penjelasan-hasil-grafik/:id
	resp, err = client.R().
		SetAuthToken("your_token").
		Delete("/tenaga-kesehatan/penjelasan-hasil-grafik/:id")

	// POST /tenaga-kesehatan/rencana-persalinan
	resp, err = client.R().
		SetAuthToken("your_token").
		SetBody(map[string]any{
			"key": "value",
		}).
		Post("/tenaga-kesehatan/rencana-persalinan")

	// GET /tenaga-kesehatan/rencana-persalinan/:id
	resp, err = client.R().
		SetAuthToken("your_token").
		Get("/tenaga-kesehatan/rencana-persalinan/:id")

	// GET /tenaga-kesehatan/rencana-persalinan
	resp, err = client.R().
		SetAuthToken("your_token").
		Get("/tenaga-kesehatan/rencana-persalinan")

	// PUT /tenaga-kesehatan/rencana-persalinan/:id
	resp, err = client.R().
		SetAuthToken("your_token").
		SetBody(map[string]any{
			"key": "value",
		}).
		Put("/tenaga-kesehatan/rencana-persalinan/:id")

	// DELETE /tenaga-kesehatan/rencana-persalinan/:id
	resp, err = client.R().
		SetAuthToken("your_token").
		Delete("/tenaga-kesehatan/rencana-persalinan/:id")

	// POST /tenaga-kesehatan/ringkasan-persalinan
	resp, err = client.R().
		SetAuthToken("your_token").
		SetBody(map[string]any{
			"key": "value",
		}).
		Post("/tenaga-kesehatan/ringkasan-persalinan")

	// GET /tenaga-kesehatan/ringkasan-persalinan/:id
	resp, err = client.R().
		SetAuthToken("your_token").
		Get("/tenaga-kesehatan/ringkasan-persalinan/:id")

	// GET /tenaga-kesehatan/ringkasan-persalinan
	resp, err = client.R().
		SetAuthToken("your_token").
		Get("/tenaga-kesehatan/ringkasan-persalinan")

	// PUT /tenaga-kesehatan/ringkasan-persalinan/:id
	resp, err = client.R().
		SetAuthToken("your_token").
		SetBody(map[string]any{
			"key": "value",
		}).
		Put("/tenaga-kesehatan/ringkasan-persalinan/:id")

	// DELETE /tenaga-kesehatan/ringkasan-persalinan/:id
	resp, err = client.R().
		SetAuthToken("your_token").
		Delete("/tenaga-kesehatan/ringkasan-persalinan/:id")

	// POST /tenaga-kesehatan/riwayat-proses-melahirkan
	resp, err = client.R().
		SetAuthToken("your_token").
		SetBody(map[string]any{
			"key": "value",
		}).
		Post("/tenaga-kesehatan/riwayat-proses-melahirkan")

	// GET /tenaga-kesehatan/riwayat-proses-melahirkan/:id
	resp, err = client.R().
		SetAuthToken("your_token").
		Get("/tenaga-kesehatan/riwayat-proses-melahirkan/:id")

	// GET /tenaga-kesehatan/riwayat-proses-melahirkan
	resp, err = client.R().
		SetAuthToken("your_token").
		Get("/tenaga-kesehatan/riwayat-proses-melahirkan")

	// PUT /tenaga-kesehatan/riwayat-proses-melahirkan/:id
	resp, err = client.R().
		SetAuthToken("your_token").
		SetBody(map[string]any{
			"key": "value",
		}).
		Put("/tenaga-kesehatan/riwayat-proses-melahirkan/:id")

	// DELETE /tenaga-kesehatan/riwayat-proses-melahirkan/:id
	resp, err = client.R().
		SetAuthToken("your_token").
		Delete("/tenaga-kesehatan/riwayat-proses-melahirkan/:id")

	// POST /tenaga-kesehatan/keterangan-lahir
	resp, err = client.R().
		SetAuthToken("your_token").
		SetBody(map[string]any{
			"key": "value",
		}).
		Post("/tenaga-kesehatan/keterangan-lahir")

	// GET /tenaga-kesehatan/keterangan-lahir/:id
	resp, err = client.R().
		SetAuthToken("your_token").
		Get("/tenaga-kesehatan/keterangan-lahir/:id")

	// GET /tenaga-kesehatan/keterangan-lahir
	resp, err = client.R().
		SetAuthToken("your_token").
		Get("/tenaga-kesehatan/keterangan-lahir")

	// PUT /tenaga-kesehatan/keterangan-lahir/:id
	resp, err = client.R().
		SetAuthToken("your_token").
		SetBody(map[string]any{
			"key": "value",
		}).
		Put("/tenaga-kesehatan/keterangan-lahir/:id")

	// DELETE /tenaga-kesehatan/keterangan-lahir/:id
	resp, err = client.R().
		SetAuthToken("your_token").
		Delete("/tenaga-kesehatan/keterangan-lahir/:id")

	// POST /tenaga-kesehatan/pelayanan-ibu-nifas
	resp, err = client.R().
		SetAuthToken("your_token").
		SetBody(map[string]any{
			"key": "value",
		}).
		Post("/tenaga-kesehatan/pelayanan-ibu-nifas")

	// GET /tenaga-kesehatan/pelayanan-ibu-nifas/:id
	resp, err = client.R().
		SetAuthToken("your_token").
		Get("/tenaga-kesehatan/pelayanan-ibu-nifas/:id")

	// GET /tenaga-kesehatan/pelayanan-ibu-nifas
	resp, err = client.R().
		SetAuthToken("your_token").
		Get("/tenaga-kesehatan/pelayanan-ibu-nifas")

	// PUT /tenaga-kesehatan/pelayanan-ibu-nifas/:id
	resp, err = client.R().
		SetAuthToken("your_token").
		SetBody(map[string]any{
			"key": "value",
		}).
		Put("/tenaga-kesehatan/pelayanan-ibu-nifas/:id")

	// DELETE /tenaga-kesehatan/pelayanan-ibu-nifas/:id
	resp, err = client.R().
		SetAuthToken("your_token").
		Delete("/tenaga-kesehatan/pelayanan-ibu-nifas/:id")

	// POST /tenaga-kesehatan/skrining-preeklampsia
	resp, err = client.R().
		SetAuthToken("your_token").
		SetBody(map[string]any{
			"key": "value",
		}).
		Post("/tenaga-kesehatan/skrining-preeklampsia")

	// GET /tenaga-kesehatan/skrining-preeklampsia/:id
	resp, err = client.R().
		SetAuthToken("your_token").
		Get("/tenaga-kesehatan/skrining-preeklampsia/:id")

	// GET /tenaga-kesehatan/skrining-preeklampsia
	resp, err = client.R().
		SetAuthToken("your_token").
		Get("/tenaga-kesehatan/skrining-preeklampsia")

	// PUT /tenaga-kesehatan/skrining-preeklampsia/:id
	resp, err = client.R().
		SetAuthToken("your_token").
		SetBody(map[string]any{
			"key": "value",
		}).
		Put("/tenaga-kesehatan/skrining-preeklampsia/:id")

	// DELETE /tenaga-kesehatan/skrining-preeklampsia/:id
	resp, err = client.R().
		SetAuthToken("your_token").
		Delete("/tenaga-kesehatan/skrining-preeklampsia/:id")

	// POST /tenaga-kesehatan/skrining-dm-gestasional
	resp, err = client.R().
		SetAuthToken("your_token").
		SetBody(map[string]any{
			"key": "value",
		}).
		Post("/tenaga-kesehatan/skrining-dm-gestasional")

	// GET /tenaga-kesehatan/skrining-dm-gestasional/:id
	resp, err = client.R().
		SetAuthToken("your_token").
		Get("/tenaga-kesehatan/skrining-dm-gestasional/:id")

	// GET /tenaga-kesehatan/skrining-dm-gestasional
	resp, err = client.R().
		SetAuthToken("your_token").
		Get("/tenaga-kesehatan/skrining-dm-gestasional")

	// PUT /tenaga-kesehatan/skrining-dm-gestasional/:id
	resp, err = client.R().
		SetAuthToken("your_token").
		SetBody(map[string]any{
			"key": "value",
		}).
		Put("/tenaga-kesehatan/skrining-dm-gestasional/:id")

	// DELETE /tenaga-kesehatan/skrining-dm-gestasional/:id
	resp, err = client.R().
		SetAuthToken("your_token").
		Delete("/tenaga-kesehatan/skrining-dm-gestasional/:id")

	// POST /tenaga-kesehatan/rujukan
	resp, err = client.R().
		SetAuthToken("your_token").
		SetBody(map[string]any{
			"key": "value",
		}).
		Post("/tenaga-kesehatan/rujukan")

	// GET /tenaga-kesehatan/rujukan/:id
	resp, err = client.R().
		SetAuthToken("your_token").
		Get("/tenaga-kesehatan/rujukan/:id")

	// GET /tenaga-kesehatan/rujukan
	resp, err = client.R().
		SetAuthToken("your_token").
		Get("/tenaga-kesehatan/rujukan")

	// PUT /tenaga-kesehatan/rujukan/:id
	resp, err = client.R().
		SetAuthToken("your_token").
		SetBody(map[string]any{
			"key": "value",
		}).
		Put("/tenaga-kesehatan/rujukan/:id")

	// DELETE /tenaga-kesehatan/rujukan/:id
	resp, err = client.R().
		SetAuthToken("your_token").
		Delete("/tenaga-kesehatan/rujukan/:id")

	// POST /tenaga-kesehatan/pemeriksaan-dokter-t3
	resp, err = client.R().
		SetAuthToken("your_token").
		SetBody(map[string]any{
			"key": "value",
		}).
		Post("/tenaga-kesehatan/pemeriksaan-dokter-t3")

	// GET /tenaga-kesehatan/pemeriksaan-dokter-t3/:id
	resp, err = client.R().
		SetAuthToken("your_token").
		Get("/tenaga-kesehatan/pemeriksaan-dokter-t3/:id")

	// GET /tenaga-kesehatan/pemeriksaan-dokter-t3
	resp, err = client.R().
		SetAuthToken("your_token").
		Get("/tenaga-kesehatan/pemeriksaan-dokter-t3")

	// PUT /tenaga-kesehatan/pemeriksaan-dokter-t3/:id
	resp, err = client.R().
		SetAuthToken("your_token").
		SetBody(map[string]any{
			"key": "value",
		}).
		Put("/tenaga-kesehatan/pemeriksaan-dokter-t3/:id")

	// DELETE /tenaga-kesehatan/pemeriksaan-dokter-t3/:id
	resp, err = client.R().
		SetAuthToken("your_token").
		Delete("/tenaga-kesehatan/pemeriksaan-dokter-t3/:id")

	// POST /tenaga-kesehatan/pemeriksaan-lanjutan-t3
	resp, err = client.R().
		SetAuthToken("your_token").
		SetBody(map[string]any{
			"key": "value",
		}).
		Post("/tenaga-kesehatan/pemeriksaan-lanjutan-t3")

	// GET /tenaga-kesehatan/pemeriksaan-lanjutan-t3/:id
	resp, err = client.R().
		SetAuthToken("your_token").
		Get("/tenaga-kesehatan/pemeriksaan-lanjutan-t3/:id")

	// GET /tenaga-kesehatan/pemeriksaan-lanjutan-t3
	resp, err = client.R().
		SetAuthToken("your_token").
		Get("/tenaga-kesehatan/pemeriksaan-lanjutan-t3")

	// PUT /tenaga-kesehatan/pemeriksaan-lanjutan-t3/:id
	resp, err = client.R().
		SetAuthToken("your_token").
		SetBody(map[string]any{
			"key": "value",
		}).
		Put("/tenaga-kesehatan/pemeriksaan-lanjutan-t3/:id")

	// DELETE /tenaga-kesehatan/pemeriksaan-lanjutan-t3/:id
	resp, err = client.R().
		SetAuthToken("your_token").
		Delete("/tenaga-kesehatan/pemeriksaan-lanjutan-t3/:id")

	// GET /tenaga-kesehatan/kategori-tanda-bahaya
	resp, err = client.R().
		SetAuthToken("your_token").
		Get("/tenaga-kesehatan/kategori-tanda-bahaya")

	// POST /tenaga-kesehatan/kategori-tanda-bahaya
	resp, err = client.R().
		SetAuthToken("your_token").
		SetBody(map[string]any{
			"key": "value",
		}).
		Post("/tenaga-kesehatan/kategori-tanda-bahaya")

	// GET /tenaga-kesehatan/kategori-tanda-bahaya/:id
	resp, err = client.R().
		SetAuthToken("your_token").
		Get("/tenaga-kesehatan/kategori-tanda-bahaya/:id")

	// GET /tenaga-kesehatan/kategori-tanda-bahaya/filter
	resp, err = client.R().
		SetAuthToken("your_token").
		Get("/tenaga-kesehatan/kategori-tanda-bahaya/filter")

	// PUT /tenaga-kesehatan/kategori-tanda-bahaya/:id
	resp, err = client.R().
		SetAuthToken("your_token").
		SetBody(map[string]any{
			"key": "value",
		}).
		Put("/tenaga-kesehatan/kategori-tanda-bahaya/:id")

	// DELETE /tenaga-kesehatan/kategori-tanda-bahaya/:id
	resp, err = client.R().
		SetAuthToken("your_token").
		Delete("/tenaga-kesehatan/kategori-tanda-bahaya/:id")

	// GET /tenaga-kesehatan/skrining-pemantauan
	resp, err = client.R().
		SetAuthToken("your_token").
		Get("/tenaga-kesehatan/skrining-pemantauan")

	// POST /tenaga-kesehatan/skrining-pemantauan
	resp, err = client.R().
		SetAuthToken("your_token").
		SetBody(map[string]any{
			"key": "value",
		}).
		Post("/tenaga-kesehatan/skrining-pemantauan")

	// GET /tenaga-kesehatan/skrining-pemantauan/:id
	resp, err = client.R().
		SetAuthToken("your_token").
		Get("/tenaga-kesehatan/skrining-pemantauan/:id")

	// GET /tenaga-kesehatan/skrining-pemantauan/anak/:anak_id
	resp, err = client.R().
		SetAuthToken("your_token").
		Get("/tenaga-kesehatan/skrining-pemantauan/anak/:anak_id")

	// PUT /tenaga-kesehatan/skrining-pemantauan/:id
	resp, err = client.R().
		SetAuthToken("your_token").
		SetBody(map[string]any{
			"key": "value",
		}).
		Put("/tenaga-kesehatan/skrining-pemantauan/:id")

	// DELETE /tenaga-kesehatan/skrining-pemantauan/:id
	resp, err = client.R().
		SetAuthToken("your_token").
		Delete("/tenaga-kesehatan/skrining-pemantauan/:id")

	// GET /tenaga-kesehatan/kartu-keluarga
	resp, err = client.R().
		SetAuthToken("your_token").
		Get("/tenaga-kesehatan/kartu-keluarga")

	// POST /tenaga-kesehatan/kartu-keluarga
	resp, err = client.R().
		SetAuthToken("your_token").
		SetBody(map[string]any{
			"key": "value",
		}).
		Post("/tenaga-kesehatan/kartu-keluarga")

	// GET /tenaga-kesehatan/kartu-keluarga/:id
	resp, err = client.R().
		SetAuthToken("your_token").
		Get("/tenaga-kesehatan/kartu-keluarga/:id")

	// GET /tenaga-kesehatan/kartu-keluarga/no-kk/:no_kk
	resp, err = client.R().
		SetAuthToken("your_token").
		Get("/tenaga-kesehatan/kartu-keluarga/no-kk/:no_kk")

	// PUT /tenaga-kesehatan/kartu-keluarga/:id
	resp, err = client.R().
		SetAuthToken("your_token").
		SetBody(map[string]any{
			"key": "value",
		}).
		Put("/tenaga-kesehatan/kartu-keluarga/:id")

	// DELETE /tenaga-kesehatan/kartu-keluarga/:id
	resp, err = client.R().
		SetAuthToken("your_token").
		Delete("/tenaga-kesehatan/kartu-keluarga/:id")

	// GET /tenaga-kesehatan/kependudukan
	resp, err = client.R().
		SetAuthToken("your_token").
		Get("/tenaga-kesehatan/kependudukan")

	// GET /tenaga-kesehatan/kependudukan/desa
	resp, err = client.R().
		SetAuthToken("your_token").
		Get("/tenaga-kesehatan/kependudukan/desa")

	// POST /tenaga-kesehatan/kependudukan
	resp, err = client.R().
		SetAuthToken("your_token").
		SetBody(map[string]any{
			"key": "value",
		}).
		Post("/tenaga-kesehatan/kependudukan")

	// GET /tenaga-kesehatan/kependudukan/:id
	resp, err = client.R().
		SetAuthToken("your_token").
		Get("/tenaga-kesehatan/kependudukan/:id")

	// GET /tenaga-kesehatan/kependudukan/kartu-keluarga/:kartu_keluarga_id
	resp, err = client.R().
		SetAuthToken("your_token").
		Get("/tenaga-kesehatan/kependudukan/kartu-keluarga/:kartu_keluarga_id")

	// PUT /tenaga-kesehatan/kependudukan/:id
	resp, err = client.R().
		SetAuthToken("your_token").
		SetBody(map[string]any{
			"key": "value",
		}).
		Put("/tenaga-kesehatan/kependudukan/:id")

	// DELETE /tenaga-kesehatan/kependudukan/:id
	resp, err = client.R().
		SetAuthToken("your_token").
		Delete("/tenaga-kesehatan/kependudukan/:id")

	// GET /tenaga-kesehatan/penduduk/rekap-dusun
	resp, err = client.R().
		SetAuthToken("your_token").
		Get("/tenaga-kesehatan/penduduk/rekap-dusun")

	// GET /tenaga-kesehatan/jenis-pelayanan
	resp, err = client.R().
		SetAuthToken("your_token").
		Get("/tenaga-kesehatan/jenis-pelayanan")

	// POST /tenaga-kesehatan/pemeriksaan-dokter-t1-complete
	resp, err = client.R().
		SetAuthToken("your_token").
		SetBody(map[string]any{
			"key": "value",
		}).
		Post("/tenaga-kesehatan/pemeriksaan-dokter-t1-complete")

	// PUT /tenaga-kesehatan/pemeriksaan-dokter-t1-complete/:id
	resp, err = client.R().
		SetAuthToken("your_token").
		SetBody(map[string]any{
			"key": "value",
		}).
		Put("/tenaga-kesehatan/pemeriksaan-dokter-t1-complete/:id")

	// GET /tenaga-kesehatan/pemeriksaan-dokter-t1-complete/:id
	resp, err = client.R().
		SetAuthToken("your_token").
		Get("/tenaga-kesehatan/pemeriksaan-dokter-t1-complete/:id")

	// GET /tenaga-kesehatan/pemeriksaan-dokter-t1-complete
	resp, err = client.R().
		SetAuthToken("your_token").
		Get("/tenaga-kesehatan/pemeriksaan-dokter-t1-complete")

	// DELETE /tenaga-kesehatan/pemeriksaan-dokter-t1-complete/:id
	resp, err = client.R().
		SetAuthToken("your_token").
		Delete("/tenaga-kesehatan/pemeriksaan-dokter-t1-complete/:id")

	// POST /tenaga-kesehatan/pemeriksaan-dokter-t3-complete
	resp, err = client.R().
		SetAuthToken("your_token").
		SetBody(map[string]any{
			"key": "value",
		}).
		Post("/tenaga-kesehatan/pemeriksaan-dokter-t3-complete")

	// PUT /tenaga-kesehatan/pemeriksaan-dokter-t3-complete/:id
	resp, err = client.R().
		SetAuthToken("your_token").
		SetBody(map[string]any{
			"key": "value",
		}).
		Put("/tenaga-kesehatan/pemeriksaan-dokter-t3-complete/:id")

	// GET /tenaga-kesehatan/pemeriksaan-dokter-t3-complete/:id
	resp, err = client.R().
		SetAuthToken("your_token").
		Get("/tenaga-kesehatan/pemeriksaan-dokter-t3-complete/:id")

	// GET /tenaga-kesehatan/pemeriksaan-dokter-t3-complete
	resp, err = client.R().
		SetAuthToken("your_token").
		Get("/tenaga-kesehatan/pemeriksaan-dokter-t3-complete")

	// DELETE /tenaga-kesehatan/pemeriksaan-dokter-t3-complete/:id
	resp, err = client.R().
		SetAuthToken("your_token").
		Delete("/tenaga-kesehatan/pemeriksaan-dokter-t3-complete/:id")

	// GET /tenaga-kesehatan/laporan/ibu/preview
	resp, err = client.R().
		SetAuthToken("your_token").
		Get("/tenaga-kesehatan/laporan/ibu/preview")

	// GET /tenaga-kesehatan/laporan/ibu/export/excel
	resp, err = client.R().
		SetAuthToken("your_token").
		Get("/tenaga-kesehatan/laporan/ibu/export/excel")

	// GET /tenaga-kesehatan/laporan/anak/preview
	resp, err = client.R().
		SetAuthToken("your_token").
		Get("/tenaga-kesehatan/laporan/anak/preview")

	// GET /tenaga-kesehatan/laporan/anak/export/excel
	resp, err = client.R().
		SetAuthToken("your_token").
		Get("/tenaga-kesehatan/laporan/anak/export/excel")

	// GET /ibu/dashboard
	resp, err = client.R().
		SetAuthToken("your_token").
		Get("/ibu/dashboard")

	// GET /ibu/pemeriksaan-kehamilan/:id
	resp, err = client.R().
		SetAuthToken("your_token").
		Get("/ibu/pemeriksaan-kehamilan/:id")

	// GET /ibu/pemeriksaan-kehamilan
	resp, err = client.R().
		SetAuthToken("your_token").
		Get("/ibu/pemeriksaan-kehamilan")

	// GET /ibu/pemeriksaan-kehamilan/grafik-anc
	resp, err = client.R().
		SetAuthToken("your_token").
		Get("/ibu/pemeriksaan-kehamilan/grafik-anc")

	// GET /ibu/catatan-pelayanan-t1
	resp, err = client.R().
		SetAuthToken("your_token").
		Get("/ibu/catatan-pelayanan-t1")

	// GET /ibu/catatan-pelayanan-t2
	resp, err = client.R().
		SetAuthToken("your_token").
		Get("/ibu/catatan-pelayanan-t2")

	// GET /ibu/catatan-pelayanan-t3
	resp, err = client.R().
		SetAuthToken("your_token").
		Get("/ibu/catatan-pelayanan-t3")

	// GET /ibu/pemeriksaan-dokter-t1-complete
	resp, err = client.R().
		SetAuthToken("your_token").
		Get("/ibu/pemeriksaan-dokter-t1-complete")

	// GET /ibu/skrining-preeklampsia
	resp, err = client.R().
		SetAuthToken("your_token").
		Get("/ibu/skrining-preeklampsia")

	// GET /ibu/pemeriksaan-dokter-t3-complete
	resp, err = client.R().
		SetAuthToken("your_token").
		Get("/ibu/pemeriksaan-dokter-t3-complete")

	// GET /ibu/evaluasi-kesehatan-ibu
	resp, err = client.R().
		SetAuthToken("your_token").
		Get("/ibu/evaluasi-kesehatan-ibu")

	// GET /ibu/rujukan
	resp, err = client.R().
		SetAuthToken("your_token").
		Get("/ibu/rujukan")

	// GET /ibu/ringkasan-persalinan
	resp, err = client.R().
		SetAuthToken("your_token").
		Get("/ibu/ringkasan-persalinan")

	// GET /ibu/riwayat-proses-melahirkan
	resp, err = client.R().
		SetAuthToken("your_token").
		Get("/ibu/riwayat-proses-melahirkan")

	// GET /ibu/keterangan-lahir
	resp, err = client.R().
		SetAuthToken("your_token").
		Get("/ibu/keterangan-lahir")

	// GET /ibu/pelayanan-ibu-nifas
	resp, err = client.R().
		SetAuthToken("your_token").
		Get("/ibu/pelayanan-ibu-nifas")

	// GET /ibu/catatan-pelayanan-nifas
	resp, err = client.R().
		SetAuthToken("your_token").
		Get("/ibu/catatan-pelayanan-nifas")

	// GET /tenaga-kesehatan/kep/ endudukan/kartu-keluarga/:kartu_keluarga_id
	resp, err = client.R().
		SetAuthToken("your_token").
		Get("/tenaga-kesehatan/kep/ endudukan/kartu-keluarga/:kartu_keluarga_id")

	// GET /modul-ibu/kehamilan-aktif
	resp, err = client.R().
		SetAuthToken("your_token").
		Get("/modul-ibu/kehamilan-aktif")

	// GET /modul-ibu/evaluasi-kesehatan-ibu/me
	resp, err = client.R().
		SetAuthToken("your_token").
		Get("/modul-ibu/evaluasi-kesehatan-ibu/me")

	// GET /modul-ibu/evaluasi-kesehatan-ibu/:id
	resp, err = client.R().
		SetAuthToken("your_token").
		Get("/modul-ibu/evaluasi-kesehatan-ibu/:id")

	// GET /modul-ibu/pemeriksaan-kehamilan/me
	resp, err = client.R().
		SetAuthToken("your_token").
		Get("/modul-ibu/pemeriksaan-kehamilan/me")

	// GET /modul-ibu/pemeriksaan-kehamilan/:id
	resp, err = client.R().
		SetAuthToken("your_token").
		Get("/modul-ibu/pemeriksaan-kehamilan/:id")

	// GET /modul-ibu/skrining-preeklampsia/me
	resp, err = client.R().
		SetAuthToken("your_token").
		Get("/modul-ibu/skrining-preeklampsia/me")

	// GET /modul-ibu/skrining-preeklampsia/:id
	resp, err = client.R().
		SetAuthToken("your_token").
		Get("/modul-ibu/skrining-preeklampsia/:id")

	// GET /modul-ibu/rujukan/:id
	resp, err = client.R().
		SetAuthToken("your_token").
		Get("/modul-ibu/rujukan/:id")

	// GET /modul-ibu/pemeriksaan-dokter-trimester-1/me
	resp, err = client.R().
		SetAuthToken("your_token").
		Get("/modul-ibu/pemeriksaan-dokter-trimester-1/me")

	// GET /modul-ibu/pemeriksaan-dokter-trimester-3/me
	resp, err = client.R().
		SetAuthToken("your_token").
		Get("/modul-ibu/pemeriksaan-dokter-trimester-3/me")

	// GET /modul-ibu/pemeriksaan-dokter-trimester-1/all
	resp, err = client.R().
		SetAuthToken("your_token").
		Get("/modul-ibu/pemeriksaan-dokter-trimester-1/all")

	// GET /modul-ibu/pemeriksaan-dokter-trimester-3/all
	resp, err = client.R().
		SetAuthToken("your_token").
		Get("/modul-ibu/pemeriksaan-dokter-trimester-3/all")

	// GET /modul-ibu/riwayat-proses-melahirkan/me
	resp, err = client.R().
		SetAuthToken("your_token").
		Get("/modul-ibu/riwayat-proses-melahirkan/me")

	// GET /modul-ibu/log-ttd-mms/me
	resp, err = client.R().
		SetAuthToken("your_token").
		Get("/modul-ibu/log-ttd-mms/me")

	// POST /modul-ibu/log-ttd-mms
	resp, err = client.R().
		SetAuthToken("your_token").
		SetBody(map[string]any{
			"key": "value",
		}).
		Post("/modul-ibu/log-ttd-mms")

	// GET /modul-ibu/pemantauan-ibu-hamil/me
	resp, err = client.R().
		SetAuthToken("your_token").
		Get("/modul-ibu/pemantauan-ibu-hamil/me")

	// POST /modul-ibu/pemantauan-ibu-hamil
	resp, err = client.R().
		SetAuthToken("your_token").
		SetBody(map[string]any{
			"key": "value",
		}).
		Post("/modul-ibu/pemantauan-ibu-hamil")

	// GET /modul-ibu/persiapan-melahirkan/me
	resp, err = client.R().
		SetAuthToken("your_token").
		Get("/modul-ibu/persiapan-melahirkan/me")

	// POST /modul-ibu/persiapan-melahirkan
	resp, err = client.R().
		SetAuthToken("your_token").
		SetBody(map[string]any{
			"key": "value",
		}).
		Post("/modul-ibu/persiapan-melahirkan")

	// GET /modul-ibu/proses-melahirkan/me
	resp, err = client.R().
		SetAuthToken("your_token").
		Get("/modul-ibu/proses-melahirkan/me")

	// POST /modul-ibu/proses-melahirkan
	resp, err = client.R().
		SetAuthToken("your_token").
		SetBody(map[string]any{
			"key": "value",
		}).
		Post("/modul-ibu/proses-melahirkan")

	// GET /modul-ibu/absensi-kelas-ibu-hamil/me
	resp, err = client.R().
		SetAuthToken("your_token").
		Get("/modul-ibu/absensi-kelas-ibu-hamil/me")

	// POST /modul-ibu/absensi-kelas-ibu-hamil
	resp, err = client.R().
		SetAuthToken("your_token").
		SetBody(map[string]any{
			"key": "value",
		}).
		Post("/modul-ibu/absensi-kelas-ibu-hamil")

	// GET /modul-ibu/absensi-kelas-ibu-balita/me
	resp, err = client.R().
		SetAuthToken("your_token").
		Get("/modul-ibu/absensi-kelas-ibu-balita/me")

	// POST /modul-ibu/absensi-kelas-ibu-balita
	resp, err = client.R().
		SetAuthToken("your_token").
		SetBody(map[string]any{
			"key": "value",
		}).
		Post("/modul-ibu/absensi-kelas-ibu-balita")

	// GET /modul-ibu/checklist-pemantauan-ibu-nifas/me
	resp, err = client.R().
		SetAuthToken("your_token").
		Get("/modul-ibu/checklist-pemantauan-ibu-nifas/me")

	// POST /modul-ibu/checklist-pemantauan-ibu-nifas
	resp, err = client.R().
		SetAuthToken("your_token").
		SetBody(map[string]any{
			"key": "value",
		}).
		Post("/modul-ibu/checklist-pemantauan-ibu-nifas")

	// GET /modul-ibu/checklist-pemantauan-ibu-nifas/filled-days
	resp, err = client.R().
		SetAuthToken("your_token").
		Get("/modul-ibu/checklist-pemantauan-ibu-nifas/filled-days")

	// GET /modul-ibu/catatan-pelayanan-t1
	resp, err = client.R().
		SetAuthToken("your_token").
		Get("/modul-ibu/catatan-pelayanan-t1")

	// GET /modul-ibu/catatan-pelayanan-t2
	resp, err = client.R().
		SetAuthToken("your_token").
		Get("/modul-ibu/catatan-pelayanan-t2")

	// GET /modul-ibu/catatan-pelayanan-t3
	resp, err = client.R().
		SetAuthToken("your_token").
		Get("/modul-ibu/catatan-pelayanan-t3")

	// GET /modul-ibu/rujukan
	resp, err = client.R().
		SetAuthToken("your_token").
		Get("/modul-ibu/rujukan")

	// GET /modul-ibu/grafik-evaluasi-kehamilan/grafik
	resp, err = client.R().
		SetAuthToken("your_token").
		Get("/modul-ibu/grafik-evaluasi-kehamilan/grafik")

	// GET /modul-ibu/grafik-evaluasi-kehamilan/me
	resp, err = client.R().
		SetAuthToken("your_token").
		Get("/modul-ibu/grafik-evaluasi-kehamilan/me")

	// GET /modul-ibu/grafik-evaluasi-kehamilan/v2
	resp, err = client.R().
		SetAuthToken("your_token").
		Get("/modul-ibu/grafik-evaluasi-kehamilan/v2")

	// GET /modul-ibu/grafik-evaluasi-kehamilan/:id
	resp, err = client.R().
		SetAuthToken("your_token").
		Get("/modul-ibu/grafik-evaluasi-kehamilan/:id")

	// GET /modul-ibu/grafik-peningkatan-bb/v2
	resp, err = client.R().
		SetAuthToken("your_token").
		Get("/modul-ibu/grafik-peningkatan-bb/v2")

	// GET /modul-ibu/keterangan-lahir/me
	resp, err = client.R().
		SetAuthToken("your_token").
		Get("/modul-ibu/keterangan-lahir/me")

	// GET /modul-ibu/ringkasan-persalinan/me
	resp, err = client.R().
		SetAuthToken("your_token").
		Get("/modul-ibu/ringkasan-persalinan/me")

	// GET /modul-ibu/pelayanan-ibu-nifas/me
	resp, err = client.R().
		SetAuthToken("your_token").
		Get("/modul-ibu/pelayanan-ibu-nifas/me")

	// GET /modul-ibu/catatan-pelayanan-nifas/me
	resp, err = client.R().
		SetAuthToken("your_token").
		Get("/modul-ibu/catatan-pelayanan-nifas/me")

	// GET /modul-ibu/profil
	resp, err = client.R().
		SetAuthToken("your_token").
		Get("/modul-ibu/profil")

	// GET /modul-ibu/neonatus/anak/:anak_id
	resp, err = client.R().
		SetAuthToken("your_token").
		Get("/modul-ibu/neonatus/anak/:anak_id")

	// GET /modul-ibu/neonatus/:id
	resp, err = client.R().
		SetAuthToken("your_token").
		Get("/modul-ibu/neonatus/:id")

	// GET /ibu/anak
	resp, err = client.R().
		SetAuthToken("your_token").
		Get("/ibu/anak")

	// GET /ibu/lembar-pemantauan/rentang-usia
	resp, err = client.R().
		SetAuthToken("your_token").
		Get("/ibu/lembar-pemantauan/rentang-usia")

	// GET /ibu/lembar-pemantauan/kategori-tanda-sakit
	resp, err = client.R().
		SetAuthToken("your_token").
		Get("/ibu/lembar-pemantauan/kategori-tanda-sakit")

	// POST /ibu/lembar-pemantauan
	resp, err = client.R().
		SetAuthToken("your_token").
		SetBody(map[string]any{
			"key": "value",
		}).
		Post("/ibu/lembar-pemantauan")

	// GET /ibu/lembar-pemantauan
	resp, err = client.R().
		SetAuthToken("your_token").
		Get("/ibu/lembar-pemantauan")

	// GET /ibu/warna-tinja
	resp, err = client.R().
		SetAuthToken("your_token").
		Get("/ibu/warna-tinja")

	// POST /ibu/warna-tinja
	resp, err = client.R().
		SetAuthToken("your_token").
		SetBody(map[string]any{
			"key": "value",
		}).
		Post("/ibu/warna-tinja")

	// GET /ibu/bbl/anak/:anak_id
	resp, err = client.R().
		SetAuthToken("your_token").
		Get("/ibu/bbl/anak/:anak_id")

	// POST /ibu/bbl/anak/:anak_id
	resp, err = client.R().
		SetAuthToken("your_token").
		SetBody(map[string]any{
			"key": "value",
		}).
		Post("/ibu/bbl/anak/:anak_id")

	// GET /tenaga-kesehatan/bbl/anak/:anak_id
	resp, err = client.R().
		SetAuthToken("your_token").
		Get("/tenaga-kesehatan/bbl/anak/:anak_id")

	// POST /tenaga-kesehatan/bbl/anak/:anak_id
	resp, err = client.R().
		SetAuthToken("your_token").
		SetBody(map[string]any{
			"key": "value",
		}).
		Post("/tenaga-kesehatan/bbl/anak/:anak_id")

	// PUT /tenaga-kesehatan/bbl/anak/:anak_id/verifikasi
	resp, err = client.R().
		SetAuthToken("your_token").
		SetBody(map[string]any{
			"key": "value",
		}).
		Put("/tenaga-kesehatan/bbl/anak/:anak_id/verifikasi")

	// GET /tenaga-kesehatan/bbl
	resp, err = client.R().
		SetAuthToken("your_token").
		Get("/tenaga-kesehatan/bbl")

	// GET /ibu/pertumbuhan/anak/:anak_id
	resp, err = client.R().
		SetAuthToken("your_token").
		Get("/ibu/pertumbuhan/anak/:anak_id")

	// GET /ibu/pertumbuhan/chart/:anak_id
	resp, err = client.R().
		SetAuthToken("your_token").
		Get("/ibu/pertumbuhan/chart/:anak_id")

	// GET /ibu/pemeriksaan-gigi
	resp, err = client.R().
		SetAuthToken("your_token").
		Get("/ibu/pemeriksaan-gigi")

	// GET /ibu/pengukuran-lila
	resp, err = client.R().
		SetAuthToken("your_token").
		Get("/ibu/pengukuran-lila")

	// GET /ibu/pengukuran-lila/:anak_id
	resp, err = client.R().
		SetAuthToken("your_token").
		Get("/ibu/pengukuran-lila/:anak_id")

	// GET /ibu/kategori-capaian
	resp, err = client.R().
		SetAuthToken("your_token").
		Get("/ibu/kategori-capaian")

	// GET /ibu/kategori-capaian/rentang-usia/:rentang_usia
	resp, err = client.R().
		SetAuthToken("your_token").
		Get("/ibu/kategori-capaian/rentang-usia/:rentang_usia")

	// GET /ibu/perawatan/:id
	resp, err = client.R().
		SetAuthToken("your_token").
		Get("/ibu/perawatan/:id")

	// GET /ibu/perawatan/anak/:anak_id
	resp, err = client.R().
		SetAuthToken("your_token").
		Get("/ibu/perawatan/anak/:anak_id")

	// GET /ibu/perawatan/anak/:anak_id/rentang-usia/:rentang_usia
	resp, err = client.R().
		SetAuthToken("your_token").
		Get("/ibu/perawatan/anak/:anak_id/rentang-usia/:rentang_usia")

	// POST /ibu/perawatan
	resp, err = client.R().
		SetAuthToken("your_token").
		SetBody(map[string]any{
			"key": "value",
		}).
		Post("/ibu/perawatan")

	// PUT /ibu/perawatan/:id
	resp, err = client.R().
		SetAuthToken("your_token").
		SetBody(map[string]any{
			"key": "value",
		}).
		Put("/ibu/perawatan/:id")

	// DELETE /ibu/perawatan/:id
	resp, err = client.R().
		SetAuthToken("your_token").
		Delete("/ibu/perawatan/:id")

	// GET /ibu/jadwal-imunisasi
	resp, err = client.R().
		SetAuthToken("your_token").
		Get("/ibu/jadwal-imunisasi")

	// GET /ibu/jadwal-imunisasi/anak/:anak_id
	resp, err = client.R().
		SetAuthToken("your_token").
		Get("/ibu/jadwal-imunisasi/anak/:anak_id")

	// PUT /ibu/jadwal-imunisasi/:id/tanggal-estimasi
	resp, err = client.R().
		SetAuthToken("your_token").
		SetBody(map[string]any{
			"key": "value",
		}).
		Put("/ibu/jadwal-imunisasi/:id/tanggal-estimasi")

	// GET /ibu/jadwal-imunisasi/:id
	resp, err = client.R().
		SetAuthToken("your_token").
		Get("/ibu/jadwal-imunisasi/:id")

	// PUT /ibu/jadwal-imunisasi/:id/selesai
	resp, err = client.R().
		SetAuthToken("your_token").
		SetBody(map[string]any{
			"key": "value",
		}).
		Put("/ibu/jadwal-imunisasi/:id/selesai")

	// POST /ibu/jadwal-imunisasi/:id/request-perubahan
	resp, err = client.R().
		SetAuthToken("your_token").
		SetBody(map[string]any{
			"key": "value",
		}).
		Post("/ibu/jadwal-imunisasi/:id/request-perubahan")

	// POST /ibu/test-fcm
	resp, err = client.R().
		SetAuthToken("your_token").
		SetBody(map[string]any{
			"key": "value",
		}).
		Post("/ibu/test-fcm")

	// POST /ibu/test-reminder
	resp, err = client.R().
		SetAuthToken("your_token").
		SetBody(map[string]any{
			"key": "value",
		}).
		Post("/ibu/test-reminder")

	// GET /kader/kunjungan-imunisasi
	resp, err = client.R().
		SetAuthToken("your_token").
		Get("/kader/kunjungan-imunisasi")

	// GET /kader/kunjungan-imunisasi/:id
	resp, err = client.R().
		SetAuthToken("your_token").
		Get("/kader/kunjungan-imunisasi/:id")

	// PUT /kader/kunjungan-imunisasi/:id/status
	resp, err = client.R().
		SetAuthToken("your_token").
		SetBody(map[string]any{
			"key": "value",
		}).
		Put("/kader/kunjungan-imunisasi/:id/status")

	// PUT /kader/kunjungan-imunisasi/:id/tanggal-kunjungan
	resp, err = client.R().
		SetAuthToken("your_token").
		SetBody(map[string]any{
			"key": "value",
		}).
		Put("/kader/kunjungan-imunisasi/:id/tanggal-kunjungan")

	// GET /kader/kunjungan-imunisasi/status/:status_id
	resp, err = client.R().
		SetAuthToken("your_token").
		Get("/kader/kunjungan-imunisasi/status/:status_id")

	// GET /kader/status-kunjungan/count
	resp, err = client.R().
		SetAuthToken("your_token").
		Get("/kader/status-kunjungan/count")

	// GET /kader/absensi-kelas-ibu-balita
	resp, err = client.R().
		SetAuthToken("your_token").
		Get("/kader/absensi-kelas-ibu-balita")

	// PUT /kader/absensi-kelas-ibu-balita/:id/verifikasi
	resp, err = client.R().
		SetAuthToken("your_token").
		SetBody(map[string]any{
			"key": "value",
		}).
		Put("/kader/absensi-kelas-ibu-balita/:id/verifikasi")

	// GET /kader/absensi-kelas-ibu-hamil
	resp, err = client.R().
		SetAuthToken("your_token").
		Get("/kader/absensi-kelas-ibu-hamil")

	// PUT /kader/absensi-kelas-ibu-hamil/:id/verifikasi
	resp, err = client.R().
		SetAuthToken("your_token").
		SetBody(map[string]any{
			"key": "value",
		}).
		Put("/kader/absensi-kelas-ibu-hamil/:id/verifikasi")

	// GET /kader/pemantauan-ibu-hamil
	resp, err = client.R().
		SetAuthToken("your_token").
		Get("/kader/pemantauan-ibu-hamil")

	// PUT /kader/pemantauan-ibu-hamil/:id/verifikasi
	resp, err = client.R().
		SetAuthToken("your_token").
		SetBody(map[string]any{
			"key": "value",
		}).
		Put("/kader/pemantauan-ibu-hamil/:id/verifikasi")

	// GET /kader/checklist-pemantauan-ibu-nifas
	resp, err = client.R().
		SetAuthToken("your_token").
		Get("/kader/checklist-pemantauan-ibu-nifas")

	// PUT /kader/checklist-pemantauan-ibu-nifas/:id/verifikasi
	resp, err = client.R().
		SetAuthToken("your_token").
		SetBody(map[string]any{
			"key": "value",
		}).
		Put("/kader/checklist-pemantauan-ibu-nifas/:id/verifikasi")

	// GET /kader/log-ttd-mms/rekap
	resp, err = client.R().
		SetAuthToken("your_token").
		Get("/kader/log-ttd-mms/rekap")

	// GET /kader/log-ttd-mms/:kehamilan_id
	resp, err = client.R().
		SetAuthToken("your_token").
		Get("/kader/log-ttd-mms/:kehamilan_id")

	// GET /kader/bbl/anak/:anak_id
	resp, err = client.R().
		SetAuthToken("your_token").
		Get("/kader/bbl/anak/:anak_id")

	// PUT /kader/bbl/anak/:anak_id/verifikasi
	resp, err = client.R().
		SetAuthToken("your_token").
		SetBody(map[string]any{
			"key": "value",
		}).
		Put("/kader/bbl/anak/:anak_id/verifikasi")

	// GET /kader/bbl
	resp, err = client.R().
		SetAuthToken("your_token").
		Get("/kader/bbl")

	// GET /ibu/keluhan-anak
	resp, err = client.R().
		SetAuthToken("your_token").
		Get("/ibu/keluhan-anak")

	// GET /ibu/keluhan-anak/:id
	resp, err = client.R().
		SetAuthToken("your_token").
		Get("/ibu/keluhan-anak/:id")

	// GET /ibu/edukasi-mpasi/materi/:bulan
	resp, err = client.R().
		SetAuthToken("your_token").
		Get("/ibu/edukasi-mpasi/materi/:bulan")

	// GET /ibu/edukasi-mpasi/porsi-jadwal/:bulan
	resp, err = client.R().
		SetAuthToken("your_token").
		Get("/ibu/edukasi-mpasi/porsi-jadwal/:bulan")

	// GET /ibu/edukasi-mpasi/resep/:bulan
	resp, err = client.R().
		SetAuthToken("your_token").
		Get("/ibu/edukasi-mpasi/resep/:bulan")

	// GET /tenaga-kesehatan/edukasi-mpasi/materi
	resp, err = client.R().
		SetAuthToken("your_token").
		Get("/tenaga-kesehatan/edukasi-mpasi/materi")

	// POST /tenaga-kesehatan/edukasi-mpasi/materi
	resp, err = client.R().
		SetAuthToken("your_token").
		SetBody(map[string]any{
			"key": "value",
		}).
		Post("/tenaga-kesehatan/edukasi-mpasi/materi")

	// GET /tenaga-kesehatan/edukasi-mpasi/materi/:id
	resp, err = client.R().
		SetAuthToken("your_token").
		Get("/tenaga-kesehatan/edukasi-mpasi/materi/:id")

	// PUT /tenaga-kesehatan/edukasi-mpasi/materi/:id
	resp, err = client.R().
		SetAuthToken("your_token").
		SetBody(map[string]any{
			"key": "value",
		}).
		Put("/tenaga-kesehatan/edukasi-mpasi/materi/:id")

	// DELETE /tenaga-kesehatan/edukasi-mpasi/materi/:id
	resp, err = client.R().
		SetAuthToken("your_token").
		Delete("/tenaga-kesehatan/edukasi-mpasi/materi/:id")

	// GET /tenaga-kesehatan/edukasi-mpasi/aturan-porsi
	resp, err = client.R().
		SetAuthToken("your_token").
		Get("/tenaga-kesehatan/edukasi-mpasi/aturan-porsi")

	// POST /tenaga-kesehatan/edukasi-mpasi/aturan-porsi
	resp, err = client.R().
		SetAuthToken("your_token").
		SetBody(map[string]any{
			"key": "value",
		}).
		Post("/tenaga-kesehatan/edukasi-mpasi/aturan-porsi")

	// GET /tenaga-kesehatan/edukasi-mpasi/aturan-porsi/:id
	resp, err = client.R().
		SetAuthToken("your_token").
		Get("/tenaga-kesehatan/edukasi-mpasi/aturan-porsi/:id")

	// PUT /tenaga-kesehatan/edukasi-mpasi/aturan-porsi/:id
	resp, err = client.R().
		SetAuthToken("your_token").
		SetBody(map[string]any{
			"key": "value",
		}).
		Put("/tenaga-kesehatan/edukasi-mpasi/aturan-porsi/:id")

	// DELETE /tenaga-kesehatan/edukasi-mpasi/aturan-porsi/:id
	resp, err = client.R().
		SetAuthToken("your_token").
		Delete("/tenaga-kesehatan/edukasi-mpasi/aturan-porsi/:id")

	// GET /tenaga-kesehatan/edukasi-mpasi/jadwal
	resp, err = client.R().
		SetAuthToken("your_token").
		Get("/tenaga-kesehatan/edukasi-mpasi/jadwal")

	// POST /tenaga-kesehatan/edukasi-mpasi/jadwal
	resp, err = client.R().
		SetAuthToken("your_token").
		SetBody(map[string]any{
			"key": "value",
		}).
		Post("/tenaga-kesehatan/edukasi-mpasi/jadwal")

	// GET /tenaga-kesehatan/edukasi-mpasi/jadwal/:id
	resp, err = client.R().
		SetAuthToken("your_token").
		Get("/tenaga-kesehatan/edukasi-mpasi/jadwal/:id")

	// PUT /tenaga-kesehatan/edukasi-mpasi/jadwal/:id
	resp, err = client.R().
		SetAuthToken("your_token").
		SetBody(map[string]any{
			"key": "value",
		}).
		Put("/tenaga-kesehatan/edukasi-mpasi/jadwal/:id")

	// DELETE /tenaga-kesehatan/edukasi-mpasi/jadwal/:id
	resp, err = client.R().
		SetAuthToken("your_token").
		Delete("/tenaga-kesehatan/edukasi-mpasi/jadwal/:id")

	// GET /tenaga-kesehatan/edukasi-mpasi/resep
	resp, err = client.R().
		SetAuthToken("your_token").
		Get("/tenaga-kesehatan/edukasi-mpasi/resep")

	// POST /tenaga-kesehatan/edukasi-mpasi/resep
	resp, err = client.R().
		SetAuthToken("your_token").
		SetBody(map[string]any{
			"key": "value",
		}).
		Post("/tenaga-kesehatan/edukasi-mpasi/resep")

	// GET /tenaga-kesehatan/edukasi-mpasi/resep/:id
	resp, err = client.R().
		SetAuthToken("your_token").
		Get("/tenaga-kesehatan/edukasi-mpasi/resep/:id")

	// PUT /tenaga-kesehatan/edukasi-mpasi/resep/:id
	resp, err = client.R().
		SetAuthToken("your_token").
		SetBody(map[string]any{
			"key": "value",
		}).
		Put("/tenaga-kesehatan/edukasi-mpasi/resep/:id")

	// DELETE /tenaga-kesehatan/edukasi-mpasi/resep/:id
	resp, err = client.R().
		SetAuthToken("your_token").
		Delete("/tenaga-kesehatan/edukasi-mpasi/resep/:id")

	// GET /tenaga-kesehatan/pemeriksaan-anak
	resp, err = client.R().
		SetAuthToken("your_token").
		Get("/tenaga-kesehatan/pemeriksaan-anak")

	// POST /tenaga-kesehatan/pemeriksaan-anak
	resp, err = client.R().
		SetAuthToken("your_token").
		SetBody(map[string]any{
			"key": "value",
		}).
		Post("/tenaga-kesehatan/pemeriksaan-anak")

	// GET /tenaga-kesehatan/pemeriksaan-anak/:id
	resp, err = client.R().
		SetAuthToken("your_token").
		Get("/tenaga-kesehatan/pemeriksaan-anak/:id")

	// DELETE /tenaga-kesehatan/pemeriksaan-anak/:id
	resp, err = client.R().
		SetAuthToken("your_token").
		Delete("/tenaga-kesehatan/pemeriksaan-anak/:id")

	// GET /tenaga-kesehatan/pemeriksaan-remaja
	resp, err = client.R().
		SetAuthToken("your_token").
		Get("/tenaga-kesehatan/pemeriksaan-remaja")

	// POST /tenaga-kesehatan/pemeriksaan-remaja
	resp, err = client.R().
		SetAuthToken("your_token").
		SetBody(map[string]any{
			"key": "value",
		}).
		Post("/tenaga-kesehatan/pemeriksaan-remaja")

	// GET /tenaga-kesehatan/pemeriksaan-remaja/:id
	resp, err = client.R().
		SetAuthToken("your_token").
		Get("/tenaga-kesehatan/pemeriksaan-remaja/:id")

	// DELETE /tenaga-kesehatan/pemeriksaan-remaja/:id
	resp, err = client.R().
		SetAuthToken("your_token").
		Delete("/tenaga-kesehatan/pemeriksaan-remaja/:id")

	// GET /tenaga-kesehatan/pemeriksaan-dewasa
	resp, err = client.R().
		SetAuthToken("your_token").
		Get("/tenaga-kesehatan/pemeriksaan-dewasa")

	// POST /tenaga-kesehatan/pemeriksaan-dewasa
	resp, err = client.R().
		SetAuthToken("your_token").
		SetBody(map[string]any{
			"key": "value",
		}).
		Post("/tenaga-kesehatan/pemeriksaan-dewasa")

	// GET /tenaga-kesehatan/pemeriksaan-dewasa/:id
	resp, err = client.R().
		SetAuthToken("your_token").
		Get("/tenaga-kesehatan/pemeriksaan-dewasa/:id")

	// DELETE /tenaga-kesehatan/pemeriksaan-dewasa/:id
	resp, err = client.R().
		SetAuthToken("your_token").
		Delete("/tenaga-kesehatan/pemeriksaan-dewasa/:id")

	// GET /tenaga-kesehatan/pemeriksaan-lansia
	resp, err = client.R().
		SetAuthToken("your_token").
		Get("/tenaga-kesehatan/pemeriksaan-lansia")

	// POST /tenaga-kesehatan/pemeriksaan-lansia
	resp, err = client.R().
		SetAuthToken("your_token").
		SetBody(map[string]any{
			"key": "value",
		}).
		Post("/tenaga-kesehatan/pemeriksaan-lansia")

	// GET /tenaga-kesehatan/pemeriksaan-lansia/:id
	resp, err = client.R().
		SetAuthToken("your_token").
		Get("/tenaga-kesehatan/pemeriksaan-lansia/:id")

	// DELETE /tenaga-kesehatan/pemeriksaan-lansia/:id
	resp, err = client.R().
		SetAuthToken("your_token").
		Delete("/tenaga-kesehatan/pemeriksaan-lansia/:id")

	// GET /tenaga-kesehatan/dashboard/jumlah-usia
	resp, err = client.R().
		SetAuthToken("your_token").
		Get("/tenaga-kesehatan/dashboard/jumlah-usia")

	// GET /tenaga-kesehatan/dashboard/kesehatan-per-kelompok
	resp, err = client.R().
		SetAuthToken("your_token").
		Get("/tenaga-kesehatan/dashboard/kesehatan-per-kelompok")

	// GET /tenaga-kesehatan/dashboard/cakupan-pemeriksaan
	resp, err = client.R().
		SetAuthToken("your_token").
		Get("/tenaga-kesehatan/dashboard/cakupan-pemeriksaan")

	// GET /tenaga-kesehatan/penduduk-by-risiko
	resp, err = client.R().
		SetAuthToken("your_token").
		Get("/tenaga-kesehatan/penduduk-by-risiko")

	// GET /tenaga-kesehatan/penduduk/:id/riwayat-card
	resp, err = client.R().
		SetAuthToken("your_token").
		Get("/tenaga-kesehatan/penduduk/:id/riwayat-card")

	// GET /tenaga-kesehatan/pencatatan/:kategori
	resp, err = client.R().
		SetAuthToken("your_token").
		Get("/tenaga-kesehatan/pencatatan/:kategori")

	// POST /superadmin/form-versi
	resp, err = client.R().
		SetAuthToken("your_token").
		SetBody(map[string]any{
			"key": "value",
		}).
		Post("/superadmin/form-versi")

	// POST /superadmin/form-versi/:id/activate
	resp, err = client.R().
		SetAuthToken("your_token").
		SetBody(map[string]any{
			"key": "value",
		}).
		Post("/superadmin/form-versi/:id/activate")

	// POST /superadmin/form-versi/:id/deactivate
	resp, err = client.R().
		SetAuthToken("your_token").
		SetBody(map[string]any{
			"key": "value",
		}).
		Post("/superadmin/form-versi/:id/deactivate")

	// POST /superadmin/form-versi/:id/duplicate
	resp, err = client.R().
		SetAuthToken("your_token").
		SetBody(map[string]any{
			"key": "value",
		}).
		Post("/superadmin/form-versi/:id/duplicate")

	// GET /superadmin/form-versi
	resp, err = client.R().
		SetAuthToken("your_token").
		Get("/superadmin/form-versi")

	// GET /superadmin/form-versi/:id
	resp, err = client.R().
		SetAuthToken("your_token").
		Get("/superadmin/form-versi/:id")

	// POST /superadmin/form-versi/:versiId/questions
	resp, err = client.R().
		SetAuthToken("your_token").
		SetBody(map[string]any{
			"key": "value",
		}).
		Post("/superadmin/form-versi/:versiId/questions")

	// PUT /superadmin/questions/:id
	resp, err = client.R().
		SetAuthToken("your_token").
		SetBody(map[string]any{
			"key": "value",
		}).
		Put("/superadmin/questions/:id")

	// DELETE /superadmin/questions/:id
	resp, err = client.R().
		SetAuthToken("your_token").
		Delete("/superadmin/questions/:id")

	// POST /superadmin/form-versi/:versiId/risk-rules
	resp, err = client.R().
		SetAuthToken("your_token").
		SetBody(map[string]any{
			"key": "value",
		}).
		Post("/superadmin/form-versi/:versiId/risk-rules")

	// PUT /superadmin/risk-rules/:id
	resp, err = client.R().
		SetAuthToken("your_token").
		SetBody(map[string]any{
			"key": "value",
		}).
		Put("/superadmin/risk-rules/:id")

	// DELETE /superadmin/risk-rules/:id
	resp, err = client.R().
		SetAuthToken("your_token").
		Delete("/superadmin/risk-rules/:id")

	// GET /tenaga-kesehatan/forms/active
	resp, err = client.R().
		SetAuthToken("your_token").
		Get("/tenaga-kesehatan/forms/active")

	// POST /tenaga-kesehatan/pemeriksaan
	resp, err = client.R().
		SetAuthToken("your_token").
		SetBody(map[string]any{
			"key": "value",
		}).
		Post("/tenaga-kesehatan/pemeriksaan")

	// GET /tenaga-kesehatan/penduduk/:id/riwayat
	resp, err = client.R().
		SetAuthToken("your_token").
		Get("/tenaga-kesehatan/penduduk/:id/riwayat")

	// GET /tenaga-kesehatan/pemeriksaan/:id
	resp, err = client.R().
		SetAuthToken("your_token").
		Get("/tenaga-kesehatan/pemeriksaan/:id")

	// POST /tenaga-kesehatan/users
	resp, err = client.R().
		SetAuthToken("your_token").
		SetBody(map[string]any{
			"key": "value",
		}).
		Post("/tenaga-kesehatan/users")

	_ = resp
	_ = err
}
