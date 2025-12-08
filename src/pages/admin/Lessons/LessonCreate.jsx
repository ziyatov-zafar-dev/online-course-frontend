import { getCourses } from "@/api/courses"
import { addLesson } from "@/api/lessons"
import { getModulesByCourse } from "@/api/modules"
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

export default function LessonCreate() {
	const navigate = useNavigate()
	const [searchParams] = useSearchParams()

	const [loading, setLoading] = useState(false)
	const [courses, setCourses] = useState([])
	const [modules, setModules] = useState([])
	const [form, setForm] = useState({
		courseId: searchParams.get("courseId") || "",
		moduleId: searchParams.get("moduleId") || "",
		title: "",
		description: "",
		slug: "",
		type: "video",
		videoUrl: "",
		content: "",
		duration: "",
		orderNumber: 1,
	})

	useEffect(() => {
		fetchCourses()
	}, [])

	useEffect(() => {
		if (form.courseId) {
			fetchModules()
		} else {
			setModules([])
		}
	}, [form.courseId])

	const fetchCourses = async () => {
		try {
			const res = await getCourses()
			setCourses(res.data?.data || res.data?.items || res.data || [])
		} catch (err) {
			console.error("Failed to fetch courses:", err)
		}
	}

	const fetchModules = async () => {
		try {
			const res = await getModulesByCourse(form.courseId)
			setModules(res.data?.data || res.data || [])
		} catch (err) {
			console.error("Failed to fetch modules:", err)
		}
	}

	const handleChange = (e) => {
		const { name, value } = e.target
		setForm((prev) => ({ ...prev, [name]: value }))

		// Auto-generate slug from title
		if (name === "title") {
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

		// Reset module when course changes
		if (name === "courseId") {
			setForm((prev) => ({ ...prev, moduleId: "" }))
		}
	}

	const handleSubmit = async (e) => {
		e.preventDefault()

		if (!form.moduleId) {
			toast.error("Modulni tanlang")
			return
		}

		if (!form.title.trim()) {
			toast.error("Dars nomini kiriting")
			return
		}

		setLoading(true)
		try {
			await addLesson({
				moduleId: form.moduleId,
				title: form.title,
				description: form.description,
				slug: form.slug,
				type: form.type,
				videoUrl: form.videoUrl,
				content: form.content,
				duration: form.duration,
				orderNumber: parseInt(form.orderNumber) || 1,
			})
			toast.success("Dars muvaffaqiyatli qo'shildi!")
			navigate(
				`/admin/lessons?courseId=${form.courseId}&moduleId=${form.moduleId}`
			)
		} catch (err) {
			toast.error(
				err.response?.data?.message || "Dars qo'shishda xatolik yuz berdi"
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
					to={`/admin/lessons${
						form.courseId ? `?courseId=${form.courseId}` : ""
					}${form.moduleId ? `&moduleId=${form.moduleId}` : ""}`}
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
						Yangi dars qo'shish
					</h1>
					<p className='text-sm text-gray-500 dark:text-gray-400'>
						Modulga yangi dars qo'shing
					</p>
				</div>
			</div>

			{/* Form */}
			<div className='bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6'>
				<form onSubmit={handleSubmit} className='space-y-6'>
					{/* Course & Module Selection */}
					<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
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

						{/* Module Select */}
						<div className='space-y-2'>
							<Label className='dark:text-gray-200'>Modul *</Label>
							<Select
								value={form.moduleId}
								onValueChange={(value) => handleSelectChange("moduleId", value)}
								disabled={!form.courseId}
							>
								<SelectTrigger className='dark:bg-gray-700 dark:border-gray-600 dark:text-white'>
									<SelectValue
										placeholder={
											form.courseId ? "Modulni tanlang" : "Avval kurs tanlang"
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
					</div>

					{/* Lesson Title */}
					<div className='space-y-2'>
						<Label htmlFor='title' className='dark:text-gray-200'>
							Dars nomi *
						</Label>
						<Input
							id='title'
							name='title'
							value={form.title}
							onChange={handleChange}
							placeholder='Masalan: React Hooks bilan tanishuv'
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
							placeholder='react-hooks-bilan-tanishuv'
							className='font-mono text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400'
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
							rows={3}
							className='w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none dark:bg-gray-700 dark:text-white dark:placeholder-gray-400'
							placeholder='Dars haqida qisqacha ma`lumot...'
						/>
					</div>

					{/* Lesson Type */}
					<div className='space-y-2'>
						<Label className='dark:text-gray-200'>Dars turi</Label>
						<Select
							value={form.type}
							onValueChange={(value) => handleSelectChange("type", value)}
						>
							<SelectTrigger className='dark:bg-gray-700 dark:border-gray-600 dark:text-white'>
								<SelectValue placeholder='Turini tanlang' />
							</SelectTrigger>
							<SelectContent className='dark:bg-gray-800 dark:border-gray-700'>
								<SelectItem
									value='video'
									className='dark:text-white dark:focus:bg-gray-700'
								>
									Video
								</SelectItem>
								<SelectItem
									value='text'
									className='dark:text-white dark:focus:bg-gray-700'
								>
									Matn
								</SelectItem>
								<SelectItem
									value='quiz'
									className='dark:text-white dark:focus:bg-gray-700'
								>
									Quiz
								</SelectItem>
							</SelectContent>
						</Select>
					</div>

					{/* Video URL (conditional) */}
					{form.type === "video" && (
						<div className='space-y-2'>
							<Label htmlFor='videoUrl' className='dark:text-gray-200'>
								Video URL
							</Label>
							<Input
								id='videoUrl'
								name='videoUrl'
								value={form.videoUrl}
								onChange={handleChange}
								placeholder='https://youtube.com/watch?v=...'
								className='dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400'
							/>
						</div>
					)}

					{/* Content (conditional) */}
					{form.type === "text" && (
						<div className='space-y-2'>
							<Label htmlFor='content' className='dark:text-gray-200'>
								Kontent
							</Label>
							<textarea
								id='content'
								name='content'
								value={form.content}
								onChange={handleChange}
								rows={6}
								className='w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none dark:bg-gray-700 dark:text-white dark:placeholder-gray-400'
								placeholder='Dars kontentini kiriting...'
							/>
						</div>
					)}

					{/* Duration & Order */}
					<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
						<div className='space-y-2'>
							<Label htmlFor='duration' className='dark:text-gray-200'>
								Davomiyligi
							</Label>
							<Input
								id='duration'
								name='duration'
								value={form.duration}
								onChange={handleChange}
								placeholder='10:30'
								className='dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400'
							/>
							<p className='text-xs text-gray-500 dark:text-gray-400'>
								Format: daqiqa:soniya
							</p>
						</div>

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
						</div>
					</div>

					{/* Actions */}
					<div className='flex justify-end gap-3 pt-4 border-t dark:border-gray-700'>
						<Link
							to={`/admin/lessons${
								form.courseId ? `?courseId=${form.courseId}` : ""
							}${form.moduleId ? `&moduleId=${form.moduleId}` : ""}`}
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
