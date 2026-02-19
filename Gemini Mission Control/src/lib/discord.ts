export async function sendDiscordAlert(message: string, type: 'info' | 'warning' | 'critical' = 'info') {
    // DISCORD PURGE V1.0.27: All generic webhooks disabled to clear Gateway errors.
    console.log(`[Discord Suspended] Alert suppressed: [${type.toUpperCase()}] ${message}`);
    return;
}
