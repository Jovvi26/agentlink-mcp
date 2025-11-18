# ⚡ AGENTLINK Quick Start Guide

Get AGENTLINK up and running in 5 minutes!

## 📋 Prerequisites

Before you begin, ensure you have:

- ✅ Node.js 18+ installed ([Download](https://nodejs.org/))
- ✅ Redis 7+ running ([Install Guide](https://redis.io/docs/getting-started/))
- ✅ Git installed
- ✅ A code editor (VSCode recommended)

## 🚀 5-Minute Setup

### Step 1: Clone the Repository (30 seconds)

```bash
git clone https://github.com/AGENTLINK/AGENTLINK.git
cd AGENTLINK
```

### Step 2: Install Dependencies (2 minutes)

```bash
npm install
```

### Step 3: Configure Environment (1 minute)

```bash
# Copy the example environment file
cp .env.example .env

# Open .env in your editor and add your keys:
# - ANTHROPIC_API_KEY_1=sk-ant-...
# - FIREWORKS_API_KEY=fw_...
# - HELIUS_RPC_URL=https://...
# - MORALIS_API_KEY=...
# - WALLET_PRIVATE_KEY=...
```

**Minimum Required Keys:**
```env
ANTHROPIC_API_KEY_1=your_claude_key
FIREWORKS_API_KEY=your_fireworks_key
HELIUS_RPC_URL=your_helius_endpoint
```

### Step 4: Start Redis (30 seconds)

```bash
# In a new terminal
redis-server

# Or if using Docker:
docker run -d -p 6379:6379 redis:7-alpine
```

### Step 5: Build and Run (1 minute)

```bash
# Build the project
npm run build

# Start the server
npm start

# OR for development with hot reload:
npm run dev
```

## ✅ Verify Installation

Open your browser to:
```
http://localhost:3000/health
```

You should see:
```json
{
  "status": "healthy",
  "uptime": 123,
  "redis": "connected",
  "ai": {
    "fireworks": "healthy",
    "claude": "healthy"
  }
}
```

## 🎯 Your First Query

### Using WebSocket (Recommended)

```html
<!DOCTYPE html>
<html>
<body>
  <script src="/socket.io/socket.io.js"></script>
  <script>
    const socket = io('http://localhost:3000');
    
    socket.emit('message', {
      message: 'Analyze token address: <YOUR_TOKEN_ADDRESS>'
    });
    
    socket.on('response', (data) => {
      console.log('AI Response:', data);
    });
  </script>
</body>
</html>
```

### Using REST API

```bash
curl -X POST http://localhost:3000/api/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "tokenAddress": "YOUR_TOKEN_ADDRESS"
  }'
```

## 📱 Test Commands

Once connected via WebSocket, try these:

```
1. Get token info:
   "What is the price of [TOKEN_ADDRESS]?"

2. Analyze snipers:
   "Show me sniper wallets for pair [PAIR_ADDRESS]"

3. Check analytics:
   "Analyze token [TOKEN_ADDRESS]"

4. Execute trade (careful!):
   "Buy 0.01 SOL of token [TOKEN_ADDRESS]"
```

## 🔧 Common Issues

### ❌ Redis Connection Failed
```bash
# Check if Redis is running
redis-cli ping
# Should return: PONG

# If not running:
redis-server
```

### ❌ Port 3000 Already in Use
```bash
# Change port in .env
PORT=3001

# Or kill existing process
lsof -ti:3000 | xargs kill
```

### ❌ API Keys Not Working
```bash
# Verify your .env file
cat .env | grep API_KEY

# Ensure no extra spaces
# ✅ ANTHROPIC_API_KEY=sk-ant-...
# ❌ ANTHROPIC_API_KEY = sk-ant-...
```

### ❌ TypeScript Errors
```bash
# Clean and rebuild
npm run clean
npm install
npm run build
```

## 🎓 Next Steps

### 1. Read the Documentation
- [Architecture Overview](docs/ARCHITECTURE.md)
- [API Reference](docs/api/)
- [WebSocket Events](docs/api/websocket.md)

### 2. Explore Features
- Token analysis
- Sniper detection
- Automated trading
- Real-time updates

### 3. Configure Advanced Settings
```env
# In .env

# Cache TTL (seconds)
REDIS_CACHE_TTL=300

# Trading limits
MAX_TRADE_AMOUNT_SOL=1.0
TRADE_COOLDOWN_MS=5000

# AI provider preferences
AI_PRIMARY_PROVIDER=fireworks
AI_FALLBACK_PROVIDER=claude
```

### 4. Set Up Development Environment

**VSCode Extensions:**
```json
{
  "recommendations": [
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "ms-vscode.vscode-typescript-next"
  ]
}
```

**Enable Hot Reload:**
```bash
npm run dev
```

**Run Tests:**
```bash
npm test
npm run test:watch
```

## 🔐 Production Checklist

Before deploying to production:

- [ ] Change all default API keys
- [ ] Enable HTTPS/WSS
- [ ] Configure CORS properly
- [ ] Set up monitoring
- [ ] Enable rate limiting
- [ ] Review security settings
- [ ] Set up backups
- [ ] Configure logging
- [ ] Test disaster recovery
- [ ] Review `.env.example` vs `.env`

## 📚 Learning Resources

### Essential Reading
1. [README.md](README.md) - Overview and features
2. [ARCHITECTURE.md](docs/ARCHITECTURE.md) - System design
3. [API Documentation](docs/api/) - Endpoints and events
4. [Contributing Guide](CONTRIBUTING.md) - How to contribute

### Video Tutorials (Coming Soon)
- [ ] Installation and setup
- [ ] Your first trade
- [ ] Building custom strategies
- [ ] Deploying to production

## 💬 Get Help

### Community
- **Discord**: [Join here](https://discord.gg/AGENTLINK)
- **Twitter**: [@AGENTLINKAI](https://twitter.com/AGENTLINKai)
- **GitHub Discussions**: [Ask questions](https://github.com/AGENTLINK/AGENTLINK/discussions)

### Support
- **Documentation**: [docs.AGENTLINK.io](https://docs.AGENTLINK.io)
- **Email**: support@AGENTLINK.io
- **Issues**: [GitHub Issues](https://github.com/AGENTLINK/AGENTLINK/issues)

## 🎉 Success!

You're now ready to start trading with AGENTLINK! 

**Happy Trading! 🚀**

---

## 🔗 Quick Links

- [Full Documentation](README.md)
- [API Reference](docs/api/)
- [Troubleshooting](docs/guides/troubleshooting.md)
- [Security Policy](SECURITY.md)
- [Contributing](CONTRIBUTING.md)

---

**Need help?** Join our [Discord](https://discord.gg/AGENTLINK) or open an [issue](https://github.com/AGENTLINK/AGENTLINK/issues).
