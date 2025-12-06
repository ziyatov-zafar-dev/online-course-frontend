import { Link } from "react-router-dom"

const NotFound = () => {
	return (
		<div className='min-h-screen flex flex-col items-center justify-center bg-neutral-100 dark:bg-zinc-950 text-center px-4'>
			<h1 className='text-6xl font-bold text-neutral-900 dark:text-white'>
				404
			</h1>
			<p className='mt-2 text-neutral-600 dark:text-neutral-300 text-lg'>
				Kechirasiz, siz izlayotgan sahifa mavjud emas.
			</p>

			<Link
				to='/'
				className='mt-6 text-sm bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 px-6 py-2 rounded-xl shadow hover:opacity-80 transition'
			>
				Bosh sahifaga qaytish
			</Link>
		</div>
	)
}

export default NotFound
