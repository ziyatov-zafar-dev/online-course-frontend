import { Button } from "@/components/ui/button"
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog"
import { useState } from "react"

export default function AdminForm({
	open,
	onClose,
	title,
	fields,
	onSubmit,
	initialValues,
	loading,
}) {
	const [values, setValues] = useState(initialValues || {})
	const handleChange = (e) => {
		setValues({ ...values, [e.target.name]: e.target.value })
	}
	const handleSubmit = (e) => {
		e.preventDefault()
		onSubmit(values)
	}
	return (
		<Dialog open={open} onOpenChange={onClose}>
			<DialogContent className='dark:bg-gray-800 dark:border-gray-700'>
				<DialogHeader>
					<DialogTitle className='dark:text-white'>{title}</DialogTitle>
				</DialogHeader>
				<form onSubmit={handleSubmit} className='space-y-4'>
					{fields.map((field) => (
						<div key={field.name}>
							<label className='block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300'>
								{field.label}
							</label>
							<input
								type={field.type || "text"}
								name={field.name}
								value={values[field.name] || ""}
								onChange={handleChange}
								className='w-full border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400 transition-colors'
								required={field.required}
							/>
						</div>
					))}
					<DialogFooter className='gap-2'>
						<Button
							type='button'
							variant='outline'
							onClick={onClose}
							className='dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700'
						>
							Bekor qilish
						</Button>
						<Button
							type='submit'
							disabled={loading}
							className='bg-blue-600 hover:bg-blue-700'
						>
							{loading ? "Saqlanmoqda..." : "Saqlash"}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	)
}
