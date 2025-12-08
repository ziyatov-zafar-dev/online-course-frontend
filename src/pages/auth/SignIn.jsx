import { signIn } from "@/api/auth"
import GoogleLogo from "@/assets/google.svg"
import Logo from "@/assets/logo.svg"
import Bg from "@/assets/register-bg.jpg"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Eye, EyeOff, Loader2 } from "lucide-react"
import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { toast } from "sonner"

const SignIn = () => {
	const navigate = useNavigate()

	const [form, setForm] = useState({
		email: "",
		password: "",
	})
	const [showPassword, setShowPassword] = useState(false)
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState("")

	const handleSubmit = async (e) => {
		e.preventDefault()
		setLoading(true)
		setError("")

		try {
			const res = await signIn(form)

			if (res?.data?.success) {
				toast.success("Muvaffaqiyatli!", {
					description: "Tasdiqlash kodi emailingizga yuborildi.",
				})
				navigate("/signin/verify", { state: { email: form.email } })
			}
		} catch (err) {
			let msg = "Noma'lum xatolik yuz berdi."

			if (err.response?.status === 401) {
				msg = "Siz hali ro'yxatdan o'tmagansiz yoki email/parol noto'g'ri."
			}

			if (err.response?.status === 404) {
				msg = "Bunday foydalanuvchi topilmadi. Avval ro'yxatdan o'ting."
			}

			if (err.response?.data?.message) {
				msg = err.response.data.message
			}

			toast.error("Xatolik!", { description: msg })
			setError(msg)
		} finally {
			setLoading(false)
		}
	}

	const handleGoogleLogin = () => {
		window.location.href = "https://codebyz.online/oauth2/authorization/google"
	}

	return (
		<div
			className='min-h-screen w-full flex items-center justify-center px-4 py-6 bg-cover bg-center bg-no-repeat'
			style={{ backgroundImage: `url(${Bg})` }}
		>
			<Card className='w-full max-w-5xl flex flex-col md:flex-row rounded-3xl overflow-hidden bg-white/95 backdrop-blur-xl shadow-2xl'>
				{/* LEFT SIDE - Form */}
				<CardContent className='w-full md:w-1/2 px-6 sm:px-10 py-10 flex flex-col justify-center'>
					{/* Logo */}
					<div className='mb-8 flex items-center gap-2'>
						<span className='inline-flex h-8 w-8 items-center justify-center rounded-xl bg-blue-500 text-white text-xs font-bold'>
							&lt;/&gt;
						</span>
						<span className='font-semibold text-lg text-gray-900 tracking-tight'>
							CodeByZ
						</span>
					</div>

					<h1 className='text-2xl sm:text-3xl font-bold text-gray-900'>
						Xush kelibsiz
					</h1>
					<p className='mt-2 text-sm text-gray-600'>
						CodeByZ hisobingizga kiring
					</p>

					{/* Error Message */}
					{error && (
						<div className='mt-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm'>
							{error}
						</div>
					)}

					{/* Form */}
					<form className='mt-6 space-y-5' onSubmit={handleSubmit}>
						<div className='space-y-2'>
							<Label htmlFor='email' className='text-gray-700 font-medium'>
								Email
							</Label>
							<Input
								type='email'
								id='email'
								placeholder='me@example.com'
								required
								className='py-2 px-4 w-full text-black border-2 border-gray-200 rounded-xl outline-blue-500'
								value={form.email}
								onChange={(e) => setForm({ ...form, email: e.target.value })}
							/>
						</div>

						<div className='space-y-2'>
							<div className='flex justify-between items-center'>
								<Label htmlFor='password' className='text-gray-700 font-medium'>
									Parol
								</Label>
								<Link
									to='/forgot-password'
									className='text-sm text-blue-500 hover:underline font-medium'
								>
									Parolni unutdingizmi?
								</Link>
							</div>

							<div className='relative'>
								<Input
									type={showPassword ? "text" : "password"}
									id='password'
									placeholder='••••••••'
									required
									className='py-2 px-4 text-black pr-12 w-full border-2 border-gray-200 rounded-xl outline-blue-500'
									value={form.password}
									onChange={(e) =>
										setForm({ ...form, password: e.target.value })
									}
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

						<Button
							type='submit'
							disabled={loading}
							className='w-full py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-blue-500/25'
						>
							{loading ? (
								<>
									<Loader2 className='inline-flex h-5 w-5 items-center justify-center mr-2 animate-spin' />
									Kod yuborilmoqda...
								</>
							) : (
								"Kirish"
							)}
						</Button>
					</form>

					{/* Divider */}
					<div className='mt-6'>
						<div className='flex items-center gap-3 mb-4'>
							<Separator className='flex-1 bg-gray-200' />
							<span className='text-sm text-gray-500'>yoki davom eting</span>
							<Separator className='flex-1 bg-gray-200' />
						</div>

						{/* Google Button */}
						<Button
							type='button'
							variant='outline'
							className='w-full bg-neutral-500 text-neutral-100 hover:bg-neutral-600 py-2 rounded-lg'
							onClick={handleGoogleLogin}
						>
							<img
								src={GoogleLogo}
								alt='Google'
								className='inline-flex h-5 w-5 items-center justify-center mr-2'
							/>
							Google bilan kirish
						</Button>
					</div>

					{/* Sign Up Link */}
					<p className='mt-8 text-center text-sm text-gray-600'>
						Hisobingiz yo'qmi?{" "}
						<Link
							to='/signup'
							className='text-blue-500 hover:text-blue-600 font-semibold'
						>
							Ro'yxatdan o'tish
						</Link>
					</p>
				</CardContent>

				{/* RIGHT SIDE - Logo */}
				<div className='hidden md:flex w-1/2 bg-blue-500 items-center justify-center p-8'>
					<img
						src={Logo}
						alt='CodeByZ Logo'
						className='max-w-full max-h-full object-contain'
					/>
				</div>
			</Card>
		</div>
	)
}

export default SignIn
