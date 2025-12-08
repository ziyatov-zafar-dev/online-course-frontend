import { getUser, updateUser } from "@/api/users"
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
import { Link, useNavigate, useParams } from "react-router-dom"
import { toast } from "sonner"

export default function UserEdit() {
	const { id } = useParams()
	const navigate = useNavigate()

	const [loading, setLoading] = useState(false)
	const [fetching, setFetching] = useState(true)
	const [form, setForm] = useState({
		username: "",
		email: "",
		fullName: "",
		role: "user",
	})

	useEffect(() => {
		fetchUser()
	}, [id])

	const fetchUser = async () => {
		setFetching(true)
		try {
			const res = await getUser(id)
			const user = res.data?.data || res.data
			setForm({
				username: user.username || "",
				email: user.email || "",
				fullName: user.fullName || user.name || "",
				role: user.role || "user",
			})
		} catch (err) {
			toast.error("Foydalanuvchi ma'lumotlarini yuklashda xatolik")
			console.error(err)
		} finally {
			setFetching(false)
		}
	}

	const handleChange = (e) => {
		const { name, value } = e.target
		setForm((prev) => ({ ...prev, [name]: value }))
	}

	const handleSelectChange = (name, value) => {
		setForm((prev) => ({ ...prev, [name]: value }))
	}

	const handleSubmit = async (e) => {
		e.preventDefault()

		if (!form.username.trim()) {
			toast.error("Foydalanuvchi nomini kiriting")
			return
		}

		if (!form.email.trim()) {
			toast.error("Email manzilini kiriting")
			return
		}

		setLoading(true)
		try {
			await updateUser(id, {
				username: form.username,
				email: form.email,
				fullName: form.fullName,
				role: form.role,
			})
			toast.success("Foydalanuvchi muvaffaqiyatli yangilandi!")
			navigate("/admin/users")
		} catch (err) {
			toast.error(
				err.response?.data?.message ||
					"Foydalanuvchini yangilashda xatolik yuz berdi"
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
		<div className='max-w-2xl mx-auto'>
			{/* Header */}
			<div className='flex items-center gap-4 mb-6'>
				<Link to='/admin/users'>
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
						Foydalanuvchini tahrirlash
					</h1>
					<p className='text-sm text-gray-500 dark:text-gray-400'>
						Foydalanuvchi ma'lumotlarini yangilang
					</p>
				</div>
			</div>

			{/* Form */}
			<div className='bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6'>
				<form onSubmit={handleSubmit} className='space-y-6'>
					{/* Username */}
					<div className='space-y-2'>
						<Label htmlFor='username' className='dark:text-gray-200'>
							Foydalanuvchi nomi *
						</Label>
						<Input
							id='username'
							name='username'
							value={form.username}
							onChange={handleChange}
							placeholder='username'
							className='dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400'
						/>
					</div>

					{/* Email */}
					<div className='space-y-2'>
						<Label htmlFor='email' className='dark:text-gray-200'>
							Email *
						</Label>
						<Input
							id='email'
							name='email'
							type='email'
							value={form.email}
							onChange={handleChange}
							placeholder='user@example.com'
							className='dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400'
						/>
					</div>

					{/* Full Name */}
					<div className='space-y-2'>
						<Label htmlFor='fullName' className='dark:text-gray-200'>
							To'liq ism
						</Label>
						<Input
							id='fullName'
							name='fullName'
							value={form.fullName}
							onChange={handleChange}
							placeholder='Ism Familiya'
							className='dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400'
						/>
					</div>

					{/* Role */}
					<div className='space-y-2'>
						<Label className='dark:text-gray-200'>Rol</Label>
						<Select
							value={form.role}
							onValueChange={(value) => handleSelectChange("role", value)}
						>
							<SelectTrigger className='dark:bg-gray-700 dark:border-gray-600 dark:text-white'>
								<SelectValue placeholder='Rolni tanlang' />
							</SelectTrigger>
							<SelectContent className='dark:bg-gray-800 dark:border-gray-700'>
								<SelectItem
									value='user'
									className='dark:text-gray-200 dark:focus:bg-gray-700'
								>
									Foydalanuvchi
								</SelectItem>
								<SelectItem
									value='moderator'
									className='dark:text-gray-200 dark:focus:bg-gray-700'
								>
									Moderator
								</SelectItem>
								<SelectItem
									value='admin'
									className='dark:text-gray-200 dark:focus:bg-gray-700'
								>
									Admin
								</SelectItem>
							</SelectContent>
						</Select>
					</div>

					{/* Actions */}
					<div className='flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700'>
						<Link to='/admin/users'>
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
