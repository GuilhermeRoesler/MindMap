import { getDisplayName } from './globalConfigStore';

describe('getDisplayName', () => {
    it('returns default label when email is null', () => {
        expect(getDisplayName(null)).toBe('User');
    });

    it('capitalizes the local part of the email', () => {
        expect(getDisplayName('john@example.com')).toBe('John');
        expect(getDisplayName('maria.silva@example.com')).toBe('Maria.silva');
    });
});
