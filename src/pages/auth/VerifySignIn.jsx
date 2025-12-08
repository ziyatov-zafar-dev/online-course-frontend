import { verifySignIn } from "@/api/auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
	InputOTP,
	InputOTPGroup,
	InputOTPSlot,
} from "@/components/ui/input-otp"
import { Loader2, Mail } from "lucide-react"
import { useState } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { toast } from "sonner"

export function VerifySignIn(props) {
	const navigate = useNavigate()
	const location = useLocation()
	const { email } = location.state || {}

	const [otp, setOtp] = useState("")
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState("")

	const handleSubmit = async (e) => {
		e.preventDefault()

		if (otp.length !== 6) {
			setError("Iltimos, 6 xonali kodni kiriting.")
			toast.error("Xatolik!", {
				description: "Iltimos, 6 xonali kodni kiriting.",
			})
			return
		}

		setLoading(true)
		setError("")

		try {
			const res = await verifySignIn(email, otp)
			const data = res.data?.data

			if (res?.data?.success && data?.accessToken) {
				localStorage.setItem("access_token", data.accessToken)
				localStorage.setItem("refresh_token", data.refreshToken)

				if (data.user) {
					localStorage.setItem("user", JSON.stringify(data.user))
				}

				toast.success("Kirish muvaffaqiyatli!", {
					description: "Dashboardga yo'naltirilmoqda...",
				})
				navigate("/dashboard")
			} else {
				const msg = res?.data?.message || "Noto'g'ri tasdiqlash kodi."
				setError(msg)
				toast.error("Xatolik!", { description: msg })
			}
		} catch (err) {
			const msg =
				err?.response?.data?.message || "Tasdiqlash muvaffaqiyatsiz tugadi."
			setError(msg)
			toast.error("Xatolik!", { description: msg })
		} finally {
			setLoading(false)
		}
	}

	return (
		<Card
			{...props}
			className='w-full max-w-md mx-auto overflow-hidden bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl'
		>
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
						<Mail className='w-8 h-8 text-blue-500' />
					</div>
				</div>

				{/* Header */}
				<div className='text-center mb-6'>
					<h1 className='text-2xl font-bold text-gray-900 mb-2'>
						Emailni tasdiqlang
					</h1>
					<p className='text-sm text-gray-600'>
						6 xonali kod yuborildi
						<br />
						<span className='font-semibold text-blue-500'>{email}</span>
					</p>
				</div>

				{/* Error Message */}
				{error && (
					<div className='mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm text-center'>
						{error}
					</div>
				)}

				{/* Form */}
				<form onSubmit={handleSubmit}>
					<div className='flex justify-center mb-6'>
						<InputOTP
							maxLength={6}
							value={otp}
							onChange={(value) => setOtp(value)}
						>
							<InputOTPGroup className='gap-2 sm:gap-3'>
								{[...Array(6)].map((_, i) => (
									<InputOTPSlot
										key={i}
										index={i}
										className='w-11 h-14 sm:w-12 sm:h-14 text-xl font-semibold border-2 border-gray-400 rounded-xl outline-blue-500 text-black'
									/>
								))}
							</InputOTPGroup>
						</InputOTP>
					</div>

					<Button
						type='submit'
						disabled={loading}
						className='w-full h-12 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-blue-500/25'
					>
						{loading ? (
							<>
								<Loader2 className='inline-flex h-5 w-5 items-center justify-center mr-2 animate-spin' />
								Tasdiqlanmoqda...
							</>
						) : (
							"Tasdiqlash"
						)}
					</Button>
				</form>

				{/* Back Link */}
				<p className='mt-6 text-center text-sm text-gray-600'>
					Kodni olmadingizmi?{" "}
					<Link
						to='/signin'
						className='text-blue-500 hover:text-blue-600 font-semibold'
					>
						Qayta yuborish
					</Link>
				</p>
			</CardContent>
		</Card>
	)
}
