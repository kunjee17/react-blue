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
