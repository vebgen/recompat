# use-api

The library provides the user with a React hook (`useApi`) for retrieving
data from a server, which is a thin wrapper around the
[@vebgen/access-api](../access-api/README.md) library.

The hook may call the server on first render (useful for queries) or you
may call it manually using the `trigger()` function returned by the hook
(in case of mutations or for refreshing the data).

The hook stores and provides the following data:

- `result` - the data returned by the server;
- `error` - the error returned by the server;
- `loading` - a boolean indicating whether the hook is currently loading
  data from the server;
- `called` - a boolean indicating that either a result or an error has
  been received.

To use this library in your project, install it using your favorite
package manager:

```bash
npm install @vebgen/use-api
pnpm install @vebgen/use-api
yarn add @vebgen/use-api
```

## Development

The library is hosted in [a monorepo](https://github.com/vebgen/recompat) and
uses [Nx](https://nx.dev) for development.

### Running unit tests

Run `nx test use-api` to execute the unit tests via
[Jest](https://jestjs.io).
