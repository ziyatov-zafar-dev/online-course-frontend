import { signUp } from "@/api/auth"
import Logo from "@/assets/logo.svg"
import Bg from "@/assets/register-bg.jpg"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { useNavigate } from "react-router-dom"

const SignUp = () => {
	const navigate = useNavigate()
	const [form, setForm] = useState({
		firstname: "",
		lastname: "",
		email: "",
		password: "",
		confirmPassword: "",
		birthDate: "",
	})
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState("")

	const [showPassword, setShowPassword] = useState(false)
	const [showPassword2, setShowPassword2] = useState(false)

	const handleChange = (e) => {
		const { name, value } = e.target
		setForm((prev) => ({
			...prev,
			[name]: value,
		}))
	}

	const handleSubmit = async (e) => {
		e.preventDefault()

		if (form?.password !== form?.confirmPassword) {
			setError("Parollar mos emas")
			return
		}

		setLoading(true)
		setError("")

		try {
			const response = await signUp({
				firstname: form?.firstname,
				lastname: form?.lastname,
				email: form?.email,
				password: form?.password,
				confirmPassword: form?.confirmPassword,
				birthDate: form?.birthDate,
			})

			if (response?.data?.success) {
				navigate("/signup/verify", { state: { email: form?.email } })
			} else {
				setError(response?.data?.message || "Nimadir xato ketdi")
			}
		} catch (err) {
			setError(
				err?.response?.data?.message ||
					"Ro'yxatdan o'tish muvaffaqiyatsiz tugadi"
			)
		} finally {
			setLoading(false)
		}
	}

	return (
		<div
			style={{ backgroundImage: `url(${Bg})` }}
			className='min-h-screen flex items-center justify-center px-4'
		>
			<Card
				className='
        w-full max-w-5xl 
        flex flex-col md:flex-row 
        rounded-3xl overflow-hidden
        bg-white/90 backdrop-blur-lg'
			>
				{/* CHAP TOMON */}
				<CardContent
					className='
          w-full md:w-1/2 
          px-6 sm:px-10 
          py-10 
          text-neutral-900
          flex flex-col justify-center'
				>
					<div className='mb-10 flex items-center gap-2 text-sm text-neutral-900'>
						<span className='inline-flex h-7 w-7 items-center justify-center rounded-xl border border-neutral-300 text-xs font-semibold'>
							&lt;/&gt;
						</span>
						<span className='font-medium tracking-tight'>CodeByZ</span>
					</div>

					<h1 className='text-3xl font-semibold'>Hisob yarating</h1>
					<p className='mt-1 text-sm text-neutral-900'>
						CodeByZ ga qo'shiling va o'rganishni boshlang
					</p>

					<form className='mt-8 space-y-5' onSubmit={handleSubmit}>
						<div className='flex gap-3 md:flex-row flex-col'>
							<div className='flex-1'>
								<Label htmlFor='firstname' className='mb-1 block'>
									Ism
								</Label>
								<Input
									name='firstname'
									value={form?.firstname}
									onChange={handleChange}
									placeholder='Ali'
									className='py-1 px-2 w-full border  outline-blue-500  rounded-md'
									required
									id='firstname'
								/>
							</div>
							<div className='flex-1'>
								<Label htmlFor='lastname' className='mb-1 block'>
									Familiya
								</Label>
								<Input
									name='lastname'
									value={form?.lastname}
									onChange={handleChange}
									placeholder='Valiyev'
									className='py-1 px-2 w-full border  outline-blue-500  rounded-md'
									required
									id='lastname'
								/>
							</div>
						</div>

						<div>
							<Label htmlFor='email' className='mb-1 block'>
								Email
							</Label>
							<Input
								type='email'
								name='email'
								value={form?.email}
								onChange={handleChange}
								placeholder='me@example.com'
								className='py-1 px-2 w-full border  outline-blue-500  rounded-md'
								required
								id='email'
							/>
						</div>

						<div>
							<Label htmlFor='password' className='mb-1 block'>
								Parol
							</Label>
							<div className='relative'>
								<Input
									type={showPassword ? "text" : "password"}
									id='password'
									placeholder='••••••••'
									required
									className='py-1 px-2 w-full pr-10 border  outline-blue-500  rounded-md'
									value={form?.password}
									onChange={handleChange}
									name='password'
								/>
								{/* show password */}
								<button
									type='button'
									onClick={() => setShowPassword(!showPassword)}
									className='absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700'
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

						<div>
							<Label htmlFor='confirmPassword' className='mb-1 block'>
								Parolni tasdiqlang
							</Label>
							<div className='relative'>
								<Input
									type={showPassword2 ? "text" : "password"}
									id='confirmPassword'
									placeholder='••••••••'
									required
									className='py-1 px-2 w-full pr-10 border  outline-blue-500  rounded-md'
									value={form?.confirmPassword}
									onChange={handleChange}
									name='confirmPassword'
								/>
								{/* show password */}
								<button
									type='button'
									onClick={() => setShowPassword2(!showPassword2)}
									className='absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700'
								>
									{showPassword2 ? (
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

						<div>
							<Label htmlFor='birthDate' className='mb-1 block'>
								Tug'ilgan sana
							</Label>
							<Input
								type='date'
								name='birthDate'
								value={form?.birthDate}
								onChange={handleChange}
								className='py-1 px-2 w-full border outline-blue-500 rounded-md bg-white/90 backdrop-blur-lg'
								required
								id='birthDate'
							/>
						</div>

						{error && <p className='text-red-500 text-sm mt-2'>{error}</p>}

						<Button
							type='submit'
							className='w-full bg-blue-500 text-white hover:bg-blue-600 py-2 rounded-lg'
							size='lg'
							disabled={loading}
						>
							{loading ? "Ro'yxatdan o'tilmoqda..." : "Ro'yxatdan o'tish"}
						</Button>
					</form>

					<p className='mt-8 text-center text-xs text-neutral-900'>
						Hisobingiz bormi?
						<a href='/signin' className='font-semibold hover:underline px-1'>
							Kirish
						</a>
					</p>
				</CardContent>

				{/* O'ng tomon */}
				<div
					className='w-full md:w-1/2 
          bg-neutral-900 
          hidden md:flex 
          items-center justify-center'
				>
					{/* Desktop faqat: rasm */}
					<div className='hidden md:flex items-center justify-center h-full w-full'>
						<img
							src={Logo}
							alt='CodeByZ Logo'
							className='h-full w-full object-cover bg-[#3f9cfb]'
						/>
					</div>
				</div>
			</Card>
		</div>
	)
}

export default SignUp
