import { useTheme } from "@/context/ThemeContext"
import { Moon, Sun } from "lucide-react"

export default function ThemeToggle({ collapsed = false }) {
	const { isDark, toggleTheme } = useTheme()

	return (
		<button
			onClick={toggleTheme}
			className='flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 w-full'
		>
			{isDark ? (
				<Sun className='h-5 w-5 flex-shrink-0 text-yellow-500' />
			) : (
				<Moon className='h-5 w-5 flex-shrink-0 text-blue-500' />
			)}
			{!collapsed && (
				<span className='font-medium text-sm'>
					{isDark ? "Yorug' rejim" : "Qorong'u rejim"}
				</span>
			)}
		</button>
	)
}
