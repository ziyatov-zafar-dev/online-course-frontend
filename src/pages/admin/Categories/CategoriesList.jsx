import { deleteCategory, getCategories } from "@/api/categories"
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
import {
	BookOpen,
	Edit,
	FolderTree,
	Loader2,
	Plus,
	Search,
	Trash,
} from "lucide-react"
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { toast } from "sonner"

export default function CategoriesList() {
	const [categories, setCategories] = useState([])
	const [loading, setLoading] = useState(false)
	const [search, setSearch] = useState("")
	const [deleteId, setDeleteId] = useState(null)
	const [deleting, setDeleting] = useState(false)

	useEffect(() => {
		fetchCategories()
	}, [])

	const fetchCategories = async () => {
		setLoading(true)
		try {
			const res = await getCategories()
			setCategories(res.data?.data || res.data?.items || res.data || [])
		} catch (err) {
			toast.error("Kategoriyalarni yuklashda xatolik")
			console.error(err)
		} finally {
			setLoading(false)
		}
	}

	const handleDelete = async () => {
		setDeleting(true)
		try {
			await deleteCategory(deleteId)
			toast.success("Kategoriya o'chirildi")
			setCategories(categories.filter((c) => c.categoryId !== deleteId))
			setDeleteId(null)
		} catch {
			toast.error("O'chirishda xatolik")
		} finally {
			setDeleting(false)
		}
	}

	const filteredCategories = categories.filter(
		(category) =>
			category.name?.toLowerCase().includes(search.toLowerCase()) ||
			category.title?.toLowerCase().includes(search.toLowerCase())
	)

	return (
		<div className='space-y-6'>
			{/* Header */}
			<div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
				<div>
					<h1 className='text-2xl font-semibold text-gray-900 dark:text-white'>
						Kategoriyalar
					</h1>
					<p className='text-sm text-gray-500 dark:text-gray-400'>
						Kurs kategoriyalarini boshqaring
					</p>
				</div>
				<Link to='/admin/categories/create'>
					<Button className='bg-blue-600 hover:bg-blue-700'>
						<Plus className='h-4 w-4 mr-2' />
						Yangi kategoriya
					</Button>
				</Link>
			</div>

			{/* Search */}
			<div className='bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm'>
				<div className='relative max-w-md'>
					<Search className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500' />
					<Input
						type='search'
						placeholder="Kategoriya nomi bo'yicha qidirish..."
						className='pl-10 bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500'
						value={search}
						onChange={(e) => setSearch(e.target.value)}
					/>
				</div>
			</div>

			{/* Content */}
			<div className='bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden'>
				{loading ? (
					<div className='flex items-center justify-center py-12'>
						<Loader2 className='h-8 w-8 text-blue-600 dark:text-blue-400 animate-spin' />
					</div>
				) : filteredCategories.length === 0 ? (
					<div className='text-center py-12'>
						<FolderTree className='h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-4' />
						<h3 className='text-lg font-medium text-gray-900 dark:text-white mb-2'>
							Kategoriya topilmadi
						</h3>
						<p className='text-gray-500 dark:text-gray-400 mb-4'>
							Hozircha kategoriya mavjud emas
						</p>
						<Link to='/admin/categories/create'>
							<Button className='bg-blue-600 hover:bg-blue-700'>
								<Plus className='h-4 w-4 mr-2' />
								Birinchi kategoriyani qo'shing
							</Button>
						</Link>
					</div>
				) : (
					<Table>
						<TableHeader>
							<TableRow className='bg-gray-50 dark:bg-gray-900'>
								<TableHead className='text-gray-700 dark:text-gray-300'>
									Kategoriya nomi
								</TableHead>
								<TableHead className='text-gray-700 dark:text-gray-300'>
									Slug
								</TableHead>
								<TableHead className='text-gray-700 dark:text-gray-300'>
									Kurslar soni
								</TableHead>
								<TableHead className='text-gray-700 dark:text-gray-300'>
									Yaratilgan
								</TableHead>
								<TableHead className='text-right text-gray-700 dark:text-gray-300'>
									Amallar
								</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{filteredCategories.map((category) => (
								<TableRow
									key={category.categoryId}
									className='hover:bg-gray-50 dark:hover:bg-gray-700/50'
								>
									<TableCell>
										<div>
											<p className='font-medium text-gray-900 dark:text-white'>
												{category.name || category.title}
											</p>
											{category.description && (
												<p className='text-sm text-gray-500 dark:text-gray-400 truncate max-w-xs'>
													{category.description}
												</p>
											)}
										</div>
									</TableCell>
									<TableCell>
										<code className='text-sm bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-2 py-1 rounded'>
											{category.slug || "-"}
										</code>
									</TableCell>
									<TableCell>
										<div className='flex items-center gap-1 text-gray-600 dark:text-gray-300'>
											<BookOpen className='h-4 w-4 text-gray-400 dark:text-gray-500' />
											<span>
												{category.coursesCount || category.courses?.length || 0}
											</span>
										</div>
									</TableCell>
									<TableCell className='text-gray-500 dark:text-gray-400'>
										{category.created || category.createdAt
											? new Date(
													category.created || category.createdAt
											  ).toLocaleDateString("uz-UZ")
											: "-"}
									</TableCell>
									<TableCell className='text-right'>
										<div className='flex items-center justify-end gap-2'>
											<Link
												to={`/admin/categories/edit/${category.categoryId}`}
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
												className='text-red-500 hover:text-red-700 hover:bg-red-50 dark:border-gray-600 dark:hover:bg-red-900/20'
												onClick={() => setDeleteId(category.categoryId)}
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
							Kategoriyani o'chirish
						</DialogTitle>
						<DialogDescription className='dark:text-gray-400'>
							Haqiqatan ham bu kategoriyani o'chirmoqchimisiz? Bu amalni ortga
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
