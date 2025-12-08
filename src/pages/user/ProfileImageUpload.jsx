import { uploadProfileImage } from "@/api/user"
import Bg from "@/assets/register-bg.jpg"
import { useState } from "react"
import { toast } from "sonner"

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
		if (!selectedFile) {
			toast.error("Iltimos, fayl tanlang!")
			return
		}

		setLoading(true)

		try {
			const response = await uploadProfileImage(selectedFile)
			setProfile(response.data.data)
			toast.success("Rasm muvaffaqiyatli yuklandi!")
		} catch (error) {
			console.error("Upload xatosi:", error)
			const msg =
				error.response?.data?.message || "Rasm yuklashda xatolik yuz berdi"
			toast.error(msg)
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
				<div>
					<h2 className='text-xl font-semibold mb-4'>Profil Rasmini Yuklash</h2>
					<input
						type='file'
						accept='image/*'
						onChange={handleFileChange}
						className='mb-2 p-2 border rounded outline-blue-500'
					/>
					<button
						onClick={handleUpload}
						disabled={loading || !selectedFile}
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
			</div>
		</div>
	)
}
