import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select"
import {
	Bell,
	Globe,
	Mail,
	Monitor,
	Moon,
	Palette,
	Save,
	Settings as SettingsIcon,
	Shield,
	Smartphone,
	Sun,
} from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"

const settingsSections = [
	{ id: "general", label: "Umumiy", icon: SettingsIcon },
	{ id: "notifications", label: "Bildirishnomalar", icon: Bell },
	{ id: "appearance", label: "Ko'rinish", icon: Palette },
	{ id: "security", label: "Xavfsizlik", icon: Shield },
	{ id: "language", label: "Til", icon: Globe },
]

export default function Settings() {
	const [activeSection, setActiveSection] = useState("general")
	const [settings, setSettings] = useState({
		// General
		siteName: "Praktikum",
		siteDescription: "Ta'lim platformasi",
		adminEmail: "admin@praktikum.uz",
		// Notifications
		emailNotifications: true,
		pushNotifications: true,
		newUserNotification: true,
		newCourseNotification: true,
		// Appearance
		theme: "light",
		primaryColor: "#4F46E5",
		// Security
		twoFactorAuth: false,
		sessionTimeout: "30",
		// Language
		language: "uz",
	})

	const handleChange = (key, value) => {
		setSettings((prev) => ({ ...prev, [key]: value }))
	}

	const handleSave = () => {
		// Save settings to backend
		toast.success("Sozlamalar saqlandi!")
	}

	const renderSection = () => {
		switch (activeSection) {
			case "general":
				return (
					<div className='space-y-6'>
						<div>
							<h3 className='text-lg font-semibold text-gray-900 dark:text-white mb-4'>
								Umumiy sozlamalar
							</h3>
							<div className='space-y-4'>
								<div className='grid gap-2'>
									<Label htmlFor='siteName' className='dark:text-gray-300'>
										Sayt nomi
									</Label>
									<Input
										id='siteName'
										value={settings.siteName}
										onChange={(e) => handleChange("siteName", e.target.value)}
										placeholder='Sayt nomini kiriting'
										className='dark:bg-gray-700 dark:border-gray-600 dark:text-white'
									/>
								</div>
								<div className='grid gap-2'>
									<Label
										htmlFor='siteDescription'
										className='dark:text-gray-300'
									>
										Sayt tavsifi
									</Label>
									<Input
										id='siteDescription'
										value={settings.siteDescription}
										onChange={(e) =>
											handleChange("siteDescription", e.target.value)
										}
										placeholder='Sayt tavsifini kiriting'
										className='dark:bg-gray-700 dark:border-gray-600 dark:text-white'
									/>
								</div>
								<div className='grid gap-2'>
									<Label htmlFor='adminEmail' className='dark:text-gray-300'>
										Admin email
									</Label>
									<Input
										id='adminEmail'
										type='email'
										value={settings.adminEmail}
										onChange={(e) => handleChange("adminEmail", e.target.value)}
										placeholder='admin@example.com'
										className='dark:bg-gray-700 dark:border-gray-600 dark:text-white'
									/>
								</div>
							</div>
						</div>
					</div>
				)

			case "notifications":
				return (
					<div className='space-y-6'>
						<div>
							<h3 className='text-lg font-semibold text-gray-900 dark:text-white mb-4'>
								Bildirishnoma sozlamalari
							</h3>
							<div className='space-y-4'>
								<NotificationToggle
									icon={Mail}
									label='Email bildirishnomalar'
									description='Muhim yangiliklar haqida email orqali xabar oling'
									checked={settings.emailNotifications}
									onChange={(checked) =>
										handleChange("emailNotifications", checked)
									}
								/>
								<NotificationToggle
									icon={Smartphone}
									label='Push bildirishnomalar'
									description='Brauzer orqali push xabarlar oling'
									checked={settings.pushNotifications}
									onChange={(checked) =>
										handleChange("pushNotifications", checked)
									}
								/>
								<NotificationToggle
									icon={Bell}
									label='Yangi foydalanuvchi'
									description="Yangi foydalanuvchi ro'yxatdan o'tganda xabar oling"
									checked={settings.newUserNotification}
									onChange={(checked) =>
										handleChange("newUserNotification", checked)
									}
								/>
								<NotificationToggle
									icon={Bell}
									label='Yangi kurs'
									description="Yangi kurs qo'shilganda xabar oling"
									checked={settings.newCourseNotification}
									onChange={(checked) =>
										handleChange("newCourseNotification", checked)
									}
								/>
							</div>
						</div>
					</div>
				)

			case "appearance":
				return (
					<div className='space-y-6'>
						<div>
							<h3 className='text-lg font-semibold text-gray-900 dark:text-white mb-4'>
								Ko'rinish sozlamalari
							</h3>
							<div className='space-y-6'>
								<div className='grid gap-2'>
									<Label>Mavzu (Theme)</Label>
									<div className='grid grid-cols-3 gap-3'>
										<ThemeOption
											icon={Sun}
											label="Yorug'"
											value='light'
											selected={settings.theme === "light"}
											onClick={() => handleChange("theme", "light")}
										/>
										<ThemeOption
											icon={Moon}
											label="Qorong'u"
											value='dark'
											selected={settings.theme === "dark"}
											onClick={() => handleChange("theme", "dark")}
										/>
										<ThemeOption
											icon={Monitor}
											label='Tizim'
											value='system'
											selected={settings.theme === "system"}
											onClick={() => handleChange("theme", "system")}
										/>
									</div>
								</div>
								<div className='grid gap-2'>
									<Label htmlFor='primaryColor'>Asosiy rang</Label>
									<div className='flex items-center gap-3'>
										<input
											type='color'
											id='primaryColor'
											value={settings.primaryColor}
											onChange={(e) =>
												handleChange("primaryColor", e.target.value)
											}
											className='w-12 h-10 rounded cursor-pointer border border-gray-200'
										/>
										<Input
											value={settings.primaryColor}
											onChange={(e) =>
												handleChange("primaryColor", e.target.value)
											}
											className='flex-1'
										/>
									</div>
								</div>
							</div>
						</div>
					</div>
				)

			case "security":
				return (
					<div className='space-y-6'>
						<div>
							<h3 className='text-lg font-semibold text-gray-900 dark:text-white mb-4'>
								Xavfsizlik sozlamalari
							</h3>
							<div className='space-y-4'>
								<NotificationToggle
									icon={Shield}
									label='Ikki bosqichli autentifikatsiya'
									description='Akkauntingizni qo`shimcha himoyalang'
									checked={settings.twoFactorAuth}
									onChange={(checked) => handleChange("twoFactorAuth", checked)}
								/>
								<div className='grid gap-2'>
									<Label htmlFor='sessionTimeout'>Sessiya vaqti (daqiqa)</Label>
									<Select
										value={settings.sessionTimeout}
										onValueChange={(value) =>
											handleChange("sessionTimeout", value)
										}
									>
										<SelectTrigger>
											<SelectValue placeholder='Tanlang' />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value='15'>15 daqiqa</SelectItem>
											<SelectItem value='30'>30 daqiqa</SelectItem>
											<SelectItem value='60'>1 soat</SelectItem>
											<SelectItem value='120'>2 soat</SelectItem>
											<SelectItem value='480'>8 soat</SelectItem>
										</SelectContent>
									</Select>
								</div>
							</div>
						</div>
					</div>
				)

			case "language":
				return (
					<div className='space-y-6'>
						<div>
							<h3 className='text-lg font-semibold text-gray-900 dark:text-white mb-4'>
								Til sozlamalari
							</h3>
							<div className='space-y-4'>
								<div className='grid gap-2'>
									<Label htmlFor='language'>Interfeys tili</Label>
									<Select
										value={settings.language}
										onValueChange={(value) => handleChange("language", value)}
									>
										<SelectTrigger>
											<SelectValue placeholder='Tilni tanlang' />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value='uz'>O'zbek tili</SelectItem>
											<SelectItem value='ru'>Русский</SelectItem>
											<SelectItem value='en'>English</SelectItem>
										</SelectContent>
									</Select>
								</div>
							</div>
						</div>
					</div>
				)

			default:
				return null
		}
	}

	return (
		<div className='max-w-5xl mx-auto'>
			<div className='mb-6'>
				<h1 className='text-2xl font-semibold text-gray-900 dark:text-white'>
					Sozlamalar
				</h1>
				<p className='text-sm text-gray-500 dark:text-gray-400 mt-1'>
					Platformaning asosiy sozlamalarini boshqaring
				</p>
			</div>

			<div className='bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden'>
				<div className='flex'>
					{/* Sidebar */}
					<div className='w-64 border-r border-gray-200 dark:border-gray-700 p-4'>
						<nav className='space-y-1'>
							{settingsSections.map((section) => (
								<button
									key={section.id}
									onClick={() => setActiveSection(section.id)}
									className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-lg transition-all duration-200 ${
										activeSection === section.id
											? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
											: "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white"
									}`}
								>
									<section.icon className='h-5 w-5' />
									<span className='font-medium text-sm'>{section.label}</span>
								</button>
							))}
						</nav>
					</div>

					{/* Content */}
					<div className='flex-1 p-6'>
						{renderSection()}

						{/* Save Button */}
						<div className='mt-8 pt-6 border-t border-gray-200 dark:border-gray-700'>
							<Button
								onClick={handleSave}
								className='bg-blue-600 hover:bg-blue-700 text-white'
							>
								<Save className='h-4 w-4 mr-2' />
								Saqlash
							</Button>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

// Helper Components
function NotificationToggle({
	icon: Icon,
	label,
	description,
	checked,
	onChange,
}) {
	return (
		<div className='flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg'>
			<div className='flex items-center gap-3'>
				<div className='w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center'>
					<Icon className='h-5 w-5 text-blue-600 dark:text-blue-400' />
				</div>
				<div>
					<p className='font-medium text-gray-900 dark:text-white'>{label}</p>
					<p className='text-sm text-gray-500 dark:text-gray-400'>
						{description}
					</p>
				</div>
			</div>
			<label className='relative inline-flex items-center cursor-pointer'>
				<input
					type='checkbox'
					checked={checked}
					onChange={(e) => onChange(e.target.checked)}
					className='sr-only peer'
				/>
				<div className="w-11 h-6 bg-gray-200 dark:bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-100 dark:peer-focus:ring-blue-900/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
			</label>
		</div>
	)
}

function ThemeOption({ icon: Icon, label, value, selected, onClick }) {
	return (
		<button
			onClick={onClick}
			className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all ${
				selected
					? "border-blue-600 bg-blue-50 dark:bg-blue-900/30"
					: "border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500"
			}`}
		>
			<Icon
				className={`h-6 w-6 ${
					selected
						? "text-blue-600 dark:text-blue-400"
						: "text-gray-500 dark:text-gray-400"
				}`}
			/>
			<span
				className={`text-sm font-medium ${
					selected
						? "text-blue-600 dark:text-blue-400"
						: "text-gray-600 dark:text-gray-300"
				}`}
			>
				{label}
			</span>
		</button>
	)
}
