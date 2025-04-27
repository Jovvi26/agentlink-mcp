import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';

import { PumpFunTrading } from './providers/pumpFun';
import { TwitterAPI } from './providers/twitter';
import { config } from './utils/config';
import { logger } from './utils/logger';

async function main() {
    try {
        logger.info('Starting AgentLink MCP Server');

        // Initialize providers
        const pumpFunTrading = new PumpFunTrading(
            config.WALLET_PUBLIC_KEY,
            config.WALLET_PRIVATE_KEY,
            config.SOLANA_RPC_ENDPOINT,
            config.PUMPFUN_API_ENDPOINT,
            config.MORALIS_API_KEY
        );
        logger.info('PumpFun trading module initialized successfully');

        // Initialize Twitter API if credentials are available
        let twitterApi: TwitterAPI | null = null;
        if (config.TWITTER_API_KEY && config.TWITTER_API_KEY_SECRET) {
            twitterApi = new TwitterAPI(
                config.TWITTER_API_KEY,
                config.TWITTER_API_KEY_SECRET,
                config.TWITTER_ACCESS_TOKEN,
                config.TWITTER_ACCESS_TOKEN_SECRET
            );
            logger.info('Twitter API initialized successfully');
        } else {
            logger.warn('Twitter API credentials not provided, Twitter functionality will be limited');
        }

        // Create MCP server
        const server = new McpServer({
            name: config.SERVER_NAME,
            version: config.SERVER_VERSION,
        });

        // Register PumpFun tools
        server.tool(
            "search_tokens",
            "Search for tokens on Pump.fun by name or symbol",
            {
                type: "object",
                properties: {
                    query: {
                        type: "string",
                        description: "Search query for token name or symbol"
                    }
                },
                required: ["query"]
            },
            async ({ query }) => {
                try {
                    const tokens = await pumpFunTrading.searchTokens(query);
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
            },
            {
                title: "Search Tokens",
                readOnlyHint: true,
                openWorldHint: false
            }
        );

        server.tool(
            "get_trending_tokens",
            "Get trending tokens on Pump.fun",
            {
                type: "object",
                properties: {}
            },
            async () => {
                try {
                    const tokens = await pumpFunTrading.getTrendingTokens();
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
            },
            {
                title: "Get Trending Tokens",
                readOnlyHint: true,
                openWorldHint: false
            }
        );

        server.tool(
            "get_token_info",
            "Get detailed information about a specific token",
            {
                type: "object",
                properties: {
                    address: {
                        type: "string",
                        description: "Token address"
                    }
                },
                required: ["address"]
            },
            async ({ address }) => {
                try {
                    const token = await pumpFunTrading.getTokenInfo(address);
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
            },
            {
                title: "Get Token Info",
                readOnlyHint: true,
                openWorldHint: false
            }
        );

        server.tool(
            "get_token_price",
            "Get current price of a specific token",
            {
                type: "object",
                properties: {
                    address: {
                        type: "string",
                        description: "Token address"
                    }
                },
                required: ["address"]
            },
            async ({ address }) => {
                try {
                    const price = await pumpFunTrading.getTokenPrice(address);
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
            },
            {
                title: "Get Token Price",
                readOnlyHint: true,
                openWorldHint: false
            }
        );

        server.tool(
            "buy_token",
            "Buy a token on Pump.fun with a specified amount of SOL",
            {
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
                        description: "Maximum acceptable slippage percentage (default: 1.0)"
                    },
                    priorityFee: {
                        type: "number",
                        description: "Priority fee amount (default: 0.00001)"
                    },
                    pool: {
                        type: "string",
                        description: "Trading pool to use (default: 'pump')"
                    }
                },
                required: ["address", "solAmount"]
            },
            async ({ address, solAmount, slippage = 1.0, priorityFee = 0.00001, pool = 'pump' }) => {
                try {
                    const transaction = await pumpFunTrading.buyToken(
                        address,
                        solAmount,
                        slippage,
                        priorityFee,
                        pool
                    );
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
            },
            {
                title: "Buy Token",
                readOnlyHint: false,
                destructiveHint: true,
                idempotentHint: false,
                openWorldHint: true
            }
        );

        server.tool(
            "sell_token",
            "Sell a specific amount of a token on Pump.fun",
            {
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
                        description: "Maximum acceptable slippage percentage (default: 1.0)"
                    },
                    priorityFee: {
                        type: "number",
                        description: "Priority fee amount (default: 0.00001)"
                    },
                    pool: {
                        type: "string",
                        description: "Trading pool to use (default: 'pump')"
                    }
                },
                required: ["address", "tokenAmount"]
            },
            async ({ address, tokenAmount, slippage = 1.0, priorityFee = 0.00001, pool = 'pump' }) => {
                try {
                    const transaction = await pumpFunTrading.sellToken(
                        address,
                        tokenAmount,
                        slippage,
                        priorityFee,
                        pool
                    );
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
            },
            {
                title: "Sell Token",
                readOnlyHint: false,
                destructiveHint: true,
                idempotentHint: false,
                openWorldHint: true
            }
        );

        // Add Twitter tools if available
        if (twitterApi) {
            server.tool(
                "search_tweets",
                "Search for tweets based on a query",
                {
                    type: "object",
                    properties: {
                        query: {
                            type: "string",
                            description: "Search query for tweets"
                        },
                        count: {
                            type: "number",
                            description: "Number of tweets to return (default: 10)"
                        }
                    },
                    required: ["query"]
                },
                async ({ query, count = 10 }) => {
                    try {
                        const tweets = await twitterApi.searchTweets(query, count);
                        return {
                            content: [
                                {
                                    type: "text",
                                    text: JSON.stringify(tweets, null, 2)
                                }
                            ],
                            isError: false
                        };
                    } catch (error) {
                        return {
                            content: [
                                {
                                    type: "text",
                                    text: `Error searching tweets: ${(error as Error).message}`
                                }
                            ],
                            isError: true
                        };
                    }
                },
                {
                    title: "Search Tweets",
                    readOnlyHint: true,
                    openWorldHint: true
                }
            );

            server.tool(
                "post_tweet",
                "Post a new tweet",
                {
                    type: "object",
                    properties: {
                        text: {
                            type: "string",
                            description: "Text content of the tweet"
                        }
                    },
                    required: ["text"]
                },
                async ({ text }) => {
                    try {
                        const tweet = await twitterApi.postTweet(text);
                        return {
                            content: [
                                {
                                    type: "text",
                                    text: `Tweet posted successfully: ${JSON.stringify(tweet, null, 2)}`
                                }
                            ],
                            isError: false
                        };
                    } catch (error) {
                        return {
                            content: [
                                {
                                    type: "text",
                                    text: `Error posting tweet: ${(error as Error).message}`
                                }
                            ],
                            isError: true
                        };
                    }
                },
                {
                    title: "Post Tweet",
                    readOnlyHint: false,
                    destructiveHint: true,
                    idempotentHint: false,
                    openWorldHint: true
                }
            );
        }

        // Add a prompt for token analysis
        server.prompt(
            "analyze_token",
            "Analyze a token on Pump.fun",
            [
                {
                    name: "address",
                    description: "Token address to analyze",
                    required: true
                }
            ],
            ({ address }) => ({
                messages: [
                    {
                        role: "user",
                        content: {
                            type: "text",
                            text: `Please analyze this token with address ${address}. Get the token information, and provide insights about its price, market cap, and trading volume if available.`
                        }
                    }
                ]
            })
        );

        // Add a prompt for trending token analysis
        server.prompt(
            "analyze_trending_tokens",
            "Analyze trending tokens on Pump.fun",
            [],
            () => ({
                messages: [
                    {
                        role: "user",
                        content: {
                            type: "text",
                            text: "Please analyze the currently trending tokens on Pump.fun. Provide insights about their prices, market caps, and trading volumes if available."
                        }
                    }
                ]
            })
        );

        // Create transport and connect
        const transport = new StdioServerTransport();

        // Connect server to transport
        await server.connect(transport);

        logger.info('AgentLink MCP Server started successfully');

        // Graceful shutdown
        process.on('SIGINT', async () => {
            logger.info('Shutting down server...');
            await server.close();
            process.exit(0);
        });

        process.on('SIGTERM', async () => {
            logger.info('Shutting down server...');
            await server.close();
            process.exit(0);
        });

    } catch (error) {
        logger.error(`Error starting server: ${error}`);
        process.exit(1);
    }
}

// Start server
main();