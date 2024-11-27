/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
    theme: {
        extend: {},
    },
    plugins: [require("daisyui")],
    tailwind: {
        // Custom dark theme palette
        colors: {
            text: "#e6e6e6",
            foreground: "#12250e",
            background: "#2b4026",
            primary: "#45b82e",
            secondary: "#1f321b",
            accent: "#ffd500",
        },
    },
    daisyui: {
        themes: [
            {
                // Custom dark theme palette
                darkTheme: {
                    text: "#e6e6e6",
                    foreground: "#12250e",
                    background: "#2b4026",
                    primary: "#45b82e",
                    secondary: "#1f321b",
                    accent: "#ffd500",
                    "base-100": "#262f40",
                },
            },
        ],
    },
};
