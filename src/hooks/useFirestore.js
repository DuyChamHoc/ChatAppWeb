import { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs, query, where, orderBy } from "firebase/firestore";

const useFirestore = (collection1, condition) => {
    const [documents, setDocuments] = useState([])
    useEffect(() => {
        let museums = query(collection(db, collection1), orderBy("createdAt"));
        if (condition) {
            if (!condition.compareValue || !condition.compareValue.length) {
                return;
            }
            museums = query(collection(db, collection1), where(condition.fieldName, condition.operator, condition.compareValue), orderBy("createdAt"));
        }
        const getrooms = async () => {
            const querySnapshot = await getDocs(museums);
            const documents = querySnapshot.docs.map(doc => ({
                ...doc.data(),
                id: doc.id
            }))
            setDocuments(documents)
        }
        getrooms()
        return () => {
            getrooms()
          };
    }, [collection1, condition])
    return documents;
}
export default useFirestore;