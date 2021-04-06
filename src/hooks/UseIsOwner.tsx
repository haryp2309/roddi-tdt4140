import React, {useState} from "react";
import {auth, firestore} from "../services/Firebase";

const useIsOwner = () => {
    let unsubObserver: (() => any) | undefined = undefined;

    const [isOwner, setIsOwner] = useState(false);

    auth.onAuthStateChanged(user => {
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
    })

    return isOwner;
};

export default useIsOwner;
