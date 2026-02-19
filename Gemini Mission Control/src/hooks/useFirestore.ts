"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, onSnapshot, query, DocumentData } from "firebase/firestore";

export function useFirestoreCollection(collectionName: string) {
    const [data, setData] = useState<DocumentData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        let unsubscribe: () => void = () => { };

        try {
            const q = query(collection(db, collectionName));

            unsubscribe = onSnapshot(q, (snapshot) => {
                const items = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setData(items);
                setLoading(false);
            }, (err) => {
                console.warn(`Firestore listener error for ${collectionName}:`, err);
                setError(err);
                setLoading(false);
            });
        } catch (err) {
            console.warn(`Failed to initialize Firestore listener for ${collectionName}:`, err);
            setTimeout(() => setLoading(false), 0);
        }

        return () => {
            unsubscribe();
        };
    }, [collectionName]);

    return { data, loading, error };
}
