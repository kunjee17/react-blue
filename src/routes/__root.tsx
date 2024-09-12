import {
	NavigationMenu,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { Link, Outlet, createRootRoute } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";

export const Route = createRootRoute({
	component: RootRoute,
});

function RootRoute() {
	return (
		<div className="container mx-auto p-4">
			<NavigationMenu className="border-b border-gray-200 pb-4 mb-4">
				<NavigationMenuList className="flex gap-4">
					<NavigationMenuItem>
						<NavigationMenuLink asChild>
							<Link to="/" className="text-lg font-medium hover:text-blue-500">
								Home
							</Link>
						</NavigationMenuLink>
					</NavigationMenuItem>
					<NavigationMenuItem>
						<NavigationMenuLink asChild>
							<Link
								to="/about"
								className="text-lg font-medium hover:text-blue-500"
							>
								About
							</Link>
						</NavigationMenuLink>
					</NavigationMenuItem>
				</NavigationMenuList>
			</NavigationMenu>

			<div className="my-8">
				<Outlet />
			</div>

			<TanStackRouterDevtools />
		</div>
	);
}
