import firebaseOriginal from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyA83OQw7PKEGtBNItKiDQDberMf9nzRdLM",
    authDomain: "roddi-dev-91fcb.firebaseapp.com",
    projectId: "roddi-dev-91fcb",
    storageBucket: "roddi-dev-91fcb.appspot.com",
    messagingSenderId: "223372439598",
    appId: "1:223372439598:web:37210b5e1efc3a0ccaafbf"
};
// Initialize Firebase
firebaseOriginal.initializeApp(firebaseConfig);

export const auth = firebaseOriginal.auth()
export const firestore = firebaseOriginal.firestore()
export const firebase = firebaseOriginal