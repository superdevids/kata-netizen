Selamat pagi teman teman 👋

saya mau membagikan project open source yang saya buat untuk belajar dan eksplorasi Next.js serta arsitektur zero-database untuk website analisis sentimen publik.

Kata Netizen adalah platform **Analisis Opini Publik Indonesia** yang mengumpulkan dan menyajikan data sentimen masyarakat dari berbagai platform media sosial. Yang bikin beda, project ini **tidak menggunakan database** — semua konten dikelola melalui file Markdown biasa.

awalnya project ini pake MySQL + Prisma, tapi karena ribet urus database dan hosting, saya putuskan untuk migrasi total ke Markdown files. hasilnya ternyata lebih simpel, lebih cepat, dan lebih mudah di-maintain.

fitur yang saat ini sudah ada:

- **Artikel Analisis Sentimen** — lengkap dengan 13 jenis chart/visualisasi data
- **Zero Database Architecture** — semua artikel dari file `.md`, data runtime di JSON file
- **Static Site Generation** — halaman di-pre-build, loading super cepat
- **13 Chart Components** — MiniBarChart, DonutChart, GaugeScore, StanceBar, EskalasiTimeline, EchoChamberPanel, dan lainnya (semua SVG murni, tanpa library chart eksternal)
- **Category Filtering** — filter artikel berdasarkan kategori (Ekonomi, Sosial, dll)
- **Search Articles** — pencarian dari navbar
- **Infinite Scroll** — load artikel otomatis pas scroll
- **Dark Mode** — light/dark theme toggle
- **Newsletter Subscription** — langganan email via JSON file
- **Visitor Analytics** — log kunjungan per-hari ke JSON file
- **Responsive Design** — mobile-first, desktop, tablet

untuk stack & architecture yang digunakan:

- **Next.js 16** — React Framework (App Router)
- **React 19** — UI Library
- **TypeScript** — biar gak error error amat
- **Tailwind CSS 4** — styling cepet
- **shadcn/ui** — komponen UI siap pakai
- **Recharts** — grafik chart
- **gray-matter** — parsing YAML frontmatter dari Markdown
- **Resend** — kirim email newsletter

secara arsitektur project ini pake:

- **Markdown-Driven Content** — semua artikel dari file `.md` dengan YAML frontmatter untuk structured data
- **React Server Components** — rendering di server, gak perlu JavaScript di klien
- **Static Site Generation** — generateStaticParams buat pre-build halaman
- **File-based Storage** — JSON file untuk data runtime (gak perlu MySQL/PostgreSQL)

flow aplikasinya kurang lebih:

```
File .md di content/artikel/
  ↓
Frontmatter (YAML) → metadata + data chart
Body (Markdown) → 13 bagian artikel (dipisah <!--bagian-->)
  ↓
Next.js SSG → pre-build halaman HTML
  ↓
Browser → render artikel + chart interaktif
  ↓
Client Components: infinite scroll, search, dark mode, visitor log
```

project ini awalnya saya buat untuk belajar:

- **Next.js App Router** — Server Components vs Client Components
- **Static Site Generation** — generateStaticParams, incremental static regeneration
- **Markdown as Data Source** — YAML frontmatter untuk structured data
- **Chart Visualization** — bikin chart SVG manual tanpa library
- **File-based Storage** — gantiin database pake JSON file
- **Zero Database Architecture** — gimana caranya website jalan tanpa MySQL
- **React Server Components** — kapan pake server, kapan pake client component

masih banyak kekurangan dan beberapa bagian masih terus saya rapihkan 😅
tapi semoga source code nya bisa jadi referensi atau bahan belajar buat teman teman yang sedang belajar Next.js, React, TypeScript, atau arsitektur web modern tanpa database

rencana kedepan:

- **RSS Feed** — biar konten bisa diikuti via RSS reader
- **Full-text Search** — pake Fuse.js biar search lebih akurat
- **Sitemap Generator** — SEO biar makin gacor
- **Related Articles** — rekomendasi artikel berdasarkan konten
- **Export PDF** — export artikel ke PDF
- **Admin UI** — biar bisa manage artikel tanpa buka file langsung
- **Multi-language** — dukungan bahasa inggris

feedback, issue, code review, ataupun contribution sangat dipersilahkan 🙌

github:
https://github.com/superdevids/kata-netizen

---

## Cara Berkontribusi

### 1. Tambah Artikel

Cara paling gampang berkontribusi adalah nambah artikel:

```bash
# 1. Buat file .md di content/artikel/
# 2. Isi frontmatter + body (13 bagian pake <!--bagian-->)
# 3. Build & test
npm run build
# 4. Kirim Pull Request
```

Format lengkapnya ada di [README.md](README.md).

### 2. Report Bug / Saran Fitur

Buka [Issues](https://github.com/superdevids/kata-netizen/issues) buat:
- Lapor bug
- Saran fitur
- Pertanyaan atau diskusi

### 3. Pull Request

1. Fork repo dulu
2. `git checkout -b feat/nama-fitur`
3. Coding sesuai kebutuhan
4. Pastikan `npm run build` gak error
5. Pull Request ke `main`

### 4. Development Setup

```bash
# Clone
git clone https://github.com/superdevids/kata-netizen.git
cd kata-netizen

# Install
npm install

# Dev server (hot reload)
npm run dev

# Build production
npm run build

# Lint
npm run lint
```

**Catatan:** Project ini gak butuh database sama sekali. Cuma butuh Node.js dan npm. Tinggal clone, npm install, npm run dev, jalan. 🚀
