import { useCallback, useReducer } from "react";
import { UseApiState, initialState } from "./state";
import { reducer } from "./reducer";
import { AccessPoint, AccessPointError } from "@vebgen/access-api";


/**
 * The result of a call to the {@link useAPI} hook.
 */
export interface UseApiResult<
    TPayload, TPathArgs, TResult, TContext
> extends UseApiState<TResult> {

    /**
     * The function to call the API.
     *
     * @param context The context to send to the API. if not provided the
     *        context provided as argument to the hook call will be used.
     * @param apiPayload The payload to send to the API. If not provided the
     *        payload provided as argument to the hook call will be used.
     * @param pathArgs The arguments for computing the path to the API. If not
     *        provided the path arguments provided as argument to the hook call
     *        will be used.
     * @param headers The headers to send to the API. If not provided the
     *        headers provided as argument to the hook call will be used.
     * @returns The result of the API call as provided by the server and
     * transformed by the `AccessPoint` class or the error that was thrown.
     */
    trigger: (
        context?: TContext,
        apiPayload?: Readonly<TPayload>,
        pathArgs?: Readonly<TPathArgs>,
        headers?: Readonly<Record<string, string>>,
    ) => Promise<AccessPointError | TResult>;

    /**
     * The function to reset the internal state to the pristine state.
     */
    reset: () => void;
}


/**
 * A hook that can be used to call an API endpoint.
 *
 * The `TPayload` type is the type of the payload that is sent to the API.
 * The `TPathArgs` type is the type of the arguments that are passed in the
 * path.
 * The `TResult` type is the type of the result that is returned by the API.
 * The `TContext` type is the type of the context that is passed to the
 * access point with each call.
 *
 * @param accessPoint The class instance that describes how combine
 *       the context, payload, path arguments and headers to call the API.
 *       Note that a request that is in progress in this instance will be
 *       cancelled if a new call to the `trigger`()` is made.
 * @param context The context to use in an auto-trigger scenario and the
 *       default context to send to the API if not provided
 *       when calling the `trigger()` function.
 * @param apiPayload The payload to use in an auto-trigger scenario and the
 *       default payload to send to the API if not provided
 *       when calling the `trigger()` function.
 * @param pathArgs The path arguments to use in an auto-trigger scenario and
 *       the default arguments to use with the API if not provided
 *       when calling the `trigger()` function.
 * @param headers The headers to send to the API in an auto-trigger scenario
 *       and the default headers to use with the API if not provided
 *       when calling the `trigger()` function.
 * @param autoTrigger Whether to automatically trigger the API call on first
 *       render.
 * @param timeout The timeout for the API call. Default is 8000 (8 seconds).
 */
export function useAPI<
    TPayload, TPathArgs, TResult, TContext
>(
    accessPoint: AccessPoint<TPayload, TPathArgs, TResult, TContext>,
    context?: TContext,
    apiPayload?: Readonly<TPayload>,
    pathArgs?: Readonly<TPathArgs>,
    headers?: Readonly<Record<string, string>>,
    autoTrigger?: Readonly<boolean>,
    timeout?: Readonly<number>,
): UseApiResult<TPayload, TPathArgs, TResult, TContext> {
    console.log("[useAPI] context %O", context);
    console.log("[useAPI] apiPayload %O", apiPayload);
    console.log("[useAPI] pathArgs %O", pathArgs);
    console.log("[useAPI] headers %O", headers);

    // Internal state.
    const [state, dispatch] = useReducer(reducer<TResult>, initialState);

    // The function for the user to call the API.
    const trigger = useCallback(async (
        contextOverride?: TContext,
        apiPayloadOverride?: Readonly<TPayload>,
        pathArgsOverride?: Readonly<TPathArgs>,
        headersOverride?: Readonly<Record<string, string>>,
    ) => {
        console.log("[useAPI] trigger, state is %O", contextOverride);

        // Indicate the call is in progress.
        dispatch({ type: "loading", payload: true, });

        // Call the API.
        const result = await accessPoint.call(
            contextOverride || context,
            apiPayloadOverride || apiPayload,
            pathArgsOverride || pathArgs,
            headersOverride || headers,
            timeout || 8000,
        );

        // Dispatch the result.
        if ("code" in (result as any)) {
            dispatch({ type: "error", payload: result as AccessPointError });
        } else {
            dispatch({ type: "result", payload: result as TResult });
        }

        return result;
    }, [accessPoint, accessPoint, apiPayload, pathArgs, headers, timeout]);

    // Reset the state of the hook.
    const reset = useCallback(() => { dispatch({ type: "reset", }); }, []);

    // Auto-trigger the API call if requested.
    if (autoTrigger && !state.autoTriggerGuard) {
        trigger();
    }

    // Compose the result.
    console.log("[useAPI] returns %O", state);
    return {
        ...state,
        trigger,
        reset,
    };
}
