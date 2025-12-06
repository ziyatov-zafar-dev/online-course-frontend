import Bg from "@/assets/register-bg.jpg"
import { VerifySignIn } from "@/pages/auth/VerifySignIn"

export default function OtpIn() {
	return (
		<div
			style={{ backgroundImage: `url(${Bg})` }}
			className='flex min-h-screen w-full items-center justify-center p-6 md:p-10 '
		>
			<div className='w-full max-w-md'>
				<VerifySignIn />
			</div>
		</div>
	)
}
