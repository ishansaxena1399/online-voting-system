import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"

const config = {
  apiKey: "AIzaSyDsC0fd-es8PcgtV8Q7243FGkUZx6e5uyo",
  authDomain: "online-voting-system-8d574.firebaseapp.com",
  projectId: "online-voting-system-8d574",
  storageBucket: "online-voting-system-8d574.appspot.com",
  messagingSenderId: "45876783047",
  appId: "1:45876783047:web:1f2e0e06d67a71e1c65be2",
  measurementId: "G-38YM5SHBPR"
}

initializeApp(config);
const auth = getAuth();

export { auth };