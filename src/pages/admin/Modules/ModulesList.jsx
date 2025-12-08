import { getCourses } from "@/api/courses"
import {
	deleteModule,
	getModulesByCourse,
	getSoftDeletedModules,
	hardDeleteModule,
	restoreModule,
} from "@/api/modules"
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
	Archive,
	BookOpen,
	Edit,
	Layers,
	Loader2,
	Plus,
	RotateCcw,
	Search,
	Trash,
	Trash2,
} from "lucide-react"
import { useEffect, useState } from "react"
import { Link, useSearchParams } from "react-router-dom"
import { toast } from "sonner"

export default function ModulesList() {
	const [searchParams, setSearchParams] = useSearchParams()
	const [modules, setModules] = useState([])
	const [deletedModules, setDeletedModules] = useState([])
	const [courses, setCourses] = useState([])
	const [loading, setLoading] = useState(false)
	const [search, setSearch] = useState("")
	const [selectedCourse, setSelectedCourse] = useState(
		searchParams.get("courseId") || ""
	)
	const [activeTab, setActiveTab] = useState("active") // "active" or "deleted"
	const [deleteId, setDeleteId] = useState(null)
	const [hardDeleteId, setHardDeleteId] = useState(null)
	const [deleting, setDeleting] = useState(false)
	const [restoring, setRestoring] = useState(null)

	const [coursesLoading, setCoursesLoading] = useState(true)

	// Fetch courses for filter
	useEffect(() => {
		fetchCourses()
	}, [])

	// Fetch modules when course or tab changes
	useEffect(() => {
		if (selectedCourse) {
			if (activeTab === "active") {
				fetchModules()
			} else {
				fetchDeletedModules()
			}
		} else {
			setModules([])
			setDeletedModules([])
		}
	}, [selectedCourse, activeTab])

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
		if (!selectedCourse) return
		setLoading(true)
		try {
			const res = await getModulesByCourse(selectedCourse)
			setModules(res.data?.data || res.data || [])
		} catch (err) {
			toast.error("Modullarni yuklashda xatolik")
			console.error(err)
		} finally {
			setLoading(false)
		}
	}

	const fetchDeletedModules = async () => {
		if (!selectedCourse) return
		setLoading(true)
		try {
			const res = await getSoftDeletedModules(selectedCourse)
			setDeletedModules(res.data?.data || res.data || [])
		} catch (err) {
			toast.error("O'chirilgan modullarni yuklashda xatolik")
			console.error(err)
		} finally {
			setLoading(false)
		}
	}

	const handleCourseChange = (courseId) => {
		setSelectedCourse(courseId)
		setSearchParams({ courseId })
	}

	const handleDelete = async () => {
		setDeleting(true)
		try {
			await deleteModule(deleteId)
			toast.success("Modul o'chirildi")
			setModules(modules.filter((m) => m.id !== deleteId))
			setDeleteId(null)
		} catch {
			toast.error("O'chirishda xatolik")
		} finally {
			setDeleting(false)
		}
	}

	const handleHardDelete = async () => {
		setDeleting(true)
		try {
			await hardDeleteModule(hardDeleteId)
			toast.success("Modul butunlay o'chirildi")
			setDeletedModules(deletedModules.filter((m) => m.id !== hardDeleteId))
			setHardDeleteId(null)
		} catch {
			toast.error("O'chirishda xatolik")
		} finally {
			setDeleting(false)
		}
	}

	const handleRestore = async (moduleId) => {
		setRestoring(moduleId)
		try {
			await restoreModule(moduleId)
			toast.success("Modul tiklandi")
			setDeletedModules(deletedModules.filter((m) => m.id !== moduleId))
		} catch {
			toast.error("Tiklashda xatolik")
		} finally {
			setRestoring(null)
		}
	}

	const filteredModules = modules.filter((module) =>
		module.name?.toLowerCase().includes(search.toLowerCase())
	)

	const filteredDeletedModules = deletedModules.filter((module) =>
		module.name?.toLowerCase().includes(search.toLowerCase())
	)

	return (
		<div className='space-y-6'>
			{/* Header */}
			<div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
				<div>
					<h1 className='text-2xl font-semibold text-gray-900 dark:text-white'>
						Modullar
					</h1>
					<p className='text-sm text-gray-500 dark:text-gray-400'>
						Kursga tegishli modullarni boshqaring
					</p>
				</div>
				{selectedCourse && activeTab === "active" && (
					<Link to={`/admin/modules/create?courseId=${selectedCourse}`}>
						<Button className='bg-blue-600 hover:bg-blue-700'>
							<Plus className='h-4 w-4 mr-2' />
							Yangi modul
						</Button>
					</Link>
				)}
			</div>

			{/* Filters */}
			<div className='bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm'>
				<div className='flex flex-col md:flex-row gap-4'>
					{/* Course Select */}
					<div className='w-full md:w-72'>
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

					{/* Search */}
					{selectedCourse && (
						<div className='relative flex-1'>
							<Search className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400' />
							<Input
								type='search'
								placeholder="Modul nomi bo'yicha qidirish..."
								className='pl-10 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400'
								value={search}
								onChange={(e) => setSearch(e.target.value)}
							/>
						</div>
					)}
				</div>
			</div>

			{/* Tabs */}
			{selectedCourse && (
				<div className='flex gap-2'>
					<Button
						variant={activeTab === "active" ? "default" : "outline"}
						onClick={() => setActiveTab("active")}
						className={
							activeTab === "active"
								? "bg-blue-600 hover:bg-blue-700"
								: "dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
						}
					>
						<Layers className='h-4 w-4 mr-2' />
						Faol modullar
						{modules.length > 0 && (
							<span className='ml-2 px-2 py-0.5 text-xs rounded-full bg-white/20'>
								{modules.length}
							</span>
						)}
					</Button>
					<Button
						variant={activeTab === "deleted" ? "default" : "outline"}
						onClick={() => setActiveTab("deleted")}
						className={
							activeTab === "deleted"
								? "bg-red-600 hover:bg-red-700"
								: "dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
						}
					>
						<Archive className='h-4 w-4 mr-2' />
						O'chirilgan
						{deletedModules.length > 0 && (
							<span className='ml-2 px-2 py-0.5 text-xs rounded-full bg-white/20'>
								{deletedModules.length}
							</span>
						)}
					</Button>
				</div>
			)}

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
						Modullarni qo'shish uchun avval kurs yarating
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
					<Layers className='h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-4' />
					<h3 className='text-lg font-medium text-gray-900 dark:text-white mb-2'>
						Kursni tanlang
					</h3>
					<p className='text-gray-500 dark:text-gray-400'>
						Modullarni ko'rish uchun yuqoridagi ro'yxatdan kurs tanlang
					</p>
				</div>
			) : activeTab === "active" ? (
				/* Active Modules Table */
				<div className='bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden'>
					{loading ? (
						<div className='flex items-center justify-center py-12'>
							<Loader2 className='h-8 w-8 text-blue-600 animate-spin' />
						</div>
					) : filteredModules.length === 0 ? (
						<div className='text-center py-12'>
							<Layers className='h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-4' />
							<h3 className='text-lg font-medium text-gray-900 dark:text-white mb-2'>
								Modul topilmadi
							</h3>
							<p className='text-gray-500 dark:text-gray-400 mb-4'>
								Bu kursda hozircha modul mavjud emas
							</p>
							<Link to={`/admin/modules/create?courseId=${selectedCourse}`}>
								<Button className='bg-blue-600 hover:bg-blue-700'>
									<Plus className='h-4 w-4 mr-2' />
									Birinchi modulni qo'shing
								</Button>
							</Link>
						</div>
					) : (
						<Table>
							<TableHeader>
								<TableRow className='dark:border-gray-700'>
									<TableHead className='dark:text-gray-300'>
										Modul nomi
									</TableHead>
									<TableHead className='dark:text-gray-300'>Slug</TableHead>
									<TableHead className='dark:text-gray-300'>Tartib</TableHead>
									<TableHead className='dark:text-gray-300'>Darslar</TableHead>
									<TableHead className='dark:text-gray-300'>
										Yaratilgan
									</TableHead>
									<TableHead className='text-right dark:text-gray-300'>
										Amallar
									</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{filteredModules.map((module) => (
									<TableRow
										key={module.id}
										className='dark:border-gray-700 dark:hover:bg-gray-700/50'
									>
										<TableCell>
											<div>
												<p className='font-medium dark:text-white'>
													{module.name}
												</p>
												{module.description && (
													<p className='text-sm text-gray-500 dark:text-gray-400 truncate max-w-xs'>
														{module.description}
													</p>
												)}
											</div>
										</TableCell>
										<TableCell>
											<code className='text-sm bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded dark:text-gray-300'>
												{module.slug || "-"}
											</code>
										</TableCell>
										<TableCell>
											<span className='px-2 py-1 text-xs rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'>
												#{module.orderNumber}
											</span>
										</TableCell>
										<TableCell>
											<div className='flex items-center gap-1 dark:text-gray-300'>
												<BookOpen className='h-4 w-4 text-gray-400' />
												<span>{module.lessons?.length || 0}</span>
											</div>
										</TableCell>
										<TableCell className='text-gray-500 dark:text-gray-400'>
											{module.created
												? new Date(module.created).toLocaleDateString("uz-UZ")
												: "-"}
										</TableCell>
										<TableCell className='text-right'>
											<div className='flex items-center justify-end gap-2'>
												<Link
													to={`/admin/modules/edit/${module.id}?courseId=${selectedCourse}`}
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
													onClick={() => setDeleteId(module.id)}
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
			) : (
				/* Deleted Modules Table */
				<div className='bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden'>
					{loading ? (
						<div className='flex items-center justify-center py-12'>
							<Loader2 className='h-8 w-8 text-blue-600 animate-spin' />
						</div>
					) : filteredDeletedModules.length === 0 ? (
						<div className='text-center py-12'>
							<Archive className='h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-4' />
							<h3 className='text-lg font-medium text-gray-900 dark:text-white mb-2'>
								O'chirilgan modul yo'q
							</h3>
							<p className='text-gray-500 dark:text-gray-400'>
								Bu kursda o'chirilgan modullar mavjud emas
							</p>
						</div>
					) : (
						<Table>
							<TableHeader>
								<TableRow className='dark:border-gray-700'>
									<TableHead className='dark:text-gray-300'>
										Modul nomi
									</TableHead>
									<TableHead className='dark:text-gray-300'>Slug</TableHead>
									<TableHead className='dark:text-gray-300'>Tartib</TableHead>
									<TableHead className='dark:text-gray-300'>Darslar</TableHead>
									<TableHead className='dark:text-gray-300'>
										O'chirilgan
									</TableHead>
									<TableHead className='text-right dark:text-gray-300'>
										Amallar
									</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{filteredDeletedModules.map((module) => (
									<TableRow
										key={module.id}
										className='bg-red-50/30 dark:bg-red-900/10 dark:border-gray-700'
									>
										<TableCell>
											<div>
												<p className='font-medium text-gray-600 dark:text-gray-400'>
													{module.name}
												</p>
												{module.description && (
													<p className='text-sm text-gray-400 dark:text-gray-500 truncate max-w-xs'>
														{module.description}
													</p>
												)}
											</div>
										</TableCell>
										<TableCell>
											<code className='text-sm bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-gray-500 dark:text-gray-400'>
												{module.slug || "-"}
											</code>
										</TableCell>
										<TableCell>
											<span className='px-2 py-1 text-xs rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'>
												#{module.orderNumber}
											</span>
										</TableCell>
										<TableCell>
											<div className='flex items-center gap-1 text-gray-500 dark:text-gray-400'>
												<BookOpen className='h-4 w-4' />
												<span>{module.lessons?.length || 0}</span>
											</div>
										</TableCell>
										<TableCell className='text-gray-400 dark:text-gray-500'>
											{module.updated
												? new Date(module.updated).toLocaleDateString("uz-UZ")
												: "-"}
										</TableCell>
										<TableCell className='text-right'>
											<div className='flex items-center justify-end gap-2'>
												<Button
													size='sm'
													variant='outline'
													className='text-green-600 hover:text-green-700 hover:bg-green-50 dark:border-gray-600 dark:hover:bg-green-900/30'
													onClick={() => handleRestore(module.id)}
													disabled={restoring === module.id}
												>
													{restoring === module.id ? (
														<Loader2 className='h-4 w-4 animate-spin' />
													) : (
														<RotateCcw className='h-4 w-4' />
													)}
												</Button>
												<Button
													size='sm'
													variant='outline'
													className='text-red-500 hover:text-red-700 hover:bg-red-50 dark:border-gray-600 dark:hover:bg-red-900/30'
													onClick={() => setHardDeleteId(module.id)}
												>
													<Trash2 className='h-4 w-4' />
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

			{/* Soft Delete Confirmation Dialog */}
			<Dialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
				<DialogContent className='dark:bg-gray-800 dark:border-gray-700'>
					<DialogHeader>
						<DialogTitle className='dark:text-white'>
							Modulni o'chirish
						</DialogTitle>
						<DialogDescription className='dark:text-gray-400'>
							Haqiqatan ham bu modulni o'chirmoqchimisiz? Modul soft-delete
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

			{/* Hard Delete Confirmation Dialog */}
			<Dialog open={!!hardDeleteId} onOpenChange={() => setHardDeleteId(null)}>
				<DialogContent className='dark:bg-gray-800 dark:border-gray-700'>
					<DialogHeader>
						<DialogTitle className='text-red-600'>
							⚠️ Modulni butunlay o'chirish
						</DialogTitle>
						<DialogDescription className='dark:text-gray-400'>
							<span className='text-red-600 font-semibold'>DIQQAT!</span> Bu
							amal qaytarilmaydi! Modul bazadan butunlay o'chiriladi va uni
							tiklab bo'lmaydi. Barcha tegishli darslar ham o'chiriladi.
						</DialogDescription>
					</DialogHeader>
					<DialogFooter>
						<Button
							variant='outline'
							onClick={() => setHardDeleteId(null)}
							className='dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700'
						>
							Bekor qilish
						</Button>
						<Button
							variant='destructive'
							onClick={handleHardDelete}
							disabled={deleting}
						>
							{deleting ? (
								<>
									<Loader2 className='h-4 w-4 mr-2 animate-spin' />
									O'chirilmoqda...
								</>
							) : (
								<>
									<Trash2 className='h-4 w-4 mr-2' />
									Butunlay o'chirish
								</>
							)}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	)
}
