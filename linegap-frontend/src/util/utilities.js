export function getTime(isoString) {
    const date = new Date(isoString);
    return date.toLocaleString("en-IN", {
        timeZone: "Asia/Kolkata",
        hour12: true,
        hour: "2-digit",
        minute: "2-digit",
        // second: "2-digit"
    });
}

export function formatChatTime(dateString) {
    if (!dateString) return "";
    const date = new Date(dateString);
    const now = new Date();

    // Create "Midnight" markers for accurate day boundaries
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfYesterday = new Date(startOfToday);
    startOfYesterday.setDate(startOfYesterday.getDate() - 1);

    // 1. If it's TODAY: Return Time (e.g., 02:09 PM)
    if (date >= startOfToday) {
        return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    }
    // 2. If it's YESTERDAY: Return "Yesterday"
    if (date >= startOfYesterday) { return "Yesterday" }
    // 3. If within the LAST 7 DAYS: Return Day Name (e.g., Monday)
    const diffInMs = startOfToday - date;
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    if (diffInDays < 7) { return date.toLocaleDateString('en-US', { weekday: 'long' }) }
    // 4. OTHERWISE: Return Date (e.g., 03/05/2026)
    return date.toLocaleDateString('en-GB'); // Use 'en-US' for MM/DD/YYYY
}