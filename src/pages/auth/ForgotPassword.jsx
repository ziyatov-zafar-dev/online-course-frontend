import { forgotPassword } from "@/api/auth"
import Bg from "@/assets/register-bg.jpg"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { useNavigate } from "react-router-dom"

const ForgotPassword = () => {
	const [email, setEmail] = useState("")
	const [msg, setMsg] = useState("")
	const navigate = useNavigate()

	const handleSubmit = async (e) => {
		e.preventDefault()
		setMsg("")

		try {
			const res = await forgotPassword(email)
			console.log(res)

			if (res?.data?.success) {
				navigate("/reset-password", { state: { email } })
			}
		} catch (err) {
			setMsg("Email topilmadi yoki xato!")
		}
	}

	return (
		<div
			style={{ backgroundImage: `url(${Bg})` }}
			className='min-h-screen flex items-center justify-center'
		>
			<Card className='w-full max-w-md rounded-2xl shadow-xl bg-white/90 backdrop-blur-lg overflow-hidden  p-10 '>
				<CardHeader>
					<CardTitle className='text-2xl font-semibold text-neutral-900 py-2'>
						Parolni tiklash
					</CardTitle>
					<p className='text-sm text-neutral-600 py-2'>
						Email manzilingizni kiriting, sizga tasdiqlash kodi yuboriladi.
					</p>
				</CardHeader>

				<CardContent>
					<form className='space-y-8' onSubmit={handleSubmit}>
						<div>
							<Label htmlFor='email'>Email:</Label>
							<Input
								type='email'
								id='email'
								placeholder='me@example.com'
								className='py-1 px-2 w-full pr-10 mt-1 outline-blue-500 border rounded-md'
								required
								value={email}
								onChange={(e) => setEmail(e.target.value)}
							/>
						</div>

						{msg && <p className='text-red-500 text-sm'>{msg}</p>}

						<Button
							type='submit'
							className='w-full bg-blue-500 text-neutral-100 hover:bg-blue-600 py-2 rounded-lg'
						>
							Kod yuborish
						</Button>
					</form>
				</CardContent>
			</Card>
		</div>
	)
}

export default ForgotPassword
