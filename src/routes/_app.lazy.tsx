import {
	NavigationMenu,
	NavigationMenuItem,
	NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { useAuth } from "@/providers/auth";
import { Outlet, createLazyFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";

export const Route = createLazyFileRoute("/_app")({
	component: App,
});

function App() {
	const { currentUser, logout } = useAuth();
	const navigate = Route.useNavigate();
	useEffect(() => {
		if (!currentUser) {
			navigate({
				to: "/login",
			}).then(() => console.log("force navigation login"));
		}
	}, [navigate, currentUser]);

	return currentUser ? (
		<>
			<NavigationMenu className="border-b border-gray-200 pb-4 mb-4">
				<NavigationMenuList className="flex gap-4">
					<NavigationMenuItem
						onClick={async () => {
							logout();
							await navigate({
								to: "/login",
							});
						}}
					>
						Logout
					</NavigationMenuItem>
				</NavigationMenuList>
			</NavigationMenu>
			<Outlet />
		</>
	) : null;
}
