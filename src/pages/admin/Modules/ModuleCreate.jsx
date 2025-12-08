import { getCourses } from "@/api/courses"
import { addModule } from "@/api/modules"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select"
import { ArrowLeft, Loader2, Save } from "lucide-react"
import { useEffect, useState } from "react"
import { Link, useNavigate, useSearchParams } from "react-router-dom"
import { toast } from "sonner"

export default function ModuleCreate() {
	const navigate = useNavigate()
	const [searchParams] = useSearchParams()

	const [loading, setLoading] = useState(false)
	const [courses, setCourses] = useState([])
	const [form, setForm] = useState({
		courseId: searchParams.get("courseId") || "",
		name: "",
		description: "",
		slug: "",
		orderNumber: 1,
	})

	useEffect(() => {
		fetchCourses()
	}, [])

	const fetchCourses = async () => {
		try {
			const res = await getCourses()
			setCourses(res.data?.data || res.data?.items || res.data || [])
		} catch (err) {
			console.error("Failed to fetch courses:", err)
		}
	}

	const handleChange = (e) => {
		const { name, value } = e.target
		setForm((prev) => ({ ...prev, [name]: value }))

		// Auto-generate slug from name
		if (name === "name") {
			const slug = value
				.toLowerCase()
				.replace(/[^a-z0-9\s-]/g, "")
				.replace(/\s+/g, "-")
				.replace(/-+/g, "-")
			setForm((prev) => ({ ...prev, slug }))
		}
	}

	const handleSelectChange = (name, value) => {
		setForm((prev) => ({ ...prev, [name]: value }))
	}

	const handleSubmit = async (e) => {
		e.preventDefault()

		if (!form.courseId) {
			toast.error("Kursni tanlang")
			return
		}

		if (!form.name.trim()) {
			toast.error("Modul nomini kiriting")
			return
		}

		setLoading(true)
		try {
			await addModule({
				courseId: form.courseId,
				name: form.name,
				description: form.description,
				slug: form.slug,
				orderNumber: parseInt(form.orderNumber) || 1,
			})
			toast.success("Modul muvaffaqiyatli qo'shildi!")
			navigate(`/admin/modules?courseId=${form.courseId}`)
		} catch (err) {
			toast.error(
				err.response?.data?.message || "Modul qo'shishda xatolik yuz berdi"
			)
			console.error(err)
		} finally {
			setLoading(false)
		}
	}

	return (
		<div className='max-w-2xl mx-auto'>
			{/* Header */}
			<div className='flex items-center gap-4 mb-6'>
				<Link
					to={`/admin/modules${
						form.courseId ? `?courseId=${form.courseId}` : ""
					}`}
				>
					<Button
						variant='ghost'
						size='icon'
						className='dark:text-gray-300 dark:hover:bg-gray-700'
					>
						<ArrowLeft className='h-5 w-5' />
					</Button>
				</Link>
				<div>
					<h1 className='text-2xl font-semibold text-gray-900 dark:text-white'>
						Yangi modul qo'shish
					</h1>
					<p className='text-sm text-gray-500 dark:text-gray-400'>
						Kursga yangi modul qo'shing
					</p>
				</div>
			</div>

			{/* Form */}
			<div className='bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6'>
				<form onSubmit={handleSubmit} className='space-y-6'>
					{/* Course Select */}
					<div className='space-y-2'>
						<Label className='dark:text-gray-200'>Kurs *</Label>
						<Select
							value={form.courseId}
							onValueChange={(value) => handleSelectChange("courseId", value)}
						>
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

					{/* Module Name */}
					<div className='space-y-2'>
						<Label htmlFor='name' className='dark:text-gray-200'>
							Modul nomi *
						</Label>
						<Input
							id='name'
							name='name'
							value={form.name}
							onChange={handleChange}
							placeholder='Masalan: React asoslari'
							required
							className='dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400'
						/>
					</div>

					{/* Slug */}
					<div className='space-y-2'>
						<Label htmlFor='slug' className='dark:text-gray-200'>
							Slug
						</Label>
						<Input
							id='slug'
							name='slug'
							value={form.slug}
							onChange={handleChange}
							placeholder='react-asoslari'
							className='dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400'
						/>
						<p className='text-xs text-gray-500 dark:text-gray-400'>
							URL uchun ishlatiladigan identifikator. Avtomatik yaratiladi.
						</p>
					</div>

					{/* Description */}
					<div className='space-y-2'>
						<Label htmlFor='description' className='dark:text-gray-200'>
							Tavsif
						</Label>
						<textarea
							id='description'
							name='description'
							value={form.description}
							onChange={handleChange}
							rows={4}
							className='w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none dark:bg-gray-700 dark:text-white dark:placeholder-gray-400'
							placeholder='Modul haqida qisqacha ma`lumot...'
						/>
					</div>

					{/* Order Number */}
					<div className='space-y-2'>
						<Label htmlFor='orderNumber' className='dark:text-gray-200'>
							Tartib raqami
						</Label>
						<Input
							id='orderNumber'
							name='orderNumber'
							type='number'
							min='1'
							value={form.orderNumber}
							onChange={handleChange}
							placeholder='1'
							className='dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400'
						/>
						<p className='text-xs text-gray-500 dark:text-gray-400'>
							Modullar shu tartib raqami bo'yicha ko'rsatiladi
						</p>
					</div>

					{/* Actions */}
					<div className='flex items-center justify-end gap-3 pt-4 border-t dark:border-gray-700'>
						<Link
							to={`/admin/modules${
								form.courseId ? `?courseId=${form.courseId}` : ""
							}`}
						>
							<Button
								type='button'
								variant='outline'
								className='dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700'
							>
								Bekor qilish
							</Button>
						</Link>
						<Button
							type='submit'
							disabled={loading}
							className='bg-blue-600 hover:bg-blue-700'
						>
							{loading ? (
								<>
									<Loader2 className='h-4 w-4 mr-2 animate-spin' />
									Saqlanmoqda...
								</>
							) : (
								<>
									<Save className='h-4 w-4 mr-2' />
									Saqlash
								</>
							)}
						</Button>
					</div>
				</form>
			</div>
		</div>
	)
}
