# simple-crud

The library provides the user with a hook for managing a list. The list
supports viewing, editing, adding, and deleting items.

This implementation is suitable if the list is not large (it does not support
pagination) and the items that are retrieved when fetching the list
include all properties (no additional fetch is required for editing and
viewing).

## Running unit tests

Run `nx test simple-crud` to execute the unit tests via
[Jest](https://jestjs.io).
