import { describe, it, expect } from 'vitest';
import { formatWeekday, formatDate, formatTime } from "./dateStringHelpers";

describe('formatWeekday', () => {
    it('is måndag', () => {
        const monday = new Date(2025, 8, 29, 11, 20, 0, 0);
        const result = formatWeekday(monday)
        expect(result).toBe("måndag")
    });
    it('is empty', () => {
        const monday = new Date(NaN);
        const result = formatWeekday(monday)
        expect(result).toBe("")
    });
    it('handles null', () => {
        const result = formatWeekday(null)
        expect(result).toBe("")
    });
    it('handles undefined', () => {
        const result = formatWeekday(undefined)
        expect(result).toBe("")
    });
});

describe('formatDate', () => {
    it('is 2025-09-29', () => {
        const monday = new Date(2025, 8, 29, 11, 20, 0, 0);
        const result = formatDate(monday)
        expect(result).toBe("2025-09-29")
    });
    it('is empty', () => {
        const monday = new Date(NaN);
        const result = formatDate(monday)
        expect(result).toBe("")
    });
    it('handles null', () => {
        const result = formatDate(null)
        expect(result).toBe("")
    });
    it('handles undefined', () => {
        const result = formatDate(undefined)
        expect(result).toBe("")
    });

});

describe('formatTime', () => {
    it('is 2025-09-29', () => {
        const monday = new Date(2025, 8, 29, 11, 20, 0, 0);
        const result = formatTime(monday)
        expect(result).toBe("11:20")
    });
    it('is empty', () => {
        const monday = new Date(NaN);
        const result = formatTime(monday)
        expect(result).toBe("")
    });
    it('handles null', () => {
        const result = formatTime(null)
        expect(result).toBe("")
    });
    it('handles undefined', () => {
        const result = formatTime(undefined)
        expect(result).toBe("")
    });
});
