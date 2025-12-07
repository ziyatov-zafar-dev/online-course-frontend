import { getMe, updateProfile } from "@/api/user"
import { useEffect, useState } from "react"

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

	// Avval foydalanuvchi ma’lumotlarini olish
	useEffect(() => {
		async function fetchProfile() {
			try {
				const res = await getMe()
				setProfile(res.data.data)
			} catch (err) {
				console.error("Profile fetch error:", err)
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
		} catch (err) {
			console.error("Update error:", err)
			setMessage(err.response?.data?.message || "Xatolik yuz berdi")
		} finally {
			setLoading(false)
		}
	}

	return (
		<form
			onSubmit={handleSubmit}
			className='max-w-md mx-auto p-4 border rounded shadow space-y-4'
		>
			<h2 className='text-xl font-semibold'>Profilni yangilash</h2>

			<input
				type='text'
				name='firstname'
				value={profile.firstname}
				onChange={handleChange}
				placeholder='Ism'
				className='w-full p-2 border rounded'
			/>

			<input
				type='text'
				name='lastname'
				value={profile.lastname}
				onChange={handleChange}
				placeholder='Familiya'
				className='w-full p-2 border rounded'
			/>

			<input
				type='date'
				name='birthDate'
				value={profile.birthDate?.slice(0, 10)} // YYYY-MM-DD format
				onChange={handleChange}
				className='w-full p-2 border rounded'
			/>

			<textarea
				name='bio'
				value={profile.bio}
				onChange={handleChange}
				placeholder='Bio'
				className='w-full p-2 border rounded'
			/>

			{/* Ijtimoiy tarmoqlar */}
			<input
				type='text'
				name='website'
				value={profile.website}
				onChange={handleChange}
				placeholder='Website'
				className='w-full p-2 border rounded'
			/>
			<input
				type='text'
				name='telegram'
				value={profile.telegram}
				onChange={handleChange}
				placeholder='Telegram'
				className='w-full p-2 border rounded'
			/>
			<input
				type='text'
				name='github'
				value={profile.github}
				onChange={handleChange}
				placeholder='GitHub'
				className='w-full p-2 border rounded'
			/>
			<input
				type='text'
				name='linkedin'
				value={profile.linkedin}
				onChange={handleChange}
				placeholder='LinkedIn'
				className='w-full p-2 border rounded'
			/>
			<input
				type='text'
				name='twitter'
				value={profile.twitter}
				onChange={handleChange}
				placeholder='Twitter'
				className='w-full p-2 border rounded'
			/>
			<input
				type='text'
				name='facebook'
				value={profile.facebook}
				onChange={handleChange}
				placeholder='Facebook'
				className='w-full p-2 border rounded'
			/>
			<input
				type='text'
				name='instagram'
				value={profile.instagram}
				onChange={handleChange}
				placeholder='Instagram'
				className='w-full p-2 border rounded'
			/>

			<button
				type='submit'
				disabled={loading}
				className='w-full py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50'
			>
				{loading ? "Yangilanmoqda..." : "Saqlash"}
			</button>

			{message && <p className='text-center mt-2 text-green-600'>{message}</p>}
		</form>
	)
}
