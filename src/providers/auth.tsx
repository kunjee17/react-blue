import { useLocalStorageValue } from "@react-hookz/web";
import React, { useContext, useEffect, useState } from "react";
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
