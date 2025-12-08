import { forgotPassword } from "@/api/auth"
import Bg from "@/assets/register-bg.jpg"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { KeyRound, Loader2 } from "lucide-react"
import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { toast } from "sonner"

const ForgotPassword = () => {
	const [email, setEmail] = useState("")
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState("")
	const navigate = useNavigate()

	const handleSubmit = async (e) => {
		e.preventDefault()
		setError("")
		setLoading(true)

		try {
			const res = await forgotPassword(email)

			if (res?.data?.success) {
				toast.success("Tasdiqlash kodi yuborildi!", {
					description: "Iltimos, emailingizni tekshiring.",
				})
				navigate("/reset-password", { state: { email } })
			}
		} catch (err) {
			const msg = err?.response?.data?.message || "Email topilmadi yoki xato!"
			setError(msg)
			toast.error("Xatolik!", { description: msg })
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
							<KeyRound className='w-8 h-8 text-blue-500' />
						</div>
					</div>

					{/* Header */}
					<div className='text-center mb-6'>
						<h1 className='text-2xl font-bold text-gray-900 mb-2'>
							Parolni tiklash
						</h1>
						<p className='text-sm text-gray-600'>
							Email manzilingizni kiriting, sizga tasdiqlash kodi yuboriladi.
						</p>
					</div>

					{/* Error Message */}
					{error && (
						<div className='mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm text-center'>
							{error}
						</div>
					)}

					{/* Form */}
					<form onSubmit={handleSubmit} className='space-y-5'>
						<div className='space-y-2'>
							<Label htmlFor='email' className='text-gray-700 font-medium'>
								Email
							</Label>
							<Input
								type='email'
								id='email'
								placeholder='me@example.com'
								className='h-12 px-4 w-full border-2 border-gray-200 rounded-xl outline-blue-500 text-black'
								required
								value={email}
								onChange={(e) => setEmail(e.target.value)}
							/>
						</div>

						<Button
							type='submit'
							disabled={loading}
							className='w-full h-12 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-blue-500/25'
						>
							{loading ? (
								<>
									<Loader2 className='inline-flex h-5 w-5 items-center justify-center mr-2 animate-spin' />
									Yuborilmoqda...
								</>
							) : (
								"Kod yuborish"
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

export default ForgotPassword
