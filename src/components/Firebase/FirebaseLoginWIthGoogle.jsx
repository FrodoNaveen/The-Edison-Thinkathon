// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCnmlRbnSti6kX0RvNhlkb6VCwks7OCXrU",
    authDomain: "myproject33-77c0a.firebaseapp.com",
    projectId: "myproject33-77c0a",
    storageBucket: "myproject33-77c0a.firebasestorage.app",
    messagingSenderId: "617030656792",
    appId: "1:617030656792:web:251817bb2d5e530f45346d",
    measurementId: "G-EZYFB4BXHK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider, signInWithPopup };