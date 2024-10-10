import { useState, useEffect } from "react";
import { db } from "../firebase/config";
import { doc, getDoc } from "firebase/firestore";
import { or } from "firebase/firestore/lite";

export const useFetchDocument = (docCollection, id) => {
	const [document, setDocument] = useState(null);
	const [error, setError] = useState(null);
	const [loading, setLoading] = useState(null);

	const [cancelled, setCancelled] = useState(false);

	useEffect(() => {
		async function loadDocument() {
			if (cancelled) {
				return;
			}

			setLoading(true);


            try {
                const docRef = await doc(db, docCollection, id);
                const docSnap = await getDoc(docRef);

                setDocument(docSnap.data());
                setLoading(false);
            } catch (error) {
                setError(error.message);
                setLoading(false);
                console.log(error);
            }

		}
		loadDocument();
	}, [cancelled, docCollection, id]);

	useEffect(() => {
		return () => {
			setCancelled(true);
		};
	}, []);

	return { document, error, loading };
};
