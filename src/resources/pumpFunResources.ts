import { PumpFunAPI } from '../providers/pumpFun';
import { ResourceTemplate } from '@modelcontextprotocol/sdk/server/mcp.js';

export function createPumpFunResources(api: PumpFunAPI) {
    // Resource for token info
    const tokenResource = new ResourceTemplate(
        "token://{address}",
        { list: undefined }
    );

    // Resource for trending tokens
    const trendingResource = {
        uri: "token://trending",
        name: "Trending Tokens",
        description: "List of currently trending tokens on Pump.fun"
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

        // Handler for trending tokens resource
        trendingHandler: async (uri: URL) => {
            try {
                const tokens = await api.getTrendingTokens();
                return {
                    contents: [{
                        uri: uri.href,
                        text: JSON.stringify(tokens, null, 2),
                        mimeType: "application/json"
                    }]
                };
            } catch (error) {
                throw new Error(`Error fetching trending tokens: ${(error as Error).message}`);
            }
        }
    };

    return {
        resources: {
            tokenResource,
            trendingResource
        },
        handlers: resourceHandlers
    };
}