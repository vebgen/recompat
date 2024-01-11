import { ListMode } from "./defs";

/**
 * The internal state of the `useCrudList` hook.
 */
export interface CrudState<
    T,
    ListKey extends string | number | symbol
> {
    /**
     * The internal data.
     */
    data: Record<ListKey, T>;

    /**
     * The current item or `null` if there is no current item.
     */
    current: ListKey | null;

    /**
     * The current mode.
     *
     * - `list` - The list of items are being shown.
     * - `view` - The current item is being viewed.
     * - `edit` - The current item is being edited.
     * - `delete` - The current item is being deleted.
     */
    mode: ListMode;
}


/**
 * The action for beginning to edit an item.
 */
export type BeginEditAction<ListKey> = {
    type: "beginEdit";
    payload: ListKey;
};


/**
 * The action for beginning to create a new item.
 */
export type BeginCreateAction = {
    type: "beginCreate";
};


/**
 * The action for beginning to create a new item.
 */
export type BeginViewAction<ListKey extends string | number | symbol> = {
    type: "beginView";
    payload: ListKey;
};


/**
 * The action for beginning to delete an item.
 */
export type BeginDeleteAction<ListKey extends string | number | symbol> = {
    type: "beginDelete";
    payload: ListKey;
};


/**
 * The action for setting the current item.
 */
export type SetCurrentAction<ListKey extends string | number | symbol> = {
    type: "setCurrent";
    payload: {
        item: ListKey;
        mode?: ListMode;
    };
};


/**
 * The action for clearing the current item.
 */
export type ClearCurrentAction = {
    type: "clearCurrent";
};


/**
 * The action for setting data retrieved.
 */
export type SetDataAction<T, ListKey extends string | number | symbol> = {
    type: "setData";
    payload: Record<ListKey, T>;
};


/**
 * The action for adding a new item to the data.
 */
export type AddItemAction<T, ListKey extends string | number | symbol> = {
    type: "addNewItem";
    payload: {
        unique: ListKey;
        data: T;
    };
};


/**
 * The action for editing an existing item to the data.
 */
export type EditItemAction<T, ListKey extends string | number | symbol> = {
    type: "editItem";
    payload: {
        oldUnique: ListKey;
        newUnique: ListKey;
        data: T;
    };
};


/**
 * The action for removing an existing item to the data.
 */
export type RemoveItemAction<ListKey extends string | number | symbol> = {
    type: "removeItem";
    payload: ListKey;
};


/**
 * The action in list reducer.
 */
export type ListAction<T, ListKey extends string | number | symbol> =
    | AddItemAction<T, ListKey>
    | EditItemAction<T, ListKey>
    | RemoveItemAction<ListKey>
    | SetDataAction<T, ListKey>
    | BeginCreateAction
    | BeginViewAction<ListKey>
    | BeginEditAction<ListKey>
    | BeginDeleteAction<ListKey>
    | SetCurrentAction<ListKey>
    | ClearCurrentAction;
