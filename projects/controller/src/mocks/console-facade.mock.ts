/* tslint:disable no-any */

import { IConsoleFacade } from '@microfrontend/common';

/**
 * Encapsulates ConsoleAPI handling
 */
export class ConsoleFacadeMock implements IConsoleFacade {
    messages: string[] = [];

    /**
     * Log error
     */
    error(message: string, ...optionalParams: any[]): void {
        this.messages.push(message);
    }

    /**
     * Log warning
     */
    warning(message: string, ...optionalParams: any[]): void {
        this.messages.push(message);
    }

    /**
     * Log information
     */
    info(message: string, ...optionalParams: any[]): void {
        this.messages.push(message);
    }

    /**
     * Log debug information
     */
    debug(message: string, ...optionalParams: any[]): void {
        this.messages.push(message);
    }

    /**
     * Log logging information
     */
    log(message: string, ...optionalParams: any[]): void {
        this.messages.push(message);
    }
}
