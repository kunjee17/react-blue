import { ErrorMsg } from "@/components/error-msg";
import { FieldInfo } from "@/components/field-info";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { type User, useAuth } from "@/providers/auth";
import { useForm } from "@tanstack/react-form";
import { createLazyFileRoute } from "@tanstack/react-router";
import { valibotValidator } from "@tanstack/valibot-form-adapter";
import { useState } from "react";
import * as v from "valibot";

export const Route = createLazyFileRoute("/_auth/register")({
	component: Register,
});

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
