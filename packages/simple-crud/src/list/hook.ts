import { useCallback, useEffect, useReducer } from "react";
import {
    FetchListResult, ListMode, RefreshList
} from "./defs";
import { CrudState } from "./state";
import { reducer } from "./reducer";
import { AccessPointError } from "@vebgen/access-api";


/**
 * The result returned by the `UseCrud` hook.
 */
export interface UseCrudResult<T, ListKey extends string | number | symbol>
    extends CrudState<T, ListKey> {

    /**
     * The callback used to begin creating an item.
     */
    beginCreate: () => void;

    /**
     * The callback used to begin viewing an item.
     *
     * @param unique The unique identifier of the item.
     */
    beginView: (unique: ListKey) => void;

    /**
     * The callback used to begin editing an item.
     *
     * @param unique The unique identifier of the item.
     */
    beginEdit: (unique: ListKey) => void;

    /**
     * The callback used to request deleting an item.
     *
     * @param unique The unique identifier of the item.
     */
    beginDelete: (unique: ListKey) => void;

    /**
     * The callback for setting current item.
     *
     * The current item is also implicitly set by the `beginEdit` and
     * `beginDelete` callbacks.
     */
    setCurrent: (unique: ListKey, mode?: ListMode) => void;

    /**
     * The callback for clearing current item.
     */
    clearCurrent: () => void;

    /**
     * The callback for adding a new item.
     *
     * The item will be the last item in the list.
     */
    addNewItem: (unique: ListKey, data: T) => void;

    /**
     * The callback for editing an existing item.
     *
     * If the item does not exist, it will be added to the list.
     */
    editItem: (oldUnique: ListKey, newUnique: ListKey, data: T) => void;

    /**
     * The callback for removing an existing item.
     *
     * No error is thrown if the item does not exist.
     */
    removeItem: (unique: ListKey) => void;

    /**
     * The user is allowed to create applications.
     */
    canCreate: boolean;

    /**
     * The user is allowed to read details about applications.
     */
    canRead: boolean;

    /**
     * The user is allowed to update applications.
     */
    canUpdate: boolean;

    /**
     * The user is allowed to delete applications.
     */
    canDelete: boolean;

    /**
     * The list of items is being loaded?
     */
    isListLoading: boolean;

    /**
     * There was an error loading the list of items.
     */
    errorInList?: AccessPointError;

    /**
     * Reload the list of items.
     */
    reloadList: RefreshList<T>;

    /**
     * Clears any errors and results from the list of items.
     */
    resetList: () => void;
}


/**
 * The shape of the properties passed to the `UseCrud` hook.
 */
export interface UseCrudProps<T, ListKey extends string | number | symbol> {
    /**
     * The user is allowed to create applications.
     */
    canCreate: boolean;

    /**
     * The user is allowed to read details about applications.
     */
    canRead: boolean;

    /**
     * The user is allowed to update applications.
     */
    canUpdate: boolean;

    /**
     * The user is allowed to delete applications.
     */
    canDelete: boolean;

    /**
     * The hook to use for fetching the list.
     */
    useFetchList: () => FetchListResult<T>;

    /**
     * The function that converts a fast item to unique key.
     */
    toKey: (fast: T) => ListKey;
}


/**
 * Generic hook for managing a list of items.
 *
 * The hook expects a hook function that fetches the list of items from the
 * API. This is suitable when the list of items is not paginated and the
 * result includes all the properties for each item.
 *
 * This hook returns a object that can be used to manage the list of
 * items.
 */
export function useCrud<
    T, ListKey extends string | number | symbol = string
>({
    canCreate,
    canRead,
    canUpdate,
    canDelete,
    useFetchList,
    toKey,
}: UseCrudProps<T, ListKey>): UseCrudResult<T, ListKey> {
    console.log("[UseCrud] canCreate: %O", canCreate);
    console.log("[UseCrud] canRead: %O", canRead);
    console.log("[UseCrud] canUpdate: %O", canUpdate);
    console.log("[UseCrud] canDelete: %O", canDelete);

    const [state, dispatch] = useReducer(reducer, {
        data: {},
        current: null,
        mode: "list",
    });
    console.log("[UseCrud] state: %O", state);

    // Fetch the initial list of items.
    const {
        result: listResult,
        loading: isListLoading,
        error: errorInList,
        trigger: reloadList,
        reset: resetList,
    } = useFetchList();
    console.log(
        "[UseCrud] listResult: %O, loading: %s",
        listResult, isListLoading
    );
    console.log("[UseCrud] errorInList: %O", errorInList);


    // When the reply from the initial list of items is received...
    useEffect(() => {

        // if there was an error, do nothing.
        if (errorInList || !listResult) {
            console.log("[UseCrud] effect not running");
            return;
        }
        console.log("[UseCrud] effect running");

        // Create initial dataset.
        const dataset: Record<ListKey, T> = listResult.reduce(
            (acc: Record<ListKey, T>, fast: T) => {
                acc[toKey(fast)] = fast;
                return acc;
            }, {} as Record<ListKey, T>
        );

        // Save the initial list of items in the state.
        dispatch({ type: "setData", payload: dataset, });

    }, [listResult, errorInList, canRead, toKey]);


    // The callback for beginning to create a new item.
    const beginCreate = useCallback(() => {
        if (canCreate) {
            dispatch({ type: "beginCreate", });
        }
    }, [canCreate]);

    // The callback for beginning to view an item.
    const beginView = useCallback((unique: ListKey) => {
        if (canRead) {
            dispatch({ type: "beginView", payload: unique, });
        }
    }, [canRead]);

    // The callback for beginning to edit an item.
    const beginEdit = useCallback((unique: ListKey) => {
        if (canUpdate) {
            dispatch({ type: "beginEdit", payload: unique, });
        }
    }, [canUpdate]);


    // The callback for beginning to delete an item.
    const beginDelete = useCallback((unique: string) => {
        if (canDelete) {
            dispatch({ type: "beginDelete", payload: unique, });
        }
    }, [canDelete]);


    // The callback for setting current item.
    const setCurrent = useCallback((unique: string, mode?: ListMode) => {
        dispatch({
            type: "setCurrent", payload: {
                item: unique,
                mode,
            },
        });
    }, []);


    // The callback for clearing current item.
    const clearCurrent = useCallback(() => {
        dispatch({ type: "clearCurrent" });
    }, []);


    // The callback for adding a new item.
    const addNewItem = useCallback((unique: ListKey, data: T) => {
        dispatch({
            type: "addNewItem",
            payload: {
                unique,
                data
            },
        });
    }, []);


    // The callback for editing an existing item.
    const editItem = useCallback((
        oldUnique: ListKey, newUnique: ListKey, data: T
    ) => {
        dispatch({
            type: "editItem",
            payload: {
                oldUnique,
                newUnique,
                data
            },
        });
    }, []);


    // The callback for removing an existing item.
    const removeItem = useCallback((unique: ListKey) => {
        dispatch({
            type: "removeItem",
            payload: unique,
        });
    }, []);


    return {
        canCreate,
        canRead,
        canUpdate,
        canDelete,
        beginView,
        beginCreate,
        beginEdit,
        beginDelete,
        setCurrent,
        clearCurrent,
        isListLoading,
        errorInList,
        reloadList,
        resetList,
        addNewItem,
        editItem,
        removeItem,
        ...state
    } as UseCrudResult<T, ListKey>;
}
