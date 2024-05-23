import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
    apiKey: "AIzaSyCR0PetcFpv8OaK_krrUr3bOcLSt6cMryA",
    authDomain: "wish2go-39788.firebaseapp.com",
    databaseURL: "https://wish2go-39788-default-rtdb.firebaseio.com",
    projectId: "wish2go-39788",
    storageBucket: "wish2go-39788.appspot.com",
    messagingSenderId: "432475094234",
    appId: "1:432475094234:web:01aba13fbcecab2255f9e3",
    measurementId: "G-ZHZ7W06KYC"
  }

const app = initializeApp(firebaseConfig)

const db = getDatabase(app)

export { db }