import React, {useState} from "react";
import {auth} from "../services/Firebase";
import firebase from "firebase";

const useCurrentUser = () => {
    const [currentUser, setCurrentUser] = useState<firebase.User | null | undefined>(undefined);
    auth.onAuthStateChanged(user => {
        setCurrentUser(user)
    })
    return currentUser;
};

export default useCurrentUser;
