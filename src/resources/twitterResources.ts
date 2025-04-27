import { TwitterAPI } from '../providers/twitter';
import { ResourceTemplate } from '@modelcontextprotocol/sdk/server/mcp.js';

export function createTwitterResources(api: TwitterAPI) {
    // Resource for tweet search
    const tweetSearchResource = new ResourceTemplate(
        "twitter://search/{query}/{count?}",
        { list: undefined }
    );

    // Handlers
    const resourceHandlers = {
        // Handler for tweet search resource
        tweetSearchHandler: async (uri: URL, params: { query: string, count?: string }) => {
            try {
                const count = params.count ? parseInt(params.count, 10) : 10;
                const tweets = await api.searchTweets(params.query, count);
                return {
                    contents: [{
                        uri: uri.href,
                        text: JSON.stringify(tweets, null, 2),
                        mimeType: "application/json"
                    }]
                };
            } catch (error) {
                throw new Error(`Error searching tweets: ${(error as Error).message}`);
            }
        }
    };

    return {
        resources: {
            tweetSearchResource
        },
        handlers: resourceHandlers
    };
}