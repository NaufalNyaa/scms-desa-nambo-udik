# SCMS Desa Nambo Udik - Sistem Pengaduan Masyarakat

Aplikasi web modern untuk mengelola pengaduan masyarakat di Desa Nambo Udik, Kec. Cikande Modern, Kab. Serang. Dibangun dengan React, TypeScript, Tailwind CSS, dan Supabase.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/React-18.3.1-blue.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.5.3-blue.svg)
![Supabase](https://img.shields.io/badge/Supabase-Latest-green.svg)

## 🌟 Fitur Utama

### Untuk Warga
- ✅ Registrasi dan login dengan verifikasi NIK
- 📝 Buat laporan pengaduan dengan foto bukti
- 📊 Pantau status laporan real-time
- 💬 Diskusi dengan admin melalui komentar
- 👤 Kelola profil pribadi
- 🌓 Mode gelap/terang

### Untuk Admin
- 📋 Dashboard lengkap dengan statistik
- ✏️ Kelola dan ubah status laporan
- 📈 Lihat statistik dan analisis data
- 👥 Kelola data warga
- 💬 Berikan tanggapan kepada pelapor

## 🛠️ Teknologi

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS
- **Backend**: Supabase (PostgreSQL + Auth + Storage)
- **Build Tool**: Vite
- **Icons**: Lucide React

## 📋 Prasyarat

Sebelum memulai, pastikan Anda sudah menginstal:
- [Node.js](https://nodejs.org/) (versi 18 atau lebih tinggi)
- [npm](https://www.npmjs.com/) atau [yarn](https://yarnpkg.com/)
- Akun [Supabase](https://supabase.com/) (gratis)

## 🚀 Instalasi

### 1. Clone Repository

```bash
git clone https://github.com/NaufalNyaa/scms-desa-nambo-udik.git
cd scms-desa-nambo-udik
```

### 2. Install Dependencies

```bash
npm install
# atau
yarn install
```

### 3. Setup Supabase

#### a. Buat Project Supabase
1. Buka [Supabase Dashboard](https://app.supabase.com/)
2. Klik "New Project"
3. Isi nama project, database password, dan pilih region terdekat
4. Tunggu hingga project selesai dibuat

#### b. Jalankan SQL Schema
1. Di Supabase Dashboard, buka **SQL Editor**
2. Klik **New Query**
3. Copy semua isi file `supabase/create_complaint_system_schema.sql`
4. Paste dan **Run** query tersebut
5. Pastikan semua table dan policies berhasil dibuat

#### c. Setup Storage Bucket
1. Di Supabase Dashboard, buka **Storage**
2. Klik **Create Bucket**
3. Nama bucket: `images`
4. Set sebagai **Public Bucket**
5. Klik **Create Bucket**

#### d. Setup Storage Policy
Di SQL Editor, jalankan query berikut:

```sql
-- Policy untuk upload images
CREATE POLICY "Authenticated users can upload images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'images');

-- Policy untuk view images
CREATE POLICY "Anyone can view images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'images');

-- Policy untuk delete images
CREATE POLICY "Users can delete their own images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'images' AND auth.uid()::text = (storage.foldername(name))[1]);
```

### 4. Konfigurasi Environment Variables

Buat file `.env` di root project dan isi dengan kredensial Supabase Anda:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

**Cara mendapatkan kredensial:**
1. Di Supabase Dashboard, buka **Settings** → **API**
2. Copy `Project URL` untuk `VITE_SUPABASE_URL`
3. Copy `anon public` key untuk `VITE_SUPABASE_ANON_KEY`

### 5. Jalankan Aplikasi

#### Development Mode
```bash
npm run dev
# atau
yarn dev
```

Aplikasi akan berjalan di `http://localhost:5173`

#### Production Build
```bash
npm run build
# atau
yarn build
```

File build akan tersedia di folder `dist/`

## 👤 Akun Default

### Admin (Opsional)
Untuk membuat akun admin, uncomment bagian INSERT admin di file SQL schema dan jalankan:

```sql
-- Email: admin@desanamboudik.id
-- Password: Admin123!
-- ⚠️ GANTI PASSWORD SETELAH LOGIN PERTAMA!
```

### User Biasa
Daftar melalui halaman registrasi dengan data:
- Nama lengkap
- NIK (16 digit)
- Alamat
- Email
- Password

## 📁 Struktur Project

```
scms-desa-nambo-udik/
├── src/
│   ├── components/          # Komponen UI reusable
│   │   ├── ConfirmDialog.tsx
│   │   ├── Navbar.tsx
│   │   ├── StatusBadge.tsx
│   │   └── PriorityBadge.tsx
│   ├── contexts/            # React Context (Auth, Theme)
│   │   ├── AuthContext.tsx
│   │   └── ThemeContext.tsx
│   ├── lib/                 # Konfigurasi dan Types
│   │   ├── supabase.ts
│   │   └── types.ts
│   ├── pages/               # Halaman aplikasi
│   │   ├── LandingPage.tsx
│   │   ├── LoginPage.tsx
│   │   ├── RegisterPage.tsx
│   │   ├── UserDashboard.tsx
│   │   ├── AdminDashboard.tsx
│   │   └── ...
│   ├── App.tsx              # Main App Component
│   ├── main.tsx             # Entry Point
│   └── index.css            # Global Styles
├── supabase/
│   └── create_complaint_system_schema.sql
├── .env                     # Environment Variables (buat sendiri)
├── package.json
├── tailwind.config.js
├── vite.config.ts
└── README.md
```

## 🎨 Fitur Dark Mode

Aplikasi mendukung mode gelap yang dapat diaktifkan melalui toggle di navbar. Preferensi tema akan tersimpan di localStorage browser.

## 🔒 Keamanan

- ✅ Row Level Security (RLS) di Supabase
- ✅ Autentikasi JWT
- ✅ Validasi input di frontend dan backend
- ✅ NIK dan alamat tidak dapat diubah setelah registrasi
- ✅ Upload file dengan validasi ukuran dan tipe

## 📱 Responsive Design

Aplikasi fully responsive dan dapat diakses dengan baik di:
- 💻 Desktop (1920px+)
- 💻 Laptop (1280px - 1920px)
- 📱 Tablet (768px - 1280px)
- 📱 Mobile (320px - 768px)

## 🐛 Troubleshooting

### Error: "Missing Supabase environment variables"
**Solusi**: Pastikan file `.env` sudah dibuat dan berisi kredensial yang benar.

### Error: "User creation failed"
**Solusi**: 
1. Pastikan SQL schema sudah dijalankan dengan benar
2. Cek trigger `on_auth_user_created` sudah aktif
3. Pastikan RLS policies sudah dibuat

### Error: "Failed to upload image"
**Solusi**: 
1. Pastikan bucket `images` sudah dibuat dan public
2. Cek storage policies sudah dijalankan
3. Pastikan ukuran file tidak melebihi 5MB

### Error: "Cannot read properties of null"
**Solusi**: Refresh browser atau clear localStorage dan login kembali.

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Developer

Dikembangkan dengan ❤️ untuk Desa Nambo Udik

---

**Link Repository**: [https://github.com/NaufalNyaa/smcs-desa-nambo-udik.git]

Untuk pertanyaan dan bantuan, silakan buat issue di repository GitHub.

