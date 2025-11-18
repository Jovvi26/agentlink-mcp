# AGENTLINK Architecture

## 🏗️ System Overview

AGENTLINK is built as a multi-layered, event-driven architecture optimized for high-throughput AI-powered blockchain trading operations.

```
┌─────────────────────────────────────────────────────────────┐
│                        Client Layer                          │
│  (WebSocket, REST API, Frontend UI)                         │
└─────────────────┬───────────────────────────────────────────┘
                  │
┌─────────────────▼───────────────────────────────────────────┐
│                     API Gateway Layer                        │
│  • Express.js Server                                         │
│  • Socket.IO WebSocket Server                                │
│  • Request Validation & Rate Limiting                        │
│  • Authentication & Authorization                            │
└─────────────────┬───────────────────────────────────────────┘
                  │
       ┌──────────┴──────────┐
       │                     │
┌──────▼─────────┐    ┌──────▼──────────┐
│  AI Layer      │    │  Cache Layer    │
│                │    │                 │
│  • Fireworks   │    │  • Redis        │
│  • Claude      │    │  • BullMQ       │
│  • Router      │    │  • Queue Mgmt   │
└──────┬─────────┘    └──────┬──────────┘
       │                     │
       └──────────┬──────────┘
                  │
┌─────────────────▼───────────────────────────────────────────┐
│                   Business Logic Layer                       │
│  • Token Analysis Engine                                     │
│  • Trading Strategy Manager                                  │
│  • Risk Assessment                                           │
│  • Portfolio Management                                      │
└─────────────────┬───────────────────────────────────────────┘
                  │
┌─────────────────▼───────────────────────────────────────────┐
│                 Blockchain Integration Layer                 │
│  • MCP Server (Model Context Protocol)                       │
│  • Solana Web3.js                                           │
│  • Transaction Builder                                       │
│  • Wallet Manager                                           │
└─────────────────┬───────────────────────────────────────────┘
                  │
       ┌──────────┴──────────┐
       │                     │
┌──────▼─────────┐    ┌──────▼──────────┐
│  Data Layer    │    │  External APIs  │
│                │    │                 │
│  • Moralis     │    │  • PumpPortal   │
│  • Helius RPC  │    │  • Birdeye      │
│  • Token Data  │    │  • Twitter      │
└────────────────┘    └─────────────────┘
```

---

## 🔧 Core Components

### 1. API Gateway Layer

#### Express.js Server
```typescript
// High-performance HTTP server
- RESTful API endpoints
- Middleware stack (CORS, body-parser, compression)
- Error handling and logging
- Health checks and metrics
```

#### Socket.IO WebSocket Server
```typescript
// Real-time bidirectional communication
- WebSocket connections (WS/WSS)
- Event-based messaging
- Room-based broadcasting
- Connection pooling
- Automatic reconnection
```

**Key Features:**
- Concurrent connection handling (1000+ users)
- Message queuing and buffering
- Heartbeat/ping-pong mechanism
- Session management

---

### 2. AI Layer

#### Multi-Provider Architecture

**Provider Routing Logic:**
```typescript
function routeRequest(query: string, requiresTools: boolean) {
  if (requiresTools || isComplex(query)) {
    return 'claude'; // High reliability for tool calling
  }
  return 'fireworks'; // Cost-effective for simple queries
}
```

**Fireworks AI (Primary)**
- Model: Llama 3.1 70B
- Use: 95%+ of requests
- Cost: $0.90 per million tokens
- Latency: ~800ms average

**Claude API (Fallback)**
- Model: Claude Sonnet 4.5
- Use: Critical tool operations
- Cost: $3 per million input tokens
- Latency: ~1200ms average

**Message Format Adapter:**
```typescript
class MessageFormatAdapter {
  // Convert Claude format to OpenAI format for Fireworks
  convertToOpenAI(messages: ClaudeMessage[]): OpenAIMessage[];
  
  // Convert OpenAI format back to Claude format
  convertToClaude(messages: OpenAIMessage[]): ClaudeMessage[];
}
```

---

### 3. Cache Layer

#### Redis Implementation

**Cache Strategy:**
```typescript
interface CacheConfig {
  ttl: {
    tokenInfo: 300,      // 5 minutes
    price: 60,           // 1 minute
    analytics: 180,      // 3 minutes
    snipers: 120         // 2 minutes
  },
  keyPrefix: 'AGENTLINK:',
  encoding: 'sha256'     // Hash-based keys
}
```

**Key Features:**
- SHA-256 hash keys for cache sharing
- Automatic expiration (TTL-based)
- Cache invalidation on errors
- LRU eviction policy
- Connection pooling

#### BullMQ Queue System

**Trading Queue:**
```typescript
const tradingQueue = new Queue('trading', {
  connection: redis,
  limiter: {
    max: 1,           // 1 job at a time
    duration: 5000    // 5 second cooldown
  }
});
```

**Benefits:**
- Prevents nonce conflicts
- Rate limiting enforcement
- Automatic retry with backoff
- Job prioritization
- Dead letter queue

---

### 4. MCP Server (Model Context Protocol)

#### Architecture

**MCP Server:**
```typescript
interface MCPServer {
  // Tool registry
  tools: Map<string, Tool>;
  
  // JSON-RPC handler
  handleRequest(request: JSONRPCRequest): Promise<JSONRPCResponse>;
  
  // Tool execution
  executeTool(name: string, params: any): Promise<any>;
}
```

**Available Tools:**
```typescript
const tools = {
  get_token_info: {
    description: "Get detailed token information",
    parameters: { address: "string" }
  },
  get_token_price: {
    description: "Get current token price",
    parameters: { address: "string" }
  },
  get_token_analytics: {
    description: "Get token analytics and metrics",
    parameters: { address: "string" }
  },
  get_pair_snipers: {
    description: "Detect sniper wallets",
    parameters: { pairAddress: "string" }
  },
  buy_token: {
    description: "Execute buy order",
    parameters: {
      tokenAddress: "string",
      amount: "number"
    }
  },
  sell_token: {
    description: "Execute sell order",
    parameters: {
      tokenAddress: "string",
      amount: "number"
    }
  }
};
```

**Tool Execution Flow:**
```
1. AI generates tool call
2. Extract parameters
3. Validate and convert types
4. Send JSON-RPC request to MCP
5. MCP executes blockchain operation
6. Unwrap MCP response
7. Return result to AI
```

---

### 5. Blockchain Integration

#### Solana Web3.js Integration

**Connection Management:**
```typescript
class SolanaConnection {
  private rpc: Connection;
  private wallet: Keypair;
  
  async getTokenInfo(address: string): Promise<TokenInfo>;
  async executeTransaction(tx: Transaction): Promise<string>;
  async confirmTransaction(signature: string): Promise<boolean>;
}
```

**Transaction Builder:**
```typescript
class TransactionBuilder {
  buildBuyTransaction(params: BuyParams): Transaction;
  buildSellTransaction(params: SellParams): Transaction;
  addPriorityFee(tx: Transaction): Transaction;
  simulateTransaction(tx: Transaction): Promise<Simulation>;
}
```

#### Moralis Integration

**Data Retrieval:**
```typescript
interface MoralisClient {
  getTokenMetadata(address: string): Promise<TokenMetadata>;
  getTokenPrice(address: string): Promise<PriceData>;
  getWalletHoldings(wallet: string): Promise<Holdings[]>;
  getTokenHolders(address: string): Promise<Holder[]>;
}
```

#### PumpPortal Integration

**Trading Execution:**
```typescript
interface PumpPortalClient {
  executeBuy(params: BuyParams): Promise<TxSignature>;
  executeSell(params: SellParams): Promise<TxSignature>;
  getPoolInfo(address: string): Promise<PoolInfo>;
}
```

---

## 🔄 Data Flow

### User Query Flow

```
1. User → WebSocket → Server
   └─ Validate request
   └─ Check rate limits
   └─ Add to processing queue

2. Server → Cache Check
   └─ Generate cache key (SHA-256)
   └─ Check Redis for cached result
   └─ Return if found (cache hit)

3. Server → AI Router (if cache miss)
   └─ Analyze query complexity
   └─ Route to Fireworks (simple) or Claude (complex)
   └─ Stream response chunks to client

4. AI → Tool Execution (if needed)
   └─ Parse tool calls from AI response
   └─ Validate parameters
   └─ Send to MCP Server

5. MCP → Blockchain
   └─ Execute blockchain operation
   └─ Handle transaction confirmation
   └─ Return result

6. Result → Cache
   └─ Store in Redis with TTL
   └─ Make available for future queries

7. Result → User
   └─ Stream final response
   └─ Close connection
   └─ Log metrics
```

### Trading Flow

```
1. User requests trade
   └─ Validate token address
   └─ Check balance
   └─ Verify rate limits

2. Add to trading queue
   └─ BullMQ job created
   └─ Priority: FIFO
   └─ Rate limit: 1 per 5 seconds

3. Execute trade
   └─ Build transaction
   └─ Add priority fee
   └─ Simulate transaction
   └─ Send to PumpPortal

4. Confirm transaction
   └─ Wait for blockchain confirmation
   └─ Update portfolio
   └─ Cache invalidation
   └─ Notify user

5. Handle failures
   └─ Automatic retry (3 attempts)
   └─ Exponential backoff
   └─ User notification
   └─ Dead letter queue
```

---

## 📊 Performance Characteristics

### Latency Targets

| Operation | Target | Actual | Notes |
|-----------|--------|--------|-------|
| Simple query | <1s | 800ms | Fireworks + cache |
| Complex query | <2s | 1.2s | Claude + tools |
| Cache hit | <100ms | 60ms | Redis lookup |
| Trade execution | <5s | 3.5s | Including confirmation |
| WebSocket RTT | <50ms | 30ms | Ping-pong |

### Throughput

- **Concurrent Users**: 100-200 during launches
- **Requests/Minute**: 400+ sustained
- **Cache Hit Rate**: ~85%
- **AI Provider Split**: 97% Fireworks, 3% Claude
- **Uptime**: 99.9% target

### Cost Efficiency

**Monthly Costs (100K requests):**
- Claude Only: ~$4,000
- Hybrid (Current): ~$300
- **Savings: 92.5%**

---

## 🔐 Security Architecture

### Authentication & Authorization

```typescript
interface SecurityLayer {
  // API key validation
  validateApiKey(key: string): boolean;
  
  // Rate limiting
  checkRateLimit(userId: string): boolean;
  
  // Wallet verification
  verifyWallet(signature: string): boolean;
}
```

### Secrets Management

**Environment Variables:**
- API keys never hardcoded
- Separate dev/prod configurations
- Rotation support for high availability
- Encrypted at rest

**Wallet Security:**
- Private keys in secure environment variables
- Never logged or exposed
- Hardware wallet support planned
- Multi-sig for large operations

---

## 🚀 Scaling Strategy

### Horizontal Scaling

```
Load Balancer
    │
    ├── Server Instance 1 ─┐
    ├── Server Instance 2 ─┼── Shared Redis
    └── Server Instance N ─┘
```

### Vertical Scaling

**Current Resources:**
- CPU: 4 cores
- RAM: 8GB
- Redis: 2GB
- Bandwidth: Unlimited

**Scaling Triggers:**
- CPU > 70% sustained
- Memory > 85%
- Response time > 2s
- Error rate > 1%

### Future Enhancements

- [ ] Kubernetes deployment
- [ ] Auto-scaling groups
- [ ] Multi-region deployment
- [ ] CDN for static assets
- [ ] Database replication

---

## 📈 Monitoring & Observability

### Metrics Collection

```typescript
interface Metrics {
  requests: Counter;
  latency: Histogram;
  errors: Counter;
  activeConnections: Gauge;
  cacheHitRate: Gauge;
  aiCosts: Counter;
}
```

### Health Checks

```typescript
GET /health
{
  status: "healthy",
  uptime: 123456,
  connections: 45,
  redis: "connected",
  blockchain: "connected",
  ai: {
    fireworks: "healthy",
    claude: "healthy"
  }
}
```

### Logging Strategy

**Log Levels:**
- ERROR: System failures
- WARN: Recoverable issues
- INFO: Important events
- DEBUG: Detailed traces

**Log Points:**
1. Message reception
2. History processing
3. AI API calls
4. Client response emission
5. Error conditions

---

## 🔮 Future Architecture

### Planned Improvements

**Q1 2026:**
- Microservices separation
- Event-driven architecture
- GraphQL API
- Real-time analytics pipeline

**Q2 2026:**
- Machine learning pipeline
- Advanced caching strategies
- Global CDN deployment
- Multi-chain abstraction layer

---

## 📚 Technology Stack Summary

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Backend** | Node.js + Express | HTTP server |
| **WebSocket** | Socket.IO | Real-time comms |
| **AI** | Claude + Fireworks | Intelligence |
| **Cache** | Redis + BullMQ | Performance |
| **Blockchain** | Solana Web3.js | Chain interaction |
| **Protocol** | MCP | Tool integration |
| **APIs** | Moralis, PumpPortal | Data + Trading |
| **Language** | TypeScript | Type safety |
| **Deployment** | Railway | Hosting |

---

For more detailed documentation, see:
- [API Reference](./api/)
- [MCP Tools](./mcp-tools.md)
- [Deployment Guide](./guides/deployment.md)
- [Performance Tuning](./guides/performance.md)
