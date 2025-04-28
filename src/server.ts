import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';

import { PumpFunTrading } from './providers/pumpFun.js';
import { TwitterAPI } from './providers/twitter.js';
import { config } from './utils/config.js';
import { logger } from './utils/logger.js';

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
        let twitterApi = null;
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

        // Add tools - note the format matches exactly the examples from the SDK documentation
        server.tool(
            "search_tokens",
            { query: z.string() },
            async (params) => {
                try {
                    const tokens = await pumpFunTrading.searchTokens(params.query);
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
            "get_trending_tokens",
            {},
            async () => {
                try {
                    const tokens = await pumpFunTrading.getTrendingTokens();
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
                    const token = await pumpFunTrading.getTokenInfo(params.address);
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
                    const price = await pumpFunTrading.getTokenPrice(params.address);
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
                    const transaction = await pumpFunTrading.buyToken(
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
                    const transaction = await pumpFunTrading.sellToken(
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

        // Add Twitter tools if available
        if (twitterApi) {
            server.tool(
                "search_tweets",
                {
                    query: z.string(),
                    count: z.number().optional()
                },
                async (params) => {
                    try {
                        const tweets = await twitterApi.searchTweets(params.query, params.count ?? 10);
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
                        const tweet = await twitterApi.postTweet(params.text);
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
        }

        // Create transport and connect
        const transport = new StdioServerTransport();
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