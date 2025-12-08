import { resetPassword } from "@/api/auth"
import Bg from "@/assets/register-bg.jpg"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff, Loader2, ShieldCheck } from "lucide-react"
import { useState } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { toast } from "sonner"

const ResetPassword = () => {
	const { state } = useLocation()
	const email = state?.email || ""
	const navigate = useNavigate()

	const [form, setForm] = useState({
		code: "",
		newPassword: "",
		confirmPassword: "",
	})
	const [error, setError] = useState("")
	const [loading, setLoading] = useState(false)
	const [showPassword, setShowPassword] = useState(false)
	const [showConfirmPassword, setShowConfirmPassword] = useState(false)

	const handleSubmit = async (e) => {
		e.preventDefault()
		setError("")
		setLoading(true)

		if (form.newPassword !== form.confirmPassword) {
			setError("Parollar mos kelmadi!")
			setLoading(false)
			return
		}

		try {
			const res = await resetPassword({
				email,
				code: form.code,
				newPassword: form.newPassword,
				confirmPassword: form.confirmPassword,
			})

			if (res?.data?.success) {
				toast.success("Parol muvaffaqiyatli tiklandi!", {
					description: "Kirish sahifasiga yo'naltirilmoqda...",
				})
				setTimeout(() => navigate("/signin"), 1500)
			} else {
				const msg = res?.data?.message || "Kod yoki parol xato!"
				toast.error("Xatolik!", { description: msg })
				setError(msg)
			}
		} catch (err) {
			const msg = err?.response?.data?.message || "Kod yoki parol xato!"
			toast.error("Xatolik!", { description: msg })
			setError(msg)
		} finally {
			setLoading(false)
		}
	}

	return (
		<div
			className='min-h-screen w-full flex items-center justify-center px-4 py-6 bg-cover bg-center bg-no-repeat'
			style={{ backgroundImage: `url(${Bg})` }}
		>
			<Card className='w-full max-w-md overflow-hidden bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl'>
				<CardContent className='p-8 sm:p-10'>
					{/* Logo */}
					<div className='mb-6 flex items-center justify-center gap-2'>
						<span className='inline-flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500 text-white text-sm font-bold'>
							&lt;/&gt;
						</span>
						<span className='font-semibold text-xl text-gray-900 tracking-tight'>
							CodeByZ
						</span>
					</div>

					{/* Icon */}
					<div className='flex justify-center mb-6'>
						<div className='w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center'>
							<ShieldCheck className='w-8 h-8 text-blue-500' />
						</div>
					</div>

					{/* Header */}
					<div className='text-center mb-6'>
						<h1 className='text-2xl font-bold text-gray-900 mb-2'>
							Yangi parol o'rnating
						</h1>
						<p className='text-sm text-gray-600'>
							<span className='font-semibold text-blue-500'>{email}</span>
							<br />
							manziliga yuborilgan kodni kiriting
						</p>
					</div>

					{/* Error Message */}
					{error && (
						<div className='mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm text-center'>
							{error}
						</div>
					)}

					{/* Form */}
					<form onSubmit={handleSubmit} className='space-y-4'>
						<div className='space-y-2'>
							<Label htmlFor='code' className='text-gray-700 font-medium'>
								Tasdiqlash kodi
							</Label>
							<Input
								id='code'
								type='text'
								placeholder='XXXXXX'
								className='h-12 px-4 w-full border-2 border-gray-200 rounded-xl outline-blue-500 text-black text-center text-lg tracking-widest'
								value={form.code}
								onChange={(e) => setForm({ ...form, code: e.target.value })}
								required
							/>
						</div>

						<div className='space-y-2'>
							<Label
								htmlFor='newPassword'
								className='text-gray-700 font-medium'
							>
								Yangi parol
							</Label>
							<div className='relative'>
								<Input
									id='newPassword'
									type={showPassword ? "text" : "password"}
									placeholder='Yangi parol'
									className='h-12 px-4 pr-12 w-full border-2 border-gray-200 rounded-xl outline-blue-500 text-black'
									value={form.newPassword}
									onChange={(e) =>
										setForm({ ...form, newPassword: e.target.value })
									}
									required
									minLength={6}
								/>
								<button
									type='button'
									onClick={() => setShowPassword(!showPassword)}
									className='absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors'
								>
									{showPassword ? (
										<EyeOff className='h-5 w-5' />
									) : (
										<Eye className='h-5 w-5' />
									)}
								</button>
							</div>
						</div>

						<div className='space-y-2'>
							<Label
								htmlFor='confirmPassword'
								className='text-gray-700 font-medium'
							>
								Parolni tasdiqlang
							</Label>
							<div className='relative'>
								<Input
									id='confirmPassword'
									type={showConfirmPassword ? "text" : "password"}
									placeholder='Yangi parol (takroran)'
									className='h-12 px-4 pr-12 w-full border-2 border-gray-200 rounded-xl outline-blue-500 text-black'
									value={form.confirmPassword}
									onChange={(e) =>
										setForm({ ...form, confirmPassword: e.target.value })
									}
									required
									minLength={6}
								/>
								<button
									type='button'
									onClick={() => setShowConfirmPassword(!showConfirmPassword)}
									className='absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors'
								>
									{showConfirmPassword ? (
										<EyeOff className='h-5 w-5' />
									) : (
										<Eye className='h-5 w-5' />
									)}
								</button>
							</div>
						</div>

						<Button
							type='submit'
							disabled={loading}
							className='w-full h-12 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-blue-500/25'
						>
							{loading ? (
								<>
									<Loader2 className='inline-flex h-5 w-5 items-center justify-center mr-2 animate-spin' />
									Tiklanmoqda...
								</>
							) : (
								"Parolni tiklash"
							)}
						</Button>
					</form>

					{/* Back Link */}
					<p className='mt-6 text-center text-sm text-gray-600'>
						Parol esga tushdimi?{" "}
						<Link
							to='/signin'
							className='text-blue-500 hover:text-blue-600 font-semibold'
						>
							Kirish
						</Link>
					</p>
				</CardContent>
			</Card>
		</div>
	)
}

export default ResetPassword
