import { getMe } from "@/api/user"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Mail, User } from "lucide-react"
import { useEffect, useState } from "react"
import { toast } from "sonner"

export default function ProfilMe() {
	const [user, setUser] = useState(null)
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState("")

	useEffect(() => {
		async function fetchUser() {
			try {
				const res = await getMe()
				setUser(res.data.data)
			} catch (err) {
				setError("Ma'lumotlarni olishda xatolik!")
				toast.error("Ma'lumotlarni olishda xatolik!")
			} finally {
				setLoading(false)
			}
		}
		fetchUser()
	}, [])

	if (loading)
		return (
			<div className='flex items-center justify-center py-12'>
				<Loader2 className='h-8 w-8 text-blue-600 dark:text-blue-400 animate-spin' />
			</div>
		)
	if (error)
		return (
			<div className='text-center py-12 text-red-500 dark:text-red-400'>
				{error}
			</div>
		)
	if (!user) return null

	return (
		<div className='space-y-6'>
			{/* Profile Header */}
			<div className='bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-700 dark:to-blue-800 rounded-2xl p-8 text-white'>
				<div className='flex items-center gap-6'>
					<div className='w-20 h-20 rounded-full bg-white/20 flex items-center justify-center'>
						<User className='h-10 w-10 text-white' />
					</div>
					<div>
						<h1 className='text-2xl font-bold'>
							{user.firstname} {user.lastname}
						</h1>
						<p className='text-blue-100'>{user.email}</p>
					</div>
				</div>
			</div>

			{/* Profile Info Card */}
			<Card className='bg-white dark:bg-gray-800 rounded-xl shadow-sm border-0'>
				<CardHeader>
					<CardTitle className='text-xl font-semibold text-gray-900 dark:text-white'>
						Profil Ma'lumotlarim
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className='space-y-4'>
						<div className='flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl'>
							<div className='p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg'>
								<User className='h-5 w-5 text-blue-600 dark:text-blue-400' />
							</div>
							<div>
								<p className='text-sm text-gray-500 dark:text-gray-400'>Ism</p>
								<p className='font-medium text-gray-900 dark:text-white'>
									{user.firstname}
								</p>
							</div>
						</div>
						<div className='flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl'>
							<div className='p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg'>
								<User className='h-5 w-5 text-blue-600 dark:text-blue-400' />
							</div>
							<div>
								<p className='text-sm text-gray-500 dark:text-gray-400'>
									Familiya
								</p>
								<p className='font-medium text-gray-900 dark:text-white'>
									{user.lastname}
								</p>
							</div>
						</div>
						<div className='flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl'>
							<div className='p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg'>
								<Mail className='h-5 w-5 text-blue-600 dark:text-blue-400' />
							</div>
							<div>
								<p className='text-sm text-gray-500 dark:text-gray-400'>
									Email
								</p>
								<p className='font-medium text-gray-900 dark:text-white'>
									{user.email}
								</p>
							</div>
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	)
}
