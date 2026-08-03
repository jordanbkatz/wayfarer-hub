import { formatTime12Hour, formatTimeRange, formatMessageTime } from '../types';

describe('Time formatting utilities', () => {
  test('formatTime12Hour formats 24h military time correctly', () => {
    expect(formatTime12Hour('14:30')).toBe('2:30 PM');
    expect(formatTime12Hour('09:15')).toBe('9:15 AM');
    expect(formatTime12Hour('00:00')).toBe('12:00 AM');
    expect(formatTime12Hour('12:00')).toBe('12:00 PM');
  });

  test('formatTime12Hour returns input as-is if already formatted or invalid', () => {
    expect(formatTime12Hour('')).toBe('');
    expect(formatTime12Hour('2:30 PM')).toBe('2:30 PM');
    expect(formatTime12Hour('invalid')).toBe('invalid');
  });

  test('formatTimeRange formats time ranges correctly', () => {
    expect(formatTimeRange('10:00', '11:30')).toBe('10:00 AM - 11:30 AM');
    expect(formatTimeRange('10:00', undefined)).toBe('10:00 AM');
    expect(formatTimeRange(undefined, undefined)).toBe('Flexible');
  });

  test('formatMessageTime formats timestamps nicely', () => {
    expect(formatMessageTime(null)).toBe('Just now');
    const testDate = new Date(2026, 6, 30, 14, 30);
    const result = formatMessageTime(testDate);
    expect(result).toContain('Jul 30');
  });
});
