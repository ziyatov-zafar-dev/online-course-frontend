import { useEffect } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"

const GoogleAuthHandler = () => {
	const navigate = useNavigate()
	const [searchParams] = useSearchParams()

	useEffect(() => {
		const accessToken = searchParams.get("accessToken")
		const refreshToken = searchParams.get("refreshToken")
		const email = searchParams.get("email")

		if (!email) {
			navigate("/not-found", { replace: true })
			return
		}

		// Token va emailni saqlash
		localStorage.setItem("accessToken", accessToken)
		localStorage.setItem("refreshToken", refreshToken)
		localStorage.setItem("userEmail", email)

		navigate("/dashboard", { replace: true })
	}, [])

	return (
		<div className='flex items-center justify-center h-screen'>
			<p className='text-gray-700 text-lg'>Loading Google authentication...</p>
		</div>
	)
}

export default GoogleAuthHandler
