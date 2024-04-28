import { createContext, useContext } from 'react';


/**
 * The data available from the AppUrlsContext.
 */
export interface AppUrlsContextData {
    /**
     * The domain for the API (without any path components).
     *
     * The string never ends with a slash.
     *
     * @example 'https://api.example.com'
     */
    apiDomain: string;

    /**
     * The path prefix for the API.
     *
     * This will be joined with the apiDomain and with endpoint paths to create
     * the full URL. It should include the version if applicable.
     *
     * The string always starts with a slash and never ends with a slash.
     * If the API calls are going to the root of the domain, this should be
     * an empty string.
     *
     * @example '/api/v1'
     */
    apiPath: string;

    /**
     * A function that computes the full URL for an API endpoint.
     *
     * This function will join the apiDomain, apiPath, and the endpoint to
     * create the full address.
     *
     * @param endpoint The path to the endpoint, starting with a slash.
     */
    getApiUrl: (endpoint: string) => string;

    /**
     * The domain for the main application (without any path components).
     *
     * The string never ends with a slash.
     *
     * @example 'https://www.example.com'
     */
    webappDomain: string;

    /**
     * The path prefix for the main application.
     *
     * This, together with the webappDomain, tells us where the main application
     * is hosted. It should include the version if applicable.
     *
     * The string always starts with a slash and never ends with a slash.
     * If the application is hosted at the root of the domain, this should be
     * an empty string.
     *
     * @example '/app'
     */
    webappPath: string;

    /**
     * A function that computes the full URL for an application endpoint.
     *
     * This function will join the webappDomain, webappPath, and the endpoint
     * to create the full address.
     *
     * @param endpoint The path to the endpoint, starting with a slash.
     */
    getWebappUrl: (endpoint: string) => string;


    /**
     * The domain for the API used to authenticate users.
     *
     * The string never ends with a slash.
     *
     * @example 'https://www.example.com'
     */
    authDomain: string;

    /**
     * The path prefix for the API used to authenticate users.
     *
     * The string always starts with a slash and never ends with a slash.
     * If the auth call goes to the root of the domain, this should be
     * an empty string.
     *
     * @example '/auth'
     */
    authPath: string;

    /**
     * A function that computes the full URL for the auth endpoint.
     *
     * This function will join the authDomain, authPath, and the endpoint to
     * create the full address.
     *
     * @param endpoint The path to the endpoint, starting with a slash.
     */
    getAuthUrl: (endpoint: string) => string;
}


/**
 * A context that stores domains and paths.
 */
export const AppUrlsContext = createContext<AppUrlsContextData | null>(null);


/**
 * The provider for the AppUrls context.
 */
export const AppUrlsProvider = AppUrlsContext.Provider;


/**
 * The hook to use the AppUrls context.
 */
export function useAppUrls(): AppUrlsContextData {
    const result = useContext(AppUrlsContext);
    if (result === undefined) {
        throw new Error('useAppUrls must be used within a AppUrlsProvider');
    }
    return result as AppUrlsContextData;
};


/**
 * The default export is the AppUrls context.
 */
export default AppUrlsContext;
