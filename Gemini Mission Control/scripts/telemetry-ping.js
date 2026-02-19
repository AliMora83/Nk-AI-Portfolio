const { initializeApp } = require("firebase/app");
const { getFirestore, doc, setDoc, serverTimestamp } = require("firebase/firestore");
const http = require("http");
const https = require("https");

// Load variables from .env
require("dotenv").config();

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

const TARGETS = [
    { name: "Main API", id: "main-api", url: "https://google.com" }, // Placeholder for now
    { name: "Firebase", id: "firebase", url: `https://${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}.firebaseio.com` },
    { name: "Hostinger VPS", id: "hostinger-vps", url: "https://hostinger.com" } // Placeholder
];

async function measureLatency(url) {
    const start = Date.now();
    const protocol = url.startsWith("https") ? https : http;

    return new Promise((resolve) => {
        const req = protocol.get(url, (res) => {
            res.on("data", () => { });
            res.on("end", () => resolve(Date.now() - start));
        });
        req.on("error", () => resolve(-1));
        req.setTimeout(5000, () => {
            req.destroy();
            resolve(-1);
        });
    });
}

function getMockLoad() {
    // Simulate realistic load patterns
    return `${Math.floor(Math.random() * 15) + 5}%`;
}

async function runTelemetry() {
    console.log("--- STARTING TELEMETRY PULSE ---");

    for (const target of TARGETS) {
        const latency = await measureLatency(target.url);
        const load = getMockLoad();
        const status = latency !== -1 ? "Online" : "Offline";

        console.log(`[${target.name}] Status: ${status} | Latency: ${latency}ms | Load: ${load}`);

        try {
            await setDoc(doc(db, "System_Status", target.id), {
                name: target.name,
                status,
                latency: latency !== -1 ? `${latency}ms` : "---",
                load: status === "Online" ? load : "-",
                last_updated: serverTimestamp()
            }, { merge: true });
        } catch (err) {
            console.error(`Error updating ${target.name}:`, err);
        }
    }
}

// Run every 30 seconds
setInterval(runTelemetry, 30000);
runTelemetry();
