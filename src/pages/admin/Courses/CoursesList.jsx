import { deleteCourse, getCourses } from "@/api/courses"
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
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table"
import { BookOpen, Edit, Loader2, Plus, Search, Trash } from "lucide-react"
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { toast } from "sonner"

export default function CoursesList() {
	const [courses, setCourses] = useState([])
	const [loading, setLoading] = useState(false)
	const [search, setSearch] = useState("")
	const [deleteId, setDeleteId] = useState(null)
	const [deleting, setDeleting] = useState(false)

	useEffect(() => {
		fetchCourses()
	}, [])

	const fetchCourses = async () => {
		setLoading(true)
		try {
			const res = await getCourses()
			setCourses(res.data?.data || res.data?.items || res.data || [])
		} catch (err) {
			toast.error("Kurslarni yuklashda xatolik")
			console.error(err)
		} finally {
			setLoading(false)
		}
	}

	const handleSearch = (e) => {
		setSearch(e.target.value)
	}

	const handleDelete = async () => {
		setDeleting(true)
		try {
			await deleteCourse(deleteId)
			toast.success("Kurs o'chirildi")
			setCourses(courses.filter((c) => c.courseId !== deleteId))
			setDeleteId(null)
		} catch {
			toast.error("O'chirishda xatolik")
		} finally {
			setDeleting(false)
		}
	}

	const filteredCourses = courses.filter((course) =>
		course.name?.toLowerCase().includes(search.toLowerCase())
	)

	return (
		<div className='space-y-6'>
			{/* Header */}
			<div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
				<div>
					<h1 className='text-2xl font-semibold text-gray-900 dark:text-white'>
						Kurslar
					</h1>
					<p className='text-sm text-gray-500 dark:text-gray-400'>
						Barcha kurslarni boshqaring
					</p>
				</div>
				<Link to='/admin/courses/create'>
					<Button className='bg-blue-600 hover:bg-blue-700'>
						<Plus className='h-4 w-4 mr-2' />
						Yangi kurs
					</Button>
				</Link>
			</div>

			{/* Search */}
			<div className='bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm'>
				<div className='relative max-w-md'>
					<Search className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500' />
					<Input
						type='search'
						placeholder='Kurs nomi bo`yicha qidirish...'
						className='pl-10 bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500'
						value={search}
						onChange={handleSearch}
					/>
				</div>
			</div>

			{/* Table */}
			<div className='bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden'>
				{loading ? (
					<div className='flex items-center justify-center py-12'>
						<Loader2 className='h-8 w-8 text-blue-600 dark:text-blue-400 animate-spin' />
					</div>
				) : filteredCourses.length === 0 ? (
					<div className='text-center py-12'>
						<BookOpen className='h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-4' />
						<h3 className='text-lg font-medium text-gray-900 dark:text-white mb-2'>
							Kurs topilmadi
						</h3>
						<p className='text-gray-500 dark:text-gray-400 mb-4'>
							Hozircha hech qanday kurs mavjud emas
						</p>
						<Link to='/admin/courses/create'>
							<Button className='bg-blue-600 hover:bg-blue-700'>
								<Plus className='h-4 w-4 mr-2' />
								Birinchi kursni qo'shing
							</Button>
						</Link>
					</div>
				) : (
					<Table>
						<TableHeader>
							<TableRow className='bg-gray-50 dark:bg-gray-900'>
								<TableHead className='text-gray-700 dark:text-gray-300'>
									Kurs nomi
								</TableHead>
								<TableHead className='text-gray-700 dark:text-gray-300'>
									Tavsif
								</TableHead>
								<TableHead className='text-gray-700 dark:text-gray-300'>
									Daraja
								</TableHead>
								<TableHead className='text-gray-700 dark:text-gray-300'>
									Narxi
								</TableHead>
								<TableHead className='text-right text-gray-700 dark:text-gray-300'>
									Amallar
								</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{filteredCourses.map((course) => (
								<TableRow
									key={course.courseId}
									className='hover:bg-gray-50 dark:hover:bg-gray-700/50'
								>
									<TableCell className='font-medium text-gray-900 dark:text-white'>
										{course.name}
									</TableCell>
									<TableCell className='max-w-xs truncate text-gray-600 dark:text-gray-300'>
										{course.description || "-"}
									</TableCell>
									<TableCell>
										<span className='px-2 py-1 text-xs rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'>
											{course.status?.name || course.status || "DRAFT"}
										</span>
									</TableCell>
									<TableCell className='text-gray-900 dark:text-white'>
										{course.price
											? `${Number(course.price).toLocaleString()} so'm`
											: "Bepul"}
									</TableCell>
									<TableCell className='text-right'>
										<div className='flex items-center justify-end gap-2'>
											<Link to={`/admin/courses/edit/${course.courseId}`}>
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
												className='text-red-500 hover:text-red-700 hover:bg-red-50 dark:border-gray-600 dark:hover:bg-red-900/20'
												onClick={() => setDeleteId(course.courseId)}
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

			{/* Delete Confirmation Dialog */}
			<Dialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
				<DialogContent className='dark:bg-gray-800 dark:border-gray-700'>
					<DialogHeader>
						<DialogTitle className='dark:text-white'>
							Kursni o'chirish
						</DialogTitle>
						<DialogDescription className='dark:text-gray-400'>
							Haqiqatan ham bu kursni o'chirmoqchimisiz? Bu amalni ortga
							qaytarib bo'lmaydi.
						</DialogDescription>
					</DialogHeader>
					<DialogFooter className='gap-2'>
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
