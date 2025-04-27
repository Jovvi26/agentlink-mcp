import winston from 'winston';

// Create a logger instance
const logger = winston.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    defaultMeta: { service: 'agentlink-mcp' },
    transports: [
        // Write to all logs with level 'info' and below to console
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(),
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
        format: winston.format.combine(
            winston.format.colorize(),
            winston.format.simple()
        )
    }));
}

export { logger };