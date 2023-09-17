import { useEffect, useState } from "react";
import { useContext } from "react";
import { createContext } from "react";

// Configuracion de FireBase
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../config/firebase";

const AuthContext = createContext();

export default function AuthContextProvider({ children }) {
	const [authUser, setAuthUser] = useState(false);

	useEffect(() => {
		const unsuscribe = onAuthStateChanged(auth, (authUser) => {
			console.log("authUser", authUser);
			setAuthUser(authUser);
		});
		// console.log("authUser", authUser);
		// setAuthUser(authUser);
		console.log("unsuscribe", unsuscribe);

		// return authUser;
		return unsuscribe;
	}, [authUser]);

	if (authUser === false) return; //<p>Cargando...</p>;

	return (
		<AuthContext.Provider value={{ authUser }}>{children}</AuthContext.Provider>
	);
}

export const useAuthContext = () => useContext(AuthContext);
