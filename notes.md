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
- Now create _auth and _app folder. (this will allowed direct url)
- create `_auth.lazy.tsx` and `_app.lazy.tsx` layout files. 
- Now, lets concentrate on `_auth.lazy.tsx` 

```tsx
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
```

- Here is navigation for Register and Login. Before we go and work on this pages. Let's create simple AuthProvider
- create `providers/auth.tsx` 
```tsx
export type User = {
	email: string;
	password: string;
};

type AuthContextProps = {
	currentUser: User | undefined | null;
	login: (dto: User) => void;
	register: (dto: User) => void;
	logout: () => void;
};

const AuthContext = React.createContext<AuthContextProps | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
	const [currentUser, setCurrentUser] = useState<User | undefined | null>(
		undefined,
	);

	const { value, set } = useLocalStorageValue<User>("user", {
		defaultValue: undefined,
	});

	const register = (dto: User) => {
		return set(dto);
	};

	const logout = () => {
		setCurrentUser(undefined);
	};

	const login = (dto: User) => {
		if (value?.email === dto.email && value?.password === dto.password) {
			console.log("setting current user");
			setCurrentUser(value);
		}
	};

	useEffect(() => {
		setCurrentUser(value);
	}, [value]);

	return (
		<AuthContext.Provider
			value={{
				currentUser,
				register,
				logout,
				login,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuth = () => {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
};

```

- Now, let's check `login.lazy.tsx` and `register.lazy.tsx` files
- See the statically typed form. It is impossible escape type and see valibot, it is light weight and fine grained
- We need few more components 
    - pnpm dlx shadcn@latest add alert
    - pnpm dlx shadcn@latest add input
    - pnpm dlx shadcn@latest add button
    - pnpm dlx shadcn@latest add label

- Some helper custom components
```tsx
export const ErrorMsg = ({
	errorMsg,
}: { errorMsg: string | undefined | null }) => {
	if (errorMsg) {
		return (
			<Alert variant="destructive">
				<ExclamationTriangleIcon className="h-4 w-4" />
				<AlertTitle>Error</AlertTitle>
				<AlertDescription>{errorMsg}</AlertDescription>
			</Alert>
		);
	}

	return null;
};

export const FieldInfo = ({
	field,
	// biome-ignore lint/suspicious/noExplicitAny: Passing type for Error is overkill as of now <explanation>
}: { field: FieldApi<any, any, any, any> }) => {
	return (
		<>
			{field.state.meta.isTouched && field.state.meta.errors.length ? (
				<ErrorMsg errorMsg={field.state.meta.errors.join(",")} />
			) : null}
			{field.state.meta.isValidating ? "Validating..." : null}
		</>
	);
};
```

```tsx
function Register() {
	const [errorMsg, setErrorMsg] = useState("");
	const navigate = Route.useNavigate();
	const { register } = useAuth();
	const { handleSubmit, Field, Subscribe } = useForm<User>({
		defaultValues: {
			email: "",
			password: "",
		},
		onSubmit: async ({ value }) => {
			try {
				register(value);
				await navigate({
					to: "/login",
				});
			} catch (error: unknown) {
				const err = error as Error;
				setErrorMsg(err.message);
			}
		},
	});
	return (
		<div>
			<form
				onSubmit={async (e) => {
					e.preventDefault();
					e.stopPropagation();
					await handleSubmit();
				}}
			>
				<Field
					name="email"
					validatorAdapter={valibotValidator()}
					validators={{
						onChange: v.pipe(v.string(), v.email(), v.minLength(3)),
					}}
				>
					{(field) => (
						<>
							<Label htmlFor="email">Email</Label>
							<Input
								id="email"
								type="email"
								value={field.state.value}
								onBlur={field.handleBlur}
								onChange={(e) => field.handleChange(e.target.value)}
								placeholder="Email"
							/>
							<FieldInfo field={field} />
						</>
					)}
				</Field>
				<Field
					name="password"
					validatorAdapter={valibotValidator()}
					validators={{
						onChange: v.pipe(v.string(), v.minLength(4)),
					}}
				>
					{(field) => (
						<>
							<Label htmlFor="password">Password</Label>
							<Input
								id="password"
								type="password"
								value={field.state.value}
								onBlur={field.handleBlur}
								onChange={(e) => field.handleChange(e.target.value)}
							/>
							<FieldInfo field={field} />
						</>
					)}
				</Field>
				<Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
					{([canSubmit, isSubmitting]) => (
						<Button
							type={"submit"}
							disabled={!canSubmit}
							variant={"outline"}
							className="mt-2"
						>
							{isSubmitting ? "..." : "Submit"}
						</Button>
					)}
				</Subscribe>
			</form>
			<ErrorMsg errorMsg={errorMsg} />
		</div>
	);
}

function Login() {
	const [errorMsg, setErrorMsg] = useState("");
	const navigate = Route.useNavigate();
	const { login } = useAuth();
	const { handleSubmit, Field, Subscribe } = useForm<User>({
		defaultValues: {
			email: "",
			password: "",
		},
		onSubmit: async ({ value }) => {
			try {
				login(value);
				await navigate({
					to: "/dashboard",
				});
			} catch (error: unknown) {
				const err = error as Error;
				setErrorMsg(err.message);
			}
		},
	});
	return (
		<div>
			<form
				onSubmit={async (e) => {
					e.preventDefault();
					e.stopPropagation();
					await handleSubmit();
				}}
			>
				<Field
					name="email"
					validatorAdapter={valibotValidator()}
					validators={{
						onChange: v.pipe(v.string(), v.email(), v.minLength(3)),
					}}
				>
					{(field) => (
						<>
							<Label htmlFor="email">Email</Label>
							<Input
								id="email"
								type="email"
								value={field.state.value}
								onBlur={field.handleBlur}
								onChange={(e) => field.handleChange(e.target.value)}
								placeholder="Email"
							/>
							<FieldInfo field={field} />
						</>
					)}
				</Field>
				<Field
					name="password"
					validatorAdapter={valibotValidator()}
					validators={{
						onChange: v.pipe(v.string(), v.minLength(4)),
					}}
				>
					{(field) => (
						<>
							<Label htmlFor="password">Password</Label>
							<Input
								id="password"
								type="password"
								value={field.state.value}
								onBlur={field.handleBlur}
								onChange={(e) => field.handleChange(e.target.value)}
							/>
							<FieldInfo field={field} />
						</>
					)}
				</Field>
				<Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
					{([canSubmit, isSubmitting]) => (
						<Button
							type={"submit"}
							disabled={!canSubmit}
							variant={"outline"}
							className="mt-2"
						>
							{isSubmitting ? "..." : "Login"}
						</Button>
					)}
				</Subscribe>
			</form>
			<ErrorMsg errorMsg={errorMsg} />
		</div>
	);
}
```
- Now, we need to have protected routes for app.
- So, here how `_app.lazy.tsx` looks like

```tsx
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

```

- Let's move on to queryies
- Let's have simple json-server `pnpm add -D json-server`
- Create `db.json` file. 

```json
{
	"todos": []
}
```

- Now create todo service

```ts
export type Todo = {
	id: string;
	text: string;
	done: boolean;
};

const url = "http://localhost:3000/todos";

export const addTodo = async (todo: Todo) => {
	const response = await fetch(url, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(todo),
	});
	if (!response.ok) {
		throw new Error(`Failed to add to-do: ${response.statusText}`);
	}
	return await response.json();
};

export const updateTodo = async (todo: Todo) => {
	const response = await fetch(`${url}/${todo.id}`, {
		method: "PUT",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(todo),
	});
	if (!response.ok) {
		throw new Error(`Failed to update to-do: ${response.statusText}`);
	}
	return await response.json();
};

export const deleteTodo = async (id: string) => {
	const response = await fetch(`${url}/${id}`, {
		method: "DELETE",
		headers: {
			"Content-Type": "application/json",
		},
	});
	if (!response.ok) {
		throw new Error(`Failed to delete to-do: ${response.statusText}`);
	}
	return await response.json();
};

export const getTodos = async () => {
	const response = await fetch(url, {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
		},
	});
	if (!response.ok) {
		throw new Error(`Failed to delete to-do: ${response.statusText}`);
	}
	return (await response.json()) as Todo[];
};

```

- And now the final piece, Dashboard file. 
- Again here all queries are statically typed

```tsx
function Dashboard() {
	const [errorMsg, setErrorMsg] = useState("");
	const queryClient = useQueryClient();

	const query = useQuery({ queryKey: ["todos"], queryFn: getTodos });

	const addMutation = useMutation({
		mutationFn: addTodo,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["todos"] });
		},
		onError: (err) => {
			setErrorMsg(err.message);
		},
	});

	const updateMutation = useMutation({
		mutationFn: updateTodo,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["todos"] });
		},
		onError: (err) => {
			setErrorMsg(err.message);
		},
	});

	const deleteMutation = useMutation({
		mutationFn: deleteTodo,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["todos"] });
		},
		onError: (err) => {
			setErrorMsg(err.message);
		},
	});

	const { handleSubmit, Field, Subscribe, reset } = useForm<Todo>({
		defaultValues: {
			id: nanoid(),
			text: "",
			done: false,
		},
		onSubmit: async ({ value }) => {
			await addMutation.mutateAsync(value);
			reset();
		},
	});

	const handleDelete = async (id: string) => {
		await deleteMutation.mutateAsync(id);
	};

	const toggleDone = async (todo: Todo) => {
		await updateMutation.mutateAsync({ ...todo, done: !todo.done });
	};

	return (
		<div className="mx-auto p-6 max-w-md">
			<div className="flex items-center gap-2 mb-4">
				<form
					onSubmit={async (e) => {
						e.preventDefault();
						e.stopPropagation();
						await handleSubmit();
					}}
					className="flex w-full gap-2"
				>
					<Field
						name="text"
						validatorAdapter={valibotValidator()}
						validators={{
							onChange: v.pipe(v.string(), v.minLength(3)),
						}}
					>
						{(field) => (
							<>
								<Input
									type="text"
									value={field.state.value}
									onBlur={field.handleBlur}
									onChange={(e) => field.handleChange(e.target.value)}
									placeholder="Enter a new to-do"
									className="flex-grow"
								/>
								<FieldInfo field={field} />
							</>
						)}
					</Field>

					<Subscribe
						selector={(state) => [state.canSubmit, state.isSubmitting]}
					>
						{([canSubmit, isSubmitting]) => (
							<Button
								type="submit"
								disabled={!canSubmit}
								className="whitespace-nowrap"
							>
								{isSubmitting ? "..." : "Add To-Do"}
							</Button>
						)}
					</Subscribe>
				</form>
				<ErrorMsg errorMsg={errorMsg} />
			</div>
			{query.isLoading && <p>Loading...</p>}
			{query.data && (
				<div>
					<ul className="space-y-2">
						{query.data.map((todo) => (
							<li
								key={todo.id}
								className="flex items-center justify-between p-3 bg-gray-100 border rounded-md shadow-sm"
							>
								<span
									onKeyDown={() => toggleDone(todo)}
									onClick={() => toggleDone(todo)}
									className={`cursor-pointer flex-grow ${
										todo.done ? "line-through text-gray-500" : ""
									}`}
								>
									{todo.text}
								</span>

								<Button
									variant="ghost"
									size="sm"
									onClick={() => handleDelete(todo.id)}
								>
									<Trash className="w-4 h-4 text-red-500" />
								</Button>
							</li>
						))}
					</ul>
				</div>
			)}
		</div>
	);
}

```