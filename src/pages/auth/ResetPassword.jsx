import { resetPassword } from "@/api/auth"
import Bg from "@/assets/register-bg.jpg"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"

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
	const [success, setSuccess] = useState("")
	const [loading, setLoading] = useState(false)

	const handleSubmit = async (e) => {
		e.preventDefault()
		setError("")
		setSuccess("")
		setLoading(true)

		try {
			const res = await resetPassword({
				email,
				code: form.code,
				newPassword: form.newPassword,
				confirmPassword: form.confirmPassword,
			})

			if (res?.data?.success) {
				setSuccess("Parol muvaffaqiyatli tiklandi!")
				setTimeout(() => navigate("/signin"), 1500)
			}
		} catch (err) {
			setError(err.response?.data?.message || "Kod yoki parol xato!")
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
				className='w-full max-w-md shadow-xl rounded-3xl 
        bg-white/90 backdrop-blur-lg overflow-hidden text-neutral-900'
			>
				<CardContent className='p-8'>
					<h1 className='text-2xl font-bold text-center text-neutral-900'>
						Parolni Tiklash
					</h1>
					<p className='mt-2 text-sm text-center text-neutral-500'>
						{email} manziliga yuborilgan kodni kiriting
					</p>

					<form onSubmit={handleSubmit} className='mt-6 space-y-5'>
						<div>
							<Label htmlFor='code'>Kod</Label>
							<Input
								id='code'
								type='text'
								placeholder='XXXXXX'
								className='py-1 px-2 w-full pr-10 mr-1 outline-blue-500 border rounded-md'
								value={form.code}
								onChange={(e) => setForm({ ...form, code: e.target.value })}
								required
							/>
						</div>

						<div>
							<Label htmlFor='newPassword'>Yangi parol</Label>
							<Input
								id='newPassword'
								type='password'
								placeholder='Yangi parol'
								className='py-1 px-2 w-full pr-10 mr-1 outline-blue-500 border rounded-md'
								value={form.newPassword}
								onChange={(e) =>
									setForm({ ...form, newPassword: e.target.value })
								}
								required
							/>
						</div>

						<div>
							<Label htmlFor='confirmPassword'>Parol tasdiqlash</Label>
							<Input
								id='confirmPassword'
								type='password'
								placeholder='Yangi parol (takroran)'
								className='py-1 px-2 w-full pr-10 mr-1 outline-blue-500 border rounded-md'
								value={form.confirmPassword}
								onChange={(e) =>
									setForm({ ...form, confirmPassword: e.target.value })
								}
								required
							/>
						</div>

						{error && <p className='text-red-500 text-sm'>{error}</p>}
						{success && <p className='text-green-600 text-sm'>{success}</p>}

						<Button
							type='submit'
							className='w-full py-2 rounded-lg bg-blue-500 text-neutral-100 hover:bg-blue-600'
							disabled={loading}
						>
							{loading ? "Yuklanmoqda..." : "Parolni tiklash"}
						</Button>
					</form>
				</CardContent>
			</Card>
		</div>
	)
}

export default ResetPassword
