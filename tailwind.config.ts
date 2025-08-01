import type { Config } from "tailwindcss";

export default {
    darkMode: 'class', // 启用类名模式的暗色主题
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                // 简化的颜色配置
                background: "rgb(var(--background))",
                foreground: "rgb(var(--foreground))",
                card: "rgb(var(--card))",
                'card-foreground': "rgb(var(--card-foreground))",
                border: "rgb(var(--border))",
                muted: "rgb(var(--muted))",
                'muted-foreground': "rgb(var(--muted-foreground))",
                accent: "rgb(var(--accent))",
                'accent-foreground': "rgb(var(--accent-foreground))",
            }
        },
    },
    plugins: [],
} satisfies Config;
