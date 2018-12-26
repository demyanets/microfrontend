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
        console.error.apply(console, arguments);
    }

    /**
     * Log warning
     */
    warning(message: string, ...optionalParams: any[]): void {
        // tslint:disable no-console
        console.warn.apply(console, arguments);
    }

    /**
     * Log information
     */
    info(message: string, ...optionalParams: any[]): void {
        // tslint:disable no-console
        console.info.apply(console, arguments);
    }

    /**
     * Log debug information
     */
    debug(message: string, ...optionalParams: any[]): void {
        // tslint:disable no-console
        console.debug.apply(console, arguments);
    }

    /**
     * Log logging information
     */
    log(message: string, ...optionalParams: any[]): void {
        // tslint:disable no-console
        console.log.apply(console, arguments);
    }
}
