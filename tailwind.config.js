/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
            },
            colors: {
                base: '#0f0f0f',
                surface: '#1a1a1a',
                raised: '#242424',
                border: '#2e2e2e',
                accent: '#7c6af7',
                'accent-hover': '#9585f9',
                muted: '#6b7280',
                subtle: '#374151',
            },
            animation: {
                'fade-in': 'fadeIn 0.15s ease-out',
                'slide-up': 'slideUp 0.2s ease-out',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                slideUp: {
                    '0%': { opacity: '0', transform: 'translateY(8px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
            },
        },
    },
    plugins: [],
}
