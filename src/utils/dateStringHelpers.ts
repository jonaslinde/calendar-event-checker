type DateLike = Date | string | number | null | undefined;

const toValidDate = (input: DateLike): Date | null => {
    if (input == null) return null;
    const d = input instanceof Date ? input : new Date(input);
    return isNaN(d.getTime()) ? null : d;
};

export const formatDate = (date?: DateLike): string => {
    const d = toValidDate(date);
    return d ? d.toLocaleDateString('sv-SE') : "";
}

export const formatTime = (date?: DateLike): string => {
    const d = toValidDate(date);
    return d ? d.toLocaleTimeString('sv-SE', { hour: '2-digit', minute: '2-digit' }) : "";
}

export const formatWeekday = (date?: DateLike): string => {
    const d = toValidDate(date);
    return d ? d.toLocaleDateString('sv-SE', { weekday: 'long' }) : "";
}
