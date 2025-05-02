import winston from 'winston';

// Create a logger instance
const logger = winston.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json(),
        winston.format.uncolorize() // Add this to ensure no colors are used
    ),
    defaultMeta: { service: 'agentlink-mcp' },
    transports: [
        // Write to stderr instead of stdout to avoid interfering with JSON-RPC
        new winston.transports.Console({
            stderrLevels: ['error', 'warn', 'info', 'debug'],
            format: winston.format.combine(
                // Remove colorize here
                winston.format.simple()
            )
        }),
        // Write all logs to `combined.log`
        new winston.transports.File({ filename: 'logs/combined.log' }),
        // Write all errors to `error.log`
        new winston.transports.File({ filename: 'logs/error.log', level: 'error' })
    ]
});

// If we're not in production, also log to the console with a simpler format
if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({
        stderrLevels: ['error', 'warn', 'info', 'debug'], // Use stderr for all levels
        format: winston.format.combine(
            // Remove colorize for MCP compatibility
            winston.format.simple()
        )
    }));
}

export { logger };