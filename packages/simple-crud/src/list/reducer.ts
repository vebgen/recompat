import { CrudState, EditItemAction, ListAction } from "./state";

function replaceItem<T, ListKey extends string | number | symbol>(
    oldData: Record<ListKey, T>,
    options: EditItemAction<T, ListKey>["payload"]
): Record<ListKey, T> {

    let found: boolean = false;
    const result = Object.keys(oldData).reduce(
        (acc, key) => {
            if (key !== options.oldUnique) {
                (acc as any)[key] = (oldData as any)[key];
            } else {
                found = true;
                acc[options.newUnique] = options.data;
            }
            return acc;
        }, {} as Record<ListKey, T>
    );
    if (!found) {
        result[options.newUnique] = options.data;
    }
    return result;
}


/**
 * The reducer for the `use2StageList` hook.
 */
export function reducer<T, ListKey extends string | number | symbol>(
    state: CrudState<T, ListKey>,
    action: ListAction<T, ListKey>
): CrudState<T, ListKey> {
    switch (action.type) {
        case "beginCreate":
            return {
                ...state,
                current: null,
                mode: "create",
            };

        case "beginEdit":
            return {
                ...state,
                current: action.payload,
                mode: "edit",
            };

        case "beginView":
            return {
                ...state,
                current: action.payload,
                mode: "view",
            };

        case "beginDelete":
            return {
                ...state,
                current: action.payload,
                mode: "delete",
            };

        case "setCurrent":
            return {
                ...state,
                current: action.payload.item,
                mode: action.payload.mode ?? state.mode,
            };

        case "clearCurrent":
            return {
                ...state,
                current: null,
                mode: "list",
            };

        case "setData":
            return {
                ...state,
                data: action.payload,
            };

        case "editItem":
            if (action.payload.oldUnique !== action.payload.newUnique) {
                return {
                    ...state,
                    data: replaceItem(state.data, action.payload),
                };
            } else {
                return {
                    ...state,
                    data: {
                        ...state.data,
                        [action.payload.newUnique]: action.payload.data,
                    },
                };
            }

        case "addNewItem":
            return {
                ...state,
                data: {
                    ...state.data,
                    [action.payload.unique]: action.payload.data,
                },
            };

        case "removeItem":
            return {
                ...state,
                data: Object.keys(state.data).reduce(
                    (acc, key) => {
                        if (key !== action.payload) {
                            (acc as any)[key] = (state.data as any)[key];
                        }
                        return acc;
                    }, {} as Record<ListKey, T>
                ),
            };

        default:
            return state;
    }
}
