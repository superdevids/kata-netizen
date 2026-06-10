import Link from "next/link";
import Image from "next/image";
import { Navbar } from "@/components/medium/Navbar";
import { Footer } from "@/components/medium/Footer";
import { ExternalLink } from "lucide-react";
import { supportPlatforms } from "@/data/support";

export default function SupportPage() {
	return (
		<div className="min-h-screen bg-white dark:bg-stone-900">
			<Navbar />

			<main className="max-w-334 mx-auto px-6 py-12">
				{/* Hero Section */}
				<div className="text-center mb-16">
					<div className="flex justify-center mb-6">
						<Image
							src="/logo.png"
							alt="Kata Netizen"
							width={512}
							height={512}
							className="size-48"
						/>
					</div>
					<h1 className="text-4xl sm:text-5xl font-bold text-stone-900 dark:text-stone-100 mb-4">
						Dukung Kata Netizen
					</h1>
					<p className="text-lg text-stone-600 dark:text-stone-400 max-w-4xl mx-auto leading-relaxed">
						Bantuan Anda membantu kami terus menyajikan analisis sentimen dan opini publik yang berkualitas untuk masyarakat Indonesia.
					</p>
				</div>

				{/* Support Platforms Grid */}
				<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
					{supportPlatforms.map((platform) => {
						return (
							<Link
								key={platform.name}
								href={platform.url}
								target="_blank"
								rel="noopener noreferrer"
								className={`group relative overflow-hidden rounded-xl border-2 ${platform.borderColor} ${platform.hoverColor} ${platform.bgColor} p-8 transition-all duration-300 hover:shadow-lg hover:-translate-y-1`}
							>
								<div className="absolute top-0 right-0 w-32 h-32 opacity-10 rounded-bl-full -mr-8 -mt-8" style={{ backgroundColor: platform.color }} />

								<div className="relative">
									<div className="inline-flex items-center justify-center w-16 h-16 rounded-xl mb-6 shadow-lg bg-white dark:bg-stone-800 p-2">
										<Image
											src={platform.logo}
											alt={platform.name}
											width={56}
											height={56}
											className="w-full h-full object-contain"
										/>
									</div>

									<h2 className={`text-2xl font-bold mb-3 ${platform.textColor || "text-stone-900 dark:text-stone-100"}`}>
										{platform.name}
									</h2>

									<p className={`text-sm leading-relaxed mb-6 ${platform.textColor || "text-stone-600 dark:text-stone-400"}`}>
										{platform.description}
									</p>

									<div className={`inline-flex items-center gap-2 px-6 py-3 rounded-full ${platform.buttonColor} text-white font-medium transition-all duration-300 group-hover:shadow-md`}>
										<span>Dukung via {platform.name}</span>
										<ExternalLink className="w-4 h-4" />
									</div>
								</div>
							</Link>
						);
					})}
				</div>

				{/* Thank You Message */}
				<div className="text-center py-12 px-6 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border border-blue-200 dark:border-blue-800">
					<h3 className="text-2xl font-bold text-stone-900 dark:text-stone-100 mb-4">
						Terima Kasih! 🙏
					</h3>
					<p className="text-stone-600 dark:text-stone-400 max-w-2xl mx-auto leading-relaxed">
						Setiap dukungan, sebesar apapun, sangat berarti bagi kami. Dengan bantuan Anda, kami dapat terus menyediakan analisis yang objektif dan bermanfaat untuk masyarakat Indonesia.
					</p>
				</div>

				{/* Alternative Support */}
				<div className="mt-12 text-center">
					<p className="text-sm text-stone-500 dark:text-stone-500">
						Ingin mendukung dengan cara lain?{" "}
						<Link href="/about" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
							Hubungi kami
						</Link>
					</p>
				</div>
			</main>

			<Footer />
		</div>
	);
}
