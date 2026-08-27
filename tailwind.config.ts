import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eef4ff",
          100: "#d9e6ff",
          200: "#bcd3ff",
          300: "#8eb6ff",
          400: "#598dff",
          500: "#3366ff",
          600: "#1f47f5",
          700: "#1836e1",
          800: "#1a2fb6",
          900: "#1c2f8f",
          950: "#151d57",
        },
        accent: {
          500: "#0ea5a5",
          600: "#0d9488",
        },
        // emas antik: aksen mark, sengaja diredam agar tidak bentrok dengan tinta
        gold: {
          50: "#faf7f0",
          100: "#f2ebda",
          200: "#e4d5b4",
          300: "#d2b985",
          400: "#bf9e5e",
          500: "#a9853f",
          600: "#946f33",
          700: "#78582c",
          800: "#634929",
          900: "#533e25",
        },
        // biru tinta: warna utama mark dan wordmark
        ink: {
          50: "#f2f5f9",
          100: "#e3e9f1",
          200: "#c8d4e4",
          300: "#9db2ce",
          400: "#6c8ab3",
          500: "#4a6c99",
          600: "#39547d",
          700: "#2c4265",
          800: "#1b3a6b",
          900: "#16233f",
          950: "#0e1728",
        },
        // Sistem warna khusus homepage: identitas "research operating system".
        // Terpisah dari brand/ink/gold di atas (dipakai Header/Footer/Logo)
        // supaya redesign homepage tidak menggeser warna navigasi situs.
        research: {
          ink: "#0B1220",
          navy: "#101A33",
          blue: "#3157E8",
          indigo: "#5268FF",
        },
        paper: "#F7F7F3",
        canvas: "#FCFCFA",
        graphite: "#4D5565",
        hairline: "#DCE1E8",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "var(--font-sans)", "sans-serif"],
        // Typografi editorial homepage: Plex untuk UI/produk, Source Serif
        // untuk aksen naskah akademik. Tidak dipakai Header/Footer (masih
        // Inter/Outfit) supaya navigasi situs tidak berubah.
        plex: ["var(--font-plex)", "var(--font-sans)", "sans-serif"],
        editorial: ["var(--font-serif-editorial)", "Georgia", "serif"],
        mono: ["var(--font-mono-data)", "ui-monospace", "SFMono-Regular", "monospace"],
      },
      container: {
        center: true,
        padding: "1rem",
      },
      keyframes: {
        // Aliran halus di sepanjang garis penghubung AiLayer/MethodGraph —
        // dashoffset bergerak, bukan opacity/scale, supaya terasa seperti
        // sinyal mengalir, bukan efek "flashy" umum.
        dash: {
          to: { strokeDashoffset: "-16" },
        },
        fadeIn: {
          from: { opacity: "0", transform: "translateY(2px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        dash: "dash 3s linear infinite",
        fadeIn: "fadeIn 0.25s ease-out",
      },
    },
  },
  plugins: [],
};

export default config;
