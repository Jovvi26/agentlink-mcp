import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';

import { PumpFunTrading } from './providers/pumpFun.js';
import { TwitterAPI } from './providers/twitter.js';
import { config } from './utils/config.js';
import { logger } from './utils/logger.js';

async function main() {
    // Create MCP server first
    let server: McpServer | undefined;
    let transport: StdioServerTransport | undefined;

    try {
        logger.info('Starting AgentLink MCP Server');

        // Create MCP server first, but don't connect yet
        server = new McpServer({
            name: config.SERVER_NAME || "agentlink",
            version: config.SERVER_VERSION || "1.0.0",
        });

        // Initialize providers BEFORE connecting to transport
        logger.info('Initializing providers...');

        // Initialize PumpFunTrading
        let pumpFunTrading: PumpFunTrading | null = null;
        try {
            pumpFunTrading = new PumpFunTrading(
                config.WALLET_PUBLIC_KEY,
                config.WALLET_PRIVATE_KEY,
                config.SOLANA_RPC_ENDPOINT,
                config.PUMPFUN_API_ENDPOINT,
                config.MORALIS_API_KEY
            );
            logger.info('PumpFun trading module initialized successfully');
        } catch (err: unknown) {
            console.error(`Failed to initialize PumpFunTrading: ${err instanceof Error ? err.message : String(err)}`);
            if (err instanceof Error && err.stack) {
                console.error(err.stack);
            }
            // Continue without this provider rather than exiting
        }

        // Initialize Twitter API if credentials are available
        let twitterApi: TwitterAPI | null = null;
        try {
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
        } catch (err: unknown) {
            console.error(`Failed to initialize TwitterAPI: ${err instanceof Error ? err.message : String(err)}`);
            if (err instanceof Error && err.stack) {
                console.error(err.stack);
            }
            // Continue without this provider
        }

        // Register all tools BEFORE connecting to transport
        logger.info('Registering tools...');

        // Add tools only if providers were initialized successfully
        if (pumpFunTrading) {
            try {
                server.tool(
                    "search_tokens",
                    { query: z.string() },
                    async (params) => {
                        try {
                            const tokens = await pumpFunTrading!.searchTokens(params.query);
                            return {
                                content: [{ type: "text", text: JSON.stringify(tokens, null, 2) }]
                            };
                        } catch (error) {
                            return {
                                content: [{ type: "text", text: `Error: ${error instanceof Error ? error.message : String(error)}` }],
                                isError: true
                            };
                        }
                    }
                );

                server.tool(
                    "get_graduated_tokens",
                    {
                        limit: z.number().optional(),
                        cursor: z.string().optional()
                    },
                    async (params) => {
                        try {
                            const tokens = await pumpFunTrading!.getGraduatedTokens(params.limit, params.cursor);
                            return {
                                content: [{ type: "text", text: JSON.stringify(tokens, null, 2) }]
                            };
                        } catch (error) {
                            return {
                                content: [{ type: "text", text: `Error: ${error instanceof Error ? error.message : String(error)}` }],
                                isError: true
                            };
                        }
                    }
                );

                server.tool(
                    "get_token_info",
                    { address: z.string() },
                    async (params) => {
                        try {
                            const token = await pumpFunTrading!.getTokenInfo(params.address);
                            return {
                                content: [{ type: "text", text: JSON.stringify(token, null, 2) }]
                            };
                        } catch (error) {
                            return {
                                content: [{ type: "text", text: `Error: ${error instanceof Error ? error.message : String(error)}` }],
                                isError: true
                            };
                        }
                    }
                );

                server.tool(
                    "get_token_price",
                    { address: z.string() },
                    async (params) => {
                        try {
                            const price = await pumpFunTrading!.getTokenPrice(params.address);
                            return {
                                content: [{ type: "text", text: JSON.stringify(price, null, 2) }]
                            };
                        } catch (error) {
                            return {
                                content: [{ type: "text", text: `Error: ${error instanceof Error ? error.message : String(error)}` }],
                                isError: true
                            };
                        }
                    }
                );

                server.tool(
                    "buy_token",
                    {
                        address: z.string(),
                        solAmount: z.number(),
                        slippage: z.number().optional(),
                        priorityFee: z.number().optional(),
                        pool: z.string().optional()
                    },
                    async (params) => {
                        try {
                            const transaction = await pumpFunTrading!.buyToken(
                                params.address,
                                params.solAmount,
                                params.slippage ?? 1.0,
                                params.priorityFee ?? 0.00001,
                                params.pool ?? 'pump'
                            );
                            return {
                                content: [{ type: "text", text: `Transaction initiated: ${JSON.stringify(transaction, null, 2)}` }]
                            };
                        } catch (error) {
                            return {
                                content: [{ type: "text", text: `Error: ${error instanceof Error ? error.message : String(error)}` }],
                                isError: true
                            };
                        }
                    }
                );

                server.tool(
                    "sell_token",
                    {
                        address: z.string(),
                        tokenAmount: z.string(),
                        slippage: z.number().optional(),
                        priorityFee: z.number().optional(),
                        pool: z.string().optional()
                    },
                    async (params) => {
                        try {
                            const transaction = await pumpFunTrading!.sellToken(
                                params.address,
                                params.tokenAmount,
                                params.slippage ?? 1.0,
                                params.priorityFee ?? 0.00001,
                                params.pool ?? 'pump'
                            );
                            return {
                                content: [{ type: "text", text: `Transaction initiated: ${JSON.stringify(transaction, null, 2)}` }]
                            };
                        } catch (error) {
                            return {
                                content: [{ type: "text", text: `Error: ${error instanceof Error ? error.message : String(error)}` }],
                                isError: true
                            };
                        }
                    }
                );
                logger.info('Added PumpFun tools successfully');
            } catch (err: unknown) {
                console.error(`Failed to add PumpFun tools: ${err instanceof Error ? err.message : String(err)}`);
                if (err instanceof Error && err.stack) {
                    console.error(err.stack);
                }
            }
        }

        // Add Twitter tools if available
        if (twitterApi) {
            try {
                server.tool(
                    "search_tweets",
                    {
                        query: z.string(),
                        count: z.number().optional()
                    },
                    async (params) => {
                        try {
                            const tweets = await twitterApi!.searchTweets(params.query, params.count ?? 10);
                            return {
                                content: [{ type: "text", text: JSON.stringify(tweets, null, 2) }]
                            };
                        } catch (error) {
                            return {
                                content: [{ type: "text", text: `Error: ${error instanceof Error ? error.message : String(error)}` }],
                                isError: true
                            };
                        }
                    }
                );

                server.tool(
                    "post_tweet",
                    { text: z.string() },
                    async (params) => {
                        try {
                            const tweet = await twitterApi!.postTweet(params.text);
                            return {
                                content: [{ type: "text", text: `Tweet posted successfully: ${JSON.stringify(tweet, null, 2)}` }]
                            };
                        } catch (error) {
                            return {
                                content: [{ type: "text", text: `Error: ${error instanceof Error ? error.message : String(error)}` }],
                                isError: true
                            };
                        }
                    }
                );
                logger.info('Added Twitter tools successfully');
            } catch (err: unknown) {
                console.error(`Failed to add Twitter tools: ${err instanceof Error ? err.message : String(err)}`);
                if (err instanceof Error && err.stack) {
                    console.error(err.stack);
                }
            }
        }

        // NOW connect to transport AFTER all tools are registered
        logger.info('Connecting to transport...');
        transport = new StdioServerTransport();
        await server.connect(transport);
        logger.info('MCP connection established');

        logger.info('AgentLink MCP Server started successfully');

        // Graceful shutdown
        process.on('SIGINT', async () => {
            logger.info('Shutting down server...');
            if (server) await server.close();
            process.exit(0);
        });

        process.on('SIGTERM', async () => {
            logger.info('Shutting down server...');
            if (server) await server.close();
            process.exit(0);
        });

    } catch (error: unknown) {
        // Log detailed error for debugging
        console.error(`Error starting server: ${error instanceof Error ? error.message : String(error)}`);
        if (error instanceof Error && error.stack) {
            console.error(error.stack);
        }

        // Try to close server if it was created
        if (server) {
            try {
                await server.close();
            } catch (closeError: unknown) {
                console.error(`Error closing server: ${closeError instanceof Error ? closeError.message : String(closeError)}`);
            }
        }

        process.exit(1);
    }
}

// Start server
main();