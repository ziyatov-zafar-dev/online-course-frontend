import Navbar from "@/components/Navbar"
import Sidebar from "@/components/Sidebar"
import { useEffect, useState } from "react"
import { useLocation } from "react-router-dom"

const pageTitles = {
	"/dashboard": "Dashboard",
	"/admin/courses": "Kurslar",
	"/admin/modules": "Modullar",
	"/admin/lessons": "Darslar",
	"/admin/categories": "Kategoriyalar",
	"/admin/skills": "Ko'nikmalar",
	"/admin/users": "Foydalanuvchilar",
	"/user/me": "Profil",
	"/settings": "Sozlamalar",
}

export default function DashboardLayout({ children, title }) {
	const { pathname } = useLocation()
	const pageTitle = title || pageTitles[pathname] || "Dashboard"
	const [sidebarOpen, setSidebarOpen] = useState(false)
	const [isMobile, setIsMobile] = useState(false)

	// Check screen size
	useEffect(() => {
		const checkMobile = () => {
			setIsMobile(window.innerWidth < 1024)
			if (window.innerWidth >= 1024) {
				setSidebarOpen(false)
			}
		}
		checkMobile()
		window.addEventListener("resize", checkMobile)
		return () => window.removeEventListener("resize", checkMobile)
	}, [])

	// Close sidebar on route change (mobile)
	useEffect(() => {
		if (isMobile) {
			setSidebarOpen(false)
		}
	}, [pathname, isMobile])

	return (
		<div className='min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200'>
			{/* Mobile Overlay */}
			{sidebarOpen && isMobile && (
				<div
					className='fixed inset-0 bg-black/50 z-40 lg:hidden'
					onClick={() => setSidebarOpen(false)}
				/>
			)}

			{/* Sidebar */}
			<Sidebar
				className={
					isMobile ? (sidebarOpen ? "translate-x-0" : "-translate-x-full") : ""
				}
			/>

			{/* Main Content */}
			<div className='lg:ml-64 transition-all duration-300'>
				{/* Navbar */}
				<Navbar
					title={pageTitle}
					onMenuClick={() => setSidebarOpen(!sidebarOpen)}
					showMenuButton={isMobile}
				/>

				{/* Page Content */}
				<main className='p-4 md:p-6'>{children}</main>
			</div>
		</div>
	)
}
