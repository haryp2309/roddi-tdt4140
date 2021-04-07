import React, {useEffect, useState} from "react";
import {auth, firestore} from "../services/Firebase";
import useCurrentUser from "./UseCurrentUser";

const useIsOwner = () => {
    let unsubObserver: (() => any) | undefined = undefined;

    const [isOwner, setIsOwner] = useState(false);
    const user = useCurrentUser();

    useEffect(() => {
        if (unsubObserver) unsubObserver();
        if (user) {
            const userId = user.uid
            firestore
                .collection("user")
                .doc(userId)
                .onSnapshot(snapshot => {
                    const data = snapshot.data()
                    if (data) {
                        setIsOwner(data.isOwner === true)
                    }
                })
        }
    }, [user])

    return isOwner;
};

export default useIsOwner;
