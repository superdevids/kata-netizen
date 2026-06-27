# Contributing to Kata Netizen

selamat siang teman-teman 👋

izin share project open source yang saya buat untuk belajar dan eksplorasi integrasi analisis sentimen publik dengan website modern menggunakan Next.js dan Markdown-based content management.

project ini adalah platform **Analisis Opini Publik Indonesia** bernama **Kata Netizen** yang mengumpulkan, memproses, dan menyajikan sentimen masyarakat dari berbagai platform media sosial — tanpa database, semua konten dikelola melalui file Markdown.

fitur yang saat ini sudah ada:

- **Artikel Analisis Sentimen** — setiap artikel berisi analisis lengkap dengan visualisasi data interaktif
- **Zero Database Architecture** — semua artikel dari file `.md`, data transien di JSON file, tidak perlu MySQL/PostgreSQL
- **Static Site Generation** — halaman di-pre-build untuk performa maksimal
- **13 Chart Components** — MiniBarChart, DonutChart, GaugeScore, StanceBar, EskalasiTimeline, dan lainnya
- **Responsive Design** — mobile-first dengan dark mode
- **Category Filtering** — filter artikel berdasarkan kategori (Ekonomi, Sosial, dll)
- **Search Articles** — pencarian realtime dari navbar
- **Infinite Scroll** — load lebih banyak artikel otomatis
- **Table of Contents** — navigasi section artikel
- **Trending Sidebar** — artikel terbaru di sidebar
- **Newsletter Subscription** — langganan email dengan penyimpanan JSON
- **Visitor Analytics** — log kunjungan per-hari ke JSON file (auto-trim)
- **Dark Mode** — support light/dark theme

untuk stack & architecture yang digunakan:

- **Next.js 16** — React framework (App Router)
- **React 19** — UI Library
- **TypeScript** — type safety
- **Tailwind CSS 4** — utility-first CSS
- **shadcn/ui** — komponen UI (Radix UI)
- **Recharts** — grafik & chart interaktif
- **Resend** — email newsletter
- **gray-matter** — parsing YAML frontmatter dari Markdown
- **react-markdown** — rendering Markdown

secara arsitektur project ini menggunakan kombinasi:

- **Markdown-Driven Content** — semua artikel dari file `.md` dengan YAML frontmatter
- **Server Components** — React Server Components untuk performa
- **Static Site Generation** — halaman di-pre-build via `generateStaticParams`
- **File-based Storage** — JSON file untuk data runtime (newsletter, visitor log)
- **REST API** — endpoint untuk infinite scroll, newsletter, visitor log
- **Client Components** — interaktivitas di sisi klien (infinite scroll, search, theme toggle)

flow aplikasinya kurang lebih:

```
User → Browser
  ↓
Next.js (Server Components)
  ↓
content/artikel/*.md  ─→  Frontmatter (YAML)  ─→  ArticleBody + Charts
  ↓                         Body (Markdown)     ─→  13 bagian artikel
Static Site Generation
  ↓
HTML + CSS + JS terkirim ke browser
  ↓
Client Components: infinite scroll, search, newsletter, visitor log, dark mode
```

```
Struktur file artikel:

content/artikel/
├── analisis-pergerakan-rupiah.md   →  /analisis-pergerakan-rupiah
├── kenaikan-bbm-dan-dampak-sosial.md  →  /kenaikan-bbm-dan-dampak-sosial
└── judul-baru.md                    →  /judul-baru
```

Setiap file `.md` memiliki **YAML frontmatter** untuk metadata + data analysis, dan **body** dengan 13 bagian yang dipisah `<!--bagian-->`.

salah satu tujuan project ini adalah belajar bagaimana membuat website analisis yang dinamis dan interaktif tanpa ketergantungan database — semua dikelola melalui file Markdown yang sederhana, mudah diedit, dan mudah di-version control.

dari project ini saya banyak belajar tentang:

- **Next.js App Router** — Server Components, SSR, SSG
- **Static Site Generation** — generateStaticParams untuk halaman dinamis
- **Markdown as Data Source** — YAML frontmatter untuk structured data
- **Chart Visualization** — SVG-based chart components tanpa library eksternal
- **File-based Storage** — JSON file untuk data runtime
- **React Server Components vs Client Components** — kapan harus pake yang mana
- **Infinite Scroll** — IntersectionObserver + offset-based pagination
- **Dark Mode** — theme provider dengan Tailwind CSS
- **Progressive Web App** — performa optimal dengan pre-rendering

masih banyak kekurangan dan fitur yang ingin saya tambahkan kedepannya seperti:

- **RSS Feed** — untuk syndication konten
- **Search Engine** — full-text search dengan Fuse.js atau Lunr
- **Related Articles Algorithm** — rekomendasi artikel berdasarkan tag/kategori
- **Reading Time Estimator** — perkiraan waktu baca yang lebih akurat
- **Share to Social Media** — Open Graph meta tags yang lebih lengkap
- **Sitemap Generator** — XML sitemap untuk SEO
- **Image Optimization** — optimasi gambar artikel
- **Multi-language Support** — dukungan multi bahasa
- **Admin Dashboard** — UI untuk manage artikel tanpa edit file langsung
- **Analytics Dashboard** — visualisasi visitor log
- **Export to PDF** — export artikel ke PDF

feedback, issue, code review, ataupun contribution sangat dipersilahkan 🙌

**github:**
https://github.com/superdevids/kata-netizen

---

## Cara Berkontribusi

### 1. Tambah Artikel Baru

Cara termudah berkontribusi adalah dengan menambahkan artikel analisis sentimen:

1. Buat file `.md` baru di `content/artikel/`
2. Ikuti format frontmatter + 13 bagian `<!--bagian-->`
3. Jalankan `npm run build` untuk verifikasi
4. Buat Pull Request

Lihat [README.md](README.md) untuk dokumentasi lengkap format file.

### 2. Fix Bug atau Tambah Fitur

1. Fork repository
2. Buat branch baru: `git checkout -b feat/nama-fitur`
3. Lakukan perubahan
4. Pastikan `npm run build` sukses
5. Buat Pull Request ke branch `main`

### 3. Report Issue

Buka [Issues](https://github.com/superdevids/kata-netizen/issues) untuk:
- Laporan bug
- Saran fitur
- Pertanyaan

---

## Development Setup

```bash
# Clone repo
git clone https://github.com/superdevids/kata-netizen.git
cd kata-netizen

# Install dependencies
npm install

# Development server (port 3000)
npm run dev

# Production build
npm run build

# Start production server
npm start

# Lint
npm run lint
```

**Catatan:** Project ini tidak membutuhkan database. Semua konten dari file `.md`. Cukup `npm install && npm run dev`.
