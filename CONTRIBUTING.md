# Contributing to AGENTLINK

First off, thank you for considering contributing to AGENTLINK! It's people like you that make AGENTLINK such a great tool for the Solana trading community.

## 🌟 Ways to Contribute

- **Bug Reports**: Help us identify and fix issues
- **Feature Requests**: Suggest new features or improvements
- **Code Contributions**: Submit pull requests
- **Documentation**: Improve our docs and guides
- **Community Support**: Help other users in Discord

## 🚀 Getting Started

### 1. Fork and Clone

```bash
# Fork the repository on GitHub
# Clone your fork
git clone https://github.com/YOUR_USERNAME/AGENTLINK.git
cd AGENTLINK

# Add upstream remote
git remote add upstream https://github.com/AGENTLINK/AGENTLINK.git
```

### 2. Set Up Development Environment

```bash
# Install dependencies
npm install

# Copy environment template
cp .env.example .env.development

# Start Redis (required)
redis-server

# Run in development mode
npm run dev
```

### 3. Create a Branch

```bash
# Update your fork
git checkout main
git pull upstream main

# Create a feature branch
git checkout -b feature/your-feature-name
# or
git checkout -b fix/your-bug-fix
```

## 📝 Development Guidelines

### Code Style

We use ESLint and Prettier for code formatting:

```bash
# Check linting
npm run lint

# Fix linting issues
npm run lint:fix

# Format code
npm run format
```

### Commit Messages

Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
feat: add new token analysis metric
fix: resolve WebSocket connection timeout
docs: update API documentation
refactor: improve caching logic
test: add unit tests for trading module
chore: update dependencies
```

### TypeScript Guidelines

- Use strict type checking
- Avoid `any` types
- Document complex types with comments
- Export types for public APIs

```typescript
// ✅ Good
interface TokenAnalysis {
  address: string;
  price: number;
  volume24h: number;
  holders: number;
}

async function analyzeToken(address: string): Promise<TokenAnalysis> {
  // implementation
}

// ❌ Bad
async function analyzeToken(address: any): Promise<any> {
  // implementation
}
```

### Testing

- Write tests for new features
- Maintain or improve code coverage
- Run tests before submitting PR

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

## 🔧 Pull Request Process

### 1. Before Submitting

- [ ] Code follows style guidelines
- [ ] Tests pass locally
- [ ] New tests added for new features
- [ ] Documentation updated
- [ ] No console.log or debugging code
- [ ] Commit messages follow conventions

### 2. Submit PR

1. Push your branch to your fork
2. Open a Pull Request against `main`
3. Fill out the PR template completely
4. Link related issues

### 3. PR Review

- Maintainers will review within 48 hours
- Address feedback promptly
- Keep PR focused and small when possible
- Be patient and respectful

### 4. After Approval

- Squash commits if requested
- Rebase on latest main if needed
- PR will be merged by maintainers

## 🐛 Bug Reports

### Before Reporting

- Search existing issues
- Test on latest version
- Verify it's reproducible

### Report Template

```markdown
**Description**
Clear description of the bug

**To Reproduce**
1. Step 1
2. Step 2
3. See error

**Expected Behavior**
What should happen

**Environment**
- Node version:
- OS:
- AGENTLINK version:

**Logs**
```
paste relevant logs
```

**Additional Context**
Screenshots, related issues, etc.
```

## 💡 Feature Requests

### Before Requesting

- Check if already requested
- Consider if it fits project scope
- Think about implementation

### Request Template

```markdown
**Problem Statement**
What problem does this solve?

**Proposed Solution**
How should it work?

**Alternatives Considered**
Other approaches you've thought about

**Additional Context**
Examples, mockups, references
```

## 📚 Documentation

### What to Document

- New features and APIs
- Configuration options
- Examples and use cases
- Troubleshooting guides

### Documentation Style

- Clear and concise
- Include code examples
- Add screenshots for UI changes
- Update relevant docs in `/docs`

## 🔒 Security

**Do not** open public issues for security vulnerabilities.

Email security@AGENTLINK.io with:
- Description of vulnerability
- Steps to reproduce
- Potential impact
- Suggested fix (if any)

## 🏗️ Project Structure

```
AGENTLINK/
├── src/
│   ├── server/          # Express server
│   ├── ai/              # AI providers
│   ├── blockchain/      # Blockchain integrations
│   ├── mcp/             # MCP server
│   ├── cache/           # Redis caching
│   ├── utils/           # Utilities
│   └── types/           # TypeScript types
├── docs/                # Documentation
├── tests/               # Test files
└── scripts/             # Build/deploy scripts
```

## 🎯 Priority Areas

We especially welcome contributions in:

1. **Performance Optimization**
   - Caching improvements
   - Query optimization
   - Load testing

2. **Testing**
   - Unit tests
   - Integration tests
   - E2E tests

3. **Documentation**
   - API examples
   - Deployment guides
   - Video tutorials

4. **Features**
   - See [Issues](https://github.com/AGENTLINK/AGENTLINK/issues) with `good first issue` label

## 💬 Communication

- **Discord**: Daily discussions and support
- **GitHub Issues**: Bug reports and features
- **GitHub Discussions**: General questions
- **Email**: For sensitive matters

## 📜 Code of Conduct

### Our Pledge

We are committed to providing a welcoming and inclusive environment for everyone.

### Our Standards

**Positive behavior:**
- Using welcoming language
- Being respectful of differing viewpoints
- Accepting constructive criticism
- Focusing on what's best for the community

**Unacceptable behavior:**
- Harassment or discriminatory language
- Trolling or insulting comments
- Public or private harassment
- Publishing others' private information
- Other unprofessional conduct

### Enforcement

Violations may be reported to conduct@AGENTLINK.io. All reports will be reviewed and investigated.

## 🏆 Recognition

Contributors are recognized in:
- README.md acknowledgments
- Release notes
- Contributor leaderboard (coming soon)

## ❓ Questions?

- Check our [FAQ](docs/FAQ.md)
- Ask in [Discord](https://discord.gg/AGENTLINK)
- Open a [Discussion](https://github.com/AGENTLINK/AGENTLINK/discussions)

---

**Thank you for contributing to AGENTLINK!** 🚀

Your contributions help make decentralized trading accessible to everyone.
