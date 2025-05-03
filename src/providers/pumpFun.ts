import axios from 'axios';
import * as solanaWeb3 from '@solana/web3.js';
import bs58 from 'bs58';
import { MoralisAPI } from './moralisApi';
import { logger } from '../utils/logger';
import { z } from 'zod';

// Token schemas
export const TokenInfoSchema = z.object({
    address: z.string(),
    name: z.string(),
    symbol: z.string(),
    decimals: z.number(),
    price: z.number().optional(),
    volume24h: z.number().optional(),
    marketCap: z.number().optional(),
    image: z.string().optional(),
});

export type TokenInfo = z.infer<typeof TokenInfoSchema>;

// Transaction schemas
export const TransactionSchema = z.object({
    hash: z.string(),
    timestamp: z.number(),
    tokenAddress: z.string(),
    amount: z.number(),
    type: z.enum(['buy', 'sell']),
    price: z.number(),
    status: z.enum(['pending', 'confirmed', 'failed']),
});

export type Transaction = z.infer<typeof TransactionSchema>;

// PumpFun API provider
export class PumpFunAPI {
    private apiEndpoint: string;
    private publicKey: string;
    private moralisApi: MoralisAPI | null = null;

    constructor(publicKey: string, apiEndpoint: string = 'https://pumpportal.fun/api/trade-local', moralisApiKey?: string) {
        if (!publicKey) {
            throw new Error('Wallet public key is required for Pump.fun API');
        }
        this.publicKey = publicKey;
        this.apiEndpoint = apiEndpoint;

        // Initialize Moralis API if API key is provided
        if (moralisApiKey) {
            try {
                this.moralisApi = new MoralisAPI(moralisApiKey);
                logger.info('Moralis API initialized successfully in PumpFunAPI');
            } catch (error) {
                logger.warn(`Failed to initialize Moralis API: ${error}`);
            }
        }
    }

    /**
     * Get token information from Pump.fun
     * First tries to use Moralis API, falls back to placeholder data if not available
     * @param tokenAddress The contract address of the token
     * @returns Token information
     */
    async getTokenInfo(tokenAddress: string): Promise<any> {
        try {
            logger.info(`Getting token info for ${tokenAddress}`);

            // Try to use Moralis API if available
            if (this.moralisApi) {
                try {
                    return await this.moralisApi.getTokenMetadata(tokenAddress);
                } catch (error) {
                    logger.warn(`Failed to get token info from Moralis, falling back to placeholder: ${error}`);
                }
            }

            // Fallback to placeholder data
            return {
                address: tokenAddress,
                name: 'Unknown Token',
                symbol: 'UNKNOWN',
                decimals: 9,
                supply: 0,
                note: 'Limited token info available. Consider adding a Moralis API key for enhanced metadata.'
            };
        } catch (error) {
            logger.error(`Failed to get token info: ${error}`);
            throw new Error(`Failed to get token info: ${error}`);
        }
    }

    /**
     * Get token price information
     * Uses Moralis API if available
     * @param tokenAddress The contract address of the token
     * @returns Token price information
     */
    async getTokenPrice(tokenAddress: string): Promise<any> {
        try {
            logger.info(`Getting token price for ${tokenAddress}`);

            // Try to use Moralis API if available
            if (this.moralisApi) {
                try {
                    return await this.moralisApi.getTokenPrice(tokenAddress);
                } catch (error) {
                    logger.warn(`Failed to get token price from Moralis: ${error}`);
                }
            }

            // Fallback to placeholder data
            return {
                address: tokenAddress,
                usdPrice: 0,
                nativePrice: {
                    value: 0,
                    decimals: 9,
                    name: 'Wrapped Solana',
                    symbol: 'WSOL'
                },
                note: 'Price information not available. Consider adding a Moralis API key for real-time prices.'
            };
        } catch (error) {
            logger.error(`Failed to get token price: ${error}`);
            throw new Error(`Failed to get token price: ${error}`);
        }
    }

    /**
     * Search for tokens by name or symbol
     * @param query Search query for token name or symbol
     * @returns Array of matching tokens
     */
    async searchTokens(query: string): Promise<TokenInfo[]> {
        // This is a mock implementation since the original API doesn't have a direct search endpoint
        // In a real implementation, you might use Moralis or another API to search for tokens
        logger.info(`Searching tokens with query: ${query}`);

        return [
            {
                address: "sample123456789",
                name: "Sample Token",
                symbol: "SMPL",
                decimals: 9,
                price: 0.00001,
            }
        ];
    }

    /**
     * Generate a buy transaction that can be signed and sent
     * @param tokenAddress The contract address of the token
     * @param amount The amount to buy
     * @param denominatedInSol Whether the amount is in SOL (true) or tokens (false)
     * @param slippage The slippage percentage
     * @param priorityFee The priority fee amount
     * @param pool The pool to use (pump, raydium, pump-amm, auto)
     * @returns The serialized transaction buffer
     */
    async generateBuyTransaction(
        tokenAddress: string,
        amount: number,
        denominatedInSol: boolean = true,
        slippage: number = 1.0,
        priorityFee: number = 0.00001,
        pool: string = 'pump'
    ): Promise<Buffer> {
        try {
            logger.info(`Generating buy transaction for ${amount} ${denominatedInSol ? 'SOL' : 'tokens'} of ${tokenAddress}`);

            const response = await axios.post(
                this.apiEndpoint,
                {
                    publicKey: this.publicKey,
                    action: 'buy',
                    mint: tokenAddress,
                    amount: amount,
                    denominatedInSol: denominatedInSol.toString(),
                    slippage: slippage,
                    priorityFee: priorityFee,
                    pool: pool
                },
                {
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    responseType: 'arraybuffer'
                }
            );

            if (response.status !== 200) {
                throw new Error(`API error: ${response.statusText}`);
            }

            return Buffer.from(response.data);
        } catch (error) {
            logger.error(`Failed to generate buy transaction: ${error}`);
            throw new Error(`Failed to generate buy transaction: ${error}`);
        }
    }

    /**
     * Generate a sell transaction that can be signed and sent
     * @param tokenAddress The contract address of the token
     * @param amount The amount to sell (can be a string like "100%" to sell all)
     * @param denominatedInSol Whether the amount is in SOL (true) or tokens (false)
     * @param slippage The slippage percentage
     * @param priorityFee The priority fee amount
     * @param pool The pool to use (pump, raydium, pump-amm, auto)
     * @returns The serialized transaction buffer
     */
    async generateSellTransaction(
        tokenAddress: string,
        amount: number | string,
        denominatedInSol: boolean = false,
        slippage: number = 1.0,
        priorityFee: number = 0.00001,
        pool: string = 'pump'
    ): Promise<Buffer> {
        try {
            logger.info(`Generating sell transaction for ${amount} of ${tokenAddress}`);

            const response = await axios.post(
                this.apiEndpoint,
                {
                    publicKey: this.publicKey,
                    action: 'sell',
                    mint: tokenAddress,
                    amount: amount,
                    denominatedInSol: denominatedInSol.toString(),
                    slippage: slippage,
                    priorityFee: priorityFee,
                    pool: pool
                },
                {
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    responseType: 'arraybuffer'
                }
            );

            if (response.status !== 200) {
                throw new Error(`API error: ${response.statusText}`);
            }

            return Buffer.from(response.data);
        } catch (error) {
            logger.error(`Failed to generate sell transaction: ${error}`);
            throw new Error(`Failed to generate sell transaction: ${error}`);
        }
    }
}

// PumpFun Trading provider
export class PumpFunTrading {
    private api: PumpFunAPI;
    private moralisApi: MoralisAPI | null = null;
    private walletPrivateKey?: string;
    private walletPublicKey: string;
    private rpcEndpoint: string;
    private connection: solanaWeb3.Connection;

    constructor(
        walletPublicKey: string,
        walletPrivateKey?: string,
        rpcEndpoint: string = 'https://api.mainnet-beta.solana.com',
        apiEndpoint: string = 'https://pumpportal.fun/api/trade-local',
        moralisApiKey?: string
    ) {
        if (!walletPublicKey) {
            throw new Error('Wallet public key is required for trading');
        }

        this.walletPublicKey = walletPublicKey;
        this.walletPrivateKey = walletPrivateKey;
        this.rpcEndpoint = rpcEndpoint;

        // Create Solana connection
        this.connection = new solanaWeb3.Connection(
            this.rpcEndpoint,
            'confirmed'
        );

        // Initialize API
        this.api = new PumpFunAPI(walletPublicKey, apiEndpoint, moralisApiKey);

        // Initialize Moralis API if API key is provided
        if (moralisApiKey) {
            try {
                this.moralisApi = new MoralisAPI(moralisApiKey);
                logger.info('Moralis API initialized successfully in PumpFunTrading');
            } catch (error) {
                logger.warn(`Failed to initialize Moralis API in PumpFunTrading: ${error}`);
            }
        }
    }

    /**
     * Get token information, enhanced with Moralis data if available
     * @param tokenAddress The contract address of the token
     * @returns Enhanced token information
     */
    async getTokenInfo(tokenAddress: string): Promise<any> {
        // Try to get token info from Moralis first if available
        if (this.moralisApi) {
            try {
                const moralisData = await this.moralisApi.getTokenMetadata(tokenAddress);
                logger.info(`Retrieved token metadata for ${tokenAddress} from Moralis`);
                return moralisData;
            } catch (error) {
                logger.warn(`Failed to get token info from Moralis, falling back to API: ${error}`);
            }
        }

        // Fall back to the standard API method if Moralis fails or isn't available
        return this.api.getTokenInfo(tokenAddress);
    }

    /**
     * Get token price information from Moralis if available
     * @param tokenAddress The contract address of the token
     * @returns Token price information
     */
    async getTokenPrice(tokenAddress: string): Promise<any> {
        // Try to get token price from Moralis if available
        if (this.moralisApi) {
            try {
                const priceData = await this.moralisApi.getTokenPrice(tokenAddress);
                logger.info(`Retrieved token price for ${tokenAddress} from Moralis`);
                return priceData;
            } catch (error) {
                logger.warn(`Failed to get token price from Moralis: ${error}`);
            }
        }

        // Fall back to placeholder data if Moralis fails or isn't available
        return {
            address: tokenAddress,
            usdPrice: null,
            nativePrice: {
                value: null,
                decimals: 9,
                name: 'Wrapped Solana',
                symbol: 'WSOL'
            },
            note: 'Price information not available without Moralis API key'
        };
    }

    private validateWallet(): void {
        if (!this.walletPrivateKey) {
            throw new Error('Wallet private key is not configured. Trading is not available.');
        }
    }

    /**
     * Search for tokens
     * @param query The search query
     * @returns List of matching tokens
     */
    async searchTokens(query: string): Promise<TokenInfo[]> {
        return this.api.searchTokens(query);
    }

    /**
     * Get graduated tokens from Pump.fun via Moralis API
     * @param limit The number of tokens to return (default 100)
     * @param cursor Pagination cursor for retrieving more results
     * @returns List of tokens that have graduated from the bonding phase
     */
    async getGraduatedTokens(limit: number = 100, cursor?: string): Promise<any> {
        // Try to get graduated tokens from Moralis if available
        if (this.moralisApi) {
            try {
                const graduatedTokens = await this.moralisApi.getGraduatedTokens(limit, cursor);
                logger.info(`Retrieved graduated tokens from Moralis API`);
                return graduatedTokens;
            } catch (error) {
                logger.warn(`Failed to get graduated tokens from Moralis: ${error}`);
            }
        }

        // Fall back to placeholder data if Moralis fails or isn't available
        logger.warn('Moralis API not available or failed. Returning placeholder data for graduated tokens.');
        return {
            result: [
                {
                    tokenAddress: "placeholder123456789",
                    name: "Placeholder Token",
                    symbol: "PLACE",
                    logo: "",
                    decimals: "9",
                    priceNative: "0.000001",
                    priceUsd: "0.00015",
                    liquidity: "10000",
                    fullyDilutedValuation: "150000",
                    graduatedAt: new Date().toISOString()
                }
            ],
            note: "Placeholder data. For real graduated token data, please provide a valid Moralis API key."
        };
    }

    /**
     * Buy a token on Pump.fun
     * @param tokenAddress The contract address of the token
     * @param amount Amount in SOL to spend
     * @param slippage The slippage percentage (default 1.0%)
     * @param priorityFee The priority fee amount (default 0.00001)
     * @param pool The pool to use (default 'pump')
     * @returns Transaction details including signature
     */
    async buyToken(
        tokenAddress: string,
        amount: number,
        slippage: number = 1.0,
        priorityFee: number = 0.00001,
        pool: string = 'pump'
    ): Promise<any> {
        try {
            this.validateWallet();

            logger.info(`Buying token ${tokenAddress} for ${amount} SOL with ${slippage}% slippage`);

            // Step 1: Generate transaction through Pump.fun API
            const transactionBuffer = await this.api.generateBuyTransaction(
                tokenAddress,
                amount,
                true, // denominatedInSol = true for buying with SOL
                slippage,
                priorityFee,
                pool
            );

            // Step 2: Deserialize and sign the transaction
            const transaction = solanaWeb3.VersionedTransaction.deserialize(
                new Uint8Array(transactionBuffer)
            );

            // Step 3: Sign the transaction
            const signerKeyPair = solanaWeb3.Keypair.fromSecretKey(
                bs58.decode(this.walletPrivateKey!)
            );
            transaction.sign([signerKeyPair]);

            // Step 4: Send the transaction
            const signature = await this.connection.sendTransaction(transaction);

            logger.info(`Transaction sent: ${signature}`);

            return {
                success: true,
                transactionId: signature,
                tokenAddress,
                amountSol: amount,
                status: 'sent',
                explorerUrl: `https://solscan.io/tx/${signature}`
            };
        } catch (error) {
            logger.error(`Failed to buy token: ${error}`);
            throw new Error(`Failed to buy token: ${error}`);
        }
    }

    /**
     * Sell a token on Pump.fun
     * @param tokenAddress The contract address of the token
     * @param amount Amount of tokens to sell (can be a string like "100%" to sell all)
     * @param slippage The slippage percentage (default 1.0%)
     * @param priorityFee The priority fee amount (default 0.00001)
     * @param pool The pool to use (default 'pump')
     * @returns Transaction details including signature
     */
    async sellToken(
        tokenAddress: string,
        amount: number | string,
        slippage: number = 1.0,
        priorityFee: number = 0.00001,
        pool: string = 'pump'
    ): Promise<any> {
        try {
            this.validateWallet();

            logger.info(`Selling ${amount} of token ${tokenAddress} with ${slippage}% slippage`);

            // Step 1: Generate transaction through Pump.fun API
            const transactionBuffer = await this.api.generateSellTransaction(
                tokenAddress,
                amount,
                false, // denominatedInSol = false for selling tokens
                slippage,
                priorityFee,
                pool
            );

            // Step 2: Deserialize and sign the transaction
            const transaction = solanaWeb3.VersionedTransaction.deserialize(
                new Uint8Array(transactionBuffer)
            );

            // Step 3: Sign the transaction
            const signerKeyPair = solanaWeb3.Keypair.fromSecretKey(
                bs58.decode(this.walletPrivateKey!)
            );
            transaction.sign([signerKeyPair]);

            // Step 4: Send the transaction
            const signature = await this.connection.sendTransaction(transaction);

            logger.info(`Transaction sent: ${signature}`);

            return {
                success: true,
                transactionId: signature,
                tokenAddress,
                amount: amount,
                status: 'sent',
                explorerUrl: `https://solscan.io/tx/${signature}`
            };
        } catch (error) {
            logger.error(`Failed to sell token: ${error}`);
            throw new Error(`Failed to sell token: ${error}`);
        }
    }
}