# simple-crud

The library provides the user with a React hook (`useCrud`) for managing a list.
The list supports viewing, editing, adding, and deleting items.

This implementation is suitable if the list is not large (it does not support
pagination) and the items that are retrieved when fetching the list
include all properties (no additional fetch is required for editing and
viewing).

To use this library in your project, install it using your favorite
package manager:

```bash
npm install @vebgen/simple-crud
pnpm install @vebgen/simple-crud
yarn add @vebgen/simple-crud
```

## Development

The library is hosted in [a monorepo](https://github.com/vebgen/recompat) and
uses [Nx](https://nx.dev) for development.

### Running unit tests

Run `nx test simple-crud` to execute the unit tests via
[Jest](https://jestjs.io).
