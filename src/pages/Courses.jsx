import CourseCard from "@/components/cards/CourseCard"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select"
import { Plus, Search, Filter, Grid, List } from "lucide-react"
import { useState } from "react"
import { Link } from "react-router-dom"

const courses = [
	{
		id: 1,
		title: "React.js asoslari",
		description: "React frameworkini o'rganish va amaliy loyihalar yaratish",
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
		description: "Backend dasturlash asoslari va API yaratish",
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
		description: "Python tilini noldan o'rganish",
		image: "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=400",
		instructor: "Mike Johnson",
		duration: "20 soat",
		lessons: 40,
		students: 234,
		category: "Backend",
		progress: 30,
	},
	{
		id: 4,
		title: "Vue.js Framework",
		description: "Vue.js bilan web ilovalar yaratish",
		image: "https://images.unsplash.com/photo-1537432376149-e84978a99ba7?w=400",
		instructor: "Sarah Wilson",
		duration: "14 soat",
		lessons: 28,
		students: 112,
		category: "Frontend",
	},
	{
		id: 5,
		title: "PostgreSQL Database",
		description: "Ma'lumotlar bazasi bilan ishlash",
		image: "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=400",
		instructor: "Alex Brown",
		duration: "10 soat",
		lessons: 20,
		students: 78,
		category: "Database",
	},
	{
		id: 6,
		title: "Docker & Kubernetes",
		description: "Containerization va orchestration",
		image: "https://images.unsplash.com/photo-1605745341112-85968b19335b?w=400",
		instructor: "Chris Lee",
		duration: "18 soat",
		lessons: 36,
		students: 67,
		category: "DevOps",
	},
]

const categories = ["Barchasi", "Frontend", "Backend", "Database", "DevOps"]

export default function Courses() {
	const [viewMode, setViewMode] = useState("grid")
	const [searchQuery, setSearchQuery] = useState("")
	const [selectedCategory, setSelectedCategory] = useState("Barchasi")

	const filteredCourses = courses.filter((course) => {
		const matchesSearch = course.title
			.toLowerCase()
			.includes(searchQuery.toLowerCase())
		const matchesCategory =
			selectedCategory === "Barchasi" || course.category === selectedCategory
		return matchesSearch && matchesCategory
	})

	return (
		<div className='space-y-6'>
			{/* Header */}
			<div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
				<div>
					<h1 className='text-2xl font-semibold text-gray-900'>Kurslar</h1>
					<p className='text-gray-500'>Barcha kurslarni boshqaring</p>
				</div>
				<Link to='/admin/courses/create'>
					<Button className='bg-indigo-600 hover:bg-indigo-700'>
						<Plus className='h-4 w-4 mr-2' />
						Yangi kurs
					</Button>
				</Link>
			</div>

			{/* Filters */}
			<div className='bg-white rounded-xl p-4 shadow-sm'>
				<div className='flex flex-col md:flex-row gap-4'>
					{/* Search */}
					<div className='relative flex-1'>
						<Search className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400' />
						<Input
							type='search'
							placeholder='Kurs nomi bo'yicha qidirish...'
							className='pl-10'
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
						/>
					</div>

					{/* Category Filter */}
					<Select value={selectedCategory} onValueChange={setSelectedCategory}>
						<SelectTrigger className='w-full md:w-48'>
							<Filter className='h-4 w-4 mr-2' />
							<SelectValue placeholder='Kategoriya' />
						</SelectTrigger>
						<SelectContent>
							{categories.map((cat) => (
								<SelectItem key={cat} value={cat}>
									{cat}
								</SelectItem>
							))}
						</SelectContent>
					</Select>

					{/* View Toggle */}
					<div className='flex items-center gap-1 bg-gray-100 rounded-lg p-1'>
						<Button
							variant={viewMode === "grid" ? "default" : "ghost"}
							size='icon'
							onClick={() => setViewMode("grid")}
							className={viewMode === "grid" ? "bg-white shadow-sm" : ""}
						>
							<Grid className='h-4 w-4' />
						</Button>
						<Button
							variant={viewMode === "list" ? "default" : "ghost"}
							size='icon'
							onClick={() => setViewMode("list")}
							className={viewMode === "list" ? "bg-white shadow-sm" : ""}
						>
							<List className='h-4 w-4' />
						</Button>
					</div>
				</div>
			</div>

			{/* Results Count */}
			<p className='text-sm text-gray-500'>
				{filteredCourses.length} ta kurs topildi
			</p>

			{/* Courses Grid */}
			<div
				className={
					viewMode === "grid"
						? "grid gap-6 md:grid-cols-2 lg:grid-cols-3"
						: "space-y-4"
				}
			>
				{filteredCourses.map((course) => (
					<CourseCard key={course.id} {...course} />
				))}
			</div>

			{/* Empty State */}
			{filteredCourses.length === 0 && (
				<div className='text-center py-12'>
					<div className='w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4'>
						<Search className='h-8 w-8 text-gray-400' />
					</div>
					<h3 className='text-lg font-medium text-gray-900 mb-2'>
						Kurs topilmadi
					</h3>
					<p className='text-gray-500'>
						Boshqa kalit so'z bilan qidirib ko'ring
					</p>
				</div>
			)}
		</div>
	)
}
