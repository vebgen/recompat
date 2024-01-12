import { AccessPointError } from "@vebgen/access-api";

/**
 * The operating mode of the list.
 *
 * Following values are allowed:
 * - `list` - The view should show the list of items and nothing else;
 * - `view` - The view should show the details of the current item;
 * - `edit` - The view should show the details of the current item and allow
 *   editing;
 * - `delete` - The view should show confirmation dialog for deleting the
 *   current item;
 * - `create` - The view should show the form for creating a new item.
 */
export type ListMode = "list" | "view" | "edit" | "delete" | "create";


/**
 * The function used to reload the list.
 */
export type RefreshList<T> = () => Promise<AccessPointError | T[]>;


/**
 * The result returned by the `useFetchList` hook.
 */
export interface FetchListResult<T> {
    /**
     * The list of items returned by the API or `undefined` if the list
     * has not been fetched yet.
     */
    result?: T[];

    /**
     * Whether the list is currently being fetched.
     */
    loading: boolean;

    /**
     * The error returned by the API or `undefined` if there was no error.
     */
    error?: AccessPointError;

    /**
     * Reload the list of items.
     */
    trigger: RefreshList<T>;

    /**
     * Clear any errors and results.
     */
    reset: () => void;
}
