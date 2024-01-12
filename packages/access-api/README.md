# access-api

A base class for accessing API endpoints using `fetch`.

This library provides the `AccessPoint` abstract class. You are expected to
extend this class for each server with common functionality like
base URL and authorization. Then you build one class for each API endpoint
that extends your custom `AccessPoint` class.

For a React library that allows you to use the `AccessPoint` class in your
components, see [@vebgen/use-api](../use-api/README.md).

## Usage

### Simple example

The simplest implementation requires you to provide a path and relies on
library defaults for the rest.

```typescript
import { AccessPoint } from '@vebgen/access-api';
import type { AccessPointError } from '@vebgen/access-api';

interface TResult {
    version: string;
}

class MyAccessPoint extends AccessPoint<never, never, TResult, never> {
  pathPattern(context: TContext): string {
    return '/api/version';
  }
}
const accessPoint = new MyAccessPoint();
```

`never, never, TResult, never` here means that:

- there is no payload (`TPayload` is the first type parameter),
- there are no path arguments (`TPathArgs` is the second type parameter),
- the response from the server is expected to have `TResult` shape,
- the user provides no context for the call (`TContext` is the fourth type
  parameter).

This class allows you to make a request to the server with the following code:

```typescript
accessPoint.call()
  .then((response: TResult) => {
    // Do something with the response
  })
  .catch((error: AccessPointError) => {
    // Handle the error
  });
```

This call will read the base URL from the `NX_API_URL` environment variable
and make a `POST` request to the URL `NX_API_URL + '/api/version'`.

### Customizing the request

You can customize the request by implementing appropriate methods in your
`AccessPoint` subclass.

```typescript
import { AccessPoint } from '@vebgen/access-api';
import type { AccessPointError, AccessPointMethod } from '@vebgen/access-api';

interface TPayload {
    commentId: number;
}
interface TPathArgs {
    postSlug: string;
}
interface TResult {
    votes: number;
}
interface TContext {
    userId: string;
    token: string;
    canVote: boolean;
}

class VoteAP extends AccessPoint<TPayload, TPathArgs, TResult, TContext> {
  apiUrl(context: TContext): string { return "https://example.com"; }
  method(context: TContext): AccessPointMethod { 
    return "PUT" as AccessPointMethod; 
  }
  pathPattern(context: TContext): string {
    return '/api/v1/posts/{postSlug}';
  }
  additionalHeaders(context: TContext): Record<string, string> {
    return {
      'Authorization': `Bearer ${context.token}`,
    };
  }
  isAllowed(context: TContext): boolean {
    return Boolean(context.userId) && context.canVote;
  }
}
const voteAP = new VoteAP();
```

Now to call the API, you need to provide the payload and path arguments:

```typescript
const userContext: TContext = {
    userId: '123',
    token: 'abc',
    canVote: true,
};
const payload: TPayload = {
    commentId: 123,
};
const pathArgs: TPathArgs = {
    postSlug: 'hello-world',
};
const extraHeaders: Record<string, string> = {
    'X-Extra-Header': 'value',
};
const timeout = 1000;
voteAP.call(
    userContext, payload, pathArgs, extraHeaders, timeout
).then((response: TResult) => {
    // Do something with the response
}).catch((error: AccessPointError) => {
    // Handle the error
});
```

## Development

The library is hosted in [a monorepo](https://github.com/vebgen/recompat) and
uses [Nx](https://nx.dev) for development.

### Running unit tests

Run `nx test access-api` to execute the unit tests via
[Jest](https://jestjs.io).
