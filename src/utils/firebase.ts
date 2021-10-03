import { initializeApp, FirebaseOptions, getApps } from "firebase/app";
const config: FirebaseOptions = JSON.parse(process.env.REACT_APP_FIREBASE_CONFIG as string) as FirebaseOptions;


// if (!getApps().length) {
// }
console.log('Default app')
initializeApp(config);
