/// <reference types="jasmine" />

import { Level } from './level.enum';
import { LoggerUtilities } from './logger-utilities';

describe('LoggerUtilities', () => {
    it('prepareMetaString should include app and file details', () => {
        const result = LoggerUtilities.prepareMetaString('shell', '2026-01-01T00:00:00.000Z', 'INFO', 'a.ts', '42');
        expect(result).toBe('shell: 2026-01-01T00:00:00.000Z INFO [a.ts:42]');
    });

    it('prepareMetaString should omit optional parts when not available', () => {
        const result = LoggerUtilities.prepareMetaString('', '2026-01-01T00:00:00.000Z', 'DEBUG', null, null);
        expect(result).toBe('2026-01-01T00:00:00.000Z DEBUG');
    });

    it('getColor should return color by level', () => {
        expect(LoggerUtilities.getColor(Level.DEBUG)).toBe('blue');
        expect(LoggerUtilities.getColor(Level.INFO)).toBe('teal');
        expect(LoggerUtilities.getColor(Level.LOG)).toBe('gray');
        expect(LoggerUtilities.getColor(Level.WARNING)).toBe('orange');
        expect(LoggerUtilities.getColor(Level.ERROR)).toBe('red');
        expect(LoggerUtilities.getColor(Level.OFF)).toBeUndefined();
    });

    it('prepareMessage should keep string and Error as-is', () => {
        const message = 'plain';
        expect(LoggerUtilities.prepareMessage(message)).toBe(message);

        const err = new Error('broken');
        expect(LoggerUtilities.prepareMessage(err as unknown as string)).toBe(err as unknown as string);
    });

    it('prepareMessage should stringify non-string values', () => {
        const result = LoggerUtilities.prepareMessage({ value: 1 });
        expect(result).toContain('"value": 1');
    });

    it('prepareMessage should return fallback text if stringify fails', () => {
        const circular: { self?: unknown } = {};
        circular.self = circular;

        const result = LoggerUtilities.prepareMessage(circular);
        expect(result).toBe('The provided "message" value could not be parsed with JSON.stringify().');
    });

    it('getCallerDetails should return nulls when stack is not available', () => {
        const originalError = (globalThis as any).Error;
        (globalThis as any).Error = function ErrorMock() {
            return { stack: undefined };
        };

        try {
            const details = LoggerUtilities.getCallerDetails();
            expect(details.fileName).toBeNull();
            expect(details.lineNumber).toBeNull();
        } finally {
            (globalThis as any).Error = originalError;
        }
    });

    it('getCallerDetails should return nulls when stack cannot be parsed', () => {
        const originalError = (globalThis as any).Error;
        (globalThis as any).Error = function ErrorMock() {
            return { stack: 'Error\nline1\nline2' };
        };

        try {
            const details = LoggerUtilities.getCallerDetails();
            expect(details.fileName).toBeNull();
            expect(details.lineNumber).toBeNull();
        } finally {
            (globalThis as any).Error = originalError;
        }
    });
});
