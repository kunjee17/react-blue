- It is assumed that latest node lts is installed on machine 
- globally install pnpm using `npm i -g pnpm`
- create new application using `pnpm create vite`
- remove eslint
- install biome using `pnpm add --save-dev --save-exact @biomejs/biome`
- init biome using `pnpm biome init`
- biome check:write `pnpm biome check --write .`
- biome check `pnpm biome check .`
- ignore the obvious files ```"node_modules", "dist", "public", "tsconfig.*.*"```
- let's go for first lint error
- let's solve first two issues
- add type button to button
- replace root code with more strict code

```tsx
const rootElement = document.getElementById("root");

if (rootElement) {
	createRoot(rootElement).render(
		<StrictMode>
			<App />
		</StrictMode>,
	);
} else {
	console.error("No root element found");
}
```

- let's add Routing library using command `pnpm add @tanstack/react-router`
- also add some dev tools for same using `pnpm add -D @tanstack/router-plugin @tanstack/router-devtools @tanstack/router-cli`
- let's update vite.config with below code

```ts
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [TanStackRouterVite(), react()],
});
```

- create tsr.config.json in root
- populate default options 

```json
{
  "routesDirectory": "./src/routes",
  "generatedRouteTree": "./src/routeTree.gen.ts",
}
```

- TSR CLI is required to ignore `routeTree.gen.ts` file
- let's ignore the generated file in `.gitignore` and `biome.json`
- Time to create first routes 
    - create `__root.tsx` file in `src/routes` folder
    ```tsx
    import { Outlet, createRootRoute } from "@tanstack/react-router";
    import { TanStackRouterDevtools } from "@tanstack/router-devtools";

    export const Route = createRootRoute({
        component: RootRoute,
    });

    function RootRoute() {
        return (
            <>
                <Outlet />
                <TanStackRouterDevtools />
            </>
        );
    }
    ```

    - create `index.lazy.tsx` file in `src/routes` folder
    ```tsx
    import { createLazyFileRoute } from "@tanstack/react-router";

    export const Route = createLazyFileRoute("/")({
        component: Index,
    });

    function Index() {
        return (
            <div>
                <h1>Index file</h1>
            </div>
        );
    }
    ```

    - Now remove `App` from `main.tsx` 
    - Add below code to Run the routing 
    ```tsx
    import { StrictMode } from "react";
    import { createRoot } from "react-dom/client";
    import "./index.css";

    import { RouterProvider, createRouter } from "@tanstack/react-router";

    // Import the generated route tree
    import { routeTree } from "./routeTree.gen";

    // Create a new router instance
    const router = createRouter({ routeTree });

    // Register the router instance for type safety
    declare module "@tanstack/react-router" {
        interface Register {
            router: typeof router;
        }
    }

    const rootElement = document.getElementById("root");

    if (rootElement) {
        createRoot(rootElement).render(
            <StrictMode>
                <RouterProvider router={router} />
            </StrictMode>,
        );
    } else {
        console.error("No root element found");
    }
    ```
    
- Not let's set up the UI 
    - Now remove all the content of index.css and add 
    ```css
    @tailwind base;
    @tailwind components;
    @tailwind utilities;
    ```
    - we will be using `shadcn-ui` library for our UI. 
    - Add Tailwind and PostCSS using this command `pnpm add -D tailwindcss postcss autoprefixer`
    - Init tailwind using `pnpm dlx tailwindcss init -p`
    - Update tsconfig.json 
    ```json
    "compilerOptions": {
        "baseUrl": ".",
        "paths": {
        "@/*": ["./src/*"]
        }
    }
    ```
    - Update tsconfig.app.json compiler options
    ```json
    "compilerOptions": {
        "baseUrl": ".",
        "paths": {
        "@/*": ["./src/*"]
        }
    }
    ```
    - Now we need to add path types using `pnpm add -D @types/node`
    - now update viteconfig 
    ```ts
    import path from "node:path";
    import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
    import react from "@vitejs/plugin-react-swc";
    import { defineConfig } from "vite";

    // https://vitejs.dev/config/
    export default defineConfig({
        plugins: [TanStackRouterVite(), react()],
        resolve: {
            alias: {
                "@": path.resolve(__dirname, "./src"),
            },
        },
    });
    ```
    - init the shadcn-ui using `pnpm dlx shadcn@latest init`
    - let's create simple `about.lazy.tsx` page
    ```tsx
    import { createLazyFileRoute } from '@tanstack/react-router'

    export const Route = createLazyFileRoute('/about')({
    component: () => <div>Hello /about!</div>
    })
    ```
    - Let's add navigation for out `__root.tsx` route,
    - fire `pnpm dlx shadcn@latest add navigation-menu`
    - Let's use newly created navigation code in our `__root.tsx`
    ```tsx
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

    ```
    - Here `Link` to statically typed. Go ahead and give anything that is not there in Route and you will get error. 
    - UI is basedon Radix and Tailwind. `shadcn-ui` is not adding anything as such. It is just creating components. 
    - Radix provide UI standard to work with like accessibility

- Let's add some react helpers 
- Collection of React Hookz `pnpm add @react-hookz/web`
- Form library. I like `felte` but as we are already having tanstack library let's go for `tanstack`
- Here is commands `pnpm add @tanstack/react-form @tanstack/valibot-form-adapter valibot` It will also added valibot validation library as well. 
- Let's add query library `pnpm add @tanstack/react-query`

- Now, here is the game. We want to register a user and login via that user. 
- We will have fake JSON-server which will have yet another todo list which we should be able to add, read, update and delete. But todo list is behind auth wall

- Let's remove about page as we will not required that. Also we will remove Navigation from root route. 
- 