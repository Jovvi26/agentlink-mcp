import axios from 'axios';
import { logger } from '../utils/logger';

export class MoralisAPI {
    private apiKey: string;

    constructor(apiKey: string) {
        if (!apiKey) {
            throw new Error('Moralis API key is required');
        }
        this.apiKey = apiKey;
    }

    /**
     * Get token metadata from Moralis API
     * @param tokenAddress The Solana address of the token
     * @returns Token metadata including name, symbol, logo, etc.
     */
    async getTokenMetadata(tokenAddress: string): Promise<any> {
        try {
            logger.info(`Getting token metadata for ${tokenAddress} from Moralis API`);

            const response = await axios.get(
                `https://solana-gateway.moralis.io/token/mainnet/${tokenAddress}/metadata`,
                {
                    headers: {
                        'accept': 'application/json',
                        'X-API-Key': this.apiKey
                    }
                }
            );

            if (response.status !== 200) {
                throw new Error(`API error: ${response.statusText}`);
            }

            return response.data;
        } catch (error) {
            logger.error(`Failed to get token metadata from Moralis: ${error}`);
            throw new Error(`Failed to get token metadata: ${error}`);
        }
    }

    /**
     * Get token price from Moralis API
     * @param tokenAddress The Solana address of the token
     * @returns Token price information including USD and native prices
     */
    async getTokenPrice(tokenAddress: string): Promise<any> {
        try {
            logger.info(`Getting token price for ${tokenAddress} from Moralis API`);

            const response = await axios.get(
                `https://solana-gateway.moralis.io/token/mainnet/${tokenAddress}/price`,
                {
                    headers: {
                        'accept': 'application/json',
                        'X-API-Key': this.apiKey
                    }
                }
            );

            if (response.status !== 200) {
                throw new Error(`API error: ${response.statusText}`);
            }

            return response.data;
        } catch (error) {
            logger.error(`Failed to get token price from Moralis: ${error}`);
            throw new Error(`Failed to get token price: ${error}`);
        }
    }

    /**
     * Get graduated tokens from Pump.fun via Moralis API
     * @param limit The number of tokens to return (default 100)
     * @param cursor Pagination cursor for retrieving more results
     * @returns List of tokens that have graduated from the bonding phase
     */
    async getGraduatedTokens(limit: number = 100, cursor?: string): Promise<any> {
        try {
            logger.info(`Getting graduated tokens from Moralis API, limit: ${limit}${cursor ? ', cursor: ' + cursor : ''}`);

            // Construct URL with optional cursor parameter
            let url = `https://solana-gateway.moralis.io/token/mainnet/exchange/pumpfun/graduated?limit=${limit}`;
            if (cursor) {
                url += `&cursor=${cursor}`;
            }

            const response = await axios.get(
                url,
                {
                    headers: {
                        'accept': 'application/json',
                        'X-API-Key': this.apiKey
                    }
                }
            );

            if (response.status !== 200) {
                throw new Error(`API error: ${response.statusText}`);
            }

            return response.data;
        } catch (error) {
            logger.error(`Failed to get graduated tokens from Moralis: ${error}`);
            throw new Error(`Failed to get graduated tokens: ${error}`);
        }
    }
}