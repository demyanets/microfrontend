/* tslint:disable no-any */
import { Level } from './level.enum';
import { LoggerUtilities } from './logger-utilities';
import { IConsoleFacade } from './console-facade-interface';

/**
 * Encapsulates ConsoleAPI handling
 */
export class ConsoleFacade implements IConsoleFacade {
    public constructor(private readonly logLevel: Level = Level.INFO, private readonly appName: string = '') {}

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

    private _logModern(level: Level, metaString: string, message: string, additional: any[]): void {
        const color = LoggerUtilities.getColor(level);

        // make sure additional isn't null or undefined so that ...additional doesn't error
        additional = additional || [];

        switch (level) {
            case Level.WARNING:
                console.warn(`%c${metaString}`, `color:${color}`, message, ...additional);
                break;
            case Level.ERROR:
                console.error(`%c${metaString}`, `color:${color}`, message, ...additional);
                break;
            case Level.INFO:
                console.info(`%c${metaString}`, `color:${color}`, message, ...additional);
                break;
            case Level.DEBUG:
                console.debug(`%c${metaString}`, `color:${color}`, message, ...additional);
                break;
            default:
                console.log(`%c${metaString}`, `color:${color}`, message, ...additional);
        }
    }

    private _log(level: Level, message: string, additional: any[] = []): void {
        const isLog2Console = this.logLevel >= level;
        if (message && isLog2Console) {
            const logLevelString = Level[level];

            message = LoggerUtilities.prepareMessage(message);

            const timestamp = new Date().toISOString();

            const callerDetails = LoggerUtilities.getCallerDetails();

            // if no message or the log level is less than the environ
            if (isLog2Console) {
                const metaString = LoggerUtilities.prepareMetaString(
                    this.appName,
                    timestamp,
                    logLevelString,
                    callerDetails.fileName,
                    callerDetails.lineNumber
                );

                return this._logModern(level, metaString, message, additional);
            }
        }
    }
}
