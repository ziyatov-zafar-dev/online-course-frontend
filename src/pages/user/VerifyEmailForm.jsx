import { verifyChangeEmail } from "@/api/user"
import Bg from "@/assets/register-bg.jpg"
import { useState } from "react"
import { toast } from "sonner"

export default function VerifyEmailForm() {
	const [form, setForm] = useState({
		newEmail: "",
		code: "",
	})
	const [loading, setLoading] = useState(false)
	const [message, setMessage] = useState("")

	const handleChange = (e) => {
		const { name, value } = e.target
		setForm((prev) => ({ ...prev, [name]: value }))
	}

	const handleSubmit = async (e) => {
		e.preventDefault()
		setMessage("")
		setLoading(true)

		try {
			const res = await verifyChangeEmail(form)
			if (res.data.success) {
				toast.success("Email muvaffaqiyatli tasdiqlandi!")
				setForm({ newEmail: "", code: "" })
			} else {
				setMessage(res.data.message || "Xatolik yuz berdi")
				toast.error(res.data.message || "Xatolik yuz berdi")
			}
		} catch (err) {
			setMessage(err.response?.data?.message || "Xatolik yuz berdi")
			toast.error(err.response?.data?.message || "Xatolik yuz berdi")
		} finally {
			setLoading(false)
		}
	}

	return (
		<div
			style={{ backgroundImage: `url(${Bg})` }}
			className='min-h-screen flex items-center justify-center'
		>
			<div className='w-full max-w-md rounded-2xl shadow-xl bg-white/90 backdrop-blur-lg overflow-hidden p-10'>
				<form onSubmit={handleSubmit} className='space-y-4'>
					<h2 className='text-xl font-semibold'>Yangi emailni tasdiqlash</h2>
					<div className='space-y-4'>
						<input
							type='email'
							name='newEmail'
							value={form.newEmail}
							onChange={handleChange}
							placeholder='Yangi email'
							className='w-full p-2 border rounded outline-blue-500'
							required
						/>

						<input
							type='text'
							name='code'
							value={form.code}
							onChange={handleChange}
							placeholder='Tasdiqlash kodi'
							className='w-full p-2 border rounded outline-blue-500'
							required
						/>

						<button
							type='submit'
							disabled={loading}
							className='w-full py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50'
						>
							{loading ? "Tasdiqlanmoqda..." : "Tasdiqlash"}
						</button>
					</div>
					{message && (
						<p className='text-center mt-2 text-red-600'>{message}</p>
					)}
				</form>
			</div>
		</div>
	)
}
