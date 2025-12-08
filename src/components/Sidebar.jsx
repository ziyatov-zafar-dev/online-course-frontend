import ThemeToggle from "@/components/common/ThemeToggle"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import {
	BookOpen,
	ChevronLeft,
	Home,
	Layers,
	LayoutDashboard,
	ListChecks,
	LogOut,
	Menu,
	Settings,
	Tag,
	User,
	Users,
} from "lucide-react"
import { useState } from "react"
import { Link, useLocation } from "react-router-dom"

const menuItems = [
	{ label: "Dashboard", icon: Home, to: "/dashboard" },
	{ label: "Kurslar", icon: BookOpen, to: "/admin/courses" },
	{ label: "Modullar", icon: Layers, to: "/admin/modules" },
	{ label: "Darslar", icon: LayoutDashboard, to: "/admin/lessons" },
	{ label: "Kategoriyalar", icon: Tag, to: "/admin/categories" },
	{ label: "Ko'nikmalar", icon: ListChecks, to: "/admin/skills" },
	{ label: "Foydalanuvchilar", icon: Users, to: "/admin/users" },
]

const bottomItems = [
	{ label: "Profil", icon: User, to: "/user/me" },
	{ label: "Sozlamalar", icon: Settings, to: "/settings" },
]

export default function Sidebar({ className }) {
	const { pathname } = useLocation()
	const [collapsed, setCollapsed] = useState(false)

	const handleLogout = () => {
		localStorage.removeItem("access_token")
		localStorage.removeItem("refresh_token")
		window.location.href = "/signin"
	}

	return (
		<aside
			className={cn(
				"fixed left-0 top-0 h-screen bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col transition-all duration-300 z-50",
				collapsed ? "w-20" : "w-64",
				className
			)}
		>
			{/* Logo */}
			<div className='flex items-center justify-between h-16 px-4 border-b border-gray-200 dark:border-gray-700'>
				{!collapsed && (
					<Link to='/dashboard' className='flex items-center gap-2'>
						<div className='w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center'>
							<span className='text-white font-bold text-xs'>&lt;/&gt;</span>
						</div>
						<span className='text-xl font-bold text-gray-900 dark:text-white'>
							CodeByZ
						</span>
					</Link>
				)}
				<Button
					variant='ghost'
					size='icon'
					onClick={() => setCollapsed(!collapsed)}
					className='text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
				>
					{collapsed ? (
						<Menu className='h-5 w-5' />
					) : (
						<ChevronLeft className='h-5 w-5' />
					)}
				</Button>
			</div>

			{/* Main Menu */}
			<nav className='flex-1 py-4 px-3 overflow-y-auto'>
				<ul className='space-y-1'>
					{menuItems.map((item) => {
						const isActive =
							pathname === item.to || pathname.startsWith(item.to + "/")
						return (
							<li key={item.to}>
								<Link
									to={item.to}
									className={cn(
										"flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200",
										isActive
											? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
											: "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white"
									)}
								>
									<item.icon
										className={cn(
											"h-5 w-5 flex-shrink-0",
											isActive && "text-blue-600 dark:text-blue-400"
										)}
									/>
									{!collapsed && (
										<span className='font-medium text-sm'>{item.label}</span>
									)}
								</Link>
							</li>
						)
					})}
				</ul>
			</nav>

			{/* Bottom Menu */}
			<div className='py-4 px-3 border-t border-gray-200 dark:border-gray-700'>
				<ul className='space-y-1'>
					{bottomItems.map((item) => {
						const isActive = pathname === item.to
						return (
							<li key={item.to}>
								<Link
									to={item.to}
									className={cn(
										"flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200",
										isActive
											? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
											: "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white"
									)}
								>
									<item.icon className='h-5 w-5 flex-shrink-0' />
									{!collapsed && (
										<span className='font-medium text-sm'>{item.label}</span>
									)}
								</Link>
							</li>
						)
					})}
					{/* Theme Toggle */}
					<li>
						<ThemeToggle collapsed={collapsed} />
					</li>
					<li>
						<button
							onClick={handleLogout}
							className='flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 w-full'
						>
							<LogOut className='h-5 w-5 flex-shrink-0' />
							{!collapsed && (
								<span className='font-medium text-sm'>Chiqish</span>
							)}
						</button>
					</li>
				</ul>
			</div>
		</aside>
	)
}
