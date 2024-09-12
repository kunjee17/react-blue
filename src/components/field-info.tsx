import type { FieldApi } from "@tanstack/react-form";
import { ErrorMsg } from "./error-msg";

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
