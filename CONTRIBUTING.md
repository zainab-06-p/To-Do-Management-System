# Contributing to WayFair

## Code of Conduct

- Be respectful and inclusive
- Welcome new contributors
- Provide constructive feedback
- Report inappropriate behavior

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/YOUR_USERNAME/Wayfair_SPM.git`
3. Add upstream: `git remote add upstream https://github.com/zainab-06-p/Wayfair_SPM.git`
4. Create feature branch: `git checkout -b feature/your-feature`
5. Make changes and commit
6. Push to your fork: `git push origin feature/your-feature`
7. Create Pull Request

## Development Workflow

### Before Starting
- Check existing issues and PRs
- Discuss major changes first
- Follow the project structure

### Coding Standards
- Use ESLint configuration
- Follow naming conventions
- Write meaningful comments
- Keep functions small (<50 lines)

### Commit Messages
```
type(scope): description

[optional body]
[optional footer]
```

Types: feat, fix, docs, style, refactor, test, chore

Example:
```
feat(rides): add ride filtering by price

Users can now filter search results by price range
to find more affordable rides.

Closes #123
```

### Testing
- Write tests for new features
- Ensure tests pass: `npm test`
- Maintain 80%+ coverage
- Test edge cases

### Pull Request Process
1. Update documentation
2. Add tests
3. Update CHANGELOG.md
4. Request review from maintainers
5. Address feedback
6. Squash commits if needed
7. Wait for approval

## Review Process

PRs are reviewed by:
- Core maintainers
- Security team (if needed)
- At least 2 approvals required

## Issues and Bug Reports

### Reporting Bugs
1. Check if issue exists
2. Include steps to reproduce
3. Describe expected vs actual
4. Include environment info
5. Add screenshots if helpful

### Feature Requests
1. Describe use case
2. Provide examples
3. Discuss implementation
4. Get community feedback

## Documentation

- Update README if adding features
- Add comments for complex logic
- Update API docs for endpoint changes
- Keep examples up to date

## Release Process

1. Update version in package.json
2. Update CHANGELOG.md
3. Tag release
4. Create release notes
5. Publish to npm/GitHub

## Questions?

- Join our Discord
- Email: dev@wayfair.com
- Create a discussion

## Thank You!

Your contributions make WayFair better! ❤️
