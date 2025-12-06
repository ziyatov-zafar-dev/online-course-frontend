import { useState, useEffect } from "react"

export default function ThemeToggle() {
	// State for tracking dark mode
	const [isDark, setIsDark] = useState(false)

	// Check for system theme preference on initial load
	useEffect(() => {
		if (localStorage.getItem("theme") === "dark") {
			document.body.classList.add("dark")
			setIsDark(true)
		} else {
			document.body.classList.remove("dark")
		}
	}, [])

	// Toggle dark mode
	const toggleTheme = () => {
		setIsDark((prevState) => {
			const newState = !prevState
			if (newState) {
				document.body.classList.add("dark")
				localStorage.setItem("theme", "dark")
			} else {
				document.body.classList.remove("dark")
				localStorage.setItem("theme", "light")
			}
			return newState
		})
	}

	return (
		<button
			onClick={toggleTheme}
			className='p-2 bg-gray-200 dark:bg-gray-800 rounded-full'
		>
			{isDark ? "🌙" : "🌞"}
		</button>
	)
}
