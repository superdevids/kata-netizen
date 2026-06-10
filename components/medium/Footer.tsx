import Link from "next/link";
import Image from "next/image";
import { site, footerLinks } from "@/data/site";

export function Footer() {
	return (
		<footer className="border-t border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900 mt-auto">
			<div className="max-w-334 mx-auto px-6 pt-12 pb-6">
				<div className="grid grid-cols-1 sm:grid-cols-4 gap-8">
					{/* Brand */}
					<div className="sm:col-span-2">
						<Link href="/" className="flex items-center gap-2">
							<Image
								src="/logo.png"
								alt="Kata Netizen"
								width={28}
								height={28}
								className="w-7 h-7"
							/>
							<span className="font-bold text-lg text-blue-700 dark:text-blue-400">
								Kata Netizen
							</span>
						</Link>
						<p className="mt-2 text-sm text-stone-500 dark:text-stone-400 leading-relaxed">
							{site.description}
						</p>
					</div>

					{/* Platform Links */}
					<div className="sm:text-right">
						<p className="text-xs font-semibold uppercase tracking-widest text-stone-400 dark:text-stone-500 mb-3">Platform</p>
						<ul className="space-y-2">
							{footerLinks.platform.map((link) => (
								<li key={link.href}>
									<Link href={link.href} className="text-sm text-stone-600 dark:text-stone-400 hover:text-blue-700 dark:hover:text-blue-400 transition-colors">
										{link.label}
									</Link>
								</li>
							))}
						</ul>
					</div>

					{/* Bantuan Links */}
					<div className="sm:text-right">
						<p className="text-xs font-semibold uppercase tracking-widest text-stone-400 dark:text-stone-500 mb-3">Bantuan</p>
						<ul className="space-y-2">
							{footerLinks.bantuan.map((link) => (
								<li key={link.href}>
									<Link href={link.href} className="text-sm text-stone-600 dark:text-stone-400 hover:text-blue-700 dark:hover:text-blue-400 transition-colors">
										{link.label}
									</Link>
								</li>
							))}
						</ul>
					</div>
				</div>

				<div className="mt-10 pt-6 border-t border-stone-200 dark:border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-3">
					<p className="text-xs text-stone-500 dark:text-stone-500">&copy; {new Date().getFullYear()} {site.name}.</p>
					<div className="flex items-center gap-4">
						<Link href="/privacy" className="text-xs text-stone-500 dark:text-stone-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Privasi</Link>
						<Link href="/terms" className="text-xs text-stone-500 dark:text-stone-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Ketentuan</Link>
					</div>
				</div>
			</div>
		</footer>
	);
}
