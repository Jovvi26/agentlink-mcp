import { TwitterAPI } from '../providers/twitter';
import { z } from 'zod';

export function createTwitterTools(api: TwitterAPI) {
    return {
        searchTweets: {
            name: "search_tweets",
            description: "Search for tweets based on a query",
            inputSchema: {
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
            annotations: {
                title: "Search Tweets",
                readOnlyHint: true,
                openWorldHint: true
            },
            handler: async ({ query, count = 10 }: { query: string, count?: number }) => {
                try {
                    const tweets = await api.searchTweets(query, count);
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
            }
        },

        postTweet: {
            name: "post_tweet",
            description: "Post a new tweet",
            inputSchema: {
                type: "object",
                properties: {
                    text: {
                        type: "string",
                        description: "Text content of the tweet"
                    }
                },
                required: ["text"]
            },
            annotations: {
                title: "Post Tweet",
                readOnlyHint: false,
                destructiveHint: true,
                idempotentHint: false,
                openWorldHint: true
            },
            handler: async ({ text }: { text: string }) => {
                try {
                    const tweet = await api.postTweet(text);
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
            }
        }
    };
}