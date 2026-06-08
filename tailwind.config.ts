import type { Config } from "tailwindcss";

const config: Config = {
		darkMode: ["class"],
		content: [
		"./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/components/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/app/**/*.{js,ts,jsx,tsx,mdx}",
	],
	theme: {
		extend: {
			fontFamily: {
				sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
				display: ['var(--font-display)', 'system-ui', 'sans-serif'],
			},
			colors: {
			background: 'oklch(var(--background) / <alpha-value>)',
			foreground: 'oklch(var(--foreground) / <alpha-value>)',
			card: 'oklch(var(--card) / <alpha-value>)',
			'card-foreground': 'oklch(var(--card-foreground) / <alpha-value>)',
			popover: 'oklch(var(--popover) / <alpha-value>)',
			'popover-foreground': 'oklch(var(--popover-foreground) / <alpha-value>)',
			primary: 'oklch(var(--primary) / <alpha-value>)',
			'primary-foreground': 'oklch(var(--primary-foreground) / <alpha-value>)',
			secondary: 'oklch(var(--secondary) / <alpha-value>)',
			'secondary-foreground': 'oklch(var(--secondary-foreground) / <alpha-value>)',
			muted: 'oklch(var(--muted) / <alpha-value>)',
			'muted-foreground': 'oklch(var(--muted-foreground) / <alpha-value>)',
			accent: 'oklch(var(--accent) / <alpha-value>)',
			'accent-foreground': 'oklch(var(--accent-foreground) / <alpha-value>)',
			destructive: 'oklch(var(--destructive) / <alpha-value>)',
			'destructive-foreground': 'oklch(var(--destructive-foreground) / <alpha-value>)',
			border: 'oklch(var(--border) / <alpha-value>)',
			input: 'oklch(var(--input) / <alpha-value>)',
			ring: 'oklch(var(--ring) / <alpha-value>)',
			sidebar: {
				DEFAULT: 'oklch(var(--sidebar-background) / <alpha-value>)',
				foreground: 'oklch(var(--sidebar-foreground) / <alpha-value>)',
				primary: 'oklch(var(--sidebar-primary) / <alpha-value>)',
				'primary-foreground': 'oklch(var(--sidebar-primary-foreground) / <alpha-value>)',
				accent: 'oklch(var(--sidebar-accent) / <alpha-value>)',
				'accent-foreground': 'oklch(var(--sidebar-accent-foreground) / <alpha-value>)',
				border: 'oklch(var(--sidebar-border) / <alpha-value>)',
				ring: 'oklch(var(--sidebar-ring) / <alpha-value>)'
			}
			}
		}
	},
	plugins: [
		require('@tailwindcss/typography'),
	],
};
export default config;
