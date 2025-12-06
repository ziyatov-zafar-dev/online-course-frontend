/** @type {import('tailwindcss').Config} */
const { inputOtp } = require("input-otp")

module.exports = {
	darkMode: "class",
	content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
	theme: {
		extend: {
			colors: {
				primary: "#6366f1",
				secondary: "#f43f5e",
				darksecondary: "#18232d", // added custom dark secondary color
			},
			fontFamily: {
				sans: ["Inter", "sans-serif"],
			},
		},
	},
	plugins: [
		inputOtp(), // OK — bu input-otp funksionalligini ishlatadi
		require("@tailwindcss/forms"), // OK
		require("tailwindcss-animate"), // shadcn tavsiya qiladi
		require("tailwind-variants/plugin"), // 🔥 ASOSIY QUTQARUVCHI!
	],
}
