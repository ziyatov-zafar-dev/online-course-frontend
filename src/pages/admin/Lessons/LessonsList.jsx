import { getCourses } from "@/api/courses"
import { deleteLesson, getLessonsByModule, restoreLesson } from "@/api/lessons"
import { getModulesByCourse } from "@/api/modules"
import { Button } from "@/components/ui/button"
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select"
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table"
import {
	BookOpen,
	Clock,
	Edit,
	FileText,
	Loader2,
	Plus,
	Search,
	Trash,
	Video,
} from "lucide-react"
import { useEffect, useState } from "react"
import { Link, useSearchParams } from "react-router-dom"
import { toast } from "sonner"

export default function LessonsList() {
	const [searchParams, setSearchParams] = useSearchParams()
	const [lessons, setLessons] = useState([])
	const [courses, setCourses] = useState([])
	const [modules, setModules] = useState([])
	const [loading, setLoading] = useState(false)
	const [search, setSearch] = useState("")
	const [selectedCourse, setSelectedCourse] = useState(
		searchParams.get("courseId") || ""
	)
	const [selectedModule, setSelectedModule] = useState(
		searchParams.get("moduleId") || ""
	)
	const [deleteId, setDeleteId] = useState(null)
	const [deleting, setDeleting] = useState(false)
	const [coursesLoading, setCoursesLoading] = useState(true)

	// Fetch courses on mount
	useEffect(() => {
		fetchCourses()
	}, [])

	// Fetch modules when course changes
	useEffect(() => {
		if (selectedCourse) {
			fetchModules()
			setSelectedModule("")
			setLessons([])
		} else {
			setModules([])
			setLessons([])
		}
	}, [selectedCourse])

	// Fetch lessons when module changes
	useEffect(() => {
		if (selectedModule) {
			fetchLessons()
		} else {
			setLessons([])
		}
	}, [selectedModule])

	const fetchCourses = async () => {
		setCoursesLoading(true)
		try {
			const res = await getCourses()
			setCourses(res.data?.data || res.data?.items || res.data || [])
		} catch (err) {
			console.error("Failed to fetch courses:", err)
		} finally {
			setCoursesLoading(false)
		}
	}

	const fetchModules = async () => {
		try {
			const res = await getModulesByCourse(selectedCourse)
			setModules(res.data?.data || res.data || [])
		} catch (err) {
			console.error("Failed to fetch modules:", err)
		}
	}

	const fetchLessons = async () => {
		if (!selectedModule) return
		setLoading(true)
		try {
			const res = await getLessonsByModule(selectedModule)
			setLessons(res.data?.data || res.data || [])
		} catch (err) {
			toast.error("Darslarni yuklashda xatolik")
			console.error(err)
		} finally {
			setLoading(false)
		}
	}

	const handleCourseChange = (courseId) => {
		setSelectedCourse(courseId)
		setSearchParams({ courseId })
	}

	const handleModuleChange = (moduleId) => {
		setSelectedModule(moduleId)
		setSearchParams({ courseId: selectedCourse, moduleId })
	}

	const handleDelete = async () => {
		setDeleting(true)
		try {
			await deleteLesson(deleteId)
			toast.success("Dars o'chirildi")
			setLessons(lessons.filter((l) => l.id !== deleteId))
			setDeleteId(null)
		} catch {
			toast.error("O'chirishda xatolik")
		} finally {
			setDeleting(false)
		}
	}

	const handleRestore = async (lessonId) => {
		try {
			await restoreLesson(lessonId)
			toast.success("Dars tiklandi")
			fetchLessons()
		} catch {
			toast.error("Tiklashda xatolik")
		}
	}

	const filteredLessons = lessons.filter(
		(lesson) =>
			lesson.title?.toLowerCase().includes(search.toLowerCase()) ||
			lesson.name?.toLowerCase().includes(search.toLowerCase())
	)

	const getLessonTypeIcon = (type) => {
		switch (type) {
			case "video":
				return <Video className='h-4 w-4 text-blue-500' />
			case "text":
				return <FileText className='h-4 w-4 text-green-500' />
			default:
				return <BookOpen className='h-4 w-4 text-gray-500' />
		}
	}

	return (
		<div className='space-y-6'>
			{/* Header */}
			<div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
				<div>
					<h1 className='text-2xl font-semibold text-gray-900 dark:text-white'>
						Darslar
					</h1>
					<p className='text-sm text-gray-500 dark:text-gray-400'>
						Modullarga tegishli darslarni boshqaring
					</p>
				</div>
				{selectedModule && (
					<Link
						to={`/admin/lessons/create?courseId=${selectedCourse}&moduleId=${selectedModule}`}
					>
						<Button className='bg-blue-600 hover:bg-blue-700'>
							<Plus className='h-4 w-4 mr-2' />
							Yangi dars
						</Button>
					</Link>
				)}
			</div>

			{/* Filters */}
			<div className='bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm'>
				<div className='flex flex-col md:flex-row gap-4'>
					{/* Course Select */}
					<div className='w-full md:w-64'>
						<Select value={selectedCourse} onValueChange={handleCourseChange}>
							<SelectTrigger className='dark:bg-gray-700 dark:border-gray-600 dark:text-white'>
								<SelectValue placeholder='Kursni tanlang' />
							</SelectTrigger>
							<SelectContent className='dark:bg-gray-800 dark:border-gray-700'>
								{courses.map((course) => (
									<SelectItem
										key={course.id || course.courseId}
										value={String(course.id || course.courseId)}
										className='dark:text-white dark:focus:bg-gray-700'
									>
										{course.title || course.name}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>

					{/* Module Select */}
					<div className='w-full md:w-64'>
						<Select
							value={selectedModule}
							onValueChange={handleModuleChange}
							disabled={!selectedCourse}
						>
							<SelectTrigger className='dark:bg-gray-700 dark:border-gray-600 dark:text-white'>
								<SelectValue
									placeholder={
										selectedCourse ? "Modulni tanlang" : "Avval kurs tanlang"
									}
								/>
							</SelectTrigger>
							<SelectContent className='dark:bg-gray-800 dark:border-gray-700'>
								{modules.map((module) => (
									<SelectItem
										key={module.id}
										value={String(module.id)}
										className='dark:text-white dark:focus:bg-gray-700'
									>
										{module.name}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>

					{/* Search */}
					{selectedModule && (
						<div className='relative flex-1'>
							<Search className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400' />
							<Input
								type='search'
								placeholder="Dars nomi bo'yicha qidirish..."
								className='pl-10 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400'
								value={search}
								onChange={(e) => setSearch(e.target.value)}
							/>
						</div>
					)}
				</div>
			</div>

			{/* Content */}
			{coursesLoading ? (
				<div className='bg-white dark:bg-gray-800 rounded-xl shadow-sm p-12 text-center'>
					<Loader2 className='h-12 w-12 text-blue-600 animate-spin mx-auto mb-4' />
					<h3 className='text-lg font-medium text-gray-900 dark:text-white mb-2'>
						Kurslar yuklanmoqda...
					</h3>
				</div>
			) : courses.length === 0 ? (
				<div className='bg-white dark:bg-gray-800 rounded-xl shadow-sm p-12 text-center'>
					<BookOpen className='h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-4' />
					<h3 className='text-lg font-medium text-gray-900 dark:text-white mb-2'>
						Kurslar mavjud emas
					</h3>
					<p className='text-gray-500 dark:text-gray-400 mb-4'>
						Darslarni qo'shish uchun avval kurs yarating
					</p>
					<Link to='/admin/courses/create'>
						<Button className='bg-blue-600 hover:bg-blue-700'>
							<Plus className='h-4 w-4 mr-2' />
							Kurs yaratish
						</Button>
					</Link>
				</div>
			) : !selectedCourse ? (
				<div className='bg-white dark:bg-gray-800 rounded-xl shadow-sm p-12 text-center'>
					<BookOpen className='h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-4' />
					<h3 className='text-lg font-medium text-gray-900 dark:text-white mb-2'>
						Kursni tanlang
					</h3>
					<p className='text-gray-500 dark:text-gray-400'>
						Darslarni ko'rish uchun avval kurs tanlang
					</p>
				</div>
			) : !selectedModule ? (
				<div className='bg-white dark:bg-gray-800 rounded-xl shadow-sm p-12 text-center'>
					<BookOpen className='h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-4' />
					<h3 className='text-lg font-medium text-gray-900 dark:text-white mb-2'>
						{modules.length === 0 ? "Modullar mavjud emas" : "Modulni tanlang"}
					</h3>
					<p className='text-gray-500 dark:text-gray-400 mb-4'>
						{modules.length === 0
							? "Darslarni qo'shish uchun avval modul yarating"
							: "Darslarni ko'rish uchun modulni tanlang"}
					</p>
					{modules.length === 0 && (
						<Link to={`/admin/modules/create?courseId=${selectedCourse}`}>
							<Button className='bg-blue-600 hover:bg-blue-700'>
								<Plus className='h-4 w-4 mr-2' />
								Modul yaratish
							</Button>
						</Link>
					)}
				</div>
			) : (
				<div className='bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden'>
					{loading ? (
						<div className='flex items-center justify-center py-12'>
							<Loader2 className='h-8 w-8 text-blue-600 animate-spin' />
						</div>
					) : filteredLessons.length === 0 ? (
						<div className='text-center py-12'>
							<BookOpen className='h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-4' />
							<h3 className='text-lg font-medium text-gray-900 dark:text-white mb-2'>
								Dars topilmadi
							</h3>
							<p className='text-gray-500 dark:text-gray-400 mb-4'>
								Bu modulda hozircha dars mavjud emas
							</p>
							<Link
								to={`/admin/lessons/create?courseId=${selectedCourse}&moduleId=${selectedModule}`}
							>
								<Button className='bg-blue-600 hover:bg-blue-700'>
									<Plus className='h-4 w-4 mr-2' />
									Birinchi darsni qo'shing
								</Button>
							</Link>
						</div>
					) : (
						<Table>
							<TableHeader>
								<TableRow className='dark:border-gray-700'>
									<TableHead className='dark:text-gray-300'>
										Dars nomi
									</TableHead>
									<TableHead className='dark:text-gray-300'>Turi</TableHead>
									<TableHead className='dark:text-gray-300'>Tartib</TableHead>
									<TableHead className='dark:text-gray-300'>
										Davomiyligi
									</TableHead>
									<TableHead className='dark:text-gray-300'>
										Yaratilgan
									</TableHead>
									<TableHead className='text-right dark:text-gray-300'>
										Amallar
									</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{filteredLessons.map((lesson) => (
									<TableRow
										key={lesson.id}
										className='dark:border-gray-700 dark:hover:bg-gray-700/50'
									>
										<TableCell>
											<div>
												<p className='font-medium dark:text-white'>
													{lesson.title || lesson.name}
												</p>
												{lesson.description && (
													<p className='text-sm text-gray-500 dark:text-gray-400 truncate max-w-xs'>
														{lesson.description}
													</p>
												)}
											</div>
										</TableCell>
										<TableCell>
											<div className='flex items-center gap-2 dark:text-gray-300'>
												{getLessonTypeIcon(lesson.type)}
												<span className='capitalize'>
													{lesson.type || "Dars"}
												</span>
											</div>
										</TableCell>
										<TableCell>
											<span className='px-2 py-1 text-xs rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'>
												#{lesson.orderNumber || lesson.order || 1}
											</span>
										</TableCell>
										<TableCell>
											<div className='flex items-center gap-1 text-gray-500 dark:text-gray-400'>
												<Clock className='h-4 w-4' />
												<span>{lesson.duration || "-"}</span>
											</div>
										</TableCell>
										<TableCell className='text-gray-500 dark:text-gray-400'>
											{lesson.created
												? new Date(lesson.created).toLocaleDateString("uz-UZ")
												: "-"}
										</TableCell>
										<TableCell className='text-right'>
											<div className='flex items-center justify-end gap-2'>
												<Link
													to={`/admin/lessons/edit/${lesson.id}?courseId=${selectedCourse}&moduleId=${selectedModule}`}
												>
													<Button
														size='sm'
														variant='outline'
														className='dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700'
													>
														<Edit className='h-4 w-4' />
													</Button>
												</Link>
												<Button
													size='sm'
													variant='outline'
													className='text-red-500 hover:text-red-700 hover:bg-red-50 dark:border-gray-600 dark:hover:bg-red-900/30'
													onClick={() => setDeleteId(lesson.id)}
												>
													<Trash className='h-4 w-4' />
												</Button>
											</div>
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					)}
				</div>
			)}

			{/* Delete Confirmation Dialog */}
			<Dialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
				<DialogContent className='dark:bg-gray-800 dark:border-gray-700'>
					<DialogHeader>
						<DialogTitle className='dark:text-white'>
							Darsni o'chirish
						</DialogTitle>
						<DialogDescription className='dark:text-gray-400'>
							Haqiqatan ham bu darsni o'chirmoqchimisiz? Dars soft-delete
							qilinadi va keyinchalik tiklanishi mumkin.
						</DialogDescription>
					</DialogHeader>
					<DialogFooter>
						<Button
							variant='outline'
							onClick={() => setDeleteId(null)}
							className='dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700'
						>
							Bekor qilish
						</Button>
						<Button
							variant='destructive'
							onClick={handleDelete}
							disabled={deleting}
						>
							{deleting ? (
								<>
									<Loader2 className='h-4 w-4 mr-2 animate-spin' />
									O'chirilmoqda...
								</>
							) : (
								"O'chirish"
							)}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	)
}
