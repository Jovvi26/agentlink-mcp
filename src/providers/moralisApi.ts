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
}