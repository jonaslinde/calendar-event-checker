export const formatDate = (date: Date): string => (!date || isNaN(date.getTime())) ? "" : date.toLocaleDateString('sv-SE');
export const formatTime = (date: Date): string => (!date || isNaN(date.getTime())) ? "" : date.toLocaleTimeString('sv-SE', { hour: '2-digit', minute: '2-digit' })
export const formatWeekday = (date: Date): string => (!date || isNaN(date.getTime())) ? "" : date.toLocaleDateString('sv-SE', { weekday: 'long' })
