/* tslint:disable no-any */

export interface IConsoleFacade {
    /**
     * Log error
     */
    error(message: string, ...optionalParams: any[]): void;

    /**}
     * Log warning
     */
    warning(message: string, ...optionalParams: any[]): void;

    /**
     * Log information
     */
    info(message: string, ...optionalParams: any[]): void;

    /**
     * Log debug information
     */
    debug(message: string, ...optionalParams: any[]): void;

    /**
     * Log logging information
     */
    log(message: string, ...optionalParams: any[]): void;
}
