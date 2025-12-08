import { getCourses } from "@/api/courses"
import { deleteSkill, getSkillsByCourse } from "@/api/skills"
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
	Edit,
	Image as ImageIcon,
	ListChecks,
	Loader2,
	Plus,
	Search,
	Trash,
} from "lucide-react"
import { useEffect, useState } from "react"
import { Link, useSearchParams } from "react-router-dom"
import { toast } from "sonner"

export default function SkillsList() {
	const [searchParams, setSearchParams] = useSearchParams()
	const [skills, setSkills] = useState([])
	const [courses, setCourses] = useState([])
	const [loading, setLoading] = useState(false)
	const [search, setSearch] = useState("")
	const [selectedCourse, setSelectedCourse] = useState(
		searchParams.get("courseId") || ""
	)
	const [deleteId, setDeleteId] = useState(null)
	const [deleting, setDeleting] = useState(false)

	// Fetch courses for filter
	useEffect(() => {
		fetchCourses()
	}, [])

	// Fetch skills when course changes
	useEffect(() => {
		if (selectedCourse) {
			fetchSkills()
		} else {
			setSkills([])
		}
	}, [selectedCourse])

	const fetchCourses = async () => {
		try {
			const res = await getCourses()
			setCourses(res.data?.data || res.data?.items || res.data || [])
		} catch (err) {
			console.error("Failed to fetch courses:", err)
		}
	}

	const fetchSkills = async () => {
		if (!selectedCourse) return
		setLoading(true)
		try {
			const res = await getSkillsByCourse(selectedCourse)
			setSkills(res.data?.data || res.data || [])
		} catch (err) {
			toast.error("Ko'nikmalarni yuklashda xatolik")
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
			await deleteSkill(deleteId)
			toast.success("Ko'nikma o'chirildi")
			setSkills(skills.filter((s) => s.skillId !== deleteId))
			setDeleteId(null)
		} catch {
			toast.error("O'chirishda xatolik")
		} finally {
			setDeleting(false)
		}
	}

	const filteredSkills = skills.filter((skill) =>
		skill.skillName?.toLowerCase().includes(search.toLowerCase())
	)

	return (
		<div className='space-y-6'>
			{/* Header */}
			<div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
				<div>
					<h1 className='text-2xl font-semibold text-gray-900 dark:text-white'>
						Ko'nikmalar
					</h1>
					<p className='text-sm text-gray-500 dark:text-gray-400'>
						Kursga tegishli ko'nikmalarni boshqaring
					</p>
				</div>
				{selectedCourse && (
					<Link to={`/admin/skills/create?courseId=${selectedCourse}`}>
						<Button className='bg-blue-600 hover:bg-blue-700'>
							<Plus className='h-4 w-4 mr-2' />
							Yangi ko'nikma
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
								placeholder="Ko'nikma nomi bo'yicha qidirish..."
								className='pl-10 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400'
								value={search}
								onChange={(e) => setSearch(e.target.value)}
							/>
						</div>
					)}
				</div>
			</div>

			{/* Content */}
			{!selectedCourse ? (
				<div className='bg-white dark:bg-gray-800 rounded-xl shadow-sm p-12 text-center'>
					<ListChecks className='h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-4' />
					<h3 className='text-lg font-medium text-gray-900 dark:text-white mb-2'>
						Kursni tanlang
					</h3>
					<p className='text-gray-500 dark:text-gray-400'>
						Ko'nikmalarni ko'rish uchun yuqoridagi ro'yxatdan kurs tanlang
					</p>
				</div>
			) : (
				<div className='bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden'>
					{loading ? (
						<div className='flex items-center justify-center py-12'>
							<Loader2 className='h-8 w-8 text-blue-600 animate-spin' />
						</div>
					) : filteredSkills.length === 0 ? (
						<div className='text-center py-12'>
							<ListChecks className='h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-4' />
							<h3 className='text-lg font-medium text-gray-900 dark:text-white mb-2'>
								Ko'nikma topilmadi
							</h3>
							<p className='text-gray-500 dark:text-gray-400 mb-4'>
								Bu kursda hozircha ko'nikma mavjud emas
							</p>
							<Link to={`/admin/skills/create?courseId=${selectedCourse}`}>
								<Button className='bg-blue-600 hover:bg-blue-700'>
									<Plus className='h-4 w-4 mr-2' />
									Birinchi ko'nikmani qo'shing
								</Button>
							</Link>
						</div>
					) : (
						<Table>
							<TableHeader>
								<TableRow className='dark:border-gray-700'>
									<TableHead className='w-16 dark:text-gray-300'>
										Icon
									</TableHead>
									<TableHead className='dark:text-gray-300'>
										Ko'nikma nomi
									</TableHead>
									<TableHead className='dark:text-gray-300'>
										Tartib raqami
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
								{filteredSkills.map((skill) => (
									<TableRow
										key={skill.skillId}
										className='dark:border-gray-700 dark:hover:bg-gray-700/50'
									>
										<TableCell>
											{skill.skillImgUrl ? (
												<img
													src={skill.skillImgUrl}
													alt={skill.skillName}
													className='w-10 h-10 rounded-lg object-cover'
												/>
											) : (
												<div className='w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center'>
													<ImageIcon className='h-5 w-5 text-gray-400' />
												</div>
											)}
										</TableCell>
										<TableCell className='font-medium dark:text-white'>
											{skill.skillName}
										</TableCell>
										<TableCell>
											<span className='px-2 py-1 text-xs rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'>
												#{skill.orderNumber}
											</span>
										</TableCell>
										<TableCell className='text-gray-500 dark:text-gray-400'>
											{skill.created
												? new Date(skill.created).toLocaleDateString("uz-UZ")
												: "-"}
										</TableCell>
										<TableCell className='text-right'>
											<div className='flex items-center justify-end gap-2'>
												<Link
													to={`/admin/skills/edit/${skill.skillId}?courseId=${selectedCourse}`}
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
													onClick={() => setDeleteId(skill.skillId)}
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
							Ko'nikmani o'chirish
						</DialogTitle>
						<DialogDescription className='dark:text-gray-400'>
							Haqiqatan ham bu ko'nikmani o'chirmoqchimisiz? Bu amalni ortga
							qaytarib bo'lmaydi.
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
