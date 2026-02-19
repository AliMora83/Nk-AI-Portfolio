const fs = require('fs');
const path = require('path');

const LOGS_DIR = path.join(__dirname, '../docs/logs');
const WALKTHROUGH_PATH = path.join(process.env.HOME, '.gemini/antigravity/brain/2269da25-9a3d-4f19-a410-53b7f4c94f7c/walkthrough.md');

// Ensure logs directory exists
if (!fs.existsSync(LOGS_DIR)) {
    fs.mkdirSync(LOGS_DIR, { recursive: true });
}

function logProofOfWork() {
    try {
        if (!fs.existsSync(WALKTHROUGH_PATH)) {
            console.error('❌ Walkthrough file not found:', WALKTHROUGH_PATH);
            process.exit(1);
        }

        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const filename = `proof_of_work_${timestamp}.md`;
        const destPath = path.join(LOGS_DIR, filename);

        fs.copyFileSync(WALKTHROUGH_PATH, destPath);
        console.log(`✅ Proof of Work logged: ${destPath}`);

        // Update index (optional, for easier traversal)
        const indexPath = path.join(LOGS_DIR, 'index.md');
        const entry = `- [${new Date().toLocaleString()}] [${filename}](${filename})\n`;
        fs.appendFileSync(indexPath, entry);
        console.log(`📝 Index updated.`);

    } catch (error) {
        console.error('❌ Error logging Proof of Work:', error);
        process.exit(1);
    }
}

logProofOfWork();
