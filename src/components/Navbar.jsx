import { Button } from "@/components/ui/button"
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { useTheme } from "@/context/ThemeContext"
import { cn } from "@/lib/utils"
import {
	Bell,
	ChevronDown,
	LogOut,
	Menu,
	Moon,
	Search,
	Settings,
	Sun,
	User,
} from "lucide-react"
import { Link, useNavigate } from "react-router-dom"

export default function Navbar({
	title,
	className,
	onMenuClick,
	showMenuButton,
}) {
	const navigate = useNavigate()
	const { isDark, toggleTheme } = useTheme()

	const handleLogout = () => {
		localStorage.removeItem("access_token")
		localStorage.removeItem("refresh_token")
		navigate("/signin")
	}

	return (
		<header
			className={cn(
				"h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-4 md:px-6 sticky top-0 z-30 transition-colors duration-200",
				className
			)}
		>
			{/* Left: Menu Button (Mobile) & Title */}
			<div className='flex items-center gap-3'>
				{showMenuButton && (
					<Button
						variant='ghost'
						size='icon'
						onClick={onMenuClick}
						className='lg:hidden text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
					>
						<Menu className='h-5 w-5' />
					</Button>
				)}
				<h1 className='text-xl md:text-2xl font-semibold text-gray-900 dark:text-white'>
					{title}
				</h1>
			</div>

			{/* Center: Search */}
			<div className='hidden md:flex items-center flex-1 max-w-md mx-8'>
				<div className='relative w-full'>
					<Search className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500' />
					<Input
						type='search'
						placeholder='Qidirish...'
						className='pl-10 bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 focus:bg-white dark:focus:bg-gray-600 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500'
					/>
				</div>
			</div>

			{/* Right: Actions */}
			<div className='flex items-center gap-2 md:gap-3'>
				{/* Mobile Search Button */}
				<Button
					variant='ghost'
					size='icon'
					className='md:hidden text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
				>
					<Search className='h-5 w-5' />
				</Button>

				{/* Theme Toggle */}
				<Button
					variant='ghost'
					size='icon'
					onClick={toggleTheme}
					className='text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
				>
					{isDark ? (
						<Sun className='h-5 w-5 text-yellow-500' />
					) : (
						<Moon className='h-5 w-5 text-blue-500' />
					)}
				</Button>

				{/* Notifications */}
				<Button
					variant='ghost'
					size='icon'
					className='relative text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
				>
					<Bell className='h-5 w-5' />
					<span className='absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full' />
				</Button>

				{/* User Menu */}
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button
							variant='ghost'
							className='flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-700 px-2'
						>
							<div className='w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center'>
								<User className='h-4 w-4 text-blue-600 dark:text-blue-400' />
							</div>
							<div className='hidden md:block text-left'>
								<p className='text-sm font-medium text-gray-900 dark:text-white'>
									Admin
								</p>
								<p className='text-xs text-gray-500 dark:text-gray-400'>
									admin@example.com
								</p>
							</div>
							<ChevronDown className='hidden md:block h-4 w-4 text-gray-400 dark:text-gray-500' />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent
						align='end'
						className='w-56 dark:bg-gray-800 dark:border-gray-700'
					>
						<DropdownMenuLabel className='dark:text-white'>
							Mening akkauntim
						</DropdownMenuLabel>
						<DropdownMenuSeparator className='dark:bg-gray-700' />
						<DropdownMenuItem
							asChild
							className='dark:text-gray-300 dark:focus:bg-gray-700 dark:focus:text-white'
						>
							<Link
								to='/user/me'
								className='flex items-center gap-2 cursor-pointer'
							>
								<User className='h-4 w-4' />
								<span>Profil</span>
							</Link>
						</DropdownMenuItem>
						<DropdownMenuItem
							asChild
							className='dark:text-gray-300 dark:focus:bg-gray-700 dark:focus:text-white'
						>
							<Link
								to='/settings'
								className='flex items-center gap-2 cursor-pointer'
							>
								<Settings className='h-4 w-4' />
								<span>Sozlamalar</span>
							</Link>
						</DropdownMenuItem>
						<DropdownMenuSeparator className='dark:bg-gray-700' />
						<DropdownMenuItem
							onClick={handleLogout}
							className='flex items-center gap-2 text-red-500 cursor-pointer dark:focus:bg-gray-700'
						>
							<LogOut className='h-4 w-4' />
							<span>Chiqish</span>
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</div>
		</header>
	)
}
