import { OTPInput, OTPInputContext } from "input-otp"
import { Minus } from "lucide-react"
import * as React from "react"

import { cn } from "@/lib/utils"

const InputOTP = React.forwardRef(
	({ className, containerClassName, ...props }, ref) => (
		<OTPInput
			ref={ref}
			containerClassName={cn(
				"flex items-center gap-2 has-[:disabled]:opacity-50",
				containerClassName
			)}
			className={cn("disabled:cursor-not-allowed", className)}
			{...props}
		/>
	)
)
InputOTP.displayName = "InputOTP"

const InputOTPGroup = React.forwardRef(({ className, ...props }, ref) => (
	<div ref={ref} className={cn("flex items-center", className)} {...props} />
))
InputOTPGroup.displayName = "InputOTPGroup"

const InputOTPSlot = React.forwardRef(({ index, className, ...props }, ref) => {
	const inputOTPContext = React.useContext(OTPInputContext)
	const { char, hasFakeCaret, isActive } = inputOTPContext.slots[index]

	return (
		<div
			ref={ref}
			className={cn(
				`relative flex h-12 w-10 items-center justify-center
         border border-input text-lg shadow-sm transition-all
         rounded-md `,
				isActive && "ring-2 ring-blue-500 border-blue-500 z-10",
				className
			)}
			{...props}
		>
			{char}
			{hasFakeCaret && (
				<div className='pointer-events-none absolute inset-0 flex items-center justify-center'>
					<div className='h-5 w-px bg-primary animate-caret-blink duration-1000' />
				</div>
			)}
		</div>
	)
})
InputOTPSlot.displayName = "InputOTPSlot"

const InputOTPSeparator = React.forwardRef(({ ...props }, ref) => (
	<div ref={ref} role='separator' {...props}>
		<Minus />
	</div>
))
InputOTPSeparator.displayName = "InputOTPSeparator"

export { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot }
