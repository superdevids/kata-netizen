Selamat pagi teman teman 👋

saya mau membagikan project open source yang saya buat untuk belajar Next.js dan arsitektur zero-database.

Kata Netizen adalah platform **Analisis Opini Publik Indonesia**. Yang bikin beda, project ini **tidak pakai database** — semua konten dari file Markdown. Awalnya pake MySQL + Prisma, tapi ribet urus database, akhirnya saya migrasi total ke Markdown. Hasilnya lebih simpel dan cepat.

**stack:**

Next.js 16, React 19, TypeScript, Tailwind CSS 4, shadcn/ui, Recharts, gray-matter, Resend

**fitur:**

- Artikel analisis sentimen dengan 13 jenis chart (MiniBarChart, DonutChart, GaugeScore, dll — semua SVG murni)
- Zero database — semua dari file `.md`, data runtime di JSON
- Static Site Generation — halaman di pre-build
- Category filtering & search artikel
- Infinite scroll
- Dark mode
- Newsletter & visitor log (JSON file)
- Responsive mobile-first

**arsitektur:**

```
content/artikel/*.md
  ↓ frontmatter (YAML) → data chart & metadata
  ↓ body (Markdown) → 13 bagian artikel
  ↓
Next.js SSG → pre-build HTML
  ↓
Browser → render + chart interaktif
```

**yang saya pelajari:**

- Next.js App Router, Server Components vs Client Components
- Static Site Generation
- YAML frontmatter untuk structured data
- Bikin chart SVG manual tanpa library eksternal
- Gantiin database pake JSON file
- Zero-database architecture

**rencana kedepan:** RSS Feed, full-text search, sitemap, export PDF, admin UI, multi-language

masih banyak kurangnya, tapi semoga bisa jadi referensi buat temen yang belajar Next.js, React, atau arsitektur web tanpa database 😁

feedback, issue, code review, contribution sangat dipersilahkan 🙌

github:
https://github.com/superdevids/kata-netizen

---

## Cara Kontribusi

**1. Tambah artikel:** Buat `.md` di `content/artikel/`, ikut format frontmatter + 13 bagian `<!--bagian-->`, `npm run build`, kirim PR.

**2. Report bug / saran:** Buka [Issues](https://github.com/superdevids/kata-netizen/issues)

**3. Pull Request:** Fork → `git checkout -b feat/nama-fitur` → coding → `npm run build` gak error → PR ke `main`

**4. Setup:**

```bash
git clone https://github.com/superdevids/kata-netizen.git
cd kata-netizen
npm install
npm run dev     # development
npm run build   # production
```

Project ini gak butuh database. Cuma Node.js + npm. Clone, install, jalan. 🚀
