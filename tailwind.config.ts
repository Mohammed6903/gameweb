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
			colors: {
			background: 'oklch(var(--background))',
			foreground: 'oklch(var(--foreground))',
			card: 'oklch(var(--card))',
			'card-foreground': 'oklch(var(--card-foreground))',
			popover: 'oklch(var(--popover))',
			'popover-foreground': 'oklch(var(--popover-foreground))',
			primary: 'oklch(var(--primary))',
			'primary-foreground': 'oklch(var(--primary-foreground))',
			secondary: 'oklch(var(--secondary))',
			'secondary-foreground': 'oklch(var(--secondary-foreground))',
			muted: 'oklch(var(--muted))',
			'muted-foreground': 'oklch(var(--muted-foreground))',
			accent: 'oklch(var(--accent))',
			'accent-foreground': 'oklch(var(--accent-foreground))',
			destructive: 'oklch(var(--destructive))',
			'destructive-foreground': 'oklch(var(--destructive-foreground))',
			border: 'oklch(var(--border))',
			input: 'oklch(var(--input))',
			ring: 'oklch(var(--ring))',
			sidebar: {
				DEFAULT: 'oklch(var(--sidebar-background))',
				foreground: 'oklch(var(--sidebar-foreground))',
				primary: 'oklch(var(--sidebar-primary))',
				'primary-foreground': 'oklch(var(--sidebar-primary-foreground))',
				accent: 'oklch(var(--sidebar-accent))',
				'accent-foreground': 'oklch(var(--sidebar-accent-foreground))',
				border: 'oklch(var(--sidebar-border))',
				ring: 'oklch(var(--sidebar-ring))'
			}
			}
		}
	},
	plugins: [
		require('@tailwindcss/typography'),
	],
};
export default config;
