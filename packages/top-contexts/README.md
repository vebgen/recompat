# top-contexts

General-purpose React context definitions for the top-level application.

## Application URLs

This context provides the root URLs for the application. The URLs are
split into two parts: the domain and the path, with a function to
combine them with the endpoints into a full URL.

At this point three categories of URLs are supported:

- the web app: used to access the web application itself,
- the API: used to access the backend services,
- the authentication: used to access the authentication services.

Following environment variables my be used to provide defaults (a
`REACT_APP_` or `NX_` prefix is required):

- `API_DOMAIN`: the domain for the API,
- `API_PATH`: the path for the API,
- `AUTH_DOMAIN`: the domain for the authentication,
- `AUTH_PATH`: the path for the authentication,
- `WEBSITE_DOMAIN`: the domain for the web app,
- `WEBSITE_PATH`: the path for the web app.

## Logger in context

The `@vebgen/logger` package provides a logger that can be used to log
messages to the console but is un-opinionated about the framework. This
package provides a React context that can be used to access the logger.

## Running unit tests

Run `nx test top-contexts` to execute the unit tests via [Jest](https://jestjs.io).
