import { useId, useState, MouseEvent } from "react";


/**
 * The shape of the data returned by the useButtonMenu hook.
 */
export interface UseButtonMenuResult {

    /**
     * The ID that should be used with the menu component.
     */
    menuId: string;

    /**
     * The element that should be used as the anchor for the menu.
     */
    anchorEl: HTMLElement | null;

    /**
     * The function that should be used to open the menu.
     */
    handleMenu: (event: MouseEvent<HTMLElement>) => void;

    /**
     * The function that should be used to close the menu.
     */
    handleClose: () => void;
};


/**
 * Hook that includes the basics for using a button that shows a menu.
 */
export const useButtonMenu = () => {
    // Menu id.
    const menuId = useId();

    // Menu anchor.
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    // Open the menu.
    const handleMenu = (event: MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    // Close the menu.
    const handleClose = () => {
        setAnchorEl(null);
    };

    return {
        menuId,
        anchorEl,
        handleMenu,
        handleClose,
    }
}
