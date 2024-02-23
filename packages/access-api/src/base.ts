import { AccessPointError, AccessPointMethod } from "./defs";


const pathArgRegEx = /\{[a-zA-Z0-9\\-_]+\}/g;


/**
 * Base class for all API calls.
 *
 * The `TPayload` type is the type of the payload that is sent to the API.
 * The `TPathArgs` type is the type of the arguments that are passed in the
 * path.
 * The `TResult` type is the type of the result that is returned by the API.
 * The `TContext` type is the type of the context that is passed to the
 * access point with each call.
 *
 * The default implementation of the `call()` method may return an error
 * message with following codes:
 * - `err-permission` - The user is not allowed to call this access point.
 * - `err-comm` - The call failed because of a communication error.
 * - `err-unknown` - The remote server returned a status outside of the
*      200-299 range.
 * - `err-other` - The remote server returned a message that could not be
 *  parsed as JSON (the `message` member will hold the original message).
 */
export abstract class AccessPoint<TPayload, TPathArgs, TResult, TContext> {

    /**
     * The controller that allows the cancellation of the call.
     *
     * This is set to a new `AbortController` instance when the call is
     * started with a time-out. If a new call with a time-out is started
     * before the previous call has completed, the previous call will be
     * aborted.
     */
    protected abortController?: AbortController = undefined;


    /**
     * The constructor.
     */
    protected constructor() { }

    /**
     * The base URL for API calls.
     *
     * By default this is set to the value of the `NX_API_URL` environment
     * variable.
     *
     * @param context The user-provided context of this call.
     * @returns the base URL for API calls.
     */
    apiUrl(context: TContext): string {
        return process.env["NX_API_URL"] as string;
    }

    /**
     * The HTTP method to use. This method is evaluated before each call.
     *
     * This method is evaluated before each call.
     *
     * @param context The user-provided context of this call.
     * @returns one of "GET", "POST", "PUT", or "DELETE".
     */
    method(context: TContext): AccessPointMethod {
        return "POST";
    }


    /**
     * The path toward the access point relative to the base URL.
     *
     * The result can contain placeholders for parameters in the form of
     * `{name}`. The `name` can consist of letters (uppercase and lowercase),
     * digits, dashes, and underscores. The result can start with a `/` or not.
     *
     * This method is evaluated before each call.
     *
     * @param context The user-provided context of this call.
     * @returns a path relative to the base URL.
     */
    abstract pathPattern(context: TContext): string;


    /**
     * Additional headers to use.
     *
     * This method is evaluated before each call.
     *
     * @param context The user-provided context of this call.
     * @returns a record of additional headers to use.
     */
    additionalHeaders(context: TContext): Record<string, string> {
        return {};
    }


    /**
     * Construct the body of the request.
     *
     * The default implementation creates the stringified JSON version of the
     * payload. If the payload is `undefined`, it returns `undefined`.
     *
     * This method is evaluated before each call.
     *
     * @param context The user-provided context of this call.
     * @param payload The payload to send.
     * @returns the body of the request.
     */
    createBody(
        context: TContext,
        payload?: Readonly<TPayload>
    ): string | undefined {
        if (payload === undefined) {
            return undefined;
        }
        return JSON.stringify(payload);
    }


    /**
     * Checks if the user/application is allowed to call this access point.
     */
    isAllowed(context: TContext): boolean {
        return true;
    }


    /**
     * Compute URL to use for a call.
     *
     * The function uses the result of `pathPattern` method along with the
     * `args` provided to compute the path. It then appends the path to the
     * base URL.
     *
     * @param context The user-provided context of this call.
     * @param args The arguments to use to compute the URL.
     *
     * @returns The URL to use with fetch.
     * @throws if the base URL is not set or if a parameter is missing.
     */
    url(
        context: TContext,
        args?: Readonly<TPathArgs>
    ): string {
        if (!args) {
            args = {} as any;
        }

        let prefix = this.apiUrl(context);
        if (prefix === undefined) {
            throw new Error("The API URL is not set");
        }

        let suffix = this.pathPattern(context).replace(
            pathArgRegEx, (match) => {
                const key = match.substring(1, match.length - 1);
                const value = (args as any)[key];
                if (value === undefined) {
                    throw new Error(`Missing value for parameter ${key}`);
                }
                return value;
            }
        );
        if (prefix?.endsWith("/")) {
            prefix = prefix.substring(0, prefix.length - 1);
        }
        if (!suffix.startsWith("/")) {
            suffix += "/";
        }
        return prefix + suffix;
    }

    /**
     * Call the access point and return a promise with the result.
     *
     * The function performs the following steps:
     * 1. See if a previous call is in progress. If so, abort it (only for
     *   calls with a time-out).
     * 2. Check if the user is allowed to call this access point. If not,
     *  return an error.
     * 3. Create the abort controller if a time-out is specified.
     * 4. Compute the body of the request using the `createBody()` method.
     * 5. Compute the headers to use using the `additionalHeaders()` method.
     * 6. Compute the URL to use using the `url()` method.
     * 7. Make the request using `fetch()`.
     * 8. Parse the response. If the response is not JSON, return an error.
     * 9. If the status is in 200-299 range return processed result.
     * 10. Otherwise return the processed error.
     *
     * @param context The user-provided context of this call.
     * @param payload The payload to send as the body of the request.
     * @param pathArgs The arguments to use to compute the URL.
     * @param headers Additional headers to use. These headers will override
     *  any headers returned by the `additionalHeaders()` method.
     * @param timeout The time-out in milliseconds. If not specified it
     *  defaults to 8000 (8 seconds); if `-1` the call will not time out.
     */
    async call(
        context?: TContext,
        payload?: Readonly<TPayload>,
        pathArgs?: Readonly<TPathArgs>,
        headers?: Readonly<Record<string, string>>,
        timeout?: number
    ): Promise<TResult> {
        console.log("[AccessPoint.call] context", context);
        console.log("[AccessPoint.call] payload", payload);
        console.log("[AccessPoint.call] pathArgs", pathArgs);
        console.log("[AccessPoint.call] headers", headers);

        // Cancel the previous call if any.
        if (timeout !== -1 && this.abortController) {
            this.abortController.abort();
            this.abortController = undefined;
            console.log("[AccessPoint.call] Previous call aborted");
        }

        // See if the user is allowed to call this access point.
        if (!this.isAllowed(context!)) {
            console.log(
                "[AccessPoint.call] Not allowed for context %O", context
            );
            return Promise.reject(this.adjustBuildInError(context!, {
                status: 0,
                code: 'err-permission',
                message: (
                    "You don't have the required permissions to " +
                    "access this resource"
                )
            }));
        }

        // Create the abort controller.
        if (timeout !== -1) {
            this.abortController = new AbortController();
            setTimeout(() => {
                if (this.abortController) {
                    this.abortController.abort();
                    this.abortController = undefined;
                    console.log("[AccessPoint.call] Timeout");
                }
            }, timeout || 8000);
        }

        // Compute the body of the request. The call may throw an
        // exception if the payload is invalid.
        const body = this.createBody(context!, payload);

        // Compute the headers to use.
        const finalHeaders: Record<string, string> = {
            'Content-Type': 'application/json',
            ...this.additionalHeaders(context!),
            ...headers
        };
        console.log("[AccessPoint.call] headers", finalHeaders);

        // Compute the url.
        const url = this.url(context!, pathArgs);
        console.log("[AccessPoint.call] url", url);

        // Make the request.
        let response: Response;
        try {
            response = await fetch(url, {
                method: this.method(context!),
                body,
                headers: finalHeaders,
                signal: this.abortController
                    ? this.abortController.signal
                    : undefined
            });
            console.log(
                "[AccessPoint.call] the response was retrieved: %O",
                response
            );
        } catch (error) {
            // The request has not reached the server.
            console.error("[AccessPoint.call] call failed: %O", error);
            return Promise.reject(this.adjustBuildInError(context!, {
                status: 0,
                code: 'err-comm',
                message: "Could not communicate with the server"
            }));
        } finally {
            console.log("[AccessPoint.call] signal cleared");
            if (timeout !== -1) {
                this.abortController = undefined;
            }
        }

        // Parse the response.
        const textResponse: string = await response.text();
        console.log("[AccessPoint.call] text reply: %O", textResponse);
        let jsonResponse: Record<string, any>;
        try {
            jsonResponse = JSON.parse(textResponse);
            console.log(
                "[AccessPoint.call] reply parsed to json: %O", jsonResponse
            );
        } catch {
            // The server always returns JSON on success. This is one of the
            // errors that returns plain text like 404.
            console.log("[AccessPoint.call] not JSON");
            return Promise.reject({
                status: response.status,
                code: 'err-other',
                message: textResponse || response.statusText
            });
        }

        // If this is a success, return the result.
        if (response.ok) {
            return this.processResult(
                jsonResponse,
                context!,
                payload,
                pathArgs,
                finalHeaders,
            );
        }
        console.log("[AccessPoint.call] NOT OK");

        // If this is an error, return the error.
        return Promise.reject(await this.processFailure(
            response,
            jsonResponse,
            context!,
            payload,
            pathArgs,
            finalHeaders,
        ));
    }


    /**
     * Post-process the result of the call.
     *
     * The default implementation simply returns the result as-is.
     *
     * @param result The json-parsed result of the call.
     * @param context The user-provided context of this call.
     * @param payload The payload that was sent to the API.
     * @param pathArgs The path arguments that were used to call the API.
     * @param headers The headers that were sent to the API.
     * @returns the result of the call.
     */
    async processResult(
        result: any,
        context: TContext,
        payload?: Readonly<TPayload>,
        pathArgs?: Readonly<TPathArgs>,
        headers?: Readonly<Record<string, string>>,
    ): Promise<TResult> {
        console.log(
            "[AccessPoint.processResult] default (no processing)",
            result
        );
        return Promise.resolve(result as TResult);
    }


    /**
     * Post-process the result of a failed call.
     *
     * The default implementation returns a generic error.
     *
     * @param response The response received from the fetch call.
     * @param result The json-parsed result of the call.
     * @param context The user-provided context of this call.
     * @param payload The payload that was sent to the API.
     * @param pathArgs The path arguments that were used to call the API.
     * @param headers The headers that were sent to the API.
     * @returns the result of the call.
     */
    async processFailure(
        response: any,
        result: any,
        context: TContext,
        payload?: Readonly<TPayload>,
        pathArgs?: Readonly<TPathArgs>,
        headers?: Readonly<Record<string, string>>,
    ): Promise<AccessPointError> {
        console.log("[AccessPoint.processFailure] default");
        return Promise.reject(this.adjustBuildInError(context, {
            status: response.status,
            code: 'err-unknown',
            message: "Unknown error",
        }));
    }

    /**
     * Make changes to the error structure before it is returned to the
     * caller.
     *
     * This is mostly here to allow translated messages to be returned.
     * The core wraps all its errors in this call and the default
     * implementation simply returns the error as-is.
     *
     * @param context The user-provided context of this call.
     * @param error The error to adjust.
     *
     * @returns the adjusted error.
     */
    adjustBuildInError(
        context: TContext,
        error: AccessPointError
    ): AccessPointError {
        return error;
    }
}
