import { Level } from './level.enum';

/**
 * Utilities to support logging
 */
export class LoggerUtilities {
    /**
     * Prepares meta string
     * @param appName title of the app
     * @param timestamp
     * @param logLevel
     * @param fileName
     * @param lineNumber
     * @returns meta string
     */
    static prepareMetaString(appName: string, timestamp: string, logLevel: string, fileName: string|null, lineNumber: string|null): string {
        const fileDetails = fileName ? ` [${fileName}:${lineNumber}]` : '';

        let result = `${timestamp} ${logLevel}${fileDetails}`;
        if (appName) {
            result = `${appName}: ${result}`;
        }
        return result;
    }

    /**
     * Gets color for the log message
     * @param level
     * @returns color
     */
    static getColor(level: Level): 'blue' | 'teal' | 'gray' | 'red' | 'orange' | undefined {
        switch (level) {
            case Level.DEBUG:
                return 'blue';
            case Level.INFO:
                return 'teal';
            case Level.LOG:
                return 'gray';
            case Level.WARNING:
                return 'orange';
            case Level.ERROR:
                return 'red';
            case Level.OFF:
            default:
                return;
        }
    }

    /**
     *  This allows us to see who called the logger
     *  @return the caller details
     */
    static getCallerDetails(): { lineNumber: string|null; fileName: string|null } {
        const err = new Error('');

        try {
            if (err.stack) {
                // this should produce the line with which the logger was called
                const callerLine = err.stack.split('\n')[4].split('/');
                // returns the file:lineNumber
                const fileLineNumber = callerLine[callerLine.length - 1].replace(/[)]/g, '').split(':');

                return {
                    fileName: fileLineNumber[0],
                    lineNumber: fileLineNumber[1],
                };
            }
        } catch (e) {}
        return {
            fileName: null,
            lineNumber: null,
        };
    }

    /**
     * Prepares message if it is Error or string
     * @param message
     * @returns message
     */
    static prepareMessage(message: any): string {
        try {
            if (typeof message !== 'string' && !(message instanceof Error)) {
                message = JSON.stringify(message, null, 2);
            }
        } catch (e) {
            // additional = [message, ...additional];
            message = 'The provided "message" value could not be parsed with JSON.stringify().';
        }

        return message;
    }
}
