import { changePassword } from "@/api/user"
import Bg from "@/assets/register-bg.jpg"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { toast } from "sonner"

export default function ChangePasswordForm() {
	const [form, setForm] = useState({
		currentPassword: "",
		newPassword: "",
		confirmPassword: "",
	})
	const [loading, setLoading] = useState(false)
	const [message, setMessage] = useState("")
	const [showPassword, setShowPassword] = useState(false)
	const [showConfirmPassword, setShowConfirmPassword] = useState(false)
	const [showCurrentPassword, setShowCurrentPassword] = useState(false)

	const handleChange = (e) => {
		const { name, value } = e.target
		setForm((prev) => ({ ...prev, [name]: value }))
	}

	const handleSubmit = async (e) => {
		e.preventDefault()
		setMessage("")

		if (form.newPassword !== form.confirmPassword) {
			toast.error("Yangi parol va tasdiqlash bir xil bo‘lishi kerak!")
			return
		}

		setLoading(true)
		try {
			const res = await changePassword(form)
			if (res.data.success) {
				toast.success("Parol muvaffaqiyatli o‘zgartirildi!")
				setForm({ currentPassword: "", newPassword: "", confirmPassword: "" })
			} else {
				setMessage(res.data.message || "Xatolik yuz berdi")
				toast.error(res.data.message || "Xatolik yuz berdi")
			}
		} catch (err) {
			setMessage(err.response?.data?.message || "Xatolik yuz berdi")
			toast.error(err.response?.data?.message || "Xatolik yuz berdi")
		} finally {
			setLoading(false)
		}
	}

	return (
		<div
			style={{ backgroundImage: `url(${Bg})` }}
			className='min-h-screen flex items-center justify-center'
		>
			<Card className='w-full max-w-md rounded-2xl shadow-xl bg-white/90 backdrop-blur-lg overflow-hidden p-10'>
				<CardHeader>
					<CardTitle className='text-2xl font-semibold text-neutral-900 py-2'>
						Parolni o‘zgartirish
					</CardTitle>
				</CardHeader>
				<CardContent>
					<form className='space-y-6' onSubmit={handleSubmit}>
						<div>
							<Label htmlFor='currentPassword'>Joriy parol</Label>
							<div className='relative'>
								<Input
									type={showPassword ? "text" : "password"}
									id='currentPassword'
									name='currentPassword'
									value={form.currentPassword}
									onChange={handleChange}
									placeholder='Joriy parol'
									className='w-full pr-10 mt-1 p-2 border rounded outline-blue-500'
									required
								/>
								<Button
									type='button'
									variant='ghost'
									className='absolute right-2 top-1/2 -translate-y-1/2 p-1 h-auto w-auto text-gray-500 hover:text-gray-700'
									onClick={() => setShowPassword(!showPassword)}
								>
									{showPassword ? (
										<svg
											xmlns='http://www.w3.org/2000/svg'
											className='h-5 w-5'
											fill='none'
											viewBox='0 0 24 24'
											stroke='currentColor'
										>
											<path
												strokeLinecap='round'
												strokeLinejoin='round'
												strokeWidth={2}
												d='M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10 0-1.145.184-2.246.525-3.263M6.24 6.24A9.964 9.964 0 0112 5c5.523 0 10 4.477 10 10 0 1.145-.184 2.246-.525 3.263M15 12a3 3 0 11-6 0 3 3 0 016 0z'
											/>
										</svg>
									) : (
										<svg
											xmlns='http://www.w3.org/2000/svg'
											className='h-5 w-5'
											fill='none'
											viewBox='0 0 24 24'
											stroke='currentColor'
										>
											<path
												strokeLinecap='round'
												strokeLinejoin='round'
												strokeWidth={2}
												d='M3 3l18 18M10.477 10.477a3 3 0 104.046 4.046M9.879 5.879a10.05 10.05 0 0110.242 10.242M4.636 4.636a10.05 10.05 0 0114.728 14.728'
											/>
										</svg>
									)}
								</Button>
							</div>
						</div>
						<div>
							<Label htmlFor='newPassword'>Yangi parol</Label>
							<div className='relative'>
								<Input
									type={showConfirmPassword ? "text" : "password"}
									id='newPassword'
									name='newPassword'
									value={form.newPassword}
									onChange={handleChange}
									placeholder='Yangi parol'
									className='w-full pr-10 mt-1 p-2 border rounded outline-blue-500'
									required
								/>
								<Button
									type='button'
									variant='ghost'
									className='absolute right-2 top-1/2 -translate-y-1/2 p-1 h-auto w-auto text-gray-500 hover:text-gray-700'
									onClick={() => setShowConfirmPassword(!showConfirmPassword)}
								>
									{showConfirmPassword ? (
										<svg
											xmlns='http://www.w3.org/2000/svg'
											className='h-5 w-5'
											fill='none'
											viewBox='0 0 24 24'
											stroke='currentColor'
										>
											<path
												strokeLinecap='round'
												strokeLinejoin='round'
												strokeWidth={2}
												d='M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10 0-1.145.184-2.246.525-3.263M6.24 6.24A9.964 9.964 0 0112 5c5.523 0 10 4.477 10 10 0 1.145-.184 2.246-.525 3.263M15 12a3 3 0 11-6 0 3 3 0 016 0z'
											/>
										</svg>
									) : (
										<svg
											xmlns='http://www.w3.org/2000/svg'
											className='h-5 w-5'
											fill='none'
											viewBox='0 0 24 24'
											stroke='currentColor'
										>
											<path
												strokeLinecap='round'
												strokeLinejoin='round'
												strokeWidth={2}
												d='M3 3l18 18M10.477 10.477a3 3 0 104.046 4.046M9.879 5.879a10.05 10.05 0 0110.242 10.242M4.636 4.636a10.05 10.05 0 0114.728 14.728'
											/>
										</svg>
									)}
								</Button>
							</div>
						</div>
						<div>
							<Label htmlFor='confirmPassword'>Parolni tasdiqlash</Label>
							<div className='relative'>
								<Input
									type={showCurrentPassword ? "text" : "password"}
									id='confirmPassword'
									name='confirmPassword'
									value={form.confirmPassword}
									onChange={handleChange}
									placeholder='Parolni tasdiqlash'
									className='w-full pr-10 mt-1 p-2 border rounded outline-blue-500'
									required
								/>
								<Button
									type='button'
									variant='ghost'
									className='absolute right-2 top-1/2 -translate-y-1/2 p-1 h-auto w-auto text-gray-500 hover:text-gray-700'
									onClick={() => setShowCurrentPassword(!showCurrentPassword)}
								>
									{showCurrentPassword ? (
										<svg
											xmlns='http://www.w3.org/2000/svg'
											className='h-5 w-5'
											fill='none'
											viewBox='0 0 24 24'
											stroke='currentColor'
										>
											<path
												strokeLinecap='round'
												strokeLinejoin='round'
												strokeWidth={2}
												d='M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10 0-1.145.184-2.246.525-3.263M6.24 6.24A9.964 9.964 0 0112 5c5.523 0 10 4.477 10 10 0 1.145-.184 2.246-.525 3.263M15 12a3 3 0 11-6 0 3 3 0 016 0z'
											/>
										</svg>
									) : (
										<svg
											xmlns='http://www.w3.org/2000/svg'
											className='h-5 w-5'
											fill='none'
											viewBox='0 0 24 24'
											stroke='currentColor'
										>
											<path
												strokeLinecap='round'
												strokeLinejoin='round'
												strokeWidth={2}
												d='M3 3l18 18M10.477 10.477a3 3 0 104.046 4.046M9.879 5.879a10.05 10.05 0 0110.242 10.242M4.636 4.636a10.05 10.05 0 0114.728 14.728'
											/>
										</svg>
									)}
								</Button>
							</div>
						</div>
						<Button
							type='submit'
							className='w-full bg-blue-500 text-neutral-100 hover:bg-blue-600 py-2 rounded-lg'
							disabled={loading}
						>
							{loading ? "Yangilanmoqda..." : "Saqlash"}
						</Button>
						{message && (
							<p className='text-center mt-2 text-red-600'>{message}</p>
						)}
					</form>
				</CardContent>
			</Card>
		</div>
	)
}
