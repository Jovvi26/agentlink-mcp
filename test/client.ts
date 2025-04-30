import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import path from 'path';
import dotenv from 'dotenv';
import fs from 'fs';

// Find the correct path to the .env file
const rootDir = path.resolve(__dirname, '..');
const envPath = path.join(rootDir, '.env');

// Check if the file exists
if (fs.existsSync(envPath)) {
    console.log(`Found .env file at: ${envPath}`);
    dotenv.config({ path: envPath });
    console.log('WALLET_PUBLIC_KEY present:', !!process.env.WALLET_PUBLIC_KEY);
} else {
    console.log(`ERROR: .env file not found at ${envPath}`);
    console.log('Looking for .env in parent directories...');

    // Try to find it in parent directories
    let currentDir = rootDir;
    let found = false;

    while (currentDir !== path.parse(currentDir).root && !found) {
        const parentDir = path.dirname(currentDir);
        const parentEnvPath = path.join(parentDir, '.env');

        if (fs.existsSync(parentEnvPath)) {
            console.log(`Found .env file at: ${parentEnvPath}`);
            dotenv.config({ path: parentEnvPath });
            found = true;
            console.log('WALLET_PUBLIC_KEY present:', !!process.env.WALLET_PUBLIC_KEY);
        }

        currentDir = parentDir;
    }

    if (!found) {
        console.log('ERROR: Could not find .env file in any parent directory');
    }
}

async function main() {
    console.log('Starting MCP client test...');

    try {
        // Create a transport that connects to your server with explicit env variables
        const transport = new StdioClientTransport({
            command: 'node',
            args: ['../build/server.js'],
            env: {
                ...process.env,
                // Explicitly set the required variables if they exist in process.env
                ...(process.env.WALLET_PUBLIC_KEY && { WALLET_PUBLIC_KEY: process.env.WALLET_PUBLIC_KEY }),
                ...(process.env.WALLET_PRIVATE_KEY && { WALLET_PRIVATE_KEY: process.env.WALLET_PRIVATE_KEY }),
                ...(process.env.SOLANA_RPC_ENDPOINT && { SOLANA_RPC_ENDPOINT: process.env.SOLANA_RPC_ENDPOINT }),
                ...(process.env.PUMPFUN_API_ENDPOINT && { PUMPFUN_API_ENDPOINT: process.env.PUMPFUN_API_ENDPOINT }),
                ...(process.env.MORALIS_API_KEY && { MORALIS_API_KEY: process.env.MORALIS_API_KEY }),
                ...(process.env.SERVER_NAME && { SERVER_NAME: process.env.SERVER_NAME }),
                ...(process.env.SERVER_VERSION && { SERVER_VERSION: process.env.SERVER_VERSION })
            } as Record<string, string>
        });

        // Rest of your code remains the same
        const client = new Client({
            name: 'test-client',
            version: '1.0.0',
        });

        console.log('Connecting to MCP server...');
        await client.connect(transport);
        console.log('Connected successfully!');

        // Test with token address
        const TOKEN_ADDRESS = "FUAfBo2jgks6gB4Z4LfZkqSZgzNucisEHqnNebaRxM1P";

        // List available tools
        console.log('\nListing available tools...');
        const tools = await client.listTools();
        console.log('Available tools:', JSON.stringify(tools, null, 2));

        // Test get_token_info
        try {
            console.log('\nTesting get_token_info...');
            const tokenInfo = await client.callTool({
                name: 'get_token_info',
                arguments: {
                    address: TOKEN_ADDRESS
                }
            });
            console.log('Token info result:', JSON.stringify(tokenInfo, null, 2));
        } catch (error) {
            console.error('Error calling get_token_info:', error);
        }

        // Close the client connection
        console.log('\nTest completed. Closing connection...');
        await client.close();

    } catch (error) {
        console.error('Error in client:', error);
    }
}

main();