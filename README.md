# TokoKita - Aplikasi Toko Berbasis Microservices

Proyek tugas Tim 1: katalog, pelanggan, order, pembayaran simulasi, API Gateway, dashboard toko/admin, seed data, Docker Compose, dan tes end-to-end.

## Menjalankan aplikasi

Prasyarat: Docker Desktop dengan Docker Compose.

```bash
docker compose up --build
```

Buka http://localhost:8080. Layanan berjalan di jaringan Compose; dashboard mengakses backend lewat API Gateway.

### Akun seed

- Admin: `admin@tokokita.local` / `Admin123!`
- Pelanggan: `demo@tokokita.local` / `Demo123!`

Ganti `JWT_SECRET` di `docker-compose.yml` sebelum penggunaan di luar demo kelas. Data proyek ini disimpan di memori dan kembali ke seed awal saat container di-restart.

## Endpoint utama

Semua endpoint aplikasi melewati gateway `http://localhost:8080`.

| Kegunaan | Endpoint |
|---|---|
| Daftar produk | `GET /api/catalog/products` |
| Kategori | `GET /api/catalog/categories` |
| Registrasi / login | `POST /api/customers/register`, `POST /api/customers/login` |
| Verifikasi token | `POST /api/customers/verify` |
| Profil | `GET /api/customers/profile` |
| Keranjang | `GET /api/orders/cart`, `PUT /api/orders/cart` |
| Checkout | `POST /api/orders/checkout` |
| Riwayat pesanan | `GET /api/orders` |
| Simulasi pembayaran | Dipanggil internal oleh Order Service saat checkout |
| Laporan pembayaran (admin) | `GET /api/payments/report` (JWT admin) |

Checkout mereservasi stok lebih dulu. Jika inisiasi pembayaran gagal, Order Service memanggil release stok dan menandai pesanan batal. Pembayaran dapat disimulasikan sukses/gagal dengan `outcome` `success` atau `failure`.

## Struktur proyek

- `katalog-service/` - produk, kategori, stok, reserve/release.
- `pelanggan-service/` - registrasi, login JWT, profil, alamat, verifikasi token.
- `order-service/` - keranjang, checkout dengan kompensasi, riwayat/status pesanan.
- `pembayaran-service/` - inisiasi/simulasi pembayaran dan laporan.
- `gateway/` - API Gateway dan dashboard toko/admin.
- `tests/` - skenario end-to-end berbasis Node.js.
- `docker-compose.yml` - menjalankan seluruh layanan.

## Menjalankan tes end-to-end

Pastikan semua container aktif, lalu jalankan:

```bash
node --test tests/e2e.test.js
```

Tes menggunakan URL gateway `http://localhost:8080` (ubah dengan `BASE_URL` bila diperlukan). Untuk alur checkout, akun demo di atas dapat digunakan.

## Catatan implementasi

Aplikasi ini adalah prototipe akademik. Penyimpanan masih in-memory; pembayaran merupakan simulasi dan tidak menghubungkan penyedia pembayaran nyata. Untuk penggunaan produksi, tambahkan database per layanan, secret management, validasi/rate limiting lebih ketat, logging terpusat, dan callback pembayaran terautentikasi.
