import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { ArrowRight } from "lucide-react"
import { Link } from "react-router-dom"

export default function InfoCard({
	title,
	description,
	icon: Icon,
	link,
	linkText = "Batafsil",
	variant = "default",
	className,
}) {
	const variants = {
		default: "bg-white dark:bg-gray-800",
		primary: "bg-gradient-to-br from-blue-500 to-blue-600 text-white",
		secondary: "bg-gradient-to-br from-purple-500 to-purple-600 text-white",
		success: "bg-gradient-to-br from-green-500 to-green-600 text-white",
	}

	const isColored = variant !== "default"

	return (
		<div
			className={cn(
				"rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300",
				variants[variant],
				className
			)}
		>
			{Icon && (
				<div
					className={cn(
						"p-3 rounded-xl w-fit mb-4",
						isColored ? "bg-white/20" : "bg-blue-50 dark:bg-blue-900/30"
					)}
				>
					<Icon
						className={cn(
							"h-6 w-6",
							isColored ? "text-white" : "text-blue-600 dark:text-blue-400"
						)}
					/>
				</div>
			)}
			<h3
				className={cn(
					"text-lg font-semibold mb-2",
					isColored ? "text-white" : "text-gray-900 dark:text-white"
				)}
			>
				{title}
			</h3>
			<p
				className={cn(
					"text-sm mb-4",
					isColored ? "text-white/80" : "text-gray-500 dark:text-gray-400"
				)}
			>
				{description}
			</p>
			{link && (
				<Link to={link}>
					<Button
						variant={isColored ? "secondary" : "ghost"}
						className={cn(
							"p-0 h-auto font-medium",
							isColored
								? "text-white hover:text-white/80 bg-transparent hover:bg-transparent"
								: "text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:bg-transparent"
						)}
					>
						{linkText}
						<ArrowRight className='h-4 w-4 ml-1' />
					</Button>
				</Link>
			)}
		</div>
	)
}
