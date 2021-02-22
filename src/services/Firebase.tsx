import firebase from "firebase/app";

import "firebase/auth";
import "firebase/firestore";
//let firebaseConfig


// Initialize Firebase
//heo

// Your web app's Firebase configuration
let firebaseConfig = {
    apiKey: "AIzaSyA83OQw7PKEGtBNItKiDQDberMf9nzRdLM",
    authDomain: "roddi-dev-91fcb.firebaseapp.com",
    projectId: "roddi-dev-91fcb",
    storageBucket: "roddi-dev-91fcb.appspot.com",
    messagingSenderId: "223372439598",
    appId: "1:223372439598:web:37210b5e1efc3a0ccaafbf"
};


console.log("før");
console.log(firebaseConfig);

console.log(firebase.initializeApp(firebaseConfig));

//firebaseOriginal.initializeApp(firebaseConfig);
console.log("etter");

//console.log(firebase.auth().useEmulator('http://localhost:4321'));

//var auth = firebaseOriginal.auth()
export const auth = firebase.auth();
export const firestore = firebase.firestore();

if (window.location.hostname === "localhost") {
    auth.useEmulator('http://localhost:4321');
    firestore.useEmulator('localhost', 1234);
}

export default firebase;

