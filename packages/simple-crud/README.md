# simple-crud

The library provides the user with a React hook (`useCrud`) for managing a list.
The list supports viewing, editing, adding, and deleting items.

This implementation is suitable if the list is not large (it does not support
pagination) and the items that are retrieved when fetching the list
include all properties (no additional fetch is required for editing and
viewing).

The `useCrud` hook delegates the retrieval of the items to another hook
that it receives as a parameter. This allows the user to implement the
retrieval of the items in a way that is suitable for their use case. The
`useAPI` hook in the [@vebgen/use-api](../use-api/README.md) package is a
good candidate for this.

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
