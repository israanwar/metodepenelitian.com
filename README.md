# MetodePenelitian.com

Platform metodologi penelitian, tools statistik, AI research assistant, dan repositori akademik untuk mahasiswa, dosen, dan peneliti Indonesia.

Dibangun dengan **Next.js 14 (App Router) + TypeScript + Tailwind CSS** dan **Supabase** (Postgres, Auth, Storage). Antarmuka **dwibahasa (Bahasa Indonesia / English)**.

## Fitur yang sudah ada (MVP fase 1)

- **Landing page** dengan ikhtisar modul dan persona pengguna.
- **i18n ID/EN** via routing `/id` dan `/en` + language switcher.
- **Knowledge Base** — daftar artikel, pencarian client-side, filter kategori, halaman detail dengan breadcrumb, artikel terkait, dan feedback.
- **Research Tools** (berjalan tanpa backend):
  - Kalkulator Ukuran Sampel (Cochran)
  - Kalkulator Slovin
  - Kalkulator Cronbach's Alpha
  - Generator Sitasi (APA / MLA / Chicago)
- **Skema Supabase** lengkap (`supabase/schema.sql`) + seed (`supabase/seed.sql`).
- Halaman **"Coming Soon"** untuk modul yang akan menyusul (Academy, AI Research, Repository, Community, Pricing, dll).

## Menjalankan secara lokal

```bash
# 1. Install dependency
npm install

# 2. Siapkan environment variables
cp .env.example .env.local
#    lalu isi kredensial Supabase Anda

# 3. Jalankan dev server
npm run dev
```

Buka http://localhost:3000 — otomatis diarahkan ke `/id`.

## Setup Supabase

1. Buat project baru di [supabase.com](https://supabase.com).
2. Di **SQL Editor**, jalankan isi `supabase/schema.sql` lalu `supabase/seed.sql`.
3. Salin **Project URL** dan **anon key** (Project Settings → API) ke `.env.local`.

## Struktur proyek

```
src/
  app/[lang]/            # Routing per-bahasa (App Router)
    page.tsx             # Landing page
    knowledge-base/      # Daftar + detail artikel
    tools/               # Research Tools + kalkulator
    ...                  # Stub "coming soon" untuk modul lain
  components/            # Header, Footer, kalkulator, dll.
  data/articles.ts       # Konten artikel contoh (bilingual)
  i18n/                  # Konfigurasi & kamus ID/EN
  lib/
    calculators.ts       # Logika kalkulator (pure functions)
    supabase/            # Client browser & server
  middleware.ts          # Redirect locale
supabase/                # schema.sql + seed.sql
docs/                    # Dokumen referensi (BRD, PRD, FRD, dll.)
```

## Roadmap (fase berikutnya)

Merujuk pada dokumen di `docs/` (Master Plan, PRD, FRD):

- Autentikasi & Member Dashboard (Supabase Auth)
- Modul AI Research (integrasi API model AI)
- Academy (kursus, learning path, sertifikat)
- Repository dengan Supabase Storage
- Community (forum, webinar)
- Admin CMS & Super Admin
- Marketplace

## Lisensi

Proprietary — © MetodePenelitian.com
