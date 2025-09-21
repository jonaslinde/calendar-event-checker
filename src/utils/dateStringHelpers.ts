export function formatDate(dateString: string) {
    try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return dateString;
        return date.toLocaleDateString('sv-SE');
    } catch {
        return dateString;
    }
};

export function formatTime(dateString: string) {
    try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return dateString;
        return date.toLocaleTimeString('sv-SE', { hour: '2-digit', minute: '2-digit' });
    } catch {
        return dateString;
    }
};

export function formatWeekday(dateString: string): string {
    try {
        return new Date(dateString).toLocaleDateString('sv-SE', { weekday: 'long' })
    } catch {
        return dateString
    }
}
