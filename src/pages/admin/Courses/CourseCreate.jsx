import { getCategories } from "@/api/categories"
import { createCourse } from "@/api/courses"
import { getTeachers } from "@/api/teachers"
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
import { ArrowLeft, ImagePlus, Loader2, Save } from "lucide-react"
import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { toast } from "sonner"

export default function CourseCreate() {
	const navigate = useNavigate()
	const [loading, setLoading] = useState(false)
	const [categories, setCategories] = useState([])
	const [teachers, setTeachers] = useState([])
	const [form, setForm] = useState({
		name: "",
		description: "",
		slug: "",
		orderNumber: 1,
		categoryId: "",
		teacherId: "",
		price: "",
		finalPrice: "",
		discountPrice: "",
		discountPercent: "",
		discountStartAt: "",
		discountEndAt: "",
		telegramGroupLink: "",
		telegramChannelLink: "",
		hasTelegramGroup: false,
		hasTelegramChannel: false,
	})

	useEffect(() => {
		fetchCategories()
		fetchTeachers()
	}, [])

	const fetchCategories = async () => {
		try {
			const { data } = await getCategories()
			setCategories(data?.data || data || [])
		} catch (err) {
			console.error("Failed to fetch categories:", err)
		}
	}

	const fetchTeachers = async () => {
		try {
			const { data } = await getTeachers()
			setTeachers(data?.data || data || [])
		} catch (err) {
			console.error("Failed to fetch teachers:", err)
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

	// Auto-generate slug from name
	const generateSlug = (name) => {
		return name
			.toLowerCase()
			.replace(/[^a-z0-9\s-]/g, "")
			.replace(/\s+/g, "-")
			.replace(/-+/g, "-")
			.trim()
	}

	const handleNameChange = (e) => {
		const name = e.target.value
		setForm((prev) => ({
			...prev,
			name,
			slug: generateSlug(name),
		}))
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
				categoryId: form.categoryId || null,
				teacherId: form.teacherId ? parseInt(form.teacherId) : null,
				price: form.price ? parseFloat(form.price) : null,
				finalPrice: form.finalPrice ? parseFloat(form.finalPrice) : null,
				discountPrice: form.discountPrice
					? parseFloat(form.discountPrice)
					: null,
				discountPercent: form.discountPercent
					? parseInt(form.discountPercent)
					: null,
				discountStartAt: form.discountStartAt || null,
				discountEndAt: form.discountEndAt || null,
				telegramGroupLink: form.telegramGroupLink || null,
				telegramChannelLink: form.telegramChannelLink || null,
				hasTelegramGroup: form.hasTelegramGroup,
				hasTelegramChannel: form.hasTelegramChannel,
			}
			await createCourse(payload)
			toast.success("Kurs muvaffaqiyatli yaratildi!")
			navigate("/admin/courses")
		} catch (err) {
			toast.error(
				err.response?.data?.message || "Kurs yaratishda xatolik yuz berdi"
			)
			console.error(err)
		} finally {
			setLoading(false)
		}
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
						Yangi kurs qo'shish
					</h1>
					<p className='text-sm text-gray-500 dark:text-gray-400'>
						Kurs ma'lumotlarini kiriting
					</p>
				</div>
			</div>

			{/* Form */}
			<div className='bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6'>
				<form onSubmit={handleSubmit} className='space-y-6'>
					{/* Thumbnail */}
					<div className='space-y-2'>
						<Label className='dark:text-gray-200'>Kurs rasmi</Label>
						<div className='border-2 border-dashed border-gray-200 dark:border-gray-600 rounded-lg p-8 text-center hover:border-blue-300 dark:hover:border-blue-500 transition-colors cursor-pointer dark:bg-gray-700/50'>
							<ImagePlus className='h-10 w-10 text-gray-400 mx-auto mb-3' />
							<p className='text-sm text-gray-500 dark:text-gray-400'>
								Rasmni yuklash uchun bosing yoki tortib olib keling
							</p>
							<p className='text-xs text-gray-400 dark:text-gray-500 mt-1'>
								PNG, JPG, GIF (max 5MB)
							</p>
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
							onChange={handleNameChange}
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

					{/* Two Columns - Category & Teacher */}
					<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
						{/* Category */}
						<div className='space-y-2'>
							<Label className='dark:text-gray-200'>Kategoriya</Label>
							<Select
								value={form.categoryId}
								onValueChange={(value) =>
									handleSelectChange("categoryId", value)
								}
							>
								<SelectTrigger className='dark:bg-gray-700 dark:border-gray-600 dark:text-white'>
									<SelectValue placeholder='Kategoriyani tanlang' />
								</SelectTrigger>
								<SelectContent className='dark:bg-gray-800 dark:border-gray-700'>
									{categories.map((cat) => (
										<SelectItem
											key={cat.categoryId}
											value={cat.categoryId}
											className='dark:text-white dark:focus:bg-gray-700'
										>
											{cat.name}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>

						{/* Teacher */}
						<div className='space-y-2'>
							<Label className='dark:text-gray-200'>O'qituvchi</Label>
							<Select
								value={form.teacherId}
								onValueChange={(value) =>
									handleSelectChange("teacherId", value)
								}
							>
								<SelectTrigger className='dark:bg-gray-700 dark:border-gray-600 dark:text-white'>
									<SelectValue placeholder="O'qituvchini tanlang" />
								</SelectTrigger>
								<SelectContent className='dark:bg-gray-800 dark:border-gray-700'>
									{teachers.map((teacher) => (
										<SelectItem
											key={teacher.teacherId}
											value={String(teacher.teacherId)}
											className='dark:text-white dark:focus:bg-gray-700'
										>
											{teacher.userInformation?.firstname}{" "}
											{teacher.userInformation?.lastname}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
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

						{/* Price */}
						<div className='space-y-2'>
							<Label htmlFor='price' className='dark:text-gray-200'>
								Narxi (so'm)
							</Label>
							<Input
								id='price'
								name='price'
								type='number'
								value={form.price}
								onChange={handleChange}
								placeholder='0'
								className='dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400'
							/>
						</div>
					</div>

					{/* Discount Section */}
					<div className='border-t dark:border-gray-700 pt-6'>
						<h3 className='text-lg font-medium mb-4 dark:text-white'>
							Chegirma sozlamalari
						</h3>
						<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
							<div className='space-y-2'>
								<Label htmlFor='discountPercent' className='dark:text-gray-200'>
									Chegirma foizi (%)
								</Label>
								<Input
									id='discountPercent'
									name='discountPercent'
									type='number'
									value={form.discountPercent}
									onChange={handleChange}
									placeholder='0'
									className='dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400'
								/>
							</div>
							<div className='space-y-2'>
								<Label htmlFor='discountPrice' className='dark:text-gray-200'>
									Chegirma narxi
								</Label>
								<Input
									id='discountPrice'
									name='discountPrice'
									type='number'
									value={form.discountPrice}
									onChange={handleChange}
									placeholder='0'
									className='dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400'
								/>
							</div>
							<div className='space-y-2'>
								<Label htmlFor='discountStartAt' className='dark:text-gray-200'>
									Chegirma boshlanishi
								</Label>
								<Input
									id='discountStartAt'
									name='discountStartAt'
									type='datetime-local'
									value={form.discountStartAt}
									onChange={handleChange}
									className='dark:bg-gray-700 dark:border-gray-600 dark:text-white'
								/>
							</div>
							<div className='space-y-2'>
								<Label htmlFor='discountEndAt' className='dark:text-gray-200'>
									Chegirma tugashi
								</Label>
								<Input
									id='discountEndAt'
									name='discountEndAt'
									type='datetime-local'
									value={form.discountEndAt}
									onChange={handleChange}
									className='dark:bg-gray-700 dark:border-gray-600 dark:text-white'
								/>
							</div>
						</div>
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
