export interface FaqItem {
	q: string;
	a: string;
}

export interface FaqCategory {
	icon: "BookOpen" | "BarChart3" | "Shield" | "Lightbulb";
	title: string;
	items: FaqItem[];
}

export const faqCategories: FaqCategory[] = [
	{
		icon: "BookOpen",
		title: "Umum",
		items: [
			{
				q: "Apa itu Kata Netizen?",
				a: "Kata Netizen adalah platform analisis opini publik yang membaca dan mengolah percakapan di media sosial menjadi insight yang mudah dipahami. Kami menganalisis sentimen, narasi, dan tren dari ribuan komentar untuk memberikan gambaran utuh tentang respon masyarakat terhadap berbagai isu.",
			},
			{
				q: "Apakah Kata Netizen gratis?",
				a: "Ya, saat ini seluruh artikel dan analisis di Kata Netizen dapat diakses secara gratis. Kami percaya bahwa informasi tentang opini publik seharusnya terbuka untuk semua kalangan.",
			},
			{
				q: "Siapa yang bisa menggunakan Kata Netizen?",
				a: "Siapa saja — jurnalis, peneliti, mahasiswa, pembuat kebijakan, pelaku bisnis, atau masyarakat umum yang ingin memahami opini publik terhadap isu-isu tertentu.",
			},
			{
				q: "Seberapa sering artikel analisis diperbarui?",
				a: "Artikel analisis diterbitkan secara berkala tergantung pada isu yang sedang dipantau. Untuk isu yang sedang panas, kami dapat memperbarui data setiap hari. Untuk isu yang lebih stabil, pembaruan dilakukan mingguan.",
			},
			{
				q: "Apakah Kata Netizen berafiliasi dengan partai politik atau organisasi tertentu?",
				a: "Tidak. Kata Netizen adalah platform independen yang tidak berafiliasi dengan partai politik, organisasi, atau kepentingan komersial tertentu. Analisis kami dirancang untuk objektif dan berbasis data.",
			},
			{
				q: "Bagaimana cara mengutip data dari Kata Netizen?",
				a: "Anda bebas mengutip data atau insight dari platform kami untuk keperluan akademik, jurnalistik, atau non-komersial lainnya. Cukup sebutkan \"Kata Netizen (katanetizen.com)\" sebagai sumber beserta tanggal akses.",
			},
			{
				q: "Apakah saya bisa meminta analisis untuk isu tertentu?",
				a: "Kami terbuka terhadap saran isu dari pembaca. Anda bisa mengirimkan usulan melalui email ke hello@katanetizen.com. Tim kami akan mempertimbangkan relevansi dan urgensi isu tersebut.",
			},
		],
	},
	{
		icon: "BarChart3",
		title: "Data & Analisis",
		items: [
			{
				q: "Dari mana data komentar dikumpulkan?",
				a: "Kami mengumpulkan komentar dari berbagai platform media sosial populer seperti Instagram, Twitter/X, YouTube, dan platform lainnya. Data dikumpulkan secara agregat dan dianonimisasi untuk menjaga privasi pengguna.",
			},
			{
				q: "Bagaimana cara kerja analisis sentimen?",
				a: "Kami menggunakan teknologi Natural Language Processing (NLP) yang telah disesuaikan dengan konteks bahasa Indonesia. Setiap komentar diklasifikasikan ke dalam kategori positif, negatif, atau netral berdasarkan makna dan konteks kalimatnya.",
			},
			{
				q: "Seberapa akurat hasil analisisnya?",
				a: "Model kami terus dilatih dan dievaluasi untuk meningkatkan akurasi. Namun, seperti semua sistem otomatis, ada kemungkinan kesalahan klasifikasi pada kasus-kasus tertentu seperti sarkasme atau bahasa gaul. Kami selalu menyertakan konteks agar pembaca dapat menilai sendiri.",
			},
			{
				q: "Apa itu Indeks Kepercayaan Publik?",
				a: "Indeks Kepercayaan Publik adalah skor komposit yang kami hitung dengan menggabungkan tiga aspek: sentimen masyarakat, sikap terhadap kebijakan (stance), dan tingkat ketegangan percakapan. Skor ini memberikan gambaran ringkas tentang sejauh mana publik mempercayai suatu kebijakan.",
			},
			{
				q: "Berapa banyak komentar yang dianalisis untuk setiap isu?",
				a: "Jumlah komentar bervariasi tergantung pada popularitas isu dan jumlah platform yang dipantau. Untuk isu-isu besar, kami bisa menganalisis puluhan ribu hingga ratusan ribu komentar. Jumlah spesifik selalu tercantum di ringkasan statistik setiap artikel.",
			},
			{
				q: "Mengapa ada perbedaan sentimen antar platform untuk isu yang sama?",
				a: "Setiap platform memiliki demografi dan budaya pengguna yang berbeda. Instagram cenderung lebih visual dan personal, Twitter lebih reaktif dan singkat, YouTube lebih mendalam. Perbedaan ini menghasilkan pola sentimen yang berbeda — dan justru itulah yang membuat analisis lintas platform menjadi lebih bermakna.",
			},
			{
				q: "Apa itu Stance dan bagaimana perbedaannya dengan sentimen?",
				a: "Sentimen mengukur emosi (positif, negatif, netral), sedangkan Stance mengukur posisi terhadap kebijakan (mendukung, menolak, tidak memihak). Seseorang bisa bersentimen netral namun tetap menolak kebijakan karena pertimbangan rasional. Keduanya memberikan perspektif yang saling melengkapi.",
			},
			{
				q: "Apakah data historis tersedia untuk dibandingkan?",
				a: "Ya, setiap artikel menampilkan tren harian yang menunjukkan perkembangan sentimen dari waktu ke waktu. Anda bisa melihat bagaimana opini publik berubah sepanjang periode analisis. Kami juga menyediakan Summary Mingguan untuk ringkasan tren jangka panjang.",
			},
		],
	},
	{
		icon: "Shield",
		title: "Privasi & Keamanan",
		items: [
			{
				q: "Apakah komentar saya bisa dilacak?",
				a: "Tidak. Kami menganalisis data secara agregat dan anonim. Kami tidak menyimpan informasi yang bisa mengidentifikasi individu tertentu, termasuk nama pengguna atau akun media sosial.",
			},
			{
				q: "Data apa saja yang kalian kumpulkan dari pengunjung?",
				a: "Kami hanya mengumpulkan data analitik dasar seperti halaman yang dikunjungi dan waktu kunjungan untuk meningkatkan kualitas platform. Kami tidak mengumpulkan data pribadi yang sensitif. Selengkapnya dapat dibaca di halaman Kebijakan Privasi.",
			},
			{
				q: "Apakah Kata Netizen menggunakan cookies?",
				a: "Ya, kami menggunakan cookies esensial untuk fungsionalitas situs dan cookies analitik untuk memahami bagaimana pengunjung menggunakan platform. Anda dapat mengelola preferensi cookies melalui pengaturan browser.",
			},
			{
				q: "Bagaimana jika saya ingin data saya dihapus?",
				a: "Karena kami tidak menyimpan data personal dari komentar media sosial, tidak ada data individu yang perlu dihapus. Jika Anda berlangganan newsletter dan ingin berhenti, cukup klik tautan unsubscribe di email atau hubungi privacy@katanetizen.com.",
			},
			{
				q: "Apakah data analisis bisa disalahgunakan?",
				a: "Kami menyadari risiko ini dan mengambil langkah pencegahan. Data hanya ditampilkan dalam bentuk agregat, tidak ada individu yang bisa diidentifikasi, dan kami tidak menjual data kepada pihak ketiga. Kebijakan lengkap dapat dibaca di halaman Privasi.",
			},
		],
	},
	{
		icon: "Lightbulb",
		title: "Fitur & Navigasi",
		items: [
			{
				q: "Bagaimana cara membaca artikel analisis?",
				a: "Setiap artikel terdiri dari beberapa bagian: ringkasan statistik, tren harian, narasi utama, perbandingan platform, dan insight tambahan. Anda bisa membaca dari atas ke bawah atau menggunakan Daftar Isi untuk langsung ke bagian yang diminati.",
			},
			{
				q: "Apa itu Echo Chamber?",
				a: "Echo chamber adalah kondisi di mana pengguna di suatu platform hanya terpapar satu sudut pandang. Kami mengukur tingkat keragaman opini di tiap platform — jika variansinya sangat rendah, itu bisa menjadi tanda bahwa diskusi tidak lagi terbuka.",
			},
			{
				q: "Apa itu Momentum Shift?",
				a: "Momentum shift mencatat momen di mana arah sentimen publik berubah secara signifikan. Ini bukan sekadar naik-turun volume komentar, melainkan pergeseran dominansi narasi yang bisa mengubah arah percakapan.",
			},
			{
				q: "Apa itu Eskalasi dan bagaimana cara membacanya?",
				a: "Eskalasi terdeteksi ketika ada lonjakan komentar negatif yang melampaui ambang batas harian. Di timeline eskalasi, Anda bisa melihat hari-hari mana yang mengalami peningkatan ketegangan signifikan — ini membantu mengidentifikasi momen-momen kritis dalam sebuah isu.",
			},
			{
				q: "Bagaimana cara menggunakan Daftar Isi (Table of Contents)?",
				a: "Daftar Isi muncul di sidebar (desktop) atau di bagian atas artikel (mobile). Klik salah satu judul untuk langsung melompat ke bagian yang diinginkan. Bagian yang sedang Anda baca akan ditandai secara otomatis.",
			},
			{
				q: "Bisakah saya membandingkan dua isu sekaligus?",
				a: "Saat ini fitur perbandingan langsung antar isu sedang dalam pengembangan. Untuk sementara, Anda bisa membuka dua artikel secara berdampingan dan membandingkan data secara manual.",
			},
			{
				q: "Apa arti angka di bagian \"Total komentar\" dan \"Volume komentar harian\"?",
				a: "\"Total komentar\" adalah jumlah keseluruhan komentar yang dianalisis untuk isu tersebut. \"Volume komentar harian\" menampilkan distribusi komentar per hari berdasarkan sentimen — membantu Anda melihat kapan percakapan paling ramai dan bagaimana trennya dari waktu ke waktu.",
			},
			{
				q: "Apa itu Kata Kunci dan Tokoh yang ditampilkan di artikel?",
				a: "Kata Kunci adalah istilah yang paling sering muncul dalam komentar di setiap kelompok sentimen. Tokoh (Entitas) adalah nama orang atau lembaga yang paling banyak disebut. Keduanya membantu Anda memahami apa dan siapa yang menjadi pusat perhatian publik.",
			},
		],
	},
];
