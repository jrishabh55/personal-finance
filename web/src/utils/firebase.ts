import { FirebaseOptions, initializeApp } from "firebase/app";
const config: FirebaseOptions = JSON.parse(process.env.REACT_APP_FIREBASE_CONFIG as string) as FirebaseOptions;

initializeApp(config);
