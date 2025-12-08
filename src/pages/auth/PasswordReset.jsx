import { resetPassword } from "@/api/auth"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/sonner"
import { useState } from "react"

export default function PasswordReset() {
	const [values, setValues] = useState({ email: "", code: "", newPassword: "" })
	const [loading, setLoading] = useState(false)

	const handleChange = (e) =>
		setValues({ ...values, [e.target.name]: e.target.value })
	const handleSubmit = async (e) => {
		e.preventDefault()
		setLoading(true)
		try {
			await resetPassword(values)
			toast.success("Password reset successful")
		} catch {
			toast.error("Reset failed")
		} finally {
			setLoading(false)
		}
	}

	return (
		<div className='max-w-md mx-auto mt-24 p-8 bg-card rounded shadow'>
			<h2 className='text-2xl font-bold mb-6'>Reset Password</h2>
			<form onSubmit={handleSubmit} className='space-y-4'>
				<div>
					<label className='block mb-1'>Email</label>
					<input
						name='email'
						type='email'
						value={values.email}
						onChange={handleChange}
						className='w-full border rounded px-3 py-2'
						required
					/>
				</div>
				<div>
					<label className='block mb-1'>Verification Code</label>
					<input
						name='code'
						value={values.code}
						onChange={handleChange}
						className='w-full border rounded px-3 py-2'
						required
					/>
				</div>
				<div>
					<label className='block mb-1'>New Password</label>
					<input
						name='newPassword'
						type='password'
						value={values.newPassword}
						onChange={handleChange}
						className='w-full border rounded px-3 py-2'
						required
					/>
				</div>
				<Button type='submit' loading={loading}>
					Reset Password
				</Button>
			</form>
		</div>
	)
}
