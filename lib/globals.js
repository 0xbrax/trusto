export const formatDate = (dateString) => {
    if (!dateString) return '';

    const date = new Date(dateString);

    const options = {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    };

    const formatter = new Intl.DateTimeFormat('it-IT', options);
    return formatter.format(date);
};