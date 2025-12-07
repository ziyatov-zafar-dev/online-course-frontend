import { verifySignIn } from "@/api/auth"
import { Button } from "@/components/ui/button"
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card"
import {
	Field,
	FieldDescription,
	FieldGroup,
	FieldLabel,
} from "@/components/ui/field"
import {
	InputOTP,
	InputOTPGroup,
	InputOTPSlot,
} from "@/components/ui/input-otp"
import { useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"

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
			return
		}

		setLoading(true)
		setError("")

		try {
			const res = await verifySignIn(email, otp)
			const token = res.data.data?.accessToken

			if (token) {
				localStorage.setItem("token", token) // ✅ Token saqlash
			}
			if (res?.data?.success) {
				navigate("/dashboard")
			} else {
				setError(res?.data?.message || "Noto'g'ri tasdiqlash kodi.")
			}
		} catch (err) {
			setError("Tasdiqlash muvaffaqiyatsiz tugadi.")
		} finally {
			setLoading(false)
		}
	}

	return (
		<Card
			{...props}
			className='
        w-full max-w-md mx-auto 
        overflow-hidden
        bg-white/90 backdrop-blur-lg rounded-xl shadow-xl 
        p-6 sm:p-10
      '
		>
			<CardHeader className='pb-4 text-center'>
				<CardTitle className='text-xl sm:text-2xl font-semibold text-gray-900'>
					Tasdiqlash
				</CardTitle>

				<CardDescription className='text-sm text-gray-500 mt-1'>
					6 xonali kod emailga yuborildi <br />
					<span className='font-semibold text-blue-600 break-all'>{email}</span>
				</CardDescription>
			</CardHeader>

			<CardContent className='py-6'>
				<form onSubmit={handleSubmit}>
					<FieldGroup>
						<Field>
							<FieldLabel className='text-base sm:text-lg font-medium text-gray-700'>
								Tasdiqlash kodini kiriting
							</FieldLabel>

							<InputOTP
								maxLength={6}
								value={otp}
								onChange={(value) => setOtp(value)}
								className='mt-4 flex justify-center outline-blue-500 border rounded-md'
							>
								<InputOTPGroup
									className='
                    flex justify-center 
                    gap-2 sm:gap-4 outline-blue-500 border rounded-md
                  '
								>
									{[...Array(6)].map((_, i) => (
										<InputOTPSlot
											key={i}
											index={i}
											className='
                        w-10 h-12 sm:w-12 sm:h-12 
                        text-lg sm:text-xl outline-blue-500 border rounded-md	
                      '
										/>
									))}
								</InputOTPGroup>
							</InputOTP>

							<FieldDescription className='text-xs text-gray-400 mt-2 text-center sm:text-left'>
								Emailga yuborilgan 6 xonali kodni kiriting.
							</FieldDescription>
						</Field>

						{error && (
							<p className='text-red-500 text-sm mt-2 text-center'>{error}</p>
						)}

						<FieldGroup className='mt-6'>
							<Button
								type='submit'
								className='
                  w-full py-3 
                  bg-blue-600 text-white font-medium 
                  rounded-lg hover:bg-blue-700 
                  transition duration-200
                  text-sm sm:text-base
                '
								disabled={loading}
							>
								{loading ? "Tasdiqlanmoqda..." : "Tasdiqlash"}
							</Button>
						</FieldGroup>
					</FieldGroup>
				</form>
			</CardContent>
		</Card>
	)
}
