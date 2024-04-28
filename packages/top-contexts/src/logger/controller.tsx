import { ReactNode } from 'react';
import { Logger } from '@vebgen/logger';

import { LoggerProvider } from './context';


/**
 * Properties expected by the LoggerController.
 */
export interface LoggerControllerProps {
    /** The logger that we're wrapping with this controller. */
    logger: Logger;

    /** The children that can use the logger and methods. */
    children: ReactNode;
}


/**
 * The logger controller makes a logger instance available to the tree that it
 * wraps.
 */
export function LoggerController({
    logger,
    children
}: LoggerControllerProps) {
    return (
        <LoggerProvider value={{
            logger,
            critical: logger.critical,
            security: logger.security,
            error: logger.error,
            warning: logger.warn,
            info: logger.info,
            debug: logger.debug,
            trace: logger.trace,
            log: logger.log,
        }}>
            {children}
        </LoggerProvider>
    );
}
