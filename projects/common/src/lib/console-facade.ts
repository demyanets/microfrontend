/* tslint:disable no-any */
import { IConsoleFacade } from './console-facade-interface';

/**
 * Encapsulates ConsoleAPI handling
 */
export class ConsoleFacade implements IConsoleFacade {
    /**
     * Log error
     */
    error(message: string, ...optionalParams: any[]): void {
        // tslint:disable no-console
        console.error.apply(console, [message, ...optionalParams]);
    }

    /**
     * Log warning
     */
    warning(message: string, ...optionalParams: any[]): void {
        // tslint:disable no-console
        console.warn.apply(console, [message, ...optionalParams]);
    }

    /**
     * Log information
     */
    info(message: string, ...optionalParams: any[]): void {
        // tslint:disable no-console
        console.info.apply(console, [message, ...optionalParams]);
    }

    /**
     * Log debug information
     */
    debug(message: string, ...optionalParams: any[]): void {
        // tslint:disable no-console
        console.debug.apply(console, [message, ...optionalParams]);
    }

    /**
     * Log logging information
     */
    log(message: string, ...optionalParams: any[]): void {
        // tslint:disable no-console
        console.log.apply(console, [message, ...optionalParams]);
    }
}
