import firebase from "firebase/app";

import "firebase/auth";
import "firebase/firestore";


// Initialize Firebase

// Your web app's Firebase configuration
let firebaseConfig = {
    apiKey: "AIzaSyA83OQw7PKEGtBNItKiDQDberMf9nzRdLM",
    authDomain: "roddi-dev-91fcb.firebaseapp.com",
    projectId: "roddi-dev-91fcb",
    storageBucket: "roddi-dev-91fcb.appspot.com",
    messagingSenderId: "223372439598",
    appId: "1:223372439598:web:37210b5e1efc3a0ccaafbf"
};


firebase.initializeApp(firebaseConfig);


const authSession = firebase.auth()
authSession.setPersistence(firebase.auth.Auth.Persistence.LOCAL)

export const auth = authSession;
export const firestore = firebase.firestore();

if (window.location.hostname === "localhost") {
    auth.useEmulator('http://localhost:4321');
    firestore.useEmulator('localhost', 1324);
}

export default firebase;

