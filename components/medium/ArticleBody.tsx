import Image from "next/image";
import { DB_DATA } from "@/data/article";
import { DonutChart, EchoChamberPanel, EmosiChart, EskalasiTimeline, IndeksTimeSeries, KomentarVerbatim, MiniBarChart, MomentumShiftPanel, StanceBar, SummaryMingguan } from "./Chart";

export function ArticleBody({ detailIsu }) {
	return (
		<div
			id="article-body"
			className="prose prose-stone max-w-none
        prose-headings:font-bold prose-headings:text-stone-900
        prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-4
        prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3
        prose-p:text-[1.125rem] prose-p:leading-[1.9] prose-p:text-stone-700 prose-p:my-6
        prose-a:text-stone-900 prose-a:underline prose-a:decoration-stone-400
        hover:prose-a:decoration-stone-800
        prose-strong:text-stone-900 prose-strong:font-semibold
        prose-blockquote:border-l-4 prose-blockquote:border-stone-800
        prose-blockquote:pl-6 prose-blockquote:not-italic
        prose-blockquote:text-stone-600 prose-blockquote:text-xl prose-blockquote:leading-relaxed
        prose-ul:space-y-2 prose-ol:space-y-2
        prose-li:text-[1.125rem] prose-li:leading-relaxed prose-li:text-stone-700
        prose-hr:border-stone-200 prose-hr:my-12
        prose-img:rounded-xl"
		>
			<p className="text-[1.2rem]! leading-[1.85]! first-letter:float-left first-letter:text-[4.5rem] first-letter:font-bold first-letter:leading-[0.85] first-letter:mr-2 first-letter:mt-1 first-letter:text-stone-900 text-justify">{detailIsu.konten.split("|||")[0]}</p>
			<figure className="my-10 -mx-4 sm:-mx-8 lg:-mx-16">
				<div className="relative w-full aspect-16/7 overflow-hidden rounded-none sm:rounded-xl bg-stone-100">
					<Image
						src={detailIsu.thumbnail}
						alt={detailIsu.judul}
						fill
						loading="eager"
						className="object-cover"
						priority
					/>
				</div>
			</figure>

			<h2>Bagaimana Publik Merespons?</h2>
			<p>{detailIsu.konten.split("|||")[1]}</p>

			{DB_DATA.ringkasan.length > 0 && (
				<div className="not-prose my-8 grid grid-cols-2 sm:grid-cols-4 gap-3">
					{DB_DATA.ringkasan.map(({ label, value, sub }) => (
						<div
							key={label}
							className="bg-stone-50 border border-stone-200 rounded-xl px-4 py-4"
						>
							<p className="text-2xl font-bold text-stone-900 leading-none mb-1">{value}</p>
							<p className="text-xs font-semibold text-stone-700 leading-snug mb-0.5">{label}</p>
							<p className="text-xs text-stone-400">{sub}</p>
						</div>
					))}
				</div>
			)}

			<p>{detailIsu.konten.split("|||")[2]}</p>

			{DB_DATA.tren_harian.length > 0 && (
				<div className="not-prose my-8">
					<p className="text-xs font-semibold uppercase tracking-widest text-stone-400 mb-3 font-sans">Volume komentar harian — 13–19 Januari 2025</p>
					<div className="bg-stone-50 border border-stone-200 rounded-xl px-4 pt-4 pb-2">
						<MiniBarChart data={DB_DATA.tren_harian} />
						<div className="flex gap-4 mt-1 pb-1 justify-center">
							{[
								{ warna: "#34D399", label: "Positif" },
								{ warna: "#F87171", label: "Negatif" },
								{ warna: "#E2E8F0", label: "Netral" },
							].map(({ warna, label }) => (
								<span
									key={label}
									className="flex items-center gap-1.5 text-xs text-stone-500 font-sans"
								>
									<span
										className="w-2.5 h-2.5 rounded-sm inline-block"
										style={{ background: warna }}
									/>
									{label}
								</span>
							))}
						</div>
					</div>
				</div>
			)}

			<h2>{DB_DATA.narasi.length - 1} Narasi Utama yang Mendominasi</h2>
			<p>Dari analisis kluster komentar, kami mengidentifikasi {DB_DATA.narasi.length - 1} narasi dominan yang membentuk percakapan publik. Masing-masing membawa perspektif berbeda — bukan sekadar pro atau kontra, melainkan cerminan kebutuhan dan kekhawatiran yang lebih dalam.</p>

			<div className="not-prose my-8 grid sm:grid-cols-2 gap-4 items-start">
				{DB_DATA.narasi.length > 0 && (
					<div className="bg-stone-50 border border-stone-200 rounded-xl p-5">
						<p className="text-xs font-semibold uppercase tracking-widest text-stone-400 mb-4 font-sans">Distribusi narasi</p>
						<div className="flex items-center gap-6">
							<DonutChart
								data={DB_DATA.narasi}
								totalKomentar={DB_DATA.ringkasan.filter((r) => r.label === "Total komentar")[0]?.value || 0}
							/>
							<div className="space-y-2.5 self-start">
								{DB_DATA.narasi.map((n) => (
									<div
										key={n.label}
										className="flex items-center gap-2"
									>
										<span
											className="w-2.5 h-2.5 rounded-full shrink-0"
											style={{ background: n.warna }}
										/>
										<span className="text-xs text-stone-600 font-sans leading-tight">
											<span className="font-semibold text-stone-800">{n.pct}%</span> {n.label}
										</span>
									</div>
								))}
							</div>
						</div>
					</div>
				)}
				{DB_DATA.narasi_detail.length > 0 && (
					<div className="space-y-3">
						{DB_DATA.narasi_detail.map((n) => (
							<div
								key={n.no}
								className={`border rounded-xl px-4 py-3.5 ${n.warna}`}
							>
								<div className="flex items-start gap-3">
									<span className={`text-xs font-black font-mono ${n.teks} opacity-50 mt-0.5`}>{n.no}</span>
									<div>
										<p className={`text-sm font-semibold ${n.teks} mb-1 font-sans`}>{n.judul}</p>
										<p className="text-xs text-stone-600 leading-relaxed font-sans">{n.isi}</p>
									</div>
								</div>
							</div>
						))}
					</div>
				)}
			</div>

			{/* <blockquote>&quot;Alhamdulillah, semoga kebijakan ini beneran terealisasi ya.&quot; — komentar paling banyak disukai di platform YouTube, mencerminkan harapan yang mendominasi lapisan pertama diskusi publik.</blockquote> */}

			{DB_DATA.narasi_komentar.length > 0 && <KomentarVerbatim data={DB_DATA.narasi_komentar} />}

			{DB_DATA.platforms.length > 0 && (
				<>
					<h2>Perbedaan Reaksi Antar Platform</h2>
					{/* <p>Satu temuan menarik: karakter percakapan berbeda nyata bergantung platformnya. Twitter menjadi ruang paling kritis — toxic rate-nya hampir tiga kali lipat YouTube. Sementara TikTok dan YouTube cenderung mendapat komentar yang lebih emosional dan personal.</p> */}
					<div className="not-prose my-8 overflow-x-auto">
						<table className="w-full text-sm font-sans border-collapse">
							<thead>
								<tr className="border-b-2 border-stone-200">
									<th className="text-left py-3 pr-4 font-semibold text-stone-700">Platform</th>
									<th className="text-right py-3 pr-4 font-semibold text-stone-700">Positif</th>
									<th className="text-right py-3 pr-4 font-semibold text-stone-700">Netral</th>
									<th className="text-right py-3 pr-4 font-semibold text-stone-700">Negatif</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-stone-100">
								{DB_DATA.platforms.map((p) => (
									<tr
										key={p.nama}
										className="hover:bg-stone-50 transition-colors"
									>
										<td className="py-3 pr-4 font-semibold text-stone-800">{p.nama}</td>
										<td className="py-3 pr-4 text-right text-green-700 font-medium">{p.positif}%</td>
										<td className="py-3 pr-4 text-right text-stone-500">{p.netral}%</td>
										<td className="py-3 pr-4 text-right text-red-600 font-medium">{p.negatif}%</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>

					<p>
						Pola ini konsisten dengan karakteristik masing-masing platform. Pengguna Twitter cenderung lebih kritis dan analitis, sementara audiens TikTok dan YouTube lebih banyak mengekspresikan reaksi emosional langsung. Tidak ada indikasi <em>echo chamber</em> yang signifikan — variance sentimen di semua platform masih berada di kisaran moderat.
					</p>
				</>
			)}

			{DB_DATA.emosi_platform.length > 0 && (
				<>
					<h2>Lebih dari Sekadar Positif dan Negatif</h2>
					<p>
						Sentimen positif/negatif hanya permukaan. Data emosi dari model memberikan gambar yang lebih kaya: <strong>senang</strong> dan <strong>harap</strong>
						mendominasi TikTok dan YouTube, sementara Twitter menjadi satu-satunya platform di mana <strong>marah</strong> masuk tiga besar. Ini konsisten dengan karakter masing-masing platform.
					</p>
					<EmosiChart data={DB_DATA.emosi_platform} />
				</>
			)}

			{DB_DATA.stance_platform.length > 0 && (
				<>
					<h2>Stance: Mendukung vs Menolak Kebijakan</h2>
					<p>
						Sentimen mengukur <em>perasaan</em>, stance mengukur <em>posisi</em>. Seseorang bisa merasa netral secara emosi tapi tetap menolak kebijakan karena alasan fiskal. Data stance dari tiga platform menunjukkan pola yang berbeda dari sentimen: Twitter adalah satu-satunya platform di mana penolak lebih banyak dari pendukung.
					</p>
					<StanceBar data={DB_DATA.stance_platform} />
				</>
			)}

			{DB_DATA.eskalasi.length > 0 && (
				<>
					<h2>Kapan Percakapan Memanas?</h2>
					<p>
						Sistem memantau lonjakan komentar negatif setiap hari. Eskalasi terdeteksi ketika delta komentar negatif melampaui ambang batas. Dua hari kritis teridentifikasi: <strong>15 dan 16 Januari</strong> — bersamaan dengan beredarnya isu penundaan implementasi sebelum akhirnya diklarifikasi.
					</p>
					<EskalasiTimeline data={DB_DATA.eskalasi} />
				</>
			)}

			{DB_DATA.momentum_shifts.length > 0 && (
				<>
					<h2>Dua Titik Balik Percakapan</h2>
					<p>Momentum shift mencatat momen di mana arah sentimen berubah secara signifikan. Bukan sekadar naik-turun volume, melainkan pergeseran dominansi narasi. Dua shift terdeteksi dalam periode pantauan ini.</p>
					<MomentumShiftPanel data={DB_DATA.momentum_shifts} />
				</>
			)}

			{DB_DATA.echo_chamber.length > 0 && (
				<>
					<h2>Apakah Ada Echo Chamber?</h2>
					<p>Echo chamber terdeteksi ketika variance opini di suatu platform sangat rendah — artinya pengguna hampir seragam membagikan satu narasi tanpa paparan pada sudut pandang lain. TikTok menunjukkan pola ini, sementara Twitter justru paling beragam meski juga paling toksik.</p>
					<EchoChamberPanel data={DB_DATA.echo_chamber} />
				</>
			)}

			{(DB_DATA.keywords.positif.length > 0 || DB_DATA.keywords.negatif.length > 0 || DB_DATA.keywords.netral.length > 0) && (
				<>
					<h2>Kata Kunci dan Tokoh yang Paling Banyak Disebut</h2>
					<p>
						Analisis TF-IDF terhadap seluruh komentar mengungkap kata-kata yang paling membedakan masing-masing kelompok sentimen. Di sisi positif, kata <strong>alhamdulillah</strong> dan <strong>sejahtera</strong> mendominasi — menunjukkan penerimaan berbasis rasa syukur. Di sisi negatif, <strong>defisit</strong> dan <strong>beban</strong> mendominasi — framing fiskal, bukan emosi.
					</p>
					<div className="not-prose my-8 space-y-4">
						{[
							{ label: "Kata kunci positif", words: DB_DATA.keywords.positif, bg: "bg-green-100 text-green-800" },
							{ label: "Kata kunci negatif", words: DB_DATA.keywords.negatif, bg: "bg-red-100 text-red-800" },
							{ label: "Kata kunci netral", words: DB_DATA.keywords.netral, bg: "bg-stone-100 text-stone-700" },
						].map(({ label, words, bg }) => (
							<div key={label}>
								<p className="text-xs font-semibold text-stone-400 uppercase tracking-widest mb-2 font-sans">{label}</p>
								<div className="flex flex-wrap gap-2">
									{words.map((w) => (
										<span
											key={w}
											className={`px-3 py-1 rounded-full text-sm font-medium font-sans capitalize ${bg}`}
										>
											{w}
										</span>
									))}
								</div>
							</div>
						))}
					</div>
				</>
			)}

			{DB_DATA.entitas.length > 0 && (
				<>
					<p>
						Dari sisi entitas, <strong>Sri Mulyani</strong> dan <strong>APBN 2025</strong> menjadi yang paling sering disebut — menandakan percakapan publik sudah bergerak ke aspek implementasi fiskal, bukan sekadar reaksi emosional atas pengumuman.
					</p>
					<div className="not-prose my-6 overflow-x-auto">
						<table className="w-full text-sm font-sans border-collapse">
							<thead>
								<tr className="border-b-2 border-stone-200">
									<th className="text-left py-2.5 pr-6 font-semibold text-stone-700">Entitas</th>
									<th className="text-left py-2.5 pr-6 font-semibold text-stone-700">Tipe</th>
									<th className="text-right py-2.5 font-semibold text-stone-700">Sebutan</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-stone-100">
								{DB_DATA.entitas.map((e) => (
									<tr
										key={e.nama}
										className="hover:bg-stone-50 transition-colors"
									>
										<td className="py-2.5 pr-6 font-medium text-stone-800">{e.nama}</td>
										<td className="py-2.5 pr-6">
											<span className="px-2 py-0.5 bg-stone-100 text-stone-600 rounded text-xs font-mono">{e.tipe}</span>
										</td>
										<td className="py-2.5 text-right text-stone-600 font-medium">{e.jumlah}×</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</>
			)}

			{DB_DATA.indeks_timeseries.length > 0 && (
				<>
					<h2>Indeks Kepercayaan Publik</h2>
					<p>Untuk mengukur tingkat kepercayaan publik terhadap kebijakan ini secara holistik, sistem kami menggabungkan skor sentimen, stance (dukungan vs. penolakan), dan tingkat eskalasi ke dalam satu indeks komposit.</p>
					<div className="not-prose my-8 bg-stone-50 border border-stone-200 rounded-xl p-5">
						<IndeksTimeSeries data={DB_DATA.indeks_timeseries} />
					</div>
					<p>
						Skor <strong>55.7</strong> menempatkan kebijakan ini dalam kategori <strong>kepercayaan sedang</strong>. Artinya, publik belum sepenuhnya yakin — mereka menerima niat baik kebijakan, tapi masih menunggu bukti implementasi nyata. Ini berbeda dari penolakan aktif, dan memberikan ruang bagi pemerintah untuk membangun kepercayaan lebih lanjut melalui komunikasi kebijakan yang transparan.
					</p>
				</>
			)}

			{detailIsu.konten.split("|||")[3] && (
				<div className="not-prose my-8 bg-stone-50 border border-stone-200 rounded-xl px-6 py-5">
					<p className="text-xs font-semibold uppercase tracking-widest text-stone-500 mb-2 font-sans">Catatan Analitik</p>
					<p className="text-[1.05rem] leading-relaxed text-stone-700 font-sans">{detailIsu.konten.split("|||")[3]}</p>
				</div>
			)}

			<hr />
			{DB_DATA.summary.length > 0 && <SummaryMingguan data={DB_DATA.summary} />}

			{detailIsu.konten.split("|||")[4] && (
				<>
					<h2>Apa yang Bisa Dibaca dari Data Ini?</h2>
					<div
						dangerouslySetInnerHTML={{
							__html: detailIsu.konten.split("|||")[4],
						}}
					/>
				</>
			)}
		</div>
	);
}
