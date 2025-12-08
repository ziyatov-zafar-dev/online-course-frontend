import { getCourses } from "@/api/courses"
import { addSkillToCourse } from "@/api/skills"
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
import { ArrowLeft, ImagePlus, Loader2, Save, X } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { Link, useNavigate, useSearchParams } from "react-router-dom"
import { toast } from "sonner"

export default function SkillCreate() {
	const navigate = useNavigate()
	const [searchParams] = useSearchParams()
	const fileInputRef = useRef(null)

	const [loading, setLoading] = useState(false)
	const [courses, setCourses] = useState([])
	const [form, setForm] = useState({
		courseId: searchParams.get("courseId") || "",
		name: "",
		orderNumber: 1,
	})
	const [iconFile, setIconFile] = useState(null)
	const [iconPreview, setIconPreview] = useState(null)

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
	}

	const handleSelectChange = (name, value) => {
		setForm((prev) => ({ ...prev, [name]: value }))
	}

	const handleFileChange = (e) => {
		const file = e.target.files?.[0]
		if (file) {
			// Validate file type
			if (!file.type.startsWith("image/")) {
				toast.error("Faqat rasm fayllari qabul qilinadi")
				return
			}
			// Validate file size (max 5MB)
			if (file.size > 5 * 1024 * 1024) {
				toast.error("Fayl hajmi 5MB dan oshmasligi kerak")
				return
			}
			setIconFile(file)
			// Create preview
			const reader = new FileReader()
			reader.onload = (e) => setIconPreview(e.target?.result)
			reader.readAsDataURL(file)
		}
	}

	const removeIcon = () => {
		setIconFile(null)
		setIconPreview(null)
		if (fileInputRef.current) {
			fileInputRef.current.value = ""
		}
	}

	const handleSubmit = async (e) => {
		e.preventDefault()

		if (!form.courseId) {
			toast.error("Kursni tanlang")
			return
		}

		if (!form.name.trim()) {
			toast.error("Ko'nikma nomini kiriting")
			return
		}

		if (!iconFile) {
			toast.error("Icon rasmini yuklang")
			return
		}

		setLoading(true)
		try {
			await addSkillToCourse(
				form.courseId,
				form.name,
				form.orderNumber,
				iconFile
			)
			toast.success("Ko'nikma muvaffaqiyatli qo'shildi!")
			navigate(`/admin/skills?courseId=${form.courseId}`)
		} catch (err) {
			toast.error(
				err.response?.data?.message || "Ko'nikma qo'shishda xatolik yuz berdi"
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
					to={`/admin/skills${
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
						Yangi ko'nikma qo'shish
					</h1>
					<p className='text-sm text-gray-500 dark:text-gray-400'>
						Kursga yangi ko'nikma qo'shing
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

					{/* Icon Upload */}
					<div className='space-y-2'>
						<Label className='dark:text-gray-200'>Icon rasmi *</Label>
						<div className='flex items-start gap-4'>
							{iconPreview ? (
								<div className='relative'>
									<img
										src={iconPreview}
										alt='Icon preview'
										className='w-24 h-24 rounded-lg object-cover border border-gray-200 dark:border-gray-600'
									/>
									<button
										type='button'
										onClick={removeIcon}
										className='absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600'
									>
										<X className='h-4 w-4' />
									</button>
								</div>
							) : (
								<div
									onClick={() => fileInputRef.current?.click()}
									className='w-24 h-24 border-2 border-dashed border-gray-200 dark:border-gray-600 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-blue-300 dark:hover:border-blue-500 transition-colors dark:bg-gray-700/50'
								>
									<ImagePlus className='h-8 w-8 text-gray-400 mb-1' />
									<span className='text-xs text-gray-500 dark:text-gray-400'>
										Yuklash
									</span>
								</div>
							)}
							<input
								ref={fileInputRef}
								type='file'
								accept='image/*'
								onChange={handleFileChange}
								className='hidden'
							/>
							<div className='text-sm text-gray-500 dark:text-gray-400'>
								<p>PNG, JPG, SVG formatlar qabul qilinadi</p>
								<p>Maksimal hajm: 5MB</p>
							</div>
						</div>
					</div>

					{/* Skill Name */}
					<div className='space-y-2'>
						<Label htmlFor='name' className='dark:text-gray-200'>
							Ko'nikma nomi *
						</Label>
						<Input
							id='name'
							name='name'
							value={form.name}
							onChange={handleChange}
							placeholder='Masalan: React Hooks'
							required
							className='dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400'
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
							Ko'nikmalar shu tartib raqami bo'yicha ko'rsatiladi
						</p>
					</div>

					{/* Actions */}
					<div className='flex items-center justify-end gap-3 pt-4 border-t dark:border-gray-700'>
						<Link
							to={`/admin/skills${
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
