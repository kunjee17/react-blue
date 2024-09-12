import {
	NavigationMenu,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { Link, Outlet, createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/_auth")({
	component: AuthLayout,
});

function AuthLayout() {
	return (
		<>
			<NavigationMenu className="border-b border-gray-200 pb-4 mb-4">
				<NavigationMenuList className="flex gap-4">
					<NavigationMenuItem>
						<NavigationMenuLink asChild>
							<Link
								to="/login"
								className="text-lg font-medium hover:text-blue-500"
							>
								Login
							</Link>
						</NavigationMenuLink>
					</NavigationMenuItem>
					<NavigationMenuItem>
						<NavigationMenuLink asChild>
							<Link
								to="/register"
								className="text-lg font-medium hover:text-blue-500"
							>
								Register
							</Link>
						</NavigationMenuLink>
					</NavigationMenuItem>
				</NavigationMenuList>
			</NavigationMenu>

			<Outlet />
		</>
	);
}
