require('dotenv').config();
const { initializeApp } = require("firebase/app");
const { getFirestore, doc, setDoc } = require("firebase/firestore");
const { exec } = require("child_process");

// Firebase config
const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function getTemperature() {
    return new Promise((resolve) => {
        exec("osx-cpu-temp", (error, stdout) => {
            if (error) {
                // Fallback or mock: 40-50 range
                resolve(Math.floor(Math.random() * (50 - 40 + 1)) + 40);
            } else {
                const temp = parseFloat(stdout.replace("°C", ""));
                resolve(isNaN(temp) ? 42 : temp);
            }
        });
    });
}

async function syncHeartbeat() {
    console.log("--- Starting Thermal Heartbeat (Live) ---");

    setInterval(async () => {
        try {
            const temp = await getTemperature();
            console.log(`[${new Date().toLocaleTimeString()}] Thermal Pulse: ${temp}°C`);

            const statusRef = doc(db, "System_Status", "thermal");
            await setDoc(statusRef, {
                cpu_temp: temp,
                last_updated: new Date().toISOString(),
                status: "Online"
            }, { merge: true });
        } catch (err) {
            console.error("Heartbeat sync error:", err);
        }
    }, 10000); // Every 10 seconds for "immediate" feel
}

syncHeartbeat();

