import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/sonner"
import {
	Calendar,
	Camera,
	Edit,
	Mail,
	MapPin,
	Phone,
	Save,
	X,
} from "lucide-react"
import { useState } from "react"

export default function Profile() {
	const [isEditing, setIsEditing] = useState(false)
	const [profile, setProfile] = useState({
		firstName: "Admin",
		lastName: "User",
		email: "admin@example.com",
		phone: "+998 90 123 45 67",
		location: "Toshkent, O'zbekiston",
		bio: "Full-stack dasturchi va ta'lim platformasi administratori",
		joinDate: "2024-01-15",
	})

	const handleSave = () => {
		setIsEditing(false)
		toast.success("Profil muvaffaqiyatli yangilandi")
	}

	const handleChange = (field, value) => {
		setProfile({ ...profile, [field]: value })
	}

	return (
		<div className='max-w-4xl mx-auto space-y-6'>
			{/* Profile Header */}
			<div className='bg-white rounded-xl shadow-sm overflow-hidden'>
				{/* Cover */}
				<div className='h-32 bg-gradient-to-r from-indigo-500 to-purple-600' />

				{/* Avatar & Info */}
				<div className='px-6 pb-6'>
					<div className='flex flex-col sm:flex-row sm:items-end gap-4 -mt-12'>
						{/* Avatar */}
						<div className='relative'>
							<div className='w-24 h-24 rounded-full bg-white p-1 shadow-lg'>
								<div className='w-full h-full rounded-full bg-indigo-100 flex items-center justify-center'>
									<span className='text-3xl font-bold text-indigo-600'>
										{profile.firstName.charAt(0)}
										{profile.lastName.charAt(0)}
									</span>
								</div>
							</div>
							<button className='absolute bottom-0 right-0 p-1.5 bg-indigo-600 rounded-full text-white hover:bg-indigo-700 transition-colors'>
								<Camera className='h-4 w-4' />
							</button>
						</div>

						{/* Name & Actions */}
						<div className='flex-1 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
							<div>
								<h1 className='text-2xl font-bold text-gray-900'>
									{profile.firstName} {profile.lastName}
								</h1>
								<p className='text-gray-500'>{profile.bio}</p>
							</div>
							{isEditing ? (
								<div className='flex gap-2'>
									<Button variant='outline' onClick={() => setIsEditing(false)}>
										<X className='h-4 w-4 mr-2' />
										Bekor qilish
									</Button>
									<Button
										className='bg-indigo-600 hover:bg-indigo-700'
										onClick={handleSave}
									>
										<Save className='h-4 w-4 mr-2' />
										Saqlash
									</Button>
								</div>
							) : (
								<Button variant='outline' onClick={() => setIsEditing(true)}>
									<Edit className='h-4 w-4 mr-2' />
									Tahrirlash
								</Button>
							)}
						</div>
					</div>
				</div>
			</div>

			{/* Profile Details */}
			<div className='grid gap-6 lg:grid-cols-3'>
				{/* Contact Info */}
				<div className='bg-white rounded-xl p-6 shadow-sm'>
					<h2 className='text-lg font-semibold text-gray-900 mb-4'>
						Aloqa ma'lumotlari
					</h2>
					<div className='space-y-4'>
						<div className='flex items-center gap-3'>
							<div className='p-2 bg-indigo-50 rounded-lg'>
								<Mail className='h-4 w-4 text-indigo-600' />
							</div>
							<div>
								<p className='text-sm text-gray-500'>Email</p>
								<p className='text-sm font-medium text-gray-900'>
									{profile.email}
								</p>
							</div>
						</div>
						<div className='flex items-center gap-3'>
							<div className='p-2 bg-indigo-50 rounded-lg'>
								<Phone className='h-4 w-4 text-indigo-600' />
							</div>
							<div>
								<p className='text-sm text-gray-500'>Telefon</p>
								<p className='text-sm font-medium text-gray-900'>
									{profile.phone}
								</p>
							</div>
						</div>
						<div className='flex items-center gap-3'>
							<div className='p-2 bg-indigo-50 rounded-lg'>
								<MapPin className='h-4 w-4 text-indigo-600' />
							</div>
							<div>
								<p className='text-sm text-gray-500'>Manzil</p>
								<p className='text-sm font-medium text-gray-900'>
									{profile.location}
								</p>
							</div>
						</div>
						<div className='flex items-center gap-3'>
							<div className='p-2 bg-indigo-50 rounded-lg'>
								<Calendar className='h-4 w-4 text-indigo-600' />
							</div>
							<div>
								<p className='text-sm text-gray-500'>Qo'shilgan sana</p>
								<p className='text-sm font-medium text-gray-900'>
									{new Date(profile.joinDate).toLocaleDateString("uz-UZ")}
								</p>
							</div>
						</div>
					</div>
				</div>

				{/* Edit Form */}
				<div className='lg:col-span-2 bg-white rounded-xl p-6 shadow-sm'>
					<h2 className='text-lg font-semibold text-gray-900 mb-4'>
						Shaxsiy ma'lumotlar
					</h2>
					<div className='grid gap-4 sm:grid-cols-2'>
						<div className='space-y-2'>
							<Label htmlFor='firstName'>Ism</Label>
							<Input
								id='firstName'
								value={profile.firstName}
								onChange={(e) => handleChange("firstName", e.target.value)}
								disabled={!isEditing}
							/>
						</div>
						<div className='space-y-2'>
							<Label htmlFor='lastName'>Familiya</Label>
							<Input
								id='lastName'
								value={profile.lastName}
								onChange={(e) => handleChange("lastName", e.target.value)}
								disabled={!isEditing}
							/>
						</div>
						<div className='space-y-2'>
							<Label htmlFor='email'>Email</Label>
							<Input
								id='email'
								type='email'
								value={profile.email}
								onChange={(e) => handleChange("email", e.target.value)}
								disabled={!isEditing}
							/>
						</div>
						<div className='space-y-2'>
							<Label htmlFor='phone'>Telefon</Label>
							<Input
								id='phone'
								value={profile.phone}
								onChange={(e) => handleChange("phone", e.target.value)}
								disabled={!isEditing}
							/>
						</div>
						<div className='sm:col-span-2 space-y-2'>
							<Label htmlFor='location'>Manzil</Label>
							<Input
								id='location'
								value={profile.location}
								onChange={(e) => handleChange("location", e.target.value)}
								disabled={!isEditing}
							/>
						</div>
						<div className='sm:col-span-2 space-y-2'>
							<Label htmlFor='bio'>Bio</Label>
							<textarea
								id='bio'
								className='w-full min-h-[100px] px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-50 disabled:text-gray-500'
								value={profile.bio}
								onChange={(e) => handleChange("bio", e.target.value)}
								disabled={!isEditing}
							/>
						</div>
					</div>
				</div>
			</div>

			{/* Security Section */}
			<div className='bg-white rounded-xl p-6 shadow-sm'>
				<h2 className='text-lg font-semibold text-gray-900 mb-4'>Xavfsizlik</h2>
				<div className='space-y-4'>
					<div className='flex items-center justify-between p-4 bg-gray-50 rounded-lg'>
						<div>
							<h3 className='font-medium text-gray-900'>
								Parolni o'zgartirish
							</h3>
							<p className='text-sm text-gray-500'>
								Oxirgi o'zgartirilgan: 30 kun oldin
							</p>
						</div>
						<Button variant='outline'>O'zgartirish</Button>
					</div>
					<div className='flex items-center justify-between p-4 bg-gray-50 rounded-lg'>
						<div>
							<h3 className='font-medium text-gray-900'>
								Ikki faktorli autentifikatsiya
							</h3>
							<p className='text-sm text-gray-500'>
								Qo'shimcha xavfsizlik qatlami
							</p>
						</div>
						<Button variant='outline'>Yoqish</Button>
					</div>
				</div>
			</div>
		</div>
	)
}
