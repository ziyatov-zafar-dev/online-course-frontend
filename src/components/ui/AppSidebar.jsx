import {
	Sidebar,
	SidebarContent,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@/components/ui/sidebar"
import {
	Book,
	Home,
	Layers,
	LayoutDashboard,
	ListChecks,
	Tag,
	Users,
} from "lucide-react"
import { Link, useLocation } from "react-router-dom"

const adminItems = [
	{ label: "Dashboard", icon: Home, to: "/dashboard" },
	{ label: "Skills", icon: ListChecks, to: "/admin/skills" },
	{ label: "Modules", icon: Layers, to: "/admin/modules" },
	{ label: "Courses", icon: Book, to: "/admin/courses" },
	{ label: "Categories", icon: Tag, to: "/admin/categories" },
	{ label: "Users", icon: Users, to: "/admin/users" },
	{ label: "Lessons", icon: LayoutDashboard, to: "/admin/lessons" },
]

export default function AppSidebar() {
	const { pathname } = useLocation()

	return (
		<Sidebar className='border-r'>
			<SidebarHeader className='p-4'>
				<h2 className='text-lg font-bold'>Admin Panel</h2>
			</SidebarHeader>
			<SidebarContent>
				<SidebarGroup>
					<SidebarGroupLabel>Menu</SidebarGroupLabel>
					<SidebarGroupContent>
						<SidebarMenu>
							{adminItems.map((item) => (
								<SidebarMenuItem key={item.label}>
									<SidebarMenuButton asChild isActive={pathname === item.to}>
										<Link to={item.to}>
											<item.icon className='mr-2 h-4 w-4' />
											<span>{item.label}</span>
										</Link>
									</SidebarMenuButton>
								</SidebarMenuItem>
							))}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>
		</Sidebar>
	)
}
