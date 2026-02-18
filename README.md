# QR Guard FE (v1.0.0)

Selamat datang di QR Guard FE, sebuah aplikasi frontend yang sedang dalam tahap pengembangan awal (v1) yang bertujuan untuk memindai dan menganalisis kode QR.

## Pengenalan

Projek ini dibangun sebagai solusi untuk mempermudah pengguna dalam memindai kode QR dan mendapatkan informasi atau analisis terkait isi kode QR tersebut. Fokus utama pada versi awal ini adalah pada fungsionalitas inti pemindaian dan penyajian hasil analisis.

## Fitur Saat Ini (v1)

*   **Pemindaian Kode QR:** Memungkinkan pengguna untuk memindai kode QR menggunakan kamera perangkat.
*   **Analisis Hasil:** Menampilkan hasil dari pemindaian kode QR, termasuk detil informasi yang terkandung di dalamnya.

## Cara Kerja Analisis URL

Fungsi analisis URL bekerja dengan cara melakukan beberapa pemeriksaan terhadap URL yang didapat dari hasil pemindaian kode QR. Prosesnya adalah sebagai berikut:

1.  **Mengakses URL:**
    *   Sistem akan mencoba mengakses dan membaca konten dari URL tersebut menggunakan HTTP GET request.
    *   Ada batas waktu (15 detik) dan pembatasan jumlah pengalihan (redirect) untuk mencegah loop tak terbatas atau kelambatan.
    *   Header `User-Agent` diatur agar permintaan terlihat seperti dari peramban web biasa.

2.  **Analisis Respons Awal:**
    *   **Jika Server Tidak Merespon:** Jika server tidak merespon atau ada kesalahan jaringan, URL akan ditandai sebagai "suspicious" dengan skor risiko 40, karena bisa jadi link sudah mati atau memblokir bot.
    *   **Deteksi Pengalihan (Redirect):** Jika URL asli berbeda dengan URL akhir setelah pengalihan, ini dianggap sebagai potensi risiko (skor +20).

3.  **Analisis Konten:**
    *   **Deteksi Unduhan Otomatis:** Sistem memeriksa `Content-Type` dan `Content-Disposition` untuk mendeteksi jika URL mencoba mengunduh file secara otomatis (misalnya, `.apk`, `.exe`, `.zip`). Jika terdeteksi, ini akan memberikan skor risiko tinggi (skor +60). Ditambah lagi jika ekstensi file tersebut memang termasuk yang berbahaya (skor +40).
    *   **Script Pengalihan Paksa:** Memeriksa keberadaan script JavaScript yang memaksa pengalihan halaman (misalnya, `window.location` atau `location.replace` dalam tag `<script>`). Ini menambah skor risiko (skor +15).
    *   **Kode Mencurigakan:** Mencari pola kode JavaScript yang ter-enkripsi atau ter-obfuscated (`eval(`, `unescape(`), yang bisa jadi menyembunyikan malware (skor +30).
    *   **Formulir Tidak Aman:**
        *   Jika halaman berisi formulir (`<form>`) dan diakses melalui koneksi HTTP (bukan HTTPS), ini dianggap tidak aman untuk input data (skor +40).
        *   Jika formulir tersebut berisi kolom kata sandi (`type="password"`), ini juga menambah skor risiko (skor +20).

4.  **Penentuan Status Akhir:**
    *   Berdasarkan total akumulasi skor risiko:
        *   **"malicious"**: Jika skor mencapai 70 atau lebih.
        *   **"suspicious"**: Jika skor antara 25 hingga 69.
        *   **"safe"**: Jika skor di bawah 25.

Hasil analisis ini kemudian dikembalikan dalam bentuk objek `AnalysisResponse` yang berisi status, URL asli, URL akhir, temuan (findings), dan skor risiko. Fungsi ini adalah bagian dari logika backend atau library yang akan dipanggil oleh aplikasi frontend (QR Guard FE) Anda untuk menganalisis URL yang ditemukan pada kode QR.

## Teknologi yang Digunakan

*   Next.js
*   React
*   TypeScript

## Pengembangan

Projek ini masih dalam tahap pengembangan awal. Kami menerima masukan dan kontribusi untuk pengembangan lebih lanjut.

---
_Versi: 1.0.0_