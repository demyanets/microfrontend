/// <reference types="jasmine" />

import { ConsoleFacade } from './console-facade';
import { Level } from './level.enum';
import { LoggerUtilities } from './logger-utilities';

describe('ConsoleFacade', () => {
    beforeEach(() => {
        spyOn(console, 'info');
        spyOn(console, 'warn');
        spyOn(console, 'error');
        spyOn(console, 'debug');
        spyOn(console, 'log');
    });

    function setupLoggerSpies(color: 'blue' | 'teal' | 'gray' | 'red' | 'orange' = 'teal'): void {
        spyOn(LoggerUtilities, 'prepareMessage').and.callFake((message: unknown) => `prepared:${message}`);
        spyOn(LoggerUtilities, 'getCallerDetails').and.returnValue({ fileName: 'source.ts', lineNumber: '12' });
        spyOn(LoggerUtilities, 'prepareMetaString').and.returnValue('META');
        spyOn(LoggerUtilities, 'getColor').and.returnValue(color);
    }

    it('constructor should log selected level', () => {
        new ConsoleFacade(Level.WARNING, 'AppName');
        expect(console.info).toHaveBeenCalledWith("'AppName' log level: WARNING");
    });

    it('error should write to console.error', () => {
        setupLoggerSpies('red');
        const facade = new ConsoleFacade(Level.LOG, 'AppName');

        facade.error('boom', { id: 1 });

        expect(console.error).toHaveBeenCalledWith('%cMETA', 'color:red', 'prepared:boom', { id: 1 });
    });

    it('warning should write to console.warn', () => {
        setupLoggerSpies('orange');
        const facade = new ConsoleFacade(Level.LOG, 'AppName');

        facade.warning('watch');

        expect(console.warn).toHaveBeenCalledWith('%cMETA', 'color:orange', 'prepared:watch');
    });

    it('info should write to console.info', () => {
        setupLoggerSpies('teal');
        const facade = new ConsoleFacade(Level.LOG, 'AppName');

        facade.info('hello');

        expect(console.info).toHaveBeenCalledWith('%cMETA', 'color:teal', 'prepared:hello');
    });

    it('debug should write to console.debug', () => {
        setupLoggerSpies('blue');
        const facade = new ConsoleFacade(Level.LOG, 'AppName');

        facade.debug('deep');

        expect(console.debug).toHaveBeenCalledWith('%cMETA', 'color:blue', 'prepared:deep');
    });

    it('log should use default branch and console.log', () => {
        setupLoggerSpies('gray');
        const facade = new ConsoleFacade(Level.LOG, 'AppName');

        facade.log('trace');

        expect(console.log).toHaveBeenCalledWith('%cMETA', 'color:gray', 'prepared:trace');
    });

    it('should not log when message is empty', () => {
        setupLoggerSpies('teal');
        const facade = new ConsoleFacade(Level.LOG, 'AppName');

        facade.info('');

        expect(LoggerUtilities.prepareMessage).not.toHaveBeenCalled();
        expect(console.info).toHaveBeenCalledTimes(1);
    });

    it('should not log when configured level is lower than message level', () => {
        setupLoggerSpies('teal');
        const facade = new ConsoleFacade(Level.ERROR, 'AppName');

        facade.info('hidden');

        expect(LoggerUtilities.prepareMessage).not.toHaveBeenCalled();
    });

    it('should normalize undefined additional params in _logModern', () => {
        spyOn(LoggerUtilities, 'getColor').and.returnValue('teal');
        const facade = new ConsoleFacade(Level.LOG, 'AppName');

        (facade as any)._logModern(Level.INFO, 'META', 'plain', undefined);

        expect(console.info).toHaveBeenCalledWith('%cMETA', 'color:teal', 'plain');
    });
});
