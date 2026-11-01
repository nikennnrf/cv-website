# CV Online – Niken Nur Faizah

Website CV pribadi bertema pastel peach yang elegan, dibuat untuk tugas pengumpulan tautan GitHub dan website CV.

## Fitur

- **HTML**: struktur semantik (`header`, `nav`, `main`, `section`, `article`, `footer`), atribut aksesibilitas (`aria-*`, `alt`).
- **CSS**: tema pastel dengan CSS variables, Flexbox dan Grid, responsif (HP sampai desktop), mode gelap, animasi halus.
- **JavaScript**: menu hamburger, ganti tema terang/gelap (tersimpan), efek mengetik, animasi saat scroll, hitung angka statistik, menu aktif otomatis, tombol kembali ke atas, salin email, validasi form.
- **Python (Flask)**: API `POST /api/contact` yang memvalidasi dan menyimpan pesan dari form kontak.
- **Development**: Git/GitHub, deploy ke GitHub Pages.

## Struktur

```
cv-website/
├── index.html
├── css/style.css
├── js/script.js
├── img/foto.jpg
├── backend/
│   ├── app.py
│   └── requirements.txt
└── README.md
```

## Menjalankan di komputer

Frontend: buka `index.html` di browser, atau jalankan `python -m http.server 8000` lalu buka `http://localhost:8000`.

Backend (opsional, untuk form kontak):

```bash
cd backend
pip install -r requirements.txt
python app.py
```

Saat dites lokal, isi `API_URL` di `js/script.js` dengan `http://127.0.0.1:5000/api/contact`.

## Form kontak: 3 cara pengiriman

Di `js/script.js` ada tiga pengaturan, dipakai berurutan:

1. `FORMSPREE_URL`: paling mudah untuk GitHub Pages. Daftar gratis di formspree.io, buat form dengan email tujuan, lalu tempel URL-nya (contoh `https://formspree.io/f/xxxxxxx`).
2. `API_URL`: alamat backend Flask milik sendiri.
3. Jika keduanya kosong, form membuka aplikasi email (`mailto:`) dengan pesan yang sudah terisi.

## Deploy ke GitHub Pages

1. Buat repositori baru di GitHub, misalnya `cv-website`.
2. Dari folder proyek:
   ```bash
   git init
   git add .
   git commit -m "feat: website CV online"
   git branch -M main
   git remote add origin https://github.com/nikennnrf/cv-website.git
   git push -u origin main
   ```
3. Di GitHub: **Settings → Pages → Source: Deploy from a branch → `main` / `(root)`** lalu Save.
4. Website aktif di `https://nikennnrf.github.io/cv-website/`.

Catatan: GitHub Pages hanya menyajikan file statis. Jika backend Flask tidak di-deploy, form kontak otomatis beralih membuka aplikasi email (`mailto:`). Untuk mengaktifkan backend, deploy folder `backend/` ke layanan seperti Render atau PythonAnywhere, lalu isi `API_URL` di `js/script.js`.

## Pengumpulan tugas

- Link GitHub: `https://github.com/nikennnrf/cv-website`
- Link website: `https://nikennnrf.github.io/cv-website/`
