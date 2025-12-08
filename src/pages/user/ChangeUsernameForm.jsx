import { changeUsername } from "@/api/user"
import Bg from "@/assets/register-bg.jpg"
import { useState } from "react"
import { toast } from "sonner"

export default function ChangeUsernameForm({ currentUsername }) {
	const [username, setUsername] = useState(currentUsername || "")
	const [loading, setLoading] = useState(false)
	const [message, setMessage] = useState("")

	const handleSubmit = async (e) => {
		e.preventDefault()
		if (!username.trim()) {
			toast.error("Iltimos, yangi username kiriting!")
			return
		}

		setLoading(true)
		setMessage("")

		try {
			const res = await changeUsername(username)
			if (res.data.success) {
				setMessage("Username muvaffaqiyatli yangilandi!")
				toast.success("Username muvaffaqiyatli yangilandi!")
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
					<h2 className='text-xl font-semibold'>Username o‘zgartirish</h2>
					<div className='space-y-4'>
						<input
							type='text'
							value={username}
							onChange={(e) => setUsername(e.target.value)}
							placeholder='Yangi username'
							className='w-full p-2 border rounded outline-blue-500'
						/>

						<button
							type='submit'
							disabled={loading}
							className='w-full py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50'
						>
							{loading ? "Yangilanmoqda..." : "Saqlash"}
						</button>
					</div>
					{message && (
						<p className='text-center mt-2 text-green-600'>{message}</p>
					)}
				</form>
			</div>
		</div>
	)
}
