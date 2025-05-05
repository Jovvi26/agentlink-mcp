import { PumpFunAPI, PumpFunTrading } from '../providers/pumpFun';
import { ResourceTemplate } from '@modelcontextprotocol/sdk/server/mcp.js';

export function createPumpFunResources(api: PumpFunAPI, trading?: PumpFunTrading) {
    // Resource for token info
    const tokenResource = new ResourceTemplate(
        "token://{address}",
        { list: undefined }
    );

    // Resource for graduated tokens
    const graduatedResource = {
        uri: "token://graduated",
        name: "Graduated Tokens",
        description: "List of tokens that have completed the bonding phase on Pump.fun"
    };

    // Resource for bonding tokens
    const bondingResource = {
        uri: "token://bonding",
        name: "Bonding Tokens",
        description: "List of tokens currently in the bonding phase on Pump.fun"
    };

    // Handlers
    const resourceHandlers = {
        // Handler for token info resource
        tokenHandler: async (uri: URL, params: { address: string }) => {
            try {
                const token = await api.getTokenInfo(params.address);
                return {
                    contents: [{
                        uri: uri.href,
                        text: JSON.stringify(token, null, 2),
                        mimeType: "application/json"
                    }]
                };
            } catch (error) {
                throw new Error(`Error fetching token: ${(error as Error).message}`);
            }
        },

        // Handler for graduated tokens resource
        graduatedHandler: async (uri: URL, params: { limit?: string, cursor?: string }) => {
            try {
                // If trading is available, use it to get graduated tokens
                if (trading) {
                    const limit = params.limit ? parseInt(params.limit, 10) : 100;
                    const tokens = await trading.getGraduatedTokens(limit, params.cursor);
                    return {
                        contents: [{
                            uri: uri.href,
                            text: JSON.stringify(tokens, null, 2),
                            mimeType: "application/json"
                        }]
                    };
                } else {
                    // Fallback if trading is not available
                    return {
                        contents: [{
                            uri: uri.href,
                            text: JSON.stringify({
                                result: [],
                                note: "PumpFunTrading module not available. Unable to fetch graduated tokens."
                            }, null, 2),
                            mimeType: "application/json"
                        }]
                    };
                }
            } catch (error) {
                throw new Error(`Error fetching graduated tokens: ${(error as Error).message}`);
            }
        },

        // Handler for bonding tokens resource
        bondingHandler: async (uri: URL, params: { limit?: string, cursor?: string }) => {
            try {
                // If trading is available, use it to get bonding tokens
                if (trading) {
                    const limit = params.limit ? parseInt(params.limit, 10) : 100;
                    const tokens = await trading.getBondingTokens(limit, params.cursor);
                    return {
                        contents: [{
                            uri: uri.href,
                            text: JSON.stringify(tokens, null, 2),
                            mimeType: "application/json"
                        }]
                    };
                } else {
                    // Fallback if trading is not available
                    return {
                        contents: [{
                            uri: uri.href,
                            text: JSON.stringify({
                                result: [],
                                note: "PumpFunTrading module not available. Unable to fetch bonding tokens."
                            }, null, 2),
                            mimeType: "application/json"
                        }]
                    };
                }
            } catch (error) {
                throw new Error(`Error fetching bonding tokens: ${(error as Error).message}`);
            }
        }
    };

    return {
        resources: {
            tokenResource,
            graduatedResource,
            bondingResource
        },
        handlers: resourceHandlers
    };
}