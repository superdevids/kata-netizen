import type { ArticleAnalysisData } from "@/lib/query";
import { DonutChart, EchoChamberPanel, EskalasiTimeline, IndeksTimeSeries, KomentarVerbatim, MiniBarChart, MomentumShiftPanel, StanceBar, SummaryMingguan } from "./Chart";

interface ArticleBodyProps {
	detailIsu: { judul: string; konten: string; thumbnail: string };
	analysis: ArticleAnalysisData;
}

export function ArticleBody({ detailIsu, analysis }: ArticleBodyProps) {
	const { ringkasan, tren_harian, narasi, narasi_detail, narasi_komentar, keywords, entitas, platforms, stance_platform, eskalasi, momentum_shifts, echo_chamber, indeks_timeseries, summary } = analysis;
	const parts = detailIsu.konten.split("|||");

	// Sanitize HTML content by removing script tags and event handlers to prevent syntax errors
	const sanitizeHtml = (html: string) => {
		return html
			.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '') // Remove <script>...</script>
			.replace(/<script[^>]*\/>/gi, '') // Remove self-closing <script/>
			.replace(/\son\w+\s*=\s*["'][^"]*["']/gi, '') // Remove event handlers: onclick="..."
			.replace(/\son\w+\s*=\s*[^\s>]+/gi, '') // Remove event handlers: onclick=func()
			.replace(/javascript:/gi, ''); // Remove javascript: URLs
	};

	return (
		<div
			id="article-body"
			className="prose prose-stone dark:prose-invert max-w-none
        prose-headings:font-bold prose-headings:text-text-heading
        prose-h2:text-xl sm:prose-h2:text-2xl prose-h2:mt-8 sm:prose-h2:mt-12 prose-h2:mb-3 sm:prose-h2:mb-4
        prose-h3:text-lg sm:prose-h3:text-xl prose-h3:mt-6 sm:prose-h3:mt-8 prose-h3:mb-3
        prose-p:text-[1rem] sm:prose-p:text-[1.125rem] prose-p:leading-[1.7] sm:prose-p:leading-[1.9] prose-p:text-text-body prose-p:my-3 sm:prose-p:my-6
        prose-a:text-blue-700 dark:prose-a:text-blue-400 prose-a:underline prose-a:decoration-blue-200 dark:prose-a:decoration-blue-800
        hover:prose-a:decoration-blue-500 dark:hover:prose-a:decoration-blue-400
        prose-strong:text-text-heading prose-strong:font-semibold
        prose-blockquote:border-l-4 prose-blockquote:border-blue-600 dark:prose-blockquote:border-blue-400
        prose-blockquote:pl-4 sm:prose-blockquote:pl-6 prose-blockquote:not-italic
        prose-blockquote:text-text-muted prose-blockquote:text-lg sm:prose-blockquote:text-xl prose-blockquote:leading-relaxed
        prose-ul:space-y-2 prose-ol:space-y-2
        prose-li:text-[1rem] sm:prose-li:text-[1.125rem] prose-li:leading-relaxed prose-li:text-text-body
        prose-hr:border-border-subtle prose-hr:my-8 sm:prose-hr:my-12
        prose-img:rounded-xl"
		>
			<p className="text-[1rem]! sm:text-[1.125rem]! leading-[1.65]! sm:leading-[1.85]! first-letter:float-left first-letter:text-[3rem] sm:first-letter:text-[4.5rem] first-letter:font-bold first-letter:leading-[0.85] first-letter:mr-1.5 sm:first-letter:mr-2 first-letter:mt-1 first-letter:text-text-heading" dangerouslySetInnerHTML={{ __html: sanitizeHtml(parts[0]) }} />

			<h2>Bagaimana Publik Merespons?</h2>
			<p>Bagian ini menggambarkan <strong>respon masyarakat secara keseluruhan terhadap isu yang dibahas</strong> — mulai dari volume percakapan, sentimen yang muncul, hingga narasi-narasi utama yang berkembang di berbagai platform media sosial.</p>

			{ringkasan.length > 0 && (
				<div className="not-prose my-8 grid grid-cols-2 sm:grid-cols-4 gap-3">
					{ringkasan.map(({ label, value, sub }) => (
						<div key={label} className="bg-surface border border-border-subtle rounded-xl px-4 py-4">
							<p className="text-2xl font-bold text-text-heading leading-none mb-1">{value}</p>
							<p className="text-xs font-semibold text-text-body leading-snug mb-0.5">{label}</p>
							<p className="text-xs text-text-muted">{sub}</p>
						</div>
					))}
				</div>
			)}

			{parts[1] && <p dangerouslySetInnerHTML={{ __html: sanitizeHtml(parts[1]) }} />}

			{tren_harian.length > 0 && (
				<div className="not-prose my-8">
					<p className="text-xs font-semibold uppercase tracking-widest text-text-faint mb-3 font-sans">Volume komentar harian</p>
					<div className="bg-surface border border-border-subtle rounded-xl px-5 pt-5 pb-4">
						<MiniBarChart data={tren_harian} />
						<div className="flex gap-5 mt-3 pt-3 border-t border-border-subtle justify-center">
							{[
								{ warna: "#34D399", label: "Positif" },
								{ warna: "#F87171", label: "Negatif" },
								{ warna: "#E2E8F0", label: "Netral" },
							].map(({ warna, label }) => (
								<span key={label} className="flex items-center gap-1.5 text-xs text-text-muted font-sans">
									<span className="w-2.5 h-2.5 rounded-sm inline-block" style={{ background: warna }} />
									{label}
								</span>
							))}
						</div>
					</div>
				</div>
			)}

			{narasi.length > 0 && (
				<>
					<h2>{narasi.length} Narasi Utama yang Mendominasi</h2>
					<p>Dari analisis kluster komentar, kami mengidentifikasi {narasi.length} narasi dominan yang membentuk percakapan publik. Masing-masing membawa perspektif berbeda — bukan sekadar pro atau kontra, melainkan cerminan kebutuhan dan kekhawatiran yang lebih dalam.</p>

					<div className="not-prose my-8 grid sm:grid-cols-2 gap-4 items-start">
						<div className="bg-surface border border-border-subtle rounded-xl p-5">
							<p className="text-xs font-semibold uppercase tracking-widest text-text-faint mb-4 font-sans">Distribusi narasi</p>
							<div className="flex flex-col items-center gap-6">
								<DonutChart
									data={narasi}
									totalKomentar={ringkasan.find((r) => r.label === "Total komentar")?.value || "0"}
								/>
								<div className="space-y-2.5 self-start">
									{narasi.map((n) => (
										<div key={n.label} className="flex items-center gap-2">
											<span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: n.warna }} />
											<span className="text-xs text-text-muted font-sans leading-tight">
												<span className="font-semibold text-text-heading">{n.pct}%</span> {n.label}
											</span>
										</div>
									))}
								</div>
							</div>
						</div>
						{narasi_detail.length > 0 && (
							<div className="space-y-3">
								{narasi_detail.map((n) => (
									<div key={n.no} className={`border rounded-xl px-4 py-3.5 ${n.warna}`}>
										<div className="flex items-start gap-3">
											<span className={`text-xs font-black font-mono ${n.teks} opacity-50 mt-0.5`}>{n.no}</span>
											<div>
												<p className={`text-sm font-semibold ${n.teks} mb-1 font-sans`}>{n.judul}</p>
												<p className="text-xs text-text-muted leading-relaxed font-sans">{n.isi}</p>
											</div>
										</div>
									</div>
								))}
							</div>
						)}
					</div>
				</>
			)}

			{narasi_komentar.length > 0 && <KomentarVerbatim data={narasi_komentar} />}

			{parts[2] && <p dangerouslySetInnerHTML={{ __html: sanitizeHtml(parts[2]) }} />}

			{platforms.length > 0 && (
				<>
					<h2>Perbedaan Reaksi Antar Platform</h2>
					<p>Setiap platform media sosial memiliki karakteristik pengguna yang berbeda. Bagian ini <strong>membandingkan bagaimana sentimen publik terdistribusi di tiap platform</strong> — apakah ada platform yang lebih <strong>positif, lebih kritis, atau justru lebih netral</strong> — sehingga kita bisa memahami konteks percakapan secara lebih utuh.</p>
					<div className="not-prose my-8 overflow-x-auto">
						<table className="w-full text-sm font-sans border-collapse">
							<thead>
								<tr className="border-b-2 border-border-subtle">
									<th className="text-left py-3 pr-4 font-semibold text-text-body">Platform</th>
									<th className="text-right py-3 pr-4 font-semibold text-text-body">Positif</th>
									<th className="text-right py-3 pr-4 font-semibold text-text-body">Netral</th>
									<th className="text-right py-3 pr-4 font-semibold text-text-body">Negatif</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-border-subtle">
								{platforms.map((p) => (
									<tr key={p.nama} className="hover:bg-surface-hover transition-colors">
										<td className="py-3 pr-4 font-semibold text-text-heading">{p.nama}</td>
										<td className="py-3 pr-4 text-right text-green-700 font-medium">{p.positif}%</td>
										<td className="py-3 pr-4 text-right text-stone-500 dark:text-text-muted">{p.netral}%</td>
										<td className="py-3 pr-4 text-right text-red-600 font-medium">{p.negatif}%</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
					{parts[3] && <p dangerouslySetInnerHTML={{ __html: sanitizeHtml(parts[3]) }} />}
				</>
			)}


			{stance_platform.length > 0 && (
				<>
					<h2>Stance: Mendukung vs Menolak Kebijakan</h2>
					<p>Sentimen mengukur perasaan — positif, negatif, atau netral. Namun perasaan saja belum tentu mencerminkan sikap terhadap kebijakan. Seseorang bisa bersikap netral secara emosi, tetapi tetap menolak kebijakan karena pertimbangan ekonomi atau prinsip. Bagian ini <strong>mengukur posisi masyarakat</strong>: mendukung, menolak, atau tidak memihak.</p>
					<StanceBar data={stance_platform} />
					{parts[4] && <p dangerouslySetInnerHTML={{ __html: sanitizeHtml(parts[4]) }} />}
				</>
			)}

			{eskalasi.length > 0 && (
				<>
					<h2>Kapan Percakapan Memanas?</h2>
					<p>Sistem memantau lonjakan komentar negatif setiap hari. Eskalasi terdeteksi ketika delta komentar negatif melampaui ambang batas.</p>
					<EskalasiTimeline data={eskalasi} />
					{parts[5] && <p dangerouslySetInnerHTML={{ __html: sanitizeHtml(parts[5]) }} />}
				</>
			)}

			{momentum_shifts.length > 0 && (
				<>
					<h2>Titik Balik Percakapan</h2>
					<p>Momentum shift mencatat momen di mana arah sentimen berubah secara signifikan. Bukan sekadar naik-turun volume, melainkan pergeseran dominansi narasi.</p>
					<MomentumShiftPanel data={momentum_shifts} />
					{parts[6] && <p dangerouslySetInnerHTML={{ __html: sanitizeHtml(parts[6]) }} />}
				</>
			)}

			{echo_chamber.length > 0 && (
				<>
					<h2>Apakah Ada Echo Chamber?</h2>
					<p>Echo chamber terjadi ketika pengguna di suatu platform hanya terpapar satu sudut pandang — sehingga pendapat yang berbeda nyaris tidak terdengar. Bagian ini <strong>memeriksa seberapa beragam opini yang beredar di tiap platform</strong>. Jika variansinya sangat rendah, artinya hampir semua orang di platform tersebut menyuarakan hal yang sama, yang bisa menjadi tanda bahwa diskusi tidak lagi terbuka.</p>
					<EchoChamberPanel data={echo_chamber} />
					{parts[7] && <p dangerouslySetInnerHTML={{ __html: sanitizeHtml(parts[7]) }} />}
				</>
			)}

			{(keywords.positif.length > 0 || keywords.negatif.length > 0 || keywords.netral.length > 0) && (
				<>
					<h2>Kata Kunci dan Tokoh yang Paling Banyak Disebut</h2>
					<p>Dari ribuan komentar yang terkumpul, sistem kami <strong>mengidentifikasi kata-kata dan istilah yang paling sering muncul di setiap kelompok sentimen</strong>. Ini membantu kita memahami apa yang sebenarnya menjadi perhatian utama masyarakat — baik yang merasa puas, kecewa, maupun yang bersikap netral.</p>
					<div className="not-prose my-8">
						<div className="bg-surface border border-border-subtle rounded-xl overflow-hidden">
							{[
								{ label: "Positif", words: keywords.positif, bg: "bg-green-100 text-green-800 dark:bg-green-950/50 dark:text-green-300", accent: "bg-green-500", icon: "●" },
								{ label: "Negatif", words: keywords.negatif, bg: "bg-red-100 text-red-800 dark:bg-red-950/50 dark:text-red-300", accent: "bg-red-500", icon: "●" },
								{ label: "Netral", words: keywords.netral, bg: "bg-stone-100 text-stone-700 dark:bg-stone-800 dark:text-stone-300", accent: "bg-stone-400", icon: "●" },
							].filter((g) => g.words.length > 0).map((g, idx, arr) => (
								<div key={g.label} className={`px-5 py-4 ${idx < arr.length - 1 ? "border-b border-border-subtle" : ""}`}>
									<div className="flex items-center gap-2 mb-3">
										<span className={`w-2 h-2 rounded-full ${g.accent}`} />
										<p className="text-xs font-bold uppercase tracking-widest text-text-faint font-sans">{g.label}</p>
										<span className="text-xs text-text-faint font-sans">({g.words.length} kata)</span>
									</div>
									<div className="flex flex-wrap gap-2">
										{g.words.map((w) => (
											<span key={w} className={`px-3 py-1.5 rounded-lg text-sm font-medium font-sans capitalize ${g.bg} transition-transform hover:scale-105 cursor-default`}>
												{w}
											</span>
										))}
									</div>
								</div>
							))}
						</div>
					</div>
					{parts[8] && <p dangerouslySetInnerHTML={{ __html: sanitizeHtml(parts[8]) }} />}
				</>
			)}

			{entitas.length > 0 && (
				<>
					<h2>Tokoh dan Lembaga yang Paling Sering Disebut</h2>
					<p>Ketika publik membicarakan suatu isu, ada <strong>nama-nama — baik tokoh maupun lembaga — yang menjadi pusat perhatian</strong>. Semakin sering disebut, semakin sentral peran mereka dalam percakapan.</p>
					<div className="not-prose my-8">
						<div className="bg-surface border border-border-subtle rounded-xl overflow-hidden">
							{entitas.map((e, i) => (
								<div
									key={e.nama}
									className={`flex items-center justify-between px-5 py-3.5 transition-colors hover:bg-surface-hover ${i < entitas.length - 1 ? "border-b border-border-subtle" : ""}`}
								>
									<div className="flex items-center gap-3">
										<span className="text-xs font-mono text-text-faint w-5 shrink-0 text-right">{i + 1}</span>
										<div className="flex gap-2">
											<p className="text-sm font-semibold text-text-heading font-sans">{e.nama}</p>
											<span className={`inline-block mt-0.5 px-1.5 py-0.5 rounded text-[10px] font-mono font-medium ${e.tipe === "PERSON" ? "bg-blue-100 text-blue-700" : e.tipe === "ORGANIZATION" ? "bg-purple-100 text-purple-700" : "bg-stone-100 text-stone-600"
												}`}>
												{e.tipe === "PERSON" ? "Tokoh" : e.tipe === "ORG" ? "Lembaga" : e.tipe}
											</span>
										</div>
									</div>
									<div className="flex items-center gap-2">
										<div className="hidden sm:block w-24 h-1.5 bg-stone-200 rounded-full overflow-hidden">
											<div
												className="h-full bg-stone-400 rounded-full"
												style={{ width: `${Math.min(100, (e.jumlah / entitas[0].jumlah) * 100)}%` }}
											/>
										</div>
										<span className="text-sm font-mono font-semibold text-text-muted min-w-[3ch] text-right">{e.jumlah}<span className="text-text-faint text-xs">×</span></span>
									</div>
								</div>
							))}
						</div>
					</div>
					{parts[9] && <p dangerouslySetInnerHTML={{ __html: sanitizeHtml(parts[9]) }} />}
				</>
			)}

			{indeks_timeseries.length > 0 && (
				<>
					<h2>Indeks Kepercayaan Publik</h2>
					<p>Untuk mendapatkan gambaran yang lebih utuh, kami menggabungkan tiga aspek utama — sentimen masyarakat, sikap terhadap kebijakan, dan tingkat ketegangan percakapan — menjadi satu skor komposit. Skor ini mencerminkan <strong>sejauh mana publik mempercayai kebijakan yang sedang berjalan</strong>. Semakin tinggi angkanya, semakin besar kepercayaan masyarakat.</p>
					<div className="not-prose my-8 bg-surface border border-border-subtle rounded-xl p-5">
						<IndeksTimeSeries data={indeks_timeseries} />
					</div>
					{parts[10] && <p dangerouslySetInnerHTML={{ __html: sanitizeHtml(parts[10]) }} />}
				</>
			)}

			{parts[11] && (
				<>
					<h2>Catatan Analitik</h2>
					<p dangerouslySetInnerHTML={{ __html: sanitizeHtml(parts[11]) }} />
				</>
			)}

			<hr />
			{summary.length > 0 && <SummaryMingguan data={summary} />}

			{parts[12] && (
				<>
					<h2>Apa yang Bisa Dibaca dari Data Ini?</h2>
					<p dangerouslySetInnerHTML={{ __html: sanitizeHtml(parts[12]) }} />
				</>
			)}
		</div>
	);
}
