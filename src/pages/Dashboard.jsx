import CourseCard from "@/components/cards/CourseCard"
import InfoCard from "@/components/cards/InfoCard"
import StatCard from "@/components/cards/StatCard"
import { Button } from "@/components/ui/button"
import {
	ArrowRight,
	Award,
	Book,
	Layers,
	LayoutDashboard,
	Target,
	TrendingUp,
	Users,
} from "lucide-react"
import { Link } from "react-router-dom"

const stats = [
	{
		title: "Jami foydalanuvchilar",
		value: "1,234",
		icon: Users,
		trend: "12%",
		trendUp: true,
	},
	{
		title: "Jami kurslar",
		value: "56",
		icon: Book,
		trend: "8%",
		trendUp: true,
	},
	{
		title: "Jami darslar",
		value: "432",
		icon: LayoutDashboard,
		trend: "18%",
		trendUp: true,
	},
	{
		title: "Faol modullar",
		value: "24",
		icon: Layers,
		trend: "5%",
		trendUp: false,
	},
]

const recentCourses = [
	{
		id: 1,
		title: "React.js asoslari",
		description: "React frameworkini o'rganish",
		image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400",
		instructor: "John Doe",
		duration: "12 soat",
		lessons: 24,
		students: 156,
		category: "Frontend",
		progress: 75,
	},
	{
		id: 2,
		title: "Node.js Backend",
		description: "Backend dasturlash asoslari",
		image: "https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=400",
		instructor: "Jane Smith",
		duration: "15 soat",
		lessons: 30,
		students: 89,
		category: "Backend",
		progress: 45,
	},
	{
		id: 3,
		title: "Python dasturlash",
		description: "Python tilini o'rganish",
		image: "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=400",
		instructor: "Mike Johnson",
		duration: "20 soat",
		lessons: 40,
		students: 234,
		category: "Backend",
		progress: 30,
	},
]

const quickActions = [
	{
		title: "Yangi kurs qo'shish",
		description: "Platforma uchun yangi kurs yarating",
		icon: Book,
		link: "/admin/courses",
		variant: "primary",
	},
	{
		title: "Foydalanuvchilar",
		description: "Barcha foydalanuvchilarni boshqaring",
		icon: Users,
		link: "/admin/users",
		variant: "secondary",
	},
	{
		title: "Statistika",
		description: "Platformangiz statistikasini ko'ring",
		icon: TrendingUp,
		link: "/dashboard",
		variant: "success",
	},
]

const Dashboard = () => {
	return (
		<div className='space-y-8'>
			{/* Welcome Section */}
			<div className='bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-700 dark:to-blue-800 rounded-2xl p-8 text-white'>
				<div className='flex items-center justify-between'>
					<div>
						<h1 className='text-3xl font-bold mb-2'>Xush kelibsiz! 👋</h1>
						<p className='text-blue-100 text-lg'>
							Bugungi kun uchun platformangizni boshqaring va rivojlantiring.
						</p>
					</div>
					<div className='hidden md:flex items-center gap-4'>
						<div className='text-right'>
							<p className='text-blue-200 text-sm'>Bugungi sana</p>
							<p className='text-xl font-semibold'>
								{new Date().toLocaleDateString("uz-UZ", {
									weekday: "long",
									year: "numeric",
									month: "long",
									day: "numeric",
								})}
							</p>
						</div>
					</div>
				</div>
			</div>

			{/* Stats Grid */}
			<div className='grid gap-6 md:grid-cols-2 lg:grid-cols-4'>
				{stats.map((stat) => (
					<StatCard key={stat.title} {...stat} />
				))}
			</div>

			{/* Quick Actions */}
			<div>
				<div className='flex items-center justify-between mb-6'>
					<h2 className='text-xl font-semibold text-gray-900 dark:text-white'>
						Tezkor harakatlar
					</h2>
				</div>
				<div className='grid gap-6 md:grid-cols-3'>
					{quickActions.map((action) => (
						<InfoCard key={action.title} {...action} />
					))}
				</div>
			</div>

			{/* Recent Courses */}
			<div>
				<div className='flex items-center justify-between mb-6'>
					<h2 className='text-xl font-semibold text-gray-900 dark:text-white'>
						So'nggi kurslar
					</h2>
					<Link to='/admin/courses'>
						<Button
							variant='ghost'
							className='text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300'
						>
							Barchasini ko'rish
							<ArrowRight className='h-4 w-4 ml-1' />
						</Button>
					</Link>
				</div>
				<div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
					{recentCourses.map((course) => (
						<CourseCard key={course.id} {...course} />
					))}
				</div>
			</div>

			{/* Activity & Progress Section */}
			<div className='grid gap-6 lg:grid-cols-2'>
				{/* Recent Activity */}
				<div className='bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm'>
					<h3 className='text-lg font-semibold text-gray-900 dark:text-white mb-4'>
						So'nggi faoliyat
					</h3>
					<div className='space-y-4'>
						{[
							{
								icon: Users,
								text: "Yangi foydalanuvchi ro'yxatdan o'tdi",
								time: "5 daqiqa oldin",
								color:
									"bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400",
							},
							{
								icon: Book,
								text: "Yangi kurs qo'shildi",
								time: "1 soat oldin",
								color:
									"bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400",
							},
							{
								icon: Award,
								text: "Foydalanuvchi sertifikat oldi",
								time: "2 soat oldin",
								color:
									"bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400",
							},
							{
								icon: Target,
								text: "Yangi modul yaratildi",
								time: "3 soat oldin",
								color:
									"bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400",
							},
						].map((activity, i) => (
							<div
								key={i}
								className='flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors'
							>
								<div className={`p-2 rounded-lg ${activity.color}`}>
									<activity.icon className='h-4 w-4' />
								</div>
								<div className='flex-1'>
									<p className='text-sm font-medium text-gray-900 dark:text-white'>
										{activity.text}
									</p>
									<p className='text-xs text-gray-500 dark:text-gray-400'>
										{activity.time}
									</p>
								</div>
							</div>
						))}
					</div>
				</div>

				{/* Progress Overview */}
				<div className='bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm'>
					<h3 className='text-lg font-semibold text-gray-900 dark:text-white mb-4'>
						Haftalik progress
					</h3>
					<div className='space-y-4'>
						{[
							{
								label: "Yangi foydalanuvchilar",
								value: 75,
								color: "bg-blue-600",
							},
							{ label: "Tugatilgan kurslar", value: 60, color: "bg-green-500" },
							{ label: "Faol darslar", value: 85, color: "bg-blue-500" },
							{ label: "O'rtacha baho", value: 92, color: "bg-yellow-500" },
						].map((item, i) => (
							<div key={i}>
								<div className='flex items-center justify-between mb-2'>
									<span className='text-sm font-medium text-gray-600 dark:text-gray-300'>
										{item.label}
									</span>
									<span className='text-sm font-bold text-gray-900 dark:text-white'>
										{item.value}%
									</span>
								</div>
								<div className='h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden'>
									<div
										className={`h-full ${item.color} rounded-full transition-all duration-500`}
										style={{ width: `${item.value}%` }}
									/>
								</div>
							</div>
						))}
					</div>
				</div>
			</div>
		</div>
	)
}

export default Dashboard
