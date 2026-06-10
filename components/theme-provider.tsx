"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

type Theme = "light" | "dark" | "system";

interface ThemeContextValue {
	theme: Theme;
	setTheme: (theme: Theme) => void;
	systemTheme: "light" | "dark";
}

const ThemeContext = createContext<ThemeContextValue>({
	theme: "system",
	setTheme: () => {},
	systemTheme: "light",
});

export function useTheme() {
	return useContext(ThemeContext);
}

/** Blocking script to prevent FOUC — rendered as raw HTML string, not a React element */
const THEME_SCRIPT: string = `(function(){try{var t=localStorage.getItem("theme")||"system";var d=t==="system"?(window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"):t;document.documentElement.classList.toggle("dark",d==="dark");}catch(e){}})();`;

export { THEME_SCRIPT };

export function ThemeProvider({ children }: { children: ReactNode }) {
	const [theme, setThemeState] = useState<Theme>("system");
	const [systemTheme, setSystemTheme] = useState<"light" | "dark">("light");

	useEffect(() => {
		// Read stored preference
		const stored = (localStorage.getItem("theme") as Theme) || "system";
		setThemeState(stored);

		// Track system preference
		const mq = window.matchMedia("(prefers-color-scheme: dark)");
		setSystemTheme(mq.matches ? "dark" : "light");

		const handler = (e: MediaQueryListEvent) => {
			setSystemTheme(e.matches ? "dark" : "light");
			// If user prefers "system", apply immediately
			const current = (localStorage.getItem("theme") as Theme) || "system";
			if (current === "system") {
				document.documentElement.classList.toggle("dark", e.matches);
			}
		};
		mq.addEventListener("change", handler);
		return () => mq.removeEventListener("change", handler);
	}, []);

	// Apply theme class whenever theme or systemTheme changes
	useEffect(() => {
		const resolved = theme === "system" ? systemTheme : theme;
		document.documentElement.classList.toggle("dark", resolved === "dark");
	}, [theme, systemTheme]);

	const setTheme = (newTheme: Theme) => {
		localStorage.setItem("theme", newTheme);
		setThemeState(newTheme);
	};

	return (
		<ThemeContext.Provider value={{ theme, setTheme, systemTheme }}>
			{children}
		</ThemeContext.Provider>
	);
}
