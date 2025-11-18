# 📁 Repository Structure

This document provides a comprehensive overview of the AGENTLINK repository structure.

## 🌳 Directory Tree

```
AGENTLINK/
│
├── 📄 README.md                    # Main project documentation
├── 📄 LICENSE                      # MIT License
├── 📄 CHANGELOG.md                 # Version history
├── 📄 CONTRIBUTING.md              # Contribution guidelines
├── 📄 CODE_OF_CONDUCT.md          # Community guidelines
├── 📄 SECURITY.md                  # Security policies
├── 📄 .gitignore                   # Git ignore rules
├── 📄 .env.example                 # Environment template
├── 📄 package.json                 # Node.js configuration
├── 📄 tsconfig.json                # TypeScript configuration
├── 📄 jest.config.js               # Jest testing configuration
├── 📄 Dockerfile                   # Docker configuration
├── 📄 docker-compose.yml           # Docker Compose setup
├── 📄 .nvmrc                       # Node version
├── 📄 .prettierrc                  # Prettier configuration
├── 📄 .eslintrc.json              # ESLint configuration
│
├── 📂 .github/                     # GitHub specific files
│   ├── 📂 workflows/               # GitHub Actions
│   │   ├── ci-cd.yml              # CI/CD pipeline
│   │   └── security.yml           # Security scans
│   ├── 📂 ISSUE_TEMPLATE/         # Issue templates
│   │   ├── bug_report.md          # Bug report template
│   │   ├── feature_request.md     # Feature request template
│   │   └── question.md            # Question template
│   ├── PULL_REQUEST_TEMPLATE.md   # PR template
│   ├── CODEOWNERS                 # Code ownership
│   └── dependabot.yml             # Dependency updates
│
├── 📂 src/                         # Source code
│   │
│   ├── 📂 server/                  # Express server
│   │   ├── index.ts               # Entry point
│   │   ├── app.ts                 # Express app
│   │   ├── routes.ts              # API routes
│   │   ├── middleware.ts          # Express middleware
│   │   └── websocket.ts           # WebSocket server
│   │
│   ├── 📂 ai/                      # AI provider layer
│   │   ├── router.ts              # AI provider routing
│   │   ├── claude.ts              # Claude API client
│   │   ├── fireworks.ts           # Fireworks API client
│   │   ├── adapter.ts             # Message format adapter
│   │   └── streaming.ts           # Streaming response handler
│   │
│   ├── 📂 blockchain/              # Blockchain integration
│   │   ├── connection.ts          # Solana connection
│   │   ├── transaction.ts         # Transaction builder
│   │   ├── wallet.ts              # Wallet management
│   │   ├── moralis.ts             # Moralis API client
│   │   └── pumpportal.ts          # PumpPortal API client
│   │
│   ├── 📂 mcp/                     # MCP server
│   │   ├── server.ts              # MCP server implementation
│   │   ├── tools.ts               # Tool definitions
│   │   ├── handlers.ts            # Tool handlers
│   │   └── types.ts               # MCP types
│   │
│   ├── 📂 cache/                   # Caching layer
│   │   ├── redis.ts               # Redis client
│   │   ├── queue.ts               # BullMQ queue
│   │   ├── strategies.ts          # Cache strategies
│   │   └── keys.ts                # Cache key generation
│   │
│   ├── 📂 utils/                   # Utility functions
│   │   ├── logger.ts              # Winston logger
│   │   ├── validators.ts          # Input validation
│   │   ├── errors.ts              # Error classes
│   │   ├── config.ts              # Configuration loader
│   │   └── helpers.ts             # General helpers
│   │
│   └── 📂 types/                   # TypeScript types
│       ├── api.ts                 # API types
│       ├── blockchain.ts          # Blockchain types
│       ├── ai.ts                  # AI provider types
│       └── common.ts              # Common types
│
├── 📂 tests/                       # Test files
│   ├── 📂 unit/                    # Unit tests
│   │   ├── ai.test.ts
│   │   ├── blockchain.test.ts
│   │   └── cache.test.ts
│   ├── 📂 integration/             # Integration tests
│   │   ├── api.test.ts
│   │   └── websocket.test.ts
│   ├── 📂 e2e/                     # End-to-end tests
│   │   └── trading.test.ts
│   ├── 📂 mocks/                   # Test mocks
│   │   └── responses.ts
│   └── setup.ts                    # Test setup
│
├── 📂 docs/                        # Documentation
│   │
│   ├── 📄 ARCHITECTURE.md          # System architecture
│   ├── 📄 DEPLOYMENT.md            # Deployment guide
│   ├── 📄 FAQ.md                   # Frequently asked questions
│   │
│   ├── 📂 api/                     # API documentation
│   │   ├── rest.md                # REST API reference
│   │   ├── websocket.md           # WebSocket events
│   │   └── mcp-tools.md           # MCP tools reference
│   │
│   ├── 📂 guides/                  # User guides
│   │   ├── getting-started.md     # Getting started guide
│   │   ├── deployment.md          # How to deploy
│   │   ├── security.md            # Security best practices
│   │   ├── performance.md         # Performance tuning
│   │   └── troubleshooting.md     # Common issues
│   │
│   └── 📂 tutorials/               # Step-by-step tutorials
│       ├── first-trade.md         # Your first trade
│       ├── sniper-detection.md    # Using sniper detection
│       └── custom-strategies.md   # Building strategies
│
├── 📂 scripts/                     # Build and utility scripts
│   ├── build.sh                   # Build script
│   ├── deploy.sh                  # Deployment script
│   ├── setup-redis.sh             # Redis setup
│   ├── migrate.ts                 # Database migrations
│   └── seed.ts                    # Test data seeding
│
├── 📂 mcp-server/                  # MCP server (separate package)
│   ├── package.json
│   ├── tsconfig.json
│   ├── src/
│   │   └── index.ts
│   └── README.md
│
├── 📂 frontend/                    # Frontend (if separate)
│   ├── public/
│   ├── src/
│   ├── package.json
│   └── README.md
│
└── 📂 examples/                    # Usage examples
    ├── basic-usage.ts
    ├── advanced-trading.ts
    └── custom-ai-provider.ts
```

---

## 📋 File Descriptions

### Root Level Files

#### 📄 README.md
Main project documentation with overview, features, installation, and quick start.

#### 📄 LICENSE
MIT License with additional terms for financial software.

#### 📄 CHANGELOG.md
Version history following Keep a Changelog format.

#### 📄 CONTRIBUTING.md
Guidelines for contributing, code style, and PR process.

#### 📄 CODE_OF_CONDUCT.md
Community standards and behavior guidelines.

#### 📄 SECURITY.md
Security policy, vulnerability reporting, and best practices.

#### 📄 .env.example
Environment variable template with all required configurations.

#### 📄 package.json
Node.js project configuration, dependencies, and scripts.

#### 📄 tsconfig.json
TypeScript compiler configuration.

---

### Source Code (`src/`)

#### 📂 server/
Express.js server implementation with WebSocket support.

**Key Files:**
- `index.ts` - Application entry point
- `app.ts` - Express app configuration
- `routes.ts` - API route definitions
- `websocket.ts` - Socket.IO server

#### 📂 ai/
Multi-provider AI architecture.

**Key Files:**
- `router.ts` - Routes requests to appropriate AI provider
- `claude.ts` - Anthropic Claude API integration
- `fireworks.ts` - Fireworks AI API integration
- `adapter.ts` - Message format conversion
- `streaming.ts` - Streaming response handler

#### 📂 blockchain/
Solana blockchain integration.

**Key Files:**
- `connection.ts` - Solana RPC connection management
- `transaction.ts` - Transaction building and signing
- `wallet.ts` - Wallet operations
- `moralis.ts` - Moralis API for token data
- `pumpportal.ts` - PumpPortal trading API

#### 📂 mcp/
Model Context Protocol server for blockchain tools.

**Key Files:**
- `server.ts` - MCP server implementation
- `tools.ts` - Available tool definitions
- `handlers.ts` - Tool execution handlers
- `types.ts` - TypeScript types for MCP

#### 📂 cache/
Redis caching and queue management.

**Key Files:**
- `redis.ts` - Redis client configuration
- `queue.ts` - BullMQ job queue
- `strategies.ts` - Cache invalidation strategies
- `keys.ts` - Cache key generation (SHA-256)

#### 📂 utils/
Shared utilities and helpers.

**Key Files:**
- `logger.ts` - Winston logging configuration
- `validators.ts` - Input validation with Joi
- `errors.ts` - Custom error classes
- `config.ts` - Environment configuration
- `helpers.ts` - General utility functions

#### 📂 types/
TypeScript type definitions.

**Key Files:**
- `api.ts` - API request/response types
- `blockchain.ts` - Blockchain data types
- `ai.ts` - AI provider types
- `common.ts` - Shared types

---

### Tests (`tests/`)

#### 📂 unit/
Unit tests for individual modules.

#### 📂 integration/
Integration tests for system components.

#### 📂 e2e/
End-to-end tests simulating real usage.

#### 📂 mocks/
Mock data and responses for testing.

---

### Documentation (`docs/`)

#### 📄 ARCHITECTURE.md
Detailed system architecture documentation.

#### 📂 api/
API reference documentation for all endpoints and events.

#### 📂 guides/
Step-by-step guides for common tasks.

#### 📂 tutorials/
In-depth tutorials for specific features.

---

### Scripts (`scripts/`)

Automation and utility scripts for build, deployment, and maintenance.

---

### GitHub Configuration (`.github/`)

#### 📂 workflows/
GitHub Actions for CI/CD, testing, and deployment.

#### 📂 ISSUE_TEMPLATE/
Templates for bug reports, feature requests, and questions.

#### 📄 PULL_REQUEST_TEMPLATE.md
Template for pull requests.

---

## 🔑 Key Patterns

### Module Organization

Each module follows this pattern:
```
module/
├── index.ts          # Public API
├── [module].ts       # Core implementation
├── types.ts          # Type definitions
├── utils.ts          # Module-specific utils
└── __tests__/        # Tests
    └── [module].test.ts
```

### File Naming Conventions

- **PascalCase**: Classes and components (`TransactionBuilder.ts`)
- **camelCase**: Functions and utilities (`formatPrice.ts`)
- **kebab-case**: Documentation files (`api-reference.md`)
- **SCREAMING_SNAKE_CASE**: Constants files (`CONFIG_CONSTANTS.ts`)

### Import Structure

```typescript
// 1. External dependencies
import express from 'express';
import { Connection } from '@solana/web3.js';

// 2. Internal modules
import { AIRouter } from '@/ai/router';
import { RedisCache } from '@/cache/redis';

// 3. Types
import type { TokenInfo, TradeParams } from '@/types';

// 4. Constants
import { DEFAULT_SLIPPAGE } from '@/constants';
```

---

## 🚀 Getting Started

### 1. Clone Repository
```bash
git clone https://github.com/AGENTLINK/AGENTLINK.git
cd AGENTLINK
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment
```bash
cp .env.example .env
# Edit .env with your configuration
```

### 4. Build Project
```bash
npm run build
```

### 5. Run Tests
```bash
npm test
```

### 6. Start Development Server
```bash
npm run dev
```

---

## 📦 Adding New Features

### 1. Create Feature Branch
```bash
git checkout -b feature/your-feature-name
```

### 2. Add Implementation
- Create files in appropriate `src/` directory
- Add types to `src/types/`
- Write tests in `tests/`

### 3. Update Documentation
- Add to relevant `docs/` files
- Update `CHANGELOG.md`
- Add examples if needed

### 4. Submit PR
Follow the PR template and guidelines in `CONTRIBUTING.md`.

---

## 🔍 Navigation Tips

### Finding Code

**AI Logic**: `src/ai/`
**Blockchain Operations**: `src/blockchain/`
**API Endpoints**: `src/server/routes.ts`
**WebSocket Events**: `src/server/websocket.ts`
**Caching**: `src/cache/`
**Types**: `src/types/`

### Finding Documentation

**API Reference**: `docs/api/`
**Guides**: `docs/guides/`
**Architecture**: `docs/ARCHITECTURE.md`
**FAQ**: `docs/FAQ.md`

### Finding Examples

**Basic Usage**: `examples/basic-usage.ts`
**Trading**: `examples/advanced-trading.ts`
**Custom Providers**: `examples/custom-ai-provider.ts`

---

## 📚 Additional Resources

- [Contributing Guide](CONTRIBUTING.md)
- [Architecture Overview](docs/ARCHITECTURE.md)
- [API Documentation](docs/api/)
- [Security Policy](SECURITY.md)
- [Changelog](CHANGELOG.md)

---

**Last Updated**: October 2025
