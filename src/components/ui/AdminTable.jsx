import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
	Table,
	TableBody,
	TableCell,
	TableHeader,
	TableRow,
} from "@/components/ui/table"
import { ChevronLeft, ChevronRight, Search } from "lucide-react"
import { useState } from "react"

export default function AdminTable({
	columns,
	data,
	onSearch,
	onPageChange,
	page,
	pageCount,
}) {
	const [search, setSearch] = useState("")
	return (
		<div className='w-full'>
			<div className='flex items-center justify-between mb-4'>
				<Input
					placeholder='Qidirish...'
					value={search}
					onChange={(e) => {
						setSearch(e.target.value)
						onSearch && onSearch(e.target.value)
					}}
					className='w-64 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500'
					icon={<Search size={16} />}
				/>
				<div className='flex gap-2 items-center'>
					<Button
						disabled={page === 1}
						onClick={() => onPageChange(page - 1)}
						variant='outline'
						className='dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700'
					>
						<ChevronLeft size={16} />
					</Button>
					<span className='px-2 text-gray-700 dark:text-gray-300'>
						{page} / {pageCount}
					</span>
					<Button
						disabled={page === pageCount}
						onClick={() => onPageChange(page + 1)}
						variant='outline'
						className='dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700'
					>
						<ChevronRight size={16} />
					</Button>
				</div>
			</div>
			<div className='bg-white dark:bg-gray-800 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700'>
				<Table>
					<TableHeader>
						<TableRow className='bg-gray-50 dark:bg-gray-900'>
							{columns.map((col) => (
								<TableCell
									key={col.key}
									className='font-semibold text-gray-700 dark:text-gray-300'
								>
									{col.label}
								</TableCell>
							))}
							<TableCell className='font-semibold text-gray-700 dark:text-gray-300'>
								Amallar
							</TableCell>
						</TableRow>
					</TableHeader>
					<TableBody>
						{data.map((row) => (
							<TableRow
								key={row.id}
								className='hover:bg-gray-50 dark:hover:bg-gray-700/50'
							>
								{columns.map((col) => (
									<TableCell
										key={col.key}
										className='text-gray-900 dark:text-gray-100'
									>
										{row[col.key]}
									</TableCell>
								))}
								<TableCell>{row.actions}</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div>
		</div>
	)
}
