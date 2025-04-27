import dotenv from 'dotenv';
import { z } from 'zod';

// Load environment variables
dotenv.config();

// Define configuration schema
const ConfigSchema = z.object({
    // Server configuration
    SERVER_NAME: z.string().default('agentlink-mcp'),
    SERVER_VERSION: z.string().default('1.0.0'),

    // PumpFun configuration
    WALLET_PUBLIC_KEY: z.string(),
    WALLET_PRIVATE_KEY: z.string().optional(),
    SOLANA_RPC_ENDPOINT: z.string().default('https://api.mainnet-beta.solana.com'),
    PUMPFUN_API_ENDPOINT: z.string().default('https://pumpportal.fun/api/trade-local'),

    // Twitter configuration
    TWITTER_API_KEY: z.string().optional(),
    TWITTER_API_KEY_SECRET: z.string().optional(),
    TWITTER_ACCESS_TOKEN: z.string().optional(),
    TWITTER_ACCESS_TOKEN_SECRET: z.string().optional(),

    // Moralis configuration
    MORALIS_API_KEY: z.string().optional(),
});

// Parse and validate configuration
const parseConfig = () => {
    const result = ConfigSchema.safeParse(process.env);

    if (!result.success) {
        console.error('Invalid configuration:', result.error.format());
        return ConfigSchema.parse({
            WALLET_PUBLIC_KEY: 'DUMMY_KEY', // This will trigger an error later
        });
    }

    return result.data;
};

// Export configuration
export const config = parseConfig();