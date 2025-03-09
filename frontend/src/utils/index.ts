function timeAgo(date: string | Date) {

    if (!date) return '';

    const now = new Date();
    const past = new Date(date);
    const seconds = Math.round((now.getTime() - past.getTime()) / 1000);

    if (seconds < 60) {
        return seconds + 's ago';
    } else if (seconds < 3600) {
        return Math.round(seconds / 60) + 'm ago';
    } else if (seconds < 86400) {
        return Math.round(seconds / 3600) + 'h ago';
    } else {
        return Math.round(seconds / 86400) + 'd ago';
    }
}



function getJoinedDate(date: string) {
    if (!date) return null
    const joinedDate = new Date(date);
    const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' };
    return joinedDate.toLocaleDateString('en-US', options);
}

export { timeAgo, getJoinedDate };