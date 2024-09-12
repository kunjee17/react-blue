import { ErrorMsg } from "@/components/error-msg";
import { FieldInfo } from "@/components/field-info";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	type Todo,
	addTodo,
	deleteTodo,
	getTodos,
	updateTodo,
} from "@/services/todo-service";
import { useForm } from "@tanstack/react-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createLazyFileRoute } from "@tanstack/react-router";
import { valibotValidator } from "@tanstack/valibot-form-adapter";
import { Trash } from "lucide-react";
import { nanoid } from "nanoid";
import { useState } from "react";
import * as v from "valibot";

export const Route = createLazyFileRoute("/_app/dashboard")({
	component: Dashboard,
});

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
