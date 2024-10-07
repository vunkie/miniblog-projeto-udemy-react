import { db } from "../firebase/config.js";

import {
	getAuth,
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
	signOut,
	updateProfile,
} from "firebase/auth";

import { useState, useEffect } from "react";

export const useAuthentication = () => {
	const [error, setError] = useState(null);
	const [loading, setLoading] = useState(null);

	const [cancelled, setCancelled] = useState(false);

	const auth = getAuth();

	function checkIfIsCancelled() {
		if (cancelled) {
			return;
		}
	}

	const createUser = async (data) => {
		checkIfIsCancelled();

		setLoading(true);
		setError(null);

		try {
			const { user } = await createUserWithEmailAndPassword(
				auth,
				data.email,
				data.password
			);

			await updateProfile(user, {
				displayName: data.displayName,
			});

			setLoading(false);
			return user;
		} catch (error) {
			console.log(error.message);

			let systemErrorMessage;

			if (error.message.includes("password")) {
				systemErrorMessage = "Senha deve ter no mínimo 6 caracteres";
			} else if (error.message.includes("email")) {
				systemErrorMessage = "Email já cadastrado";
			} else {
				systemErrorMessage =
					"Erro ao cadastrar usuário, tente mais tarde";
			}

			setError(systemErrorMessage);

			setLoading(false);
		}
	};

	//logout
	const logout = async () => {
		checkIfIsCancelled();

		signOut(auth);
	};

	//login
	const login = async (data) => {
		checkIfIsCancelled();

		setLoading(true);
		setError(null);

		try {
			await signInWithEmailAndPassword(auth, data.email, data.password);

			setLoading(false);
		} catch (error) {
			let systemErrorMessage;

			if (error.message.includes("user-not-found")) {
				systemErrorMessage = "Usuário não encontrado";
			} else if (error.message.includes("password")) {
				systemErrorMessage = "Senha incorreta";
			} else {
				systemErrorMessage = "Usuario ou senha incorretos";
			}

			console.log()
			setError(systemErrorMessage);
			setLoading(false);
		}
	};

	useEffect(() => {
		return () => {
			setCancelled(true);
		};
	}, []);

	return {
		auth,
		createUser,
		error,
		loading,
		logout,
		login
	};
};
