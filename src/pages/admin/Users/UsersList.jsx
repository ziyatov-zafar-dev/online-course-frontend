import { banUser, deleteUser, getUsers, unbanUser } from "@/api/users"
import { Button } from "@/components/ui/button"
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table"
import {
	Ban,
	CheckCircle,
	Edit,
	Loader2,
	Mail,
	Search,
	Trash,
	User,
	Users,
} from "lucide-react"
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { toast } from "sonner"

export default function UsersList() {
	const [users, setUsers] = useState([])
	const [loading, setLoading] = useState(false)
	const [search, setSearch] = useState("")
	const [deleteId, setDeleteId] = useState(null)
	const [deleting, setDeleting] = useState(false)

	useEffect(() => {
		fetchUsers()
	}, [])

	const fetchUsers = async () => {
		setLoading(true)
		try {
			const res = await getUsers()
			setUsers(res.data?.data || res.data?.items || res.data || [])
		} catch (err) {
			toast.error("Foydalanuvchilarni yuklashda xatolik")
			console.error(err)
		} finally {
			setLoading(false)
		}
	}

	const handleDelete = async () => {
		setDeleting(true)
		try {
			await deleteUser(deleteId)
			toast.success("Foydalanuvchi o'chirildi")
			setUsers(users.filter((u) => u.id !== deleteId))
			setDeleteId(null)
		} catch {
			toast.error("O'chirishda xatolik")
		} finally {
			setDeleting(false)
		}
	}

	const handleBan = async (userId, isBanned) => {
		try {
			if (isBanned) {
				await unbanUser(userId)
				toast.success("Foydalanuvchi blokdan chiqarildi")
			} else {
				await banUser(userId)
				toast.success("Foydalanuvchi bloklandi")
			}
			fetchUsers()
		} catch {
			toast.error("Amalda xatolik yuz berdi")
		}
	}

	const filteredUsers = users.filter(
		(user) =>
			user.username?.toLowerCase().includes(search.toLowerCase()) ||
			user.email?.toLowerCase().includes(search.toLowerCase()) ||
			user.name?.toLowerCase().includes(search.toLowerCase())
	)

	const getRoleBadge = (role) => {
		const roles = {
			admin: {
				label: "Admin",
				class: "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400",
			},
			user: {
				label: "Foydalanuvchi",
				class:
					"bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400",
			},
			moderator: {
				label: "Moderator",
				class:
					"bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400",
			},
		}
		const roleData = roles[role?.toLowerCase()] || roles.user
		return (
			<span className={`px-2 py-1 text-xs rounded-full ${roleData.class}`}>
				{roleData.label}
			</span>
		)
	}

	const getStatusBadge = (user) => {
		if (user.isBanned || user.blocked) {
			return (
				<span className='px-2 py-1 text-xs rounded-full bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 flex items-center gap-1'>
					<Ban className='h-3 w-3' />
					Bloklangan
				</span>
			)
		}
		if (user.isVerified || user.verified) {
			return (
				<span className='px-2 py-1 text-xs rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 flex items-center gap-1'>
					<CheckCircle className='h-3 w-3' />
					Tasdiqlangan
				</span>
			)
		}
		return (
			<span className='px-2 py-1 text-xs rounded-full bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400'>
				Kutilmoqda
			</span>
		)
	}

	return (
		<div className='space-y-6'>
			{/* Header */}
			<div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
				<div>
					<h1 className='text-2xl font-semibold text-gray-900 dark:text-white'>
						Foydalanuvchilar
					</h1>
					<p className='text-sm text-gray-500 dark:text-gray-400'>
						Tizim foydalanuvchilarini boshqaring
					</p>
				</div>
			</div>

			{/* Search */}
			<div className='bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm'>
				<div className='relative max-w-md'>
					<Search className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500' />
					<Input
						type='search'
						placeholder='Foydalanuvchi qidirish...'
						className='pl-10 bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500'
						value={search}
						onChange={(e) => setSearch(e.target.value)}
					/>
				</div>
			</div>

			{/* Content */}
			<div className='bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden'>
				{loading ? (
					<div className='flex items-center justify-center py-12'>
						<Loader2 className='h-8 w-8 text-blue-600 dark:text-blue-400 animate-spin' />
					</div>
				) : filteredUsers.length === 0 ? (
					<div className='text-center py-12'>
						<Users className='h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-4' />
						<h3 className='text-lg font-medium text-gray-900 dark:text-white mb-2'>
							Foydalanuvchi topilmadi
						</h3>
						<p className='text-gray-500 dark:text-gray-400'>
							Hozircha foydalanuvchi mavjud emas
						</p>
					</div>
				) : (
					<Table>
						<TableHeader>
							<TableRow className='bg-gray-50 dark:bg-gray-900'>
								<TableHead className='text-gray-700 dark:text-gray-300'>
									Foydalanuvchi
								</TableHead>
								<TableHead className='text-gray-700 dark:text-gray-300'>
									Email
								</TableHead>
								<TableHead className='text-gray-700 dark:text-gray-300'>
									Rol
								</TableHead>
								<TableHead className='text-gray-700 dark:text-gray-300'>
									Holati
								</TableHead>
								<TableHead className='text-gray-700 dark:text-gray-300'>
									Ro'yxatdan o'tgan
								</TableHead>
								<TableHead className='text-right text-gray-700 dark:text-gray-300'>
									Amallar
								</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{filteredUsers.map((user) => (
								<TableRow
									key={user.id}
									className='hover:bg-gray-50 dark:hover:bg-gray-700/50'
								>
									<TableCell>
										<div className='flex items-center gap-3'>
											<div className='w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center'>
												{user.avatar || user.profileImage ? (
													<img
														src={user.avatar || user.profileImage}
														alt={user.username}
														className='w-10 h-10 rounded-full object-cover'
													/>
												) : (
													<User className='h-5 w-5 text-blue-600 dark:text-blue-400' />
												)}
											</div>
											<div>
												<p className='font-medium text-gray-900 dark:text-white'>
													{user.username || user.name}
												</p>
												{user.fullName && (
													<p className='text-sm text-gray-500 dark:text-gray-400'>
														{user.fullName}
													</p>
												)}
											</div>
										</div>
									</TableCell>
									<TableCell>
										<div className='flex items-center gap-1 text-gray-600 dark:text-gray-300'>
											<Mail className='h-4 w-4' />
											{user.email}
										</div>
									</TableCell>
									<TableCell>{getRoleBadge(user.role)}</TableCell>
									<TableCell>{getStatusBadge(user)}</TableCell>
									<TableCell className='text-gray-500 dark:text-gray-400'>
										{user.createdAt || user.created
											? new Date(
													user.createdAt || user.created
											  ).toLocaleDateString("uz-UZ")
											: "-"}
									</TableCell>
									<TableCell className='text-right'>
										<div className='flex items-center justify-end gap-2'>
											<Link to={`/admin/users/edit/${user.id}`}>
												<Button
													size='sm'
													variant='outline'
													className='dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700'
												>
													<Edit className='h-4 w-4' />
												</Button>
											</Link>
											<Button
												size='sm'
												variant='outline'
												className={
													user.isBanned || user.blocked
														? "text-green-500 hover:text-green-700 hover:bg-green-50 dark:border-gray-600 dark:hover:bg-green-900/20"
														: "text-orange-500 hover:text-orange-700 hover:bg-orange-50 dark:border-gray-600 dark:hover:bg-orange-900/20"
												}
												onClick={() =>
													handleBan(user.id, user.isBanned || user.blocked)
												}
											>
												{user.isBanned || user.blocked ? (
													<CheckCircle className='h-4 w-4' />
												) : (
													<Ban className='h-4 w-4' />
												)}
											</Button>
											<Button
												size='sm'
												variant='outline'
												className='text-red-500 hover:text-red-700 hover:bg-red-50 dark:border-gray-600 dark:hover:bg-red-900/20'
												onClick={() => setDeleteId(user.id)}
											>
												<Trash className='h-4 w-4' />
											</Button>
										</div>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				)}
			</div>

			{/* Delete Confirmation Dialog */}
			<Dialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
				<DialogContent className='dark:bg-gray-800 dark:border-gray-700'>
					<DialogHeader>
						<DialogTitle className='dark:text-white'>
							Foydalanuvchini o'chirish
						</DialogTitle>
						<DialogDescription className='dark:text-gray-400'>
							Haqiqatan ham bu foydalanuvchini o'chirmoqchimisiz? Bu amalni
							ortga qaytarib bo'lmaydi.
						</DialogDescription>
					</DialogHeader>
					<DialogFooter className='gap-2'>
						<Button
							variant='outline'
							onClick={() => setDeleteId(null)}
							className='dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700'
						>
							Bekor qilish
						</Button>
						<Button
							variant='destructive'
							onClick={handleDelete}
							disabled={deleting}
						>
							{deleting ? (
								<>
									<Loader2 className='h-4 w-4 mr-2 animate-spin' />
									O'chirilmoqda...
								</>
							) : (
								"O'chirish"
							)}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	)
}
