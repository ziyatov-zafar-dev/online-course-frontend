import { Button } from "@/components/ui/button"
import { AlertTriangle, ArrowLeft, UserPlus } from "lucide-react"
import { Link } from "react-router-dom"

const GoogleEmailNotFound = () => {
	return (
		<div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4'>
			<div className='max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center'>
				{/* Icon */}
				<div className='w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6'>
					<AlertTriangle className='w-10 h-10 text-amber-600' />
				</div>

				{/* Title */}
				<h1 className='text-2xl font-bold text-gray-900 mb-3'>
					Foydalanuvchi topilmadi
				</h1>

				{/* Description */}
				<p className='text-gray-600 mb-8'>
					Bu Google hisobi bilan ro'yxatdan o'tilmagan. Iltimos, avval
					ro'yxatdan o'ting yoki boshqa hisob bilan urinib ko'ring.
				</p>

				{/* Actions */}
				<div className='space-y-3'>
					<Link to='/signup' className='block'>
						<Button className='w-full h-12 bg-indigo-600 hover:bg-indigo-700'>
							<UserPlus className='w-5 h-5 mr-2' />
							Ro'yxatdan o'tish
						</Button>
					</Link>

					<Link to='/signin' className='block'>
						<Button variant='outline' className='w-full h-12'>
							<ArrowLeft className='w-5 h-5 mr-2' />
							Kirish sahifasiga qaytish
						</Button>
					</Link>
				</div>

				{/* Help text */}
				<p className='text-sm text-gray-500 mt-6'>
					Yordam kerakmi?{" "}
					<a
						href='mailto:support@codebyz.online'
						className='text-indigo-600 hover:underline'
					>
						Biz bilan bog'laning
					</a>
				</p>
			</div>
		</div>
	)
}

export default GoogleEmailNotFound
