import { getMe, updateProfile } from "@/api/user"
import Bg from "@/assets/register-bg.jpg"
import { useEffect, useState } from "react"
import { toast } from "sonner"

export default function ProfileForm() {
	const [profile, setProfile] = useState({
		firstname: "",
		lastname: "",
		birthDate: "",
		bio: "",
		website: "",
		telegram: "",
		github: "",
		linkedin: "",
		twitter: "",
		facebook: "",
		instagram: "",
	})

	const [loading, setLoading] = useState(false)
	const [message, setMessage] = useState("")

	useEffect(() => {
		async function fetchProfile() {
			try {
				const res = await getMe()
				setProfile({
					firstname: res.data.data.firstname || "",
					lastname: res.data.data.lastname || "",
					birthDate: res.data.data.birthDate || "",
					bio: res.data.data.bio || "",
					website: res.data.data.website || "",
					telegram: res.data.data.telegram || "",
					github: res.data.data.github || "",
					linkedin: res.data.data.linkedin || "",
					twitter: res.data.data.twitter || "",
					facebook: res.data.data.facebook || "",
					instagram: res.data.data.instagram || "",
				})
			} catch (err) {
				toast.error("Profil ma'lumotlarini olishda xatolik yuz berdi.")
			}
		}
		fetchProfile()
	}, [])

	const handleChange = (e) => {
		const { name, value } = e.target
		setProfile((prev) => ({ ...prev, [name]: value }))
	}

	const handleSubmit = async (e) => {
		e.preventDefault()
		setLoading(true)
		setMessage("")

		try {
			const res = await updateProfile(profile)
			if (res.data.success) setMessage("Profil muvaffaqiyatli yangilandi!")
			toast.success("Profil muvaffaqiyatli yangilandi!")
		} catch (err) {
			setMessage(err.response?.data?.message || "Xatolik yuz berdi")
			toast.error("Profilni yangilashda xatolik yuz berdi.")
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
					<h2 className='text-xl font-semibold'>Profilni yangilash</h2>
					<div className='space-y-4'>
						<input
							type='text'
							name='firstname'
							value={profile.firstname || ""}
							onChange={handleChange}
							placeholder='Ism'
							className='w-full p-2 border rounded outline-blue-500'
						/>

						<input
							type='text'
							name='lastname'
							value={profile.lastname || ""}
							onChange={handleChange}
							placeholder='Familiya'
							className='w-full p-2 border rounded outline-blue-500'
						/>

						<input
							type='date'
							name='birthDate'
							value={profile.birthDate?.slice(0, 10) || ""}
							onChange={handleChange}
							className='w-full p-2 border rounded outline-blue-500'
						/>

						<textarea
							name='bio'
							value={profile.bio || ""}
							onChange={handleChange}
							placeholder='Bio'
							className='w-full p-2 border rounded outline-blue-500'
						/>

						{/* Ijtimoiy tarmoqlar */}
						<input
							type='text'
							name='website'
							value={profile.website || ""}
							onChange={handleChange}
							placeholder='Website'
							className='w-full p-2 border rounded outline-blue-500'
						/>
						<input
							type='text'
							name='telegram'
							value={profile.telegram || ""}
							onChange={handleChange}
							placeholder='Telegram'
							className='w-full p-2 border rounded outline-blue-500'
						/>
						<input
							type='text'
							name='github'
							value={profile.github || ""}
							onChange={handleChange}
							placeholder='GitHub'
							className='w-full p-2 border rounded outline-blue-500'
						/>
						<input
							type='text'
							name='linkedin'
							value={profile.linkedin || ""}
							onChange={handleChange}
							placeholder='LinkedIn'
							className='w-full p-2 border rounded outline-blue-500'
						/>
						<input
							type='text'
							name='twitter'
							value={profile.twitter || ""}
							onChange={handleChange}
							placeholder='Twitter'
							className='w-full p-2 border rounded outline-blue-500'
						/>
						<input
							type='text'
							name='facebook'
							value={profile.facebook || ""}
							onChange={handleChange}
							placeholder='Facebook'
							className='w-full p-2 border rounded outline-blue-500'
						/>
						<input
							type='text'
							name='instagram'
							value={profile.instagram || ""}
							onChange={handleChange}
							placeholder='Instagram'
							className='w-full p-2 border rounded outline-blue-500'
						/>

						<button
							type='submit'
							disabled={loading}
							className='w-full py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50'
						>
							{loading ? "Yangilanmoqda..." : "Saqlash"}
						</button>

						{message && (
							<p className='text-center mt-2 text-green-600'>{message}</p>
						)}
					</div>
				</form>
			</div>
		</div>
	)
}
