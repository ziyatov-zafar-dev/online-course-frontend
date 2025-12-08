import { getCategories } from "@/api/categories"
import {
	addCourseImage,
	addCourseVideo,
	getCourse,
	updateCourse,
} from "@/api/courses"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, ImagePlus, Loader2, Save, Upload } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { toast } from "sonner"

export default function CourseEdit() {
	const { id } = useParams()
	const navigate = useNavigate()
	const [loading, setLoading] = useState(false)
	const [fetching, setFetching] = useState(true)
	const [categories, setCategories] = useState([])
	const [uploadingImage, setUploadingImage] = useState(false)
	const [uploadingVideo, setUploadingVideo] = useState(false)
	const imageInputRef = useRef(null)
	const videoInputRef = useRef(null)
	const [form, setForm] = useState({
		name: "",
		description: "",
		slug: "",
		orderNumber: 1,
		telegramGroupLink: "",
		telegramChannelLink: "",
		hasTelegramGroup: false,
		hasTelegramChannel: false,
		imgUrl: "",
		promoCourseVideoUrl: "",
	})

	useEffect(() => {
		fetchData()
	}, [id])

	const fetchData = async () => {
		setFetching(true)
		try {
			const [courseRes, categoriesRes] = await Promise.all([
				getCourse(id),
				getCategories(),
			])
			const course = courseRes.data?.data || courseRes.data
			setForm({
				name: course.name || "",
				description: course.description || "",
				slug: course.slug || "",
				orderNumber: course.orderNumber || 1,
				telegramGroupLink: course.telegramGroupLink || "",
				telegramChannelLink: course.telegramChannelLink || "",
				hasTelegramGroup: course.hasTelegramGroup || false,
				hasTelegramChannel: course.hasTelegramChannel || false,
				imgUrl: course.imgUrl || "",
				promoCourseVideoUrl: course.promoCourseVideoUrl || "",
			})
			setCategories(categoriesRes.data?.data || categoriesRes.data || [])
		} catch (err) {
			toast.error("Kurs ma'lumotlarini yuklashda xatolik")
			console.error(err)
		} finally {
			setFetching(false)
		}
	}

	const handleChange = (e) => {
		const { name, value, type, checked } = e.target
		setForm((prev) => ({
			...prev,
			[name]: type === "checkbox" ? checked : value,
		}))
	}

	const handleSelectChange = (name, value) => {
		setForm((prev) => ({ ...prev, [name]: value }))
	}

	const handleImageUpload = async (e) => {
		const file = e.target.files[0]
		if (!file) return

		setUploadingImage(true)
		try {
			const res = await addCourseImage(id, file)
			const updatedCourse = res.data?.data || res.data
			setForm((prev) => ({ ...prev, imgUrl: updatedCourse.imgUrl }))
			toast.success("Rasm muvaffaqiyatli yuklandi!")
		} catch (err) {
			toast.error("Rasmni yuklashda xatolik")
			console.error(err)
		} finally {
			setUploadingImage(false)
		}
	}

	const handleVideoUpload = async (e) => {
		const file = e.target.files[0]
		if (!file) return

		setUploadingVideo(true)
		try {
			const res = await addCourseVideo(id, file)
			const updatedCourse = res.data?.data || res.data
			setForm((prev) => ({
				...prev,
				promoCourseVideoUrl: updatedCourse.promoCourseVideoUrl,
			}))
			toast.success("Video muvaffaqiyatli yuklandi!")
		} catch (err) {
			toast.error("Videoni yuklashda xatolik")
			console.error(err)
		} finally {
			setUploadingVideo(false)
		}
	}

	const handleSubmit = async (e) => {
		e.preventDefault()
		setLoading(true)
		try {
			const payload = {
				name: form.name,
				description: form.description,
				slug: form.slug,
				orderNumber: parseInt(form.orderNumber) || 1,
				telegramGroupLink: form.telegramGroupLink || null,
				telegramChannelLink: form.telegramChannelLink || null,
				hasTelegramGroup: form.hasTelegramGroup,
				hasTelegramChannel: form.hasTelegramChannel,
			}
			await updateCourse(id, payload)
			toast.success("Kurs muvaffaqiyatli yangilandi!")
			navigate("/admin/courses")
		} catch (err) {
			toast.error(
				err.response?.data?.message || "Kursni yangilashda xatolik yuz berdi"
			)
			console.error(err)
		} finally {
			setLoading(false)
		}
	}

	if (fetching) {
		return (
			<div className='flex items-center justify-center min-h-[400px]'>
				<Loader2 className='h-8 w-8 text-blue-600 animate-spin' />
			</div>
		)
	}

	return (
		<div className='max-w-3xl mx-auto'>
			{/* Header */}
			<div className='flex items-center gap-4 mb-6'>
				<Link to='/admin/courses'>
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
						Kursni tahrirlash
					</h1>
					<p className='text-sm text-gray-500 dark:text-gray-400'>
						Kurs ma'lumotlarini yangilang
					</p>
				</div>
			</div>

			{/* Form */}
			<div className='bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6'>
				<form onSubmit={handleSubmit} className='space-y-6'>
					{/* Image Upload */}
					<div className='space-y-2'>
						<Label className='dark:text-gray-200'>Kurs rasmi</Label>
						<input
							ref={imageInputRef}
							type='file'
							accept='image/*'
							onChange={handleImageUpload}
							className='hidden'
						/>
						<div
							onClick={() => imageInputRef.current?.click()}
							className='border-2 border-dashed border-gray-200 dark:border-gray-600 rounded-lg p-8 text-center hover:border-blue-300 dark:hover:border-blue-500 transition-colors cursor-pointer dark:bg-gray-700/50'
						>
							{uploadingImage ? (
								<Loader2 className='h-10 w-10 text-blue-600 animate-spin mx-auto' />
							) : form.imgUrl ? (
								<img
									src={form.imgUrl}
									alt='Course thumbnail'
									className='max-h-40 mx-auto rounded-lg'
								/>
							) : (
								<>
									<ImagePlus className='h-10 w-10 text-gray-400 mx-auto mb-3' />
									<p className='text-sm text-gray-500 dark:text-gray-400'>
										Rasmni yuklash uchun bosing
									</p>
								</>
							)}
						</div>
					</div>

					{/* Video Upload */}
					<div className='space-y-2'>
						<Label className='dark:text-gray-200'>Promo Video</Label>
						<input
							ref={videoInputRef}
							type='file'
							accept='video/*'
							onChange={handleVideoUpload}
							className='hidden'
						/>
						<div
							onClick={() => videoInputRef.current?.click()}
							className='border-2 border-dashed border-gray-200 dark:border-gray-600 rounded-lg p-4 text-center hover:border-blue-300 dark:hover:border-blue-500 transition-colors cursor-pointer dark:bg-gray-700/50'
						>
							{uploadingVideo ? (
								<Loader2 className='h-6 w-6 text-blue-600 animate-spin mx-auto' />
							) : form.promoCourseVideoUrl ? (
								<div className='flex items-center justify-center gap-2'>
									<Upload className='h-5 w-5 text-green-600' />
									<span className='text-sm text-green-600'>
										Video yuklangan ✓
									</span>
								</div>
							) : (
								<div className='flex items-center justify-center gap-2'>
									<Upload className='h-5 w-5 text-gray-400' />
									<span className='text-sm text-gray-500 dark:text-gray-400'>
										Promo video yuklash
									</span>
								</div>
							)}
						</div>
					</div>

					{/* Name */}
					<div className='space-y-2'>
						<Label htmlFor='name' className='dark:text-gray-200'>
							Kurs nomi *
						</Label>
						<Input
							id='name'
							name='name'
							value={form.name}
							onChange={handleChange}
							placeholder='Masalan: React.js asoslari'
							required
							className='dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400'
						/>
					</div>

					{/* Slug */}
					<div className='space-y-2'>
						<Label htmlFor='slug' className='dark:text-gray-200'>
							Slug (URL)
						</Label>
						<Input
							id='slug'
							name='slug'
							value={form.slug}
							onChange={handleChange}
							placeholder='react-js-asoslari'
							className='dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400'
						/>
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
							placeholder='Kurs haqida qisqacha ma`lumot...'
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
							value={form.orderNumber}
							onChange={handleChange}
							placeholder='1'
							className='dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400'
						/>
					</div>

					{/* Telegram Section */}
					<div className='border-t dark:border-gray-700 pt-6'>
						<h3 className='text-lg font-medium mb-4 dark:text-white'>
							Telegram sozlamalari
						</h3>
						<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
							<div className='space-y-2'>
								<div className='flex items-center gap-2'>
									<input
										type='checkbox'
										id='hasTelegramGroup'
										name='hasTelegramGroup'
										checked={form.hasTelegramGroup}
										onChange={handleChange}
										className='rounded dark:bg-gray-700 dark:border-gray-600'
									/>
									<Label
										htmlFor='hasTelegramGroup'
										className='dark:text-gray-200'
									>
										Telegram guruhi bor
									</Label>
								</div>
								{form.hasTelegramGroup && (
									<Input
										name='telegramGroupLink'
										value={form.telegramGroupLink}
										onChange={handleChange}
										placeholder='https://t.me/group_link'
										className='dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400'
									/>
								)}
							</div>
							<div className='space-y-2'>
								<div className='flex items-center gap-2'>
									<input
										type='checkbox'
										id='hasTelegramChannel'
										name='hasTelegramChannel'
										checked={form.hasTelegramChannel}
										onChange={handleChange}
										className='rounded dark:bg-gray-700 dark:border-gray-600'
									/>
									<Label
										htmlFor='hasTelegramChannel'
										className='dark:text-gray-200'
									>
										Telegram kanali bor
									</Label>
								</div>
								{form.hasTelegramChannel && (
									<Input
										name='telegramChannelLink'
										value={form.telegramChannelLink}
										onChange={handleChange}
										placeholder='https://t.me/channel_link'
										className='dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400'
									/>
								)}
							</div>
						</div>
					</div>

					{/* Actions */}
					<div className='flex items-center justify-end gap-3 pt-4 border-t dark:border-gray-700'>
						<Link to='/admin/courses'>
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
									Yangilash
								</>
							)}
						</Button>
					</div>
				</form>
			</div>
		</div>
	)
}
