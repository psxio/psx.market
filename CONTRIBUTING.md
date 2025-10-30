# Contributing to port444

First off, thank you for considering contributing to port444! It's people like you that make port444 such a great platform for the Web3 community.

## Code of Conduct

By participating in this project, you agree to abide by our [Code of Conduct](./CODE_OF_CONDUCT.md). Please read it before contributing.

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check the issue list as you might find out that you don't need to create one. When you are creating a bug report, please include as many details as possible:

- **Use a clear and descriptive title**
- **Describe the exact steps to reproduce the problem**
- **Provide specific examples** to demonstrate the steps
- **Describe the behavior you observed** and what you expected
- **Include screenshots or GIFs** if applicable
- **Include your environment details** (OS, browser, Node version, etc.)

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, please include:

- **Use a clear and descriptive title**
- **Provide a detailed description** of the suggested enhancement
- **Explain why this enhancement would be useful**
- **List any similar features** in other platforms
- **Include mockups or examples** if applicable

### Pull Requests

1. **Fork the repo** and create your branch from `main`
2. **Make your changes** following our coding standards
3. **Test your changes** thoroughly
4. **Update documentation** if needed
5. **Write meaningful commit messages**
6. **Submit a pull request**

## Development Workflow

### Setup Development Environment

1. Clone your fork:
```bash
git clone https://github.com/your-username/port444.git
cd port444
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file with required variables (see README.md)

4. Push database schema:
```bash
npm run db:push
```

5. Start development server:
```bash
npm run dev
```

### Branch Naming Convention

- `feature/` - New features (e.g., `feature/ai-matching`)
- `fix/` - Bug fixes (e.g., `fix/escrow-payment`)
- `docs/` - Documentation updates (e.g., `docs/api-guide`)
- `refactor/` - Code refactoring (e.g., `refactor/storage-layer`)
- `test/` - Test additions/updates (e.g., `test/builder-auth`)

### Coding Standards

#### TypeScript

- Use TypeScript for all new code
- Enable strict mode
- Define proper types and interfaces
- Avoid `any` - use `unknown` if type is truly unknown
- Use Zod schemas for runtime validation

```typescript
// Good
interface BuilderProfile {
  id: string;
  name: string;
  skills: string[];
}

// Bad
const builder: any = {...}
```

#### React Components

- Use functional components with hooks
- Follow single responsibility principle
- Use descriptive component names
- Add `data-testid` attributes for testing
- Keep components under 300 lines

```tsx
// Good
export function BuilderCard({ builder }: { builder: Builder }) {
  return (
    <Card data-testid={`card-builder-${builder.id}`}>
      {/* component content */}
    </Card>
  );
}
```

#### API Routes

- Follow RESTful conventions
- Use proper HTTP methods (GET, POST, PUT, DELETE)
- Validate inputs with Zod
- Return consistent error responses
- Add rate limiting to sensitive endpoints

```typescript
// Good
app.post('/api/builders/:builderId/services', 
  requireBuilderAuth,
  async (req, res) => {
    const validation = insertServiceSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ error: validation.error });
    }
    // handle request
  }
);
```

#### Database Operations

- Use Drizzle ORM for all database operations
- Define schemas in `shared/schema.ts`
- Use transactions for multi-step operations
- Never use raw SQL except for complex queries
- Add proper indexes for performance

```typescript
// Good
await db.insert(builders).values({
  id: nanoid(),
  name: 'Alice',
  walletAddress: '0x...'
});
```

#### Styling

- Use Tailwind CSS utility classes
- Follow design guidelines in `design_guidelines.md`
- Use Shadcn UI components
- Maintain consistent spacing and colors
- Ensure mobile responsiveness

```tsx
// Good
<Button 
  size="lg" 
  className="gap-2 hover-elevate"
  data-testid="button-submit"
>
  Submit
  <ArrowRight className="h-4 w-4" />
</Button>
```

### Testing

- Test your changes locally before submitting
- Verify all existing features still work
- Check responsive design on mobile
- Test wallet connection flows
- Verify API endpoints with proper auth

### Commit Messages

Follow conventional commits format:

```
type(scope): subject

body (optional)

footer (optional)
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting)
- `refactor`: Code refactoring
- `test`: Test updates
- `chore`: Build/tooling changes

**Examples:**
```
feat(builders): add invite code generation system

- Each builder gets 5 invite codes
- Codes are 8 characters long
- Add revoke functionality

Closes #123
```

```
fix(escrow): resolve milestone release bug

Fix issue where milestones couldn't be released
when client had insufficient balance

Fixes #456
```

## Project Structure

```
port444/
├── client/src/
│   ├── components/     # Reusable UI components
│   ├── pages/          # Page components (one per route)
│   ├── lib/            # Utility functions
│   └── hooks/          # Custom React hooks
├── server/
│   ├── routes.ts       # API route definitions
│   ├── storage.ts      # Database operations
│   ├── services/       # Business logic services
│   └── middleware/     # Express middleware
├── shared/
│   └── schema.ts       # Shared DB schema & types
└── contracts/          # Smart contracts
```

## Key Design Principles

1. **User Experience First** - Every feature should enhance UX
2. **Type Safety** - Use TypeScript strictly
3. **Security** - Validate all inputs, protect all endpoints
4. **Performance** - Optimize for speed and efficiency
5. **Accessibility** - Follow WCAG guidelines
6. **Mobile-First** - Design for mobile, enhance for desktop

## Feature Development Checklist

Before submitting a PR for a new feature:

- [ ] Code follows project coding standards
- [ ] TypeScript types are properly defined
- [ ] Database schema is updated if needed
- [ ] API endpoints have proper authentication
- [ ] Input validation with Zod schemas
- [ ] Error handling implemented
- [ ] UI is responsive and accessible
- [ ] `data-testid` attributes added
- [ ] Documentation updated
- [ ] Manual testing completed
- [ ] No console errors or warnings

## Documentation

When adding new features, update:

- `README.md` - If it affects setup or usage
- `replit.md` - Add to recent changes section
- `TAXONOMY.md` - If it affects data model
- API documentation - For new endpoints
- Code comments - For complex logic

## Questions?

- Check existing issues and discussions
- Review `design_guidelines.md` for UI/UX questions
- Review `CROSS_PLATFORM_INTEGRATION.md` for integration questions
- Open a discussion for general questions
- Tag maintainers in issues for specific questions

## Recognition

Contributors will be recognized in:
- GitHub contributors list
- Release notes
- Project documentation

Thank you for contributing to port444! 🚀
