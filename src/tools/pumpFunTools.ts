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

        getGraduatedTokens: {
            name: "get_graduated_tokens",
            description: "Get tokens that have graduated from the bonding phase on Pump.fun",
            inputSchema: {
                type: "object",
                properties: {
                    limit: {
                        type: "number",
                        description: "Number of tokens to return (default: 100)"
                    },
                    cursor: {
                        type: "string",
                        description: "Pagination cursor for retrieving more results"
                    }
                }
            },
            annotations: {
                title: "Get Graduated Tokens",
                readOnlyHint: true,
                openWorldHint: false
            },
            handler: async ({ limit = 100, cursor }: { limit?: number, cursor?: string }) => {
                try {
                    const tokens = await trading.getGraduatedTokens(limit, cursor);
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
                                text: `Error fetching graduated tokens: ${(error as Error).message}`
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

        getTokenPrice: {
            name: "get_token_price",
            description: "Get price information for a specific token",
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
                title: "Get Token Price",
                readOnlyHint: true,
                openWorldHint: false
            },
            handler: async ({ address }: { address: string }) => {
                try {
                    const price = await trading.getTokenPrice(address);
                    return {
                        content: [
                            {
                                type: "text",
                                text: JSON.stringify(price, null, 2)
                            }
                        ],
                        isError: false
                    };
                } catch (error) {
                    return {
                        content: [
                            {
                                type: "text",
                                text: `Error fetching token price: ${(error as Error).message}`
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
                    },
                    slippage: {
                        type: "number",
                        description: "Allowed slippage percentage (default: 1.0)"
                    },
                    priorityFee: {
                        type: "number",
                        description: "Transaction priority fee (default: 0.00001)"
                    },
                    pool: {
                        type: "string",
                        description: "Pool to use (default: 'pump')"
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
            handler: async ({ address, solAmount, slippage = 1.0, priorityFee = 0.00001, pool = 'pump' }:
                { address: string, solAmount: number, slippage?: number, priorityFee?: number, pool?: string }) => {
                try {
                    const transaction = await trading.buyToken(address, solAmount, slippage, priorityFee, pool);
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
                        type: "string",
                        description: "Amount of tokens to sell (can be a number or '100%' to sell all)"
                    },
                    slippage: {
                        type: "number",
                        description: "Allowed slippage percentage (default: 1.0)"
                    },
                    priorityFee: {
                        type: "number",
                        description: "Transaction priority fee (default: 0.00001)"
                    },
                    pool: {
                        type: "string",
                        description: "Pool to use (default: 'pump')"
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
            handler: async ({ address, tokenAmount, slippage = 1.0, priorityFee = 0.00001, pool = 'pump' }:
                { address: string, tokenAmount: string, slippage?: number, priorityFee?: number, pool?: string }) => {
                try {
                    const transaction = await trading.sellToken(address, tokenAmount, slippage, priorityFee, pool);
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