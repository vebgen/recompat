import { UseApiAction, UseApiState, initialState } from "./state";

/**
 * The reducer for the {@link useAPI} hook.
 */
export function reducer<TResult>(
    state: UseApiState<TResult>, action: UseApiAction<TResult>
): UseApiState<TResult> {
    switch (action.type) {
        case "reset":
            return {
                ...initialState,
            };
        case "loading":
            return {
                ...state,
                loading: action.payload,
                autoTriggerGuard: true,
            };
        case "result":
            return {
                ...state,
                result: action.payload,
                loading: false,
                called: true,
                error: undefined,
            };
        case "error":
            return {
                ...state,
                error: action.payload,
                loading: false,
                called: true,
            };
        default:
            return state;
    }
}
