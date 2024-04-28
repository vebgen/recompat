import { createContext, useContext } from 'react';
import { Logger, LogLevel, Params } from '@vebgen/logger';

/**
 * The data available from the LoggerContext.
 */
export interface LoggerContextData {
    /**
     * The logger instance.
     */
    logger: Logger;

    /**
     * Log a message at the highest level of severity.
     *
     * @param code The message code.
     * @param params The message parameters.
     * @param extra Additional contextual information.
     */
    critical: (
        code: string,
        params?: Params,
        extra?: string | string[]
    ) => void;

    /**
     * Log an authorization or authentication message.
     *
     * @param code The message code.
     * @param params The message parameters.
     * @param extra Additional contextual information.
     */
    security: (
        code: string,
        params?: Params,
        context?: string | string[]
    ) => void;

    /**
     * Log an error message.
     *
     * @param code The message code.
     * @param params The message parameters.
     * @param extra Additional contextual information.
     */
    error: (
        code: string,
        params?: Params,
        context?: string | string[]
    ) => void;

    /**
     * Log a warning message.
     *
     * @param code The message code.
     * @param params The message parameters.
     * @param extra Additional contextual information.
     */
    warning: (
        code: string,
        params?: Params,
        context?: string | string[]
    ) => void;

    /**
     * Log an informative message.
     *
     * @param code The message code.
     * @param params The message parameters.
     * @param extra Additional contextual information.
     */
    info: (
        code: string,
        params?: Params,
        context?: string | string[]
    ) => void;

    /**
     * Log a debug message.
     *
     * @param code The message code.
     * @param params The message parameters.
     * @param extra Additional contextual information.
     */
    debug: (
        code: string,
        params?: Params,
        context?: string | string[]
    ) => void;

    /**
     * Log a message expected to generate a lot of output.
     *
     * @param code The message code.
     * @param params The message parameters.
     * @param extra Additional contextual information.
     */
    trace: (
        code: string,
        params?: Params,
        context?: string | string[]
    ) => void;

    /**
     * Log a message at the given level.
     *
     * The other log methods are just wrappers around this one.
     *
     * @param level The level of the message.
     * @param code The message code.
     * @param params The message parameters.
     * @param context Additional contextual information.
     */
    log: (
        level: LogLevel,
        code: string,
        params?: Params,
        context?: string | string[]
    ) => void;
}


/**
 * A context that provides access to the application logger.
 */
export const LoggerContext = createContext<LoggerContextData | null>(null);


/**
 * The provider for the Logger context.
 */
export const LoggerProvider = LoggerContext.Provider;


/**
 * The hook to use the Logger context.
 */
export function useLogger(): LoggerContextData {
    const result = useContext(LoggerContext);
    if (result === undefined) {
        throw new Error('useLogger must be used within a LoggerProvider');
    }
    return result as LoggerContextData;
};


/**
 * The default export is the Logger context.
 */
export default LoggerContext;
