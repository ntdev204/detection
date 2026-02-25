# Conventional Commits Examples

Comprehensive real-world examples for each commit type following Conventional Commits v1.0.0 specification.

## feat (Feature)

### Simple feature

```
feat(auth): add OAuth2 login
```

### Feature with body

```
feat(api): add user profile endpoint

Implement GET /api/users/:id endpoint with authentication.
Returns user profile data including avatar, bio, and preferences.
```

### Feature with scope and details

```
feat(payment): integrate Stripe checkout

- Add Stripe SDK dependencies
- Create checkout session endpoint
- Implement webhook handler for payment events
- Add payment confirmation email

Closes: #245
```

## fix (Bug Fix)

### Simple fix

```
fix(parser): handle null values correctly
```

### Fix with explanation

```
fix(auth): prevent session timeout on page reload

Sessions were expiring immediately on page refresh due to
incorrect token refresh logic. Now properly refresh tokens
before they expire.

Fixes: #123
```

### Critical fix

```
fix(security): sanitize user input in search query

Prevent XSS attacks by escaping HTML special characters
in search input before rendering results.
```

## docs (Documentation)

### Simple doc update

```
docs: update API reference
```

### README update

```
docs(readme): add installation instructions for Windows

Include PowerShell commands and troubleshooting steps
for common Windows installation issues.
```

### API documentation

```
docs(api): document authentication endpoints

- Add examples for login/logout
- Document JWT token format
- Include error response codes
```

## style (Code Style)

### Formatting

```
style: fix indentation in auth module
```

### Linting fixes

```
style: remove trailing whitespace

Run prettier across all JavaScript files to ensure
consistent formatting.
```

## refactor (Code Restructuring)

### Extract utility

```
refactor(utils): extract validation logic

Move validation functions from controllers to utils/validators.js
for better reusability and testing.
```

### Rename for clarity

```
refactor(api): rename getUserData to fetchUserProfile

More descriptive function name that better represents
what the function actually does.
```

### Major refactor

```
refactor(core): migrate to composition pattern

- Replace inheritance with composition
- Extract mixins for shared behavior
- Update all component implementations
- Add migration guide

Refs: #567
```

## perf (Performance)

### Database optimization

```
perf(db): add index on user_id column

Query performance improved from 2.3s to 0.1s for user lookups.
```

### Caching

```
perf(api): implement Redis caching for product list

- Cache product data for 5 minutes
- Reduce database load by 80%
- Add cache invalidation on updates
```

### Bundle size

```
perf(build): reduce bundle size by 40%

- Enable tree shaking
- Lazy load non-critical components
- Remove unused dependencies
```

## test (Testing)

### Add tests

```
test: add user service unit tests
```

### Improve coverage

```
test(auth): increase coverage to 95%

- Add edge case tests for token expiration
- Test error handling scenarios
- Mock external API calls
```

### E2E tests

```
test(e2e): add checkout flow tests

Test complete user journey from product selection
to payment confirmation.
```

## build (Build System)

### Dependency update

```
build: upgrade to React 18
```

### Add dependency

```
build(deps): add lodash for utility functions
```

### Build configuration

```
build: configure webpack for production

- Enable minification
- Add source maps
- Configure code splitting
```

## ci (CI/CD)

### Add CI check

```
ci: add test coverage check

Fail CI pipeline if coverage drops below 80%.
```

### Update workflow

```
ci(github): add automatic deployment to staging

Deploy to staging environment on every merge to develop branch.
```

## chore (Maintenance)

### Gitignore

```
chore: add .env to gitignore
```

### Configuration

```
chore: update ESLint configuration

Add React hooks rules and TypeScript support.
```

## Breaking Changes

### With exclamation mark

```
feat(api)!: remove deprecated v1 endpoints

All v1 endpoints have been removed. Migrate to v2 API.
See migration guide: docs/migration-v1-to-v2.md
```

### With BREAKING CHANGE footer

```
feat(auth): update JWT token expiration

BREAKING CHANGE: JWT tokens now expire after 1 hour instead
of 24 hours. Refresh tokens must be implemented in all clients.

Migration steps:
1. Update client to handle token refresh
2. Implement refresh token endpoint
3. Update token storage logic
```

### Both methods combined

```
refactor(database)!: migrate to PostgreSQL

BREAKING CHANGE: MongoDB is no longer supported.

Migration required:
1. Export data from MongoDB
2. Run migration script: npm run migrate
3. Update connection strings to PostgreSQL format
4. Test all database operations

Closes: #890
```

## Multiple Files

### Multi-component update

```
feat(ui): redesign dashboard layout

- Update DashboardHeader component with new navigation
- Redesign StatCard with better typography
- Add responsive breakpoints for mobile
- Update color scheme to match brand guidelines

Before: 3 column layout
After: Flexible grid with 1-4 columns based on screen size
```

### Cross-module refactor

```
refactor: standardize error handling

- Create centralized ErrorHandler class
- Update all API calls to use new error handler
- Add error logging to monitoring service
- Update tests for new error format

Affected modules:
- api/
- services/
- utils/
- tests/

Refs: #456
```

## Revert

### Simple revert

```
revert: feat(api): add user endpoint

This reverts commit abc123def456.

Reverting due to performance issues in production.
```

### Revert with explanation

```
revert: perf(db): add caching layer

This reverts commit 789ghi012jkl.

The caching implementation caused data inconsistency issues.
Will re-implement with proper cache invalidation strategy.

Refs: #678
```

## Advanced Examples

### Long description with multiple paragraphs

```
fix: prevent race condition in file upload

When multiple files were uploaded simultaneously, the upload
progress tracking would become inconsistent, showing incorrect
percentages or freezing at 99%.

The issue was caused by shared state between upload instances.
Each upload now maintains isolated state with unique IDs.

Added comprehensive tests to verify concurrent upload scenarios
work correctly.

Fixes: #234, #245
Reviewed-by: Alice Chen
```

### Complex feature with multiple footers

```
feat(payment): add subscription management

Implement full subscription lifecycle management:
- Create and cancel subscriptions
- Update payment methods
- Handle trial periods
- Process proration on plan changes

Integrates with Stripe subscription API and sends
notification emails for all subscription events.

BREAKING CHANGE: Payment API endpoints have moved from
/api/payment to /api/subscriptions. Update all client code.

Closes: #890
Reviewed-by: Bob Smith
Refs: #891, #892
```

## Tips

1. **Keep the first line ≤50 characters** when possible
2. **Use imperative mood**: "add feature" not "added feature"
3. **Explain WHY in the body**, not what (the diff shows what)
4. **Reference issues** in footers for traceability
5. **Use scopes consistently** within your project
6. **Breaking changes** deserve detailed migration guides
7. **Multi-file commits** benefit from itemized lists in body
