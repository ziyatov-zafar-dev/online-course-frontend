import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { BookOpen, Clock, Play, Users } from "lucide-react"
import { Link } from "react-router-dom"

export default function CourseCard({
	id,
	title,
	description,
	image,
	instructor,
	duration,
	students,
	lessons,
	progress,
	category,
	className,
}) {
	return (
		<div
			className={cn(
				"bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 group",
				className
			)}
		>
			{/* Image */}
			<div className='relative h-48 overflow-hidden'>
				<img
					src={image || "/placeholder-course.jpg"}
					alt={title}
					className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-500'
				/>
				{category && (
					<span className='absolute top-3 left-3 px-3 py-1 bg-blue-600 text-white text-xs font-medium rounded-full'>
						{category}
					</span>
				)}
				{progress !== undefined && (
					<div className='absolute bottom-0 left-0 right-0 h-1 bg-gray-200 dark:bg-gray-700'>
						<div
							className='h-full bg-blue-600 transition-all duration-300'
							style={{ width: `${progress}%` }}
						/>
					</div>
				)}
			</div>

			{/* Content */}
			<div className='p-5'>
				<h3 className='text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors'>
					{title}
				</h3>
				{description && (
					<p className='text-sm text-gray-500 dark:text-gray-400 mb-4 line-clamp-2'>
						{description}
					</p>
				)}

				{/* Meta */}
				<div className='flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-4'>
					{duration && (
						<div className='flex items-center gap-1'>
							<Clock className='h-4 w-4' />
							<span>{duration}</span>
						</div>
					)}
					{lessons && (
						<div className='flex items-center gap-1'>
							<BookOpen className='h-4 w-4' />
							<span>{lessons} dars</span>
						</div>
					)}
					{students && (
						<div className='flex items-center gap-1'>
							<Users className='h-4 w-4' />
							<span>{students}</span>
						</div>
					)}
				</div>

				{/* Footer */}
				<div className='flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700'>
					{instructor && (
						<div className='flex items-center gap-2'>
							<div className='w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center'>
								<span className='text-blue-600 dark:text-blue-400 text-sm font-medium'>
									{instructor.charAt(0)}
								</span>
							</div>
							<span className='text-sm text-gray-600 dark:text-gray-300'>
								{instructor}
							</span>
						</div>
					)}
					<Link to={`/courses/${id}`}>
						<Button
							size='sm'
							className='bg-blue-600 hover:bg-blue-700 text-white'
						>
							<Play className='h-4 w-4 mr-1' />
							Boshlash
						</Button>
					</Link>
				</div>
			</div>
		</div>
	)
}
