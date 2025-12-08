import { verifyEmail } from "@/api/auth"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/sonner"
import { useState } from "react"
import { useNavigate } from "react-router-dom"

export default function EmailVerify() {
	const [code, setCode] = useState("")
	const [loading, setLoading] = useState(false)
	const navigate = useNavigate()

	const handleSubmit = async (e) => {
		e.preventDefault()
		setLoading(true)
		try {
			await verifyEmail({ code })
			toast.success("Email verified")
			navigate("/auth/sign-in")
		} catch {
			toast.error("Verification failed")
		} finally {
			setLoading(false)
		}
	}

	return (
		<div className='max-w-md mx-auto mt-24 p-8 bg-card rounded shadow'>
			<h2 className='text-2xl font-bold mb-6'>Verify Email</h2>
			<form onSubmit={handleSubmit} className='space-y-4'>
				<div>
					<label className='block mb-1'>Verification Code</label>
					<input
						name='code'
						value={code}
						onChange={(e) => setCode(e.target.value)}
						className='w-full border rounded px-3 py-2'
						required
					/>
				</div>
				<Button type='submit' loading={loading}>
					Verify
				</Button>
			</form>
		</div>
	)
}
