import Bg from "@/assets/register-bg.jpg"
import VerifySignUp from "@/pages/auth/VerifySignUp"

export default function OtpUp() {
	return (
		<div
			style={{ backgroundImage: `url(${Bg})` }}
			className='flex min-h-screen w-full items-center justify-center p-6 md:p-10'
		>
			{/* Verify SignUp kartasi */}
			<div className='w-full max-w-md'>
				<VerifySignUp />
			</div>
		</div>
	)
}
