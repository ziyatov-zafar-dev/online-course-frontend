import { signIn } from "@/api/auth"
import GoogleLogo from "@/assets/google.svg"
import Logo from "@/assets/logo.svg"
import Bg from "@/assets/register-bg.jpg"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { useState } from "react"
import { useNavigate } from "react-router-dom"

const SignIn = () => {
	const navigate = useNavigate()

	// Form State
	const [form, setForm] = useState({
		email: "",
		password: "",
	})

	// Parol ko'rinishi
	const [showPassword, setShowPassword] = useState(false)

	// Error & Loading
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState("")

	// Handle Submit
	const handleSubmit = async (e) => {
		e.preventDefault()
		setLoading(true)
		setError("")

		try {
			const res = await signIn(form)

			if (res?.data?.success) {
				navigate("/signin/verify", { state: { email: form.email } })
			}
		} catch (err) {
			setError(
				err.response?.data?.message || "Something went wrong, try again."
			)
		} finally {
			setLoading(false)
		}
	}

	return (
		<div
			className='min-h-screen w-full flex items-center justify-center px-4 py-6'
			style={{ backgroundImage: `url(${Bg})` }}
		>
			<Card className='w-full max-w-5xl flex flex-col md:flex-row rounded-3xl overflow-hidden bg-white/90 backdrop-blur-lg'>
				{/* LEFT SIDE */}
				<CardContent className='w-full md:w-1/2 px-6 sm:px-10 py-10 text-neutral-900 flex flex-col justify-center'>
					{/* Logo */}
					<div className='mb-8 flex items-center gap-2 text-sm text-neutral-900'>
						<span className='inline-flex h-7 w-7 items-center justify-center rounded-xl border border-neutral-600 text-xs font-semibold'>
							&lt;/&gt;
						</span>
						<span className='font-medium tracking-tight'>CodeByZ</span>
					</div>

					<h1 className='text-2xl sm:text-3xl font-semibold'>Xush kelibsiz</h1>
					<p className='mt-1 text-sm text-neutral-800'>
						CodeByZ hisobingizga kiring
					</p>

					{/* FORM */}
					<form className='mt-8 space-y-5' onSubmit={handleSubmit}>
						<div>
							<Label htmlFor='email' className='mb-1 block'>
								Email
							</Label>
							<Input
								type='email'
								id='email'
								placeholder='me@example.com'
								required
								className='py-2 px-3 w-full outline-blue-400 border rounded-md'
								value={form.email}
								onChange={(e) => setForm({ ...form, email: e.target.value })}
							/>
						</div>

						<div>
							<div className='flex justify-between mb-1'>
								<Label htmlFor='password'>Parol</Label>
								<button
									type='button'
									className='text-xs text-neutral-900 hover:underline'
									onClick={() => navigate("/forgot-password")}
								>
									Parolni unutdingizmi?
								</button>
							</div>

							<div className='relative'>
								<Input
									type={showPassword ? "text" : "password"}
									id='password'
									placeholder='••••••••'
									required
									className='py-2 px-3 w-full pr-10 outline-blue-400 border rounded-md'
									value={form.password}
									onChange={(e) =>
										setForm({ ...form, password: e.target.value })
									}
								/>

								{/* show password */}
								<button
									type='button'
									onClick={() => setShowPassword(!showPassword)}
									className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700'
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
								</button>
							</div>
						</div>

						{error && <p className='text-red-500 text-sm'>{error}</p>}

						<Button
							className='w-full bg-blue-500 text-white hover:bg-blue-600 py-2 rounded-lg'
							size='lg'
							type='submit'
							disabled={loading}
						>
							{loading ? "Kod yuborilmoqda..." : "Kirish"}
						</Button>
					</form>

					{/* GOOGLE BUTTON */}
					<div className='mt-6'>
						<div className='flex items-center gap-3 text-xs text-neutral-300 mb-3'>
							<Separator className='flex-1' />
							<span className=' text-neutral-900'>yoki davom eting</span>
							<Separator className='flex-1' />
						</div>
						<Button
							variant='outline'
							className='w-full bg-neutral-500 text-neutral-100 hover:bg-neutral-600 py-2 rounded-lg'
							onClick={() => {
								window.location.href =
									"https://codebyz.online/oauth2/authorization/google"
							}}
						>
							<img
								src={GoogleLogo}
								alt='Google logo'
								className='inline-flex h-5 w-5 items-center justify-center mr-2'
							/>
							Google bilan kirish
						</Button>
					</div>

					<p className='mt-8 text-center text-xs text-neutral-900'>
						Hisobingiz yo‘qmi?
						<a href='/signup' className='font-semibold hover:underline px-1'>
							Ro‘yxatdan o‘tish
						</a>
					</p>
				</CardContent>

				{/* RIGHT SIDE */}
				<div className='w-full md:w-1/2 bg-neutral-900 hidden md:flex items-center justify-center'>
					<img
						src={Logo}
						alt='CodeByZ Logo'
						className='h-full w-full object-cover bg-[#3f9cfb]'
					/>
				</div>
			</Card>
		</div>
	)
}

export default SignIn
