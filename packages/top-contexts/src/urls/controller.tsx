import { AppUrlsProvider } from './context';


/**
 * Properties expected by the AppUrlsController.
 */
export interface AppUrlsControllerProps {

    /**
     * The domain for the main application (without any path components).
     *
     * If not set the controller will attempt to use `REACT_APP_WEBSITE_DOMAIN`
     * and `NX_WEBSITE_DOMAIN` environment variables. If those are not set,the
     * controller will look at the current window location. If that is not set,
     * an error will be thrown.
     *
     * @example 'https://www.example.com'
     */
    webappDomain?: string;

    /**
     * The path prefix for the main application.
     *
     * This, together with the appDomain, tells us where the main application
     * is hosted. It should include the version if applicable.
     *
     * If not set the controller will attempt to use `REACT_APP_WEBSITE_PATH`
     * and `NX_WEBSITE_PATH` environment variables. If those are not set, the
     * default empty string will be set.
     *
     * @example '/app'
     * @default ''
     */
    webappPath?: string;

    /**
     * The domain for the API (without any path components).
     *
     * If not set the controller will attempt to use `REACT_APP_API_DOMAIN`
     * and `NX_API_DOMAIN` environment variables. If those are not set, the
     * controller use the `webappDomain` value.
     *
     * @example 'https://api.example.com'
     */
    apiDomain?: string;

    /**
     * The path prefix for the API.
     *
     * This will be joined with the apiDomain and with endpoint paths to create
     * the full URL. It should include the version if applicable.
     *
     * If not set the controller will attempt to use `REACT_APP_API_PATH`
     * and `NX_API_PATH` environment variables. If those are not set, the
     * controller use the `webappPath` value.
     *
     * @example '/api/v1'
     */
    apiPath?: string;

    /**
     * The domain for the API used to authenticate users.
     *
     * If not set the controller will attempt to use `REACT_APP_AUTH_DOMAIN`
     * and `NX_AUTH_DOMAIN` environment variables. If those are not set, the
     * controller use the `apiDomain` value.
     *
     * @example 'https://www.example.com'
     */
    authDomain: string;

    /**
     * The path prefix for the API used to authenticate users.
     *
     * If not set the controller will attempt to use `REACT_APP_AUTH_PATH`
     * and `NX_AUTH_PATH` environment variables. If those are not set, the
     * controller use the `apiPath` value with an '/auth' suffix.
     *
     * @example '/auth'
     */
    authPath: string;

    /** The children that will have domains and urls available to them. */
    children: React.ReactNode;
}


/**
 * Makes top level domains and paths available across the application.
 */
export const AppUrlsController = ({
    webappDomain: userWebappDomain,
    webappPath: userWebappPath,
    apiDomain: userApiDomain,
    apiPath: userApiPath,
    authDomain: userAuthDomain,
    authPath: userAuthPath,
    children
}: AppUrlsControllerProps) => {

    // The domain of the web application.
    let webappDomain = (
        userWebappDomain ||
        process.env.REACT_APP_WEBSITE_DOMAIN ||
        process.env.NX_WEBSITE_DOMAIN
    );
    if (!webappDomain && window && window.location && window.location.origin) {
        webappDomain = window.location.origin;
    }
    if (!webappDomain) {
        throw new Error(
            'The webappDomain must be set in the AppUrlsController or in ' +
            'the REACT_APP_WEBSITE_DOMAIN or NX_WEBSITE_DOMAIN environment ' +
            'variables.'
        );
    }
    if (webappDomain.endsWith('/')) {
        webappDomain = webappDomain.slice(0, -1);
    }

    // The path where it is mounted.
    let webappPath = (
        userWebappPath ||
        process.env.REACT_APP_WEBSITE_PATH ||
        process.env.NX_WEBSITE_PATH ||
        ''
    );
    if (webappPath.endsWith('/')) {
        webappPath = webappPath.slice(0, -1);
    }
    if (!webappPath.startsWith('/')) {
        webappPath = '/' + webappPath;
    }

    // Where we access the main API.
    let apiDomain = (
        userApiDomain ||
        process.env.REACT_APP_API_DOMAIN ||
        process.env.NX_API_DOMAIN ||
        webappDomain
    );
    if (apiDomain.endsWith('/')) {
        apiDomain = apiDomain.slice(0, -1);
    }

    // The path where the API is mounted.
    let apiPath = (
        userApiPath ||
        process.env.REACT_APP_API_PATH ||
        process.env.NX_API_PATH ||
        webappPath
    );
    if (apiPath.endsWith('/')) {
        apiPath = apiPath.slice(0, -1);
    }
    if (!apiPath.startsWith('/')) {
        apiPath = '/' + apiPath;
    }

    // Where we access the authentication API.
    let authDomain = (
        userAuthDomain ||
        process.env.REACT_APP_AUTH_DOMAIN ||
        process.env.NX_AUTH_DOMAIN ||
        apiDomain
    );
    if (authDomain.endsWith('/')) {
        authDomain = authDomain.slice(0, -1);
    }

    // The path where the authentication API is mounted.
    let authPath = (
        userAuthPath ||
        process.env.REACT_APP_AUTH_PATH ||
        process.env.NX_AUTH_PATH ||
        apiPath + '/auth'
    );
    if (authPath.endsWith('/')) {
        authPath = authPath.slice(0, -1);
    }
    if (!authPath.startsWith('/')) {
        authPath = '/' + authPath;
    }

    return (
        <AppUrlsProvider value={{
            webappDomain,
            webappPath,
            getWebappUrl: (endpoint: string) => (
                `${webappDomain}${webappPath}${endpoint}`
            ),

            apiDomain,
            apiPath,
            getApiUrl: (endpoint: string) => (
                `${apiDomain}${apiPath}${endpoint}`
            ),

            authDomain,
            authPath,
            getAuthUrl: (endpoint: string) => (
                `${authDomain}${authPath}${endpoint}`
            ),
        }}>
            {children}
        </AppUrlsProvider>
    );
}
