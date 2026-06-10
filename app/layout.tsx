import "./globals.css";
import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { cn } from "@/lib/utils";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider, THEME_SCRIPT } from "@/components/theme-provider";
import { Suspense } from "react";
import VisitorTracker from "@/components/visitor-tracker";

const plusJakartaSans = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
	metadataBase: new URL("https://katanetizen.com"),
	title: {
		default: "Kata Netizen - Analisis Opini dan Sentimen Publik Indonesia",
		template: "%s | Kata Netizen",
	},
	description: "Kata Netizen menghadirkan analisis opini publik, sentimen netizen, tren media sosial, dan insight percakapan digital Indonesia secara akurat dan terpercaya.",
	keywords: ["kata netizen", "analisis sentimen", "opini publik", "sentimen netizen", "media sosial", "analisis komentar", "tren sosial media", "social listening", "big data indonesia", "analisis percakapan digital", "isu viral", "analisis publik", "monitoring media sosial"],
	authors: [
		{
			name: "Kata Netizen",
			url: "https://katanetizen.com",
		},
	],
	creator: "Kata Netizen",
	publisher: "Kata Netizen",
	category: "Technology",
	robots: {
		index: true,
		follow: true,
		nocache: false,
		googleBot: {
			index: true,
			follow: true,
			noimageindex: false,
			"max-video-preview": -1,
			"max-image-preview": "large",
			"max-snippet": -1,
		},
	},
	alternates: {
		canonical: "/",
	},
	openGraph: {
		type: "website",
		locale: "id_ID",
		url: "https://katanetizen.com",
		siteName: "Kata Netizen",
		title: "Kata Netizen - Analisis Opini dan Sentimen Publik Indonesia",
		description: "Platform analisis opini publik, sentimen netizen, tren media sosial, dan insight percakapan digital Indonesia.",
		images: [
			{
				url: "/logo.png",
				width: 1200,
				height: 630,
				alt: "Kata Netizen",
			},
		],
	},
	twitter: {
		card: "summary_large_image",
		title: "Kata Netizen - Analisis Opini dan Sentimen Publik Indonesia",
		description: "Analisis sentimen, opini publik, dan tren media sosial Indonesia secara real-time.",
		images: ["/logo.png"],
		creator: "@katanetizen",
	},
	verification: {
		google: "GOOGLE_VERIFICATION_CODE",
	},
	icons: {
		icon: [{ url: "/logo.png" }, { url: "/logo.png", sizes: "32x32", type: "image/png" }, { url: "/logo.png", sizes: "16x16", type: "image/png" }],
		apple: "/logo.png",
	},
	// manifest: "/site.webmanifest",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html
			lang="id"
			suppressHydrationWarning
			className={cn("h-full", "antialiased", plusJakartaSans.variable)}
		>
			<head dangerouslySetInnerHTML={{ __html: `<script>${THEME_SCRIPT}</script>` }} suppressHydrationWarning />
			<body className="min-h-full flex flex-col bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 transition-colors">
				<ThemeProvider>
					<Suspense>
						<VisitorTracker />
					</Suspense>
					<TooltipProvider>{children}</TooltipProvider>
				</ThemeProvider>
			</body>
		</html>
	);
}
