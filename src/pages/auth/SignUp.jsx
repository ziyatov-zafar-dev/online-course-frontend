import { signUp } from "@/api/auth"
import Logo from "@/assets/logo.svg"
import Bg from "@/assets/register-bg.jpg"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff, Loader2 } from "lucide-react"
import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { toast } from "sonner"

export default function SignUp() {
	const navigate = useNavigate()
	const [values, setValues] = useState({
		firstname: "",
		lastname: "",
		email: "",
		password: "",
		confirmPassword: "",
		birthDate: "",
	})
	const [loading, setLoading] = useState(false)
	const [showPassword, setShowPassword] = useState(false)
	const [showConfirmPassword, setShowConfirmPassword] = useState(false)
	const [error, setError] = useState("")

	const handleChange = (e) => {
		setValues({ ...values, [e.target.name]: e.target.value })
		setError("")
	}

	const handleSubmit = async (e) => {
		e.preventDefault()
		setError("")

		if (!values.firstname.trim()) {
			setError("Ismingizni kiriting")
			return
		}

		if (!values.lastname.trim()) {
			setError("Familiyangizni kiriting")
			return
		}

		if (values.password !== values.confirmPassword) {
			setError("Parollar mos kelmadi")
			return
		}

		if (values.password.length < 6) {
			setError("Parol kamida 6 ta belgidan iborat bo'lishi kerak")
			return
		}

		setLoading(true)
		try {
			const res = await signUp({
				firstname: values.firstname,
				lastname: values.lastname,
				email: values.email,
				password: values.password,
				confirmPassword: values.confirmPassword,
				birthDate: values.birthDate || null,
			})

			if (res?.data?.success) {
				toast.success("Muvaffaqiyatli!", {
					description: "Tasdiqlash kodi emailingizga yuborildi.",
				})
				navigate("/signup/verify", { state: { email: values.email } })
			}
		} catch (err) {
			let msg = "Ro'yxatdan o'tishda xatolik yuz berdi"
			if (err.response?.data?.message) {
				msg = err.response.data.message
			}
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
			<Card className='w-full max-w-5xl flex flex-col md:flex-row rounded-3xl bg-white/95 backdrop-blur-xl shadow-2xl'>
				{/* LEFT SIDE - Logo */}
				<div className='hidden md:flex w-1/2 bg-blue-500 items-center justify-center p-8'>
					<img
						src={Logo}
						alt='CodeByZ Logo'
						className='max-w-full max-h-full object-contain'
					/>
				</div>

				{/* RIGHT SIDE - Form */}
				<CardContent className='w-full md:w-1/2 px-6 sm:px-10 py-8 flex flex-col justify-center '>
					{/* Logo */}
					<div className='mb-6 flex items-center gap-2'>
						<span className='inline-flex h-8 w-8 items-center justify-center rounded-xl bg-blue-500 text-white text-xs font-bold'>
							&lt;/&gt;
						</span>
						<span className='font-semibold text-lg text-gray-900 tracking-tight'>
							CodeByZ
						</span>
					</div>

					<h1 className='text-2xl sm:text-3xl font-bold text-gray-900'>
						Ro'yxatdan o'ting
					</h1>
					<p className='mt-2 text-sm text-gray-600'>
						Bepul hisob yarating va o'rganishni boshlang
					</p>

					{/* Error Message */}
					{error && (
						<div className='mt-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm'>
							{error}
						</div>
					)}

					{/* Form */}
					<form className='mt-5 space-y-4' onSubmit={handleSubmit}>
						{/* Firstname & Lastname */}
						<div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
							<div className='space-y-1.5'>
								<Label
									htmlFor='firstname'
									className='text-gray-700 font-medium text-sm'
								>
									Ism *
								</Label>
								<Input
									id='firstname'
									name='firstname'
									type='text'
									value={values.firstname}
									onChange={handleChange}
									className='h-11 px-4 w-full border-2 border-gray-200 rounded-xl outline-blue-500 text-black'
									placeholder='Ism'
									required
								/>
							</div>
							<div className='space-y-1.5'>
								<Label
									htmlFor='lastname'
									className='text-gray-700 font-medium text-sm'
								>
									Familiya *
								</Label>
								<Input
									id='lastname'
									name='lastname'
									type='text'
									value={values.lastname}
									onChange={handleChange}
									className='h-11 px-4 w-full border-2 border-gray-200 rounded-xl outline-blue-500 text-black'
									placeholder='Familiya'
									required
								/>
							</div>
						</div>

						{/* Email */}
						<div className='space-y-1.5'>
							<Label
								htmlFor='email'
								className='text-gray-700 font-medium text-sm'
							>
								Email *
							</Label>
							<Input
								id='email'
								name='email'
								type='email'
								value={values.email}
								onChange={handleChange}
								className='h-11 px-4 w-full border-2 border-gray-200 rounded-xl outline-blue-500 text-black'
								placeholder='me@example.com'
								required
							/>
						</div>

						{/* Birth Date */}
						<div className='space-y-1.5'>
							<Label
								htmlFor='birthDate'
								className='text-gray-700 font-medium text-sm'
							>
								Tug'ilgan sana <br />
							</Label>
							<Input
								id='birthDate'
								name='birthDate'
								type='date'
								value={values.birthDate}
								onChange={handleChange}
								className='h-11 px-4 w-full border-2 border-gray-200 rounded-xl outline-blue-500 text-black bg-white/95 backdrop-blur-xl'
							/>
						</div>

						{/* Password */}
						<div className='space-y-1.5'>
							<Label
								htmlFor='password'
								className='text-gray-700 font-medium text-sm'
							>
								Parol *
							</Label>
							<div className='relative'>
								<Input
									id='password'
									name='password'
									type={showPassword ? "text" : "password"}
									value={values.password}
									onChange={handleChange}
									className='h-11 px-4 pr-12 w-full border-2 border-gray-200 rounded-xl outline-blue-500 text-black'
									placeholder='Kamida 6 ta belgi'
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

						{/* Confirm Password */}
						<div className='space-y-1.5'>
							<Label
								htmlFor='confirmPassword'
								className='text-gray-700 font-medium text-sm'
							>
								Parolni tasdiqlang *
							</Label>
							<div className='relative'>
								<Input
									id='confirmPassword'
									name='confirmPassword'
									type={showConfirmPassword ? "text" : "password"}
									value={values.confirmPassword}
									onChange={handleChange}
									className='h-11 px-4 pr-12 w-full border-2 border-gray-200 rounded-xl outline-blue-500 text-black'
									placeholder='Parolni qaytadan kiriting'
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
									Ro'yxatdan o'tilmoqda...
								</>
							) : (
								"Ro'yxatdan o'tish"
							)}
						</Button>
					</form>

					{/* Sign In Link */}
					<p className='mt-6 text-center text-sm text-gray-600'>
						Hisobingiz bormi?{" "}
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
