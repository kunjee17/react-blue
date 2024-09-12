import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";

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
