import { cn } from "@/lib/utils"

export default function StatCard({
	title,
	value,
	icon: Icon,
	description,
	trend,
	trendUp = true,
	className,
}) {
	return (
		<div
			className={cn(
				"bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300",
				className
			)}
		>
			<div className='flex items-center justify-between'>
				<div>
					<p className='text-sm text-gray-500 dark:text-gray-400 font-medium'>
						{title}
					</p>
					<p className='text-3xl font-bold text-gray-900 dark:text-white mt-2'>
						{value}
					</p>
					{description && (
						<p className='text-sm text-gray-500 dark:text-gray-400 mt-1'>
							{description}
						</p>
					)}
					{trend && (
						<div className='flex items-center mt-2'>
							<span
								className={cn(
									"text-sm font-medium",
									trendUp ? "text-green-500" : "text-red-500"
								)}
							>
								{trendUp ? "↑" : "↓"} {trend}
							</span>
							<span className='text-sm text-gray-400 dark:text-gray-500 ml-1'>
								vs last month
							</span>
						</div>
					)}
				</div>
				{Icon && (
					<div className='p-3 bg-blue-50 dark:bg-blue-900/30 rounded-xl'>
						<Icon className='h-6 w-6 text-blue-600 dark:text-blue-400' />
					</div>
				)}
			</div>
		</div>
	)
}
