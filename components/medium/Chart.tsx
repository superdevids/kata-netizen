export function MiniBarChart({ data }) {
	const maxVal = Math.max(...data.map((d) => d.total));
	const w = 480,
		h = 140,
		padL = 32,
		padB = 28,
		barW = 44,
		gap = 8;
	const chartW = data.length * (barW + gap) - gap;
	const offsetX = (w - padL - chartW) / 2 + padL;
	return (
		<svg
			viewBox={`0 0 ${w} ${h}`}
			className="w-full"
			style={{ fontFamily: "inherit" }}
		>
			{data.map((d, i) => {
				const x = offsetX + i * (barW + gap);
				const maxH = h - padB - 16;
				const hPos = Math.round((d.positif / maxVal) * maxH);
				const hNeg = Math.round((d.negatif / maxVal) * maxH);
				const hNet = Math.round((d.netral / maxVal) * maxH);
				const base = h - padB;
				return (
					<g key={d.tanggal}>
						{/* Netral */}
						<rect
							x={x}
							y={base - hNet}
							width={barW}
							height={hNet}
							fill="#E2E8F0"
							rx="2"
						/>
						{/* Negatif */}
						<rect
							x={x}
							y={base - hNet - hNeg}
							width={barW}
							height={hNeg}
							fill="#F87171"
							rx="2"
						/>
						{/* Positif */}
						<rect
							x={x}
							y={base - hNet - hNeg - hPos}
							width={barW}
							height={hPos}
							fill="#34D399"
							rx="2"
						/>
						<text
							x={x + barW / 2}
							y={h - 8}
							textAnchor="middle"
							fill="#78716c"
							fontSize="10"
						>
							{d.tanggal.split(" ")[0]}
						</text>
					</g>
				);
			})}
		</svg>
	);
}

export function DonutChart({ data, totalKomentar }) {
	const r = 75;
	const cx = 96;
	const cy = 96;
	const stroke = 40;
	const circ = 2 * Math.PI * r;
	const total = data.reduce((a, d) => a + d.pct, 0);
	let offset = 0;
	return (
		<svg
			viewBox="0 0 192 192"
			className="w-full max-w-48"
		>
			{data.map((d) => {
				const dash = (d.pct / total) * circ;
				const gap = circ - dash;
				const el = (
					<circle
						key={d.label}
						cx={cx}
						cy={cy}
						r={r}
						fill="none"
						stroke={d.warna}
						strokeWidth={stroke}
						strokeDasharray={`${dash} ${gap}`}
						strokeDashoffset={-offset}
						style={{ transform: "rotate(-90deg)", transformOrigin: `${cx}px ${cy}px` }}
					/>
				);
				offset += dash;
				return el;
			})}
			<text
				x={cx}
				y={cy + 4}
				textAnchor="middle"
				fontSize="32"
				fontWeight="700"
				fill="#1c1917"
			>
				{totalKomentar}
			</text>
			<text
				x={cx}
				y={cy + 16}
				textAnchor="middle"
				fontSize="12"
				fill="#78716c"
			>
				Komentar
			</text>
		</svg>
	);
}

export function GaugeScore({ skor, kategori }) {
	const pct = skor / 100;
	const r = 42;
	const cx = 60;
	const cy = 60;
	const circ = Math.PI * r;
	const dash = pct * circ;
	const color = skor >= 70 ? "#4ade80" : skor >= 40 ? "#fbbf24" : "#f87171";
	return (
		<svg
			viewBox="0 0 120 76"
			className="w-full max-w-30"
		>
			{/* Track */}
			<path
				d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
				fill="none"
				stroke="#e7e5e4"
				strokeWidth="10"
				strokeLinecap="round"
			/>
			{/* Value */}
			<path
				d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
				fill="none"
				stroke={color}
				strokeWidth="10"
				strokeLinecap="round"
				strokeDasharray={`${dash} ${circ}`}
			/>
			<text
				x={cx}
				y={cy - 6}
				textAnchor="middle"
				fontSize="20"
				fontWeight="800"
				fill="#1c1917"
			>
				{skor}
			</text>
			<text
				x={cx}
				y={cy + 10}
				textAnchor="middle"
				fontSize="9"
				fill="#78716c"
			>
				{kategori}
			</text>
		</svg>
	);
}

export function EmosiChart({ data }) {
	const platforms = ["TikTok", "YouTube", "Twitter"];
	const colors = { TikTok: "#222222", YouTube: "#FF5151", Twitter: "#6366f1" };
	const maxVal = 35;
	return (
		<div className="not-prose my-8">
			<p className="text-xs font-semibold uppercase tracking-widest text-stone-400 mb-3 font-sans">Distribusi emosi per-platform (% komentar)</p>
			<div className="bg-stone-50 border border-stone-200 rounded-xl p-5">
				{/* Legend */}
				<div className="flex gap-4 mb-4">
					{platforms.map((p) => (
						<span
							key={p}
							className="flex items-center gap-1.5 text-xs text-stone-600 font-sans"
						>
							<span
								className="w-2.5 h-2.5 rounded-sm"
								style={{ background: colors[p] }}
							/>
							{p}
						</span>
					))}
				</div>
				{/* Bars */}
				<div className="space-y-4">
					{data.map((row) => (
						<div
							key={row.emosi}
							className="flex items-center gap-3"
						>
							<span className="text-xs text-stone-600 font-sans w-16 shrink-0 text-right">{row.emosi}</span>
							<div className="flex-1 space-y-0.5">
								{platforms.map((p) => {
									const pct = Math.round((row[p] / maxVal) * 100);
									return (
										<div
											key={p}
											className="h-3 rounded-full"
											style={{ width: `${pct}%`, background: colors[p], opacity: 0.85 }}
										/>
									);
								})}
							</div>
							<span className="text-xs text-stone-400 font-mono w-8 text-right shrink-0">{row.TikTok}%</span>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}

export function StanceBar({ data }) {
	return (
		<div className="not-prose my-8 space-y-3">
			<p className="text-xs font-semibold uppercase tracking-widest text-stone-400 mb-3 font-sans">Stance publik per-platform — mendukung vs menolak kebijakan</p>
			{data.map((row) => (
				<div key={row.platform}>
					<div className="flex justify-between text-xs text-stone-500 font-sans mb-1">
						<span className="font-semibold text-stone-700">{row.platform}</span>
						<span>
							<span className="text-emerald-600 font-medium">{row.mendukung}% Mendukung</span>
							{" · "}
							<span className="text-stone-400">{row.netral}% Netral</span>
							{" · "}
							<span className="text-red-500 font-medium">{row.menolak}% Menolak</span>
						</span>
					</div>
					<div className="flex h-3 rounded-full overflow-hidden">
						<div
							style={{ width: `${row.mendukung}%` }}
							className="bg-emerald-400"
						/>
						<div
							style={{ width: `${row.netral}%` }}
							className="bg-stone-200"
						/>
						<div
							style={{ width: `${row.menolak}%` }}
							className="bg-red-400"
						/>
					</div>
				</div>
			))}
			<div className="flex gap-4 pt-1">
				{[
					{ warna: "bg-emerald-400", label: "Mendukung" },
					{ warna: "bg-stone-200", label: "Netral" },
					{ warna: "bg-red-400", label: "Menolak" },
				].map(({ warna, label }) => (
					<span
						key={label}
						className="flex items-center gap-1.5 text-xs text-stone-400 font-sans"
					>
						<span className={`w-2.5 h-2.5 rounded-sm ${warna}`} />
						{label}
					</span>
				))}
			</div>
		</div>
	);
}

export function EskalasiTimeline({ data }) {
	const levelColor = {
		rendah: { bg: "bg-green-100", text: "text-green-700", dot: "#4ade80" },
		sedang: { bg: "bg-amber-100", text: "text-amber-700", dot: "#fbbf24" },
		tinggi: { bg: "bg-red-100", text: "text-red-700", dot: "#f87171" },
	};
	return (
		<div className="not-prose my-8">
			<p className="text-xs font-semibold uppercase tracking-widest text-stone-400 mb-4 font-sans">Timeline eskalasi — delta komentar negatif harian</p>
			<div className="relative">
				{/* vertical line */}
				<div className="absolute left-1.75 top-2 bottom-2 w-px bg-stone-200" />
				<div className="space-y-3 pl-7">
					{data.map((d) => {
						const c = levelColor[d.level];
						return (
							<div
								key={d.tanggal}
								className="relative flex items-start gap-3"
							>
								{/* dot */}
								<span
									className="absolute -left-7 mt-1.5 w-3.5 h-3.5 rounded-full border-2 border-white"
									style={{ background: c.dot, boxShadow: d.is_eskalasi ? `0 0 0 3px ${c.dot}33` : "none" }}
								/>
								<div className="flex-1 flex items-center justify-between gap-3">
									<div>
										<span className="text-xs font-semibold text-stone-700 font-sans">{d.tanggal}</span>
										{d.is_eskalasi && <span className={`ml-2 px-2 py-0.5 rounded text-xs font-semibold font-sans ${c.bg} ${c.text}`}>Eskalasi Terdeteksi</span>}
									</div>
									<div className="flex items-center gap-2 shrink-0">
										<span className={`text-xs font-mono font-semibold ${d.delta > 10 ? "text-red-600" : d.delta < 0 ? "text-emerald-600" : "text-stone-500"}`}>{d.delta > 0 ? `+${d.delta}` : d.delta}</span>
										<span className={`px-2 py-0.5 rounded text-xs font-sans ${c.bg} ${c.text}`}>{d.level}</span>
									</div>
								</div>
							</div>
						);
					})}
				</div>
			</div>
		</div>
	);
}

export function MomentumShiftPanel({ data }) {
	const sentimenColor = {
		positif: "bg-emerald-100 text-emerald-700 border-emerald-200",
		negatif: "bg-red-100 text-red-700 border-red-200",
		netral: "bg-stone-100 text-stone-600 border-stone-200",
	};
	return (
		<div className="not-prose my-8 space-y-3">
			<p className="text-xs font-semibold uppercase tracking-widest text-stone-400 mb-4 font-sans">Momentum shift — perubahan arah sentimen signifikan</p>
			{data.map((s, i) => (
				<div
					key={i}
					className="border border-stone-200 rounded-xl p-4 bg-stone-50"
				>
					<div className="flex items-center gap-2 mb-2 flex-wrap">
						<span className="text-xs font-semibold text-stone-500 font-mono">{s.tanggal}</span>
						<span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border font-sans capitalize ${sentimenColor[s.sebelum]}`}>{s.sebelum}</span>
						<span className="text-stone-300 text-sm">→</span>
						<span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border font-sans capitalize ${sentimenColor[s.sesudah]}`}>{s.sesudah}</span>
						<span className="ml-auto text-xs font-mono text-stone-400">magnitude {s.magnitude.toFixed(2)}</span>
					</div>
					<p className="text-sm text-stone-600 font-sans leading-relaxed">{s.keterangan}</p>
					{/* magnitude bar */}
					<div className="mt-3 h-3 bg-stone-200 rounded-full overflow-hidden">
						<div
							className="h-full bg-amber-400 rounded-full"
							style={{ width: `${Math.round(s.magnitude * 100)}%` }}
						/>
					</div>
					<p className="text-xs text-stone-400 mt-1 font-sans">{Math.round(s.magnitude * 100)}% intensitas perubahan</p>
				</div>
			))}
		</div>
	);
}

export function EchoChamberPanel({ data }) {
	const maxVar = 0.12;
	return (
		<div className="not-prose my-8">
			<p className="text-xs font-semibold uppercase tracking-widest text-stone-400 mb-4 font-sans">Deteksi echo chamber — variance opini per platform</p>
			<div className="grid sm:grid-cols-3 gap-3">
				{data.map((d) => (
					<div
						key={d.platform}
						className={`rounded-xl border p-4 ${d.is_echo ? "bg-red-50 border-red-200" : "bg-stone-50 border-stone-200"}`}
					>
						<div className="flex items-center justify-between mb-3">
							<span className="text-sm font-semibold text-stone-800 font-sans">{d.platform}</span>
							<span className={`px-2 py-0.5 rounded-full text-xs font-semibold font-sans ${d.is_echo ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}>{d.is_echo ? "Serupa" : "Beragam"}</span>
						</div>
						{/* Variance sentimen */}
						<div className="mb-2">
							<div className="flex justify-between text-xs font-sans mb-1">
								<span className="text-stone-500">Var. sentimen</span>
								<span className="font-mono text-stone-700">{d.var_sentimen.toFixed(3)}</span>
							</div>
							<div className="h-2 bg-stone-200 rounded-full overflow-hidden">
								<div
									className={`h-full rounded-full ${d.is_echo ? "bg-red-400" : "bg-blue-400"}`}
									style={{ width: `${Math.round((d.var_sentimen / maxVar) * 100)}%` }}
								/>
							</div>
						</div>
						{/* Variance stance */}
						<div>
							<div className="flex justify-between text-xs font-sans mb-1">
								<span className="text-stone-500">Var. stance</span>
								<span className="font-mono text-stone-700">{d.var_stance.toFixed(3)}</span>
							</div>
							<div className="h-2 bg-stone-200 rounded-full overflow-hidden">
								<div
									className={`h-full rounded-full ${d.is_echo ? "bg-red-400" : "bg-blue-400"}`}
									style={{ width: `${Math.round((d.var_stance / maxVar) * 100)}%` }}
								/>
							</div>
						</div>
						<p className="text-xs text-stone-400 mt-3 font-sans leading-relaxed">{d.is_echo ? "Opini homogen — mayoritas saling menguatkan satu narasi saja." : "Opini masih beragam — diskusi relatif sehat."}</p>
					</div>
				))}
			</div>
		</div>
	);
}

export function KomentarVerbatim({ data }) {
	return (
		<div className="not-prose mt-8 space-y-6 grid grid-cols-1 gap-4">
			{data.map((narasi) => (
				<div key={narasi.narasi}>
					<p className="text-xs font-semibold uppercase tracking-widest text-stone-400 mb-3 font-sans">Suara langsung — narasi &quot;{narasi.narasi}&quot;</p>
					<div className="space-y-2 grid grid-cols-2 gap-4">
						{narasi.komentar.map((k, i) => (
							<div
								key={i}
								className="border-l-2 border-stone-300 pl-4 py-1"
							>
								<p className="text-sm text-stone-700 font-sans leading-relaxed italic">&quot;{k.teks}&quot;</p>
								<p className="text-xs text-stone-400 font-sans mt-1">@{k.username}</p>
							</div>
						))}
					</div>
				</div>
			))}
		</div>
	);
}

export function IndeksTimeSeries({ data }) {
	const delta = (data[2].skor - data[0].skor).toFixed(2);
	const turun = data[2].skor < data[0].skor;
	const komponen = ["sentimen", "stance", "eskalasi"];
	const labelKomp = { sentimen: "Skor sentimen", stance: "Skor stance", eskalasi: "Skor eskalasi" };
	return (
		<div className="not-prose my-8">
			<p className="text-xs font-semibold uppercase tracking-widest text-stone-400 mb-4 font-sans">Indeks kepercayaan publik — tren tiga titik waktu</p>
			{/* Skor besar */}
			<div className="grid grid-cols-3 gap-3 mb-4">
				{data.map((d) => (
					<div
						key={d.tanggal}
						className="bg-stone-50 border border-stone-200 rounded-xl px-4 py-4"
					>
						<p className="text-xs text-stone-400 font-sans mb-1">{d.tanggal}</p>
						<p className="text-3xl font-bold text-stone-900 leading-none">{d.skor}</p>
						<p className="text-xs text-stone-500 font-sans mt-1">{d.skor >= 70 ? "kepercayaan tinggi" : d.skor >= 40 ? "kepercayaan sedang" : "kepercayaan rendah"}</p>
					</div>
				))}
			</div>
			{/* Delta badge */}
			<div className={`flex items-center gap-2 mb-4 px-3 py-2 rounded-lg text-sm font-sans ${turun ? "bg-red-50 text-red-700" : "bg-green-50 text-green-700"}`}>
				<span className="font-semibold">
					{turun ? "▼" : "▲"} {Math.abs(Number(delta))} poin
				</span>
				<span className="text-stone-500">
					dalam 7 hari ({data[0].tanggal} → {data[2].tanggal})
				</span>
			</div>
			{/* Breakdown komponen */}
			<div className="bg-stone-50 border border-stone-200 rounded-xl p-4 space-y-3">
				<p className="text-xs font-semibold text-stone-500 font-sans mb-2">Breakdown per komponen</p>
				{komponen.map((k) => (
					<div key={k}>
						<div className="flex justify-between text-xs font-sans mb-1">
							<span className="text-stone-600">{labelKomp[k]}</span>
							<span className="font-mono">
								<span className="text-stone-800">{data[0][k]}</span>
								<span className="text-stone-400"> → </span>
								<span className={data[2][k] < data[0][k] ? "text-red-600 font-semibold" : "text-emerald-600 font-semibold"}>{data[2][k]}</span>
							</span>
						</div>
						{/* Dual bar */}
						<div className="relative h-3 bg-stone-200 rounded-full overflow-hidden">
							<div
								className="absolute top-0 left-0 h-full bg-stone-300 rounded-full"
								style={{ width: `${data[0][k]}%` }}
							/>
							<div
								className={`absolute top-0 left-0 h-full rounded-full ${data[2][k] < data[0][k] ? "bg-amber-400" : "bg-emerald-400"}`}
								style={{ width: `${data[2][k]}%` }}
							/>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}

export function SummaryMingguan({ data }) {
	return (
		<div>
			{data.map((d) => (
				<div className="not-prose my-10 border border-stone-200 rounded-2xl overflow-hidden">
					{/* Header */}
					<div className="bg-stone-900 px-6 py-4">
						<p className="text-xs font-semibold uppercase tracking-widest text-stone-400 mb-1 font-sans">
							Laporan {d.periode} · {d.tanggal}
						</p>
						<p className="text-base font-semibold text-white font-sans leading-snug">{d.judul}</p>
					</div>
					{/* Poin-poin */}
					<div className="px-6 py-5 space-y-3 bg-stone-50">
						{d.konten.split("|").map((poin, i) => (
							<div
								key={i}
								className="flex gap-3"
							>
								<span className="text-stone-300 font-mono text-xs mt-1 shrink-0">{String(i + 1).padStart(2, "0")}</span>
								<p className="text-sm text-stone-700 font-sans leading-relaxed">{poin}</p>
							</div>
						))}
					</div>
					{/* Footer */}
					<div className="px-6 py-3 border-t border-stone-200 flex justify-between items-center bg-white">
						<span className="text-xs text-stone-400 font-sans">Digenerate otomatis · editor: {d.editor}</span>
						<span className="text-xs text-stone-400 font-sans">{d.tanggal}</span>
					</div>
				</div>
			))}
		</div>
	);
}
