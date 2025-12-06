const AuthLayout = ({ children }) => {
	return (
		<div className='min-h-screen bg-neutral-100 dark:bg-zinc-950 flex items-center justify-center px-4'>
			<div className='w-full max-w-5xl bg-white dark:bg-zinc-900 rounded-3xl shadow-xl overflow-hidden flex flex-col md:flex-row'>
				{/* LEFT — FORM SECTION */}
				<div className='w-full md:w-1/2 px-8 sm:px-12 py-10 dark:text-white'>
					{children}
				</div>

				{/* RIGHT — BRAND SECTION */}
				<div className='w-full md:w-1/2 bg-black dark:bg-zinc-950 text-white flex items-center justify-center p-8'>
					<div className='flex flex-col items-center gap-6'>
						<div className='h-20 w-20 rounded-3xl border border-white/25 flex items-center justify-center text-3xl font-bold'>
							&lt;/&gt;
						</div>
						<div className='text-center'>
							<div className='text-4xl font-bold tracking-tight'>CodeByZ</div>
							<p className='mt-3 max-w-xs text-sm text-white/70'>
								Build, learn and ship modern applications with the CodeByZ
								platform.
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

export default AuthLayout
