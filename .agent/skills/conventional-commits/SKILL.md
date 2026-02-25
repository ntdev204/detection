---
name: conventional-commits
description: Conventional Commits v1.0.0 specification and guidelines. Use when writing commit messages, reviewing commit history, or teaching team members about structured commits. Provides comprehensive documentation on commit types (feat, fix, docs, test, etc.), scope usage, breaking changes, and real-world examples following the official specification.
---

# Conventional Commits

Write meaningful, structured commit messages following Conventional Commits v1.0.0 specification.

## Commit Message Structure

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

### Components

1. **Type** (required): Noun describing the change category
2. **Scope** (optional): Section of codebase in parentheses
3. **Description** (required): Short summary after colon and space
4. **Body** (optional): Detailed explanation, one blank line after description
5. **Footer(s)** (optional): Metadata like breaking changes, issue references

## Commit Types

| Type       | Purpose                   | SemVer Impact | Example                                     |
| ---------- | ------------------------- | ------------- | ------------------------------------------- |
| `feat`     | New feature               | MINOR         | `feat(auth): add OAuth2 login`              |
| `fix`      | Bug fix                   | PATCH         | `fix(parser): handle null values`           |
| `docs`     | Documentation only        | -             | `docs: update API reference`                |
| `style`    | Code style/formatting     | -             | `style: fix indentation`                    |
| `refactor` | Code restructuring        | -             | `refactor(utils): extract validation logic` |
| `perf`     | Performance improvement   | PATCH         | `perf(db): add query index`                 |
| `test`     | Add/update tests          | -             | `test: add user service tests`              |
| `build`    | Build system/dependencies | -             | `build: upgrade to React 18`                |
| `ci`       | CI configuration          | -             | `ci: add test coverage check`               |
| `chore`    | Other changes             | -             | `chore: update gitignore`                   |
| `revert`   | Revert previous commit    | -             | `revert: feat(api): remove endpoint`        |

## Breaking Changes

Indicate breaking changes in two ways:

1. **Exclamation mark** before colon:

    ```
    feat(api)!: remove deprecated endpoint
    ```

2. **BREAKING CHANGE footer**:

    ```
    feat(api): update authentication

    BREAKING CHANGE: JWT tokens now expire after 1 hour instead of 24 hours
    ```

Both methods can be combined for maximum visibility.

## Scope Guidelines

Scope describes the affected codebase section:

- **Components**: `feat(button):`, `fix(modal):`
- **Modules**: `feat(auth):`, `refactor(database):`
- **Packages**: `build(deps):`, `chore(npm):`
- **Files/Folders**: `docs(readme):`, `test(utils):`

Keep scopes consistent within a project. Use lowercase.

## Advanced Features

### Multi-paragraph Body

```
fix: prevent racing of requests

Introduce a request id and a reference to latest request.
Dismiss incoming responses other than from latest request.

Remove timeouts which were used to mitigate the racing issue
but are obsolete now.
```

### Multiple Footers

```
fix: correct billing calculation

Fixes: #123
Reviewed-by: Alice
Refs: #456, #789
```

### Footer Format

Footers use `token: value` or `token #value` format:

- Token uses hyphens instead of spaces: `Reviewed-by:`, `Acked-by:`
- Exception: `BREAKING CHANGE` (can use spaces)
- Value can contain spaces and newlines

## Writing Commit Messages

When writing commit messages, follow this decision tree:

1. **What changed?** → Choose appropriate type
2. **Where?** → Add scope if multiple areas exist in project
3. **Breaking?** → Add `!` or `BREAKING CHANGE:` footer
4. **Why/How?** → Add body for context (optional)
5. **References?** → Add footer with issue numbers (optional)

## Best Practices

1. **Use imperative mood**: "add feature" not "added feature"
2. **Lowercase type and scope**: `feat(api):` not `Feat(API):`
3. **No period at end**: `fix: update logic` not `fix: update logic.`
4. **Keep description ≤50 chars** when possible
5. **Wrap body at 72 chars**
6. **Use body for context**: Explain "why" not "what"
7. **Reference issues in footer**: `Closes: #123`

## Examples

For comprehensive examples of each commit type, see [examples.md](references/examples.md).

### Quick Examples

**Feature:**

```
feat(api): add user profile endpoint

Implement GET /api/users/:id endpoint with authentication.
Returns user profile data including avatar and bio.
```

**Bug fix:**

```
fix(auth): prevent session timeout on page reload

Sessions were expiring immediately on page refresh due to
incorrect token refresh logic.
```

**Breaking change:**

```
feat(database)!: migrate to PostgreSQL

BREAKING CHANGE: MongoDB is no longer supported.
Update connection strings to PostgreSQL format.
Migration guide: docs/migration.md
```

**Multiple files:**

```
refactor(core): extract validation utilities

- Move validation functions to utils/validators.js
- Add comprehensive test coverage
- Update imports across codebase

Refs: #234
```

## Validation Rules (v1.0.0 Spec)

1. Commits MUST be prefixed with type
2. `feat` MUST be used for new features
3. `fix` MUST be used for bug fixes
4. Scope MUST be noun in parentheses (optional)
5. Description MUST follow `: ` after type/scope
6. Body MUST begin one blank line after description (optional)
7. Footer MUST use `token: value` format (optional)
8. Breaking changes MUST be indicated with `!` or `BREAKING CHANGE:` footer
9. Types are case-insensitive, except `BREAKING CHANGE` (must be uppercase)
10. `BREAKING-CHANGE` is synonymous with `BREAKING CHANGE`

## Integration with Tools

Conventional Commits enables:

- **Automated changelogs**: Generate from commit history
- **Semantic versioning**: Auto-bump versions based on types
- **CI/CD triggers**: Different pipelines for different types
- **Release automation**: Auto-create releases from commits
- **Commit linting**: Tools like `commitlint` validate format
