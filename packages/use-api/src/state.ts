import { AccessPointError } from "@vebgen/access-api";


/**
 * The internal state of the {@link useAPI} hook.
 */
export interface UseApiState<TResult> {
    /**
     * The result of the call.
     */
    result?: TResult;

    /**
     * The error that was produced.
     */
    error?: AccessPointError;

    /**
     * Whether the API call is in progress.
     */
    loading?: boolean;

    /**
     * Whether the API call has been called at least once
     * and either a result or an error were received.
     */
    called?: boolean;

    /**
     * Set after first render. Used to handle the auto-trigger feature.
     */
    autoTriggerGuard?: boolean;
}


/**
 * The action to indicate a call is about to be issued.
 */
export interface SetLoadingAction {
    type: "loading";
    payload: boolean;
};


/**
 * The action to set the result
 */
export interface SetResultAction<TResult> {
    type: "result";
    payload: TResult;
};


/**
 * The action for setting the error.
 */
export interface SetErrorAction {
    type: "error";
    payload: AccessPointError;
};


/**
 * The action for setting the error.
 */
export interface ResetAction {
    type: "reset";
};


/**
 * All the actions supported by the reducer.
 */
export type UseApiAction<TResult> =
    | ResetAction
    | SetLoadingAction
    | SetResultAction<TResult>
    | SetErrorAction;


// The initial state of the reducer.
export const initialState: UseApiState<any> = {
    result: undefined,
    error: undefined,
    loading: false,
    called: false,
    autoTriggerGuard: false,
};
