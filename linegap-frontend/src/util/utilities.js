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