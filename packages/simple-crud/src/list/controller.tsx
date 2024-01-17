import { ReactNode, createContext, useContext } from "react";
import { UseCrudProps, UseCrudResult, useCrud } from "./hook";


// The context is used to pass the hook result to the child components.
export const crudContext = createContext<
    null | UseCrudResult<any, string | number | symbol>
>(null);


/**
 * The provider is used to pass the hook result to the child components.
 */
export const CrudProvider = crudContext.Provider;


/**
 * Properties expected by the CRUD controller component.
 */
export interface CrudControllerProps<
    T, ListKey extends string | number | symbol
> extends UseCrudProps<T, ListKey> {

    /**
     * The children components.
     */
    children: ReactNode;
}


/**
 * The CRUD controller component.
 */
export function CrudController<T, ListKey extends string | number | symbol>({
    children,
    ...props
}: CrudControllerProps<T, ListKey>) {
    return (
        <CrudProvider value={useCrud<T, ListKey>(props) as any}>
            {children}
        </CrudProvider>
    );
}


/**
 * The hook that you can use to get the CRUD controller result.
 */
export function useCrudController<
    T, ListKey extends string | number | symbol
>() {
    const value = useContext(crudContext);
    if (value === null) {
        throw new Error(
            "No CRUD provider. Please wrap this component in a " +
            "<CrudProvider> component"
        );
    }
    return value as unknown as UseCrudResult<T, ListKey>;
}
