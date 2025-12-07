import { uploadProfileImage } from "@/api/user"
import { useState } from "react"

export default function ProfileImageUpload() {
	const [selectedFile, setSelectedFile] = useState(null)
	const [loading, setLoading] = useState(false)
	const [profile, setProfile] = useState(null)

	// Fayl tanlash
	const handleFileChange = (e) => {
		setSelectedFile(e.target.files[0])
	}

	// Upload qilish
	const handleUpload = async () => {
		if (!selectedFile) return alert("Iltimos, fayl tanlang!")

		try {
			setLoading(true)
			const response = await uploadProfileImage(selectedFile)
			console.log("Server response:", response.data)

			// Serverning data obyektini olish (Swagger bo‘yicha)
			setProfile(response.data.data)
			alert("Rasm muvaffaqiyatli yuklandi!")
		} catch (error) {
			console.error("Upload xatosi:", error)
			alert(error.response?.data?.message || "Rasm yuklashda xatolik yuz berdi")
		} finally {
			setLoading(false)
		}
	}

	return (
		<div className='max-w-md mx-auto p-4 border rounded shadow'>
			<h2 className='text-xl font-semibold mb-4'>Profil Rasmini Yuklash</h2>

			<input
				type='file'
				accept='image/*'
				onChange={handleFileChange}
				className='mb-2'
			/>
			<button
				onClick={handleUpload}
				disabled={loading || !selectedFile} // Fayl tanlanmasa ham disabled bo‘lsin
				className='w-full py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50'
			>
				{loading ? "Yuklanmoqda..." : "Upload"}
			</button>

			{profile?.images?.length > 0 && (
				<div className='mt-4 flex flex-col items-center'>
					<p className='mb-2'>Joriy profil rasmi:</p>
					<img
						src={profile.images[0].url}
						alt='Profile'
						className='w-32 h-32 object-cover rounded-full border'
					/>
				</div>
			)}
		</div>
	)
}
