import { PumpFunAPI, PumpFunTrading } from '../providers/pumpFun';
import { z } from 'zod';

export function createPumpFunTools(api: PumpFunAPI, trading: PumpFunTrading) {
    return {
        searchTokens: {
            name: "search_tokens",
            description: "Search for tokens on Pump.fun by name or symbol",
            inputSchema: {
                type: "object",
                properties: {
                    query: {
                        type: "string",
                        description: "Search query for token name or symbol"
                    }
                },
                required: ["query"]
            },
            annotations: {
                title: "Search Tokens",
                readOnlyHint: true,
                openWorldHint: false
            },
            handler: async ({ query }: { query: string }) => {
                try {
                    const tokens = await api.searchTokens(query);
                    return {
                        content: [
                            {
                                type: "text",
                                text: JSON.stringify(tokens, null, 2)
                            }
                        ],
                        isError: false
                    };
                } catch (error) {
                    return {
                        content: [
                            {
                                type: "text",
                                text: `Error searching tokens: ${(error as Error).message}`
                            }
                        ],
                        isError: true
                    };
                }
            }
        },

        getTrendingTokens: {
            name: "get_trending_tokens",
            description: "Get trending tokens on Pump.fun",
            inputSchema: {
                type: "object",
                properties: {}
            },
            annotations: {
                title: "Get Trending Tokens",
                readOnlyHint: true,
                openWorldHint: false
            },
            handler: async () => {
                try {
                    const tokens = await api.getTrendingTokens();
                    return {
                        content: [
                            {
                                type: "text",
                                text: JSON.stringify(tokens, null, 2)
                            }
                        ],
                        isError: false
                    };
                } catch (error) {
                    return {
                        content: [
                            {
                                type: "text",
                                text: `Error fetching trending tokens: ${(error as Error).message}`
                            }
                        ],
                        isError: true
                    };
                }
            }
        },

        getTokenInfo: {
            name: "get_token_info",
            description: "Get detailed information about a specific token",
            inputSchema: {
                type: "object",
                properties: {
                    address: {
                        type: "string",
                        description: "Token address"
                    }
                },
                required: ["address"]
            },
            annotations: {
                title: "Get Token Info",
                readOnlyHint: true,
                openWorldHint: false
            },
            handler: async ({ address }: { address: string }) => {
                try {
                    const token = await api.getTokenInfo(address);
                    return {
                        content: [
                            {
                                type: "text",
                                text: JSON.stringify(token, null, 2)
                            }
                        ],
                        isError: false
                    };
                } catch (error) {
                    return {
                        content: [
                            {
                                type: "text",
                                text: `Error fetching token info: ${(error as Error).message}`
                            }
                        ],
                        isError: true
                    };
                }
            }
        },

        buyToken: {
            name: "buy_token",
            description: "Buy a token on Pump.fun with a specified amount of SOL",
            inputSchema: {
                type: "object",
                properties: {
                    address: {
                        type: "string",
                        description: "Token address"
                    },
                    solAmount: {
                        type: "number",
                        description: "Amount of SOL to use for purchase"
                    }
                },
                required: ["address", "solAmount"]
            },
            annotations: {
                title: "Buy Token",
                readOnlyHint: false,
                destructiveHint: true,
                idempotentHint: false,
                openWorldHint: true
            },
            handler: async ({ address, solAmount }: { address: string, solAmount: number }) => {
                try {
                    const transaction = await trading.buyToken(address, solAmount);
                    return {
                        content: [
                            {
                                type: "text",
                                text: `Transaction initiated: ${JSON.stringify(transaction, null, 2)}`
                            }
                        ],
                        isError: false
                    };
                } catch (error) {
                    return {
                        content: [
                            {
                                type: "text",
                                text: `Error buying token: ${(error as Error).message}`
                            }
                        ],
                        isError: true
                    };
                }
            }
        },

        sellToken: {
            name: "sell_token",
            description: "Sell a specific amount of a token on Pump.fun",
            inputSchema: {
                type: "object",
                properties: {
                    address: {
                        type: "string",
                        description: "Token address"
                    },
                    tokenAmount: {
                        type: "number",
                        description: "Amount of tokens to sell"
                    }
                },
                required: ["address", "tokenAmount"]
            },
            annotations: {
                title: "Sell Token",
                readOnlyHint: false,
                destructiveHint: true,
                idempotentHint: false,
                openWorldHint: true
            },
            handler: async ({ address, tokenAmount }: { address: string, tokenAmount: number }) => {
                try {
                    const transaction = await trading.sellToken(address, tokenAmount);
                    return {
                        content: [
                            {
                                type: "text",
                                text: `Transaction initiated: ${JSON.stringify(transaction, null, 2)}`
                            }
                        ],
                        isError: false
                    };
                } catch (error) {
                    return {
                        content: [
                            {
                                type: "text",
                                text: `Error selling token: ${(error as Error).message}`
                            }
                        ],
                        isError: true
                    };
                }
            }
        }
    };
}