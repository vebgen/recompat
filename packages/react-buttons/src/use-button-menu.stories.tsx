import type { StoryFn, Meta } from '@storybook/react';
import MenuIcon from '@mui/icons-material/Menu';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import { PopoverOrigin } from '@mui/material/Popover';
import MenuItem from '@mui/material/MenuItem';

import { useButtonMenu } from "./use-button-menu";


// The properties passed to each story.
interface StoryProps { }


// Common configuration for all stories.
const storybookConfig: Meta<StoryProps> = {
    title: 'utility/useButtonMenu',
    tags: [],
    args: {

    },
};
export default storybookConfig;


const anchorOrigin: PopoverOrigin = {
    vertical: 'bottom',
    horizontal: 'right',
}

const transformOrigin: PopoverOrigin = {
    vertical: 'top',
    horizontal: 'right',
}


// Base for all stories in this file.
const Template: StoryFn<StoryProps> = () => {
    const {
        menuId,
        anchorEl,
        handleMenu,
        handleClose,
    } = useButtonMenu();


    return (
        <>
            <IconButton
                size="large"
                aria-label="Click to show the menu"
                aria-controls={menuId}
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
            >
                <MenuIcon />
            </IconButton>
            <Menu
                id={menuId}
                anchorEl={anchorEl}
                anchorOrigin={anchorOrigin}
                keepMounted
                transformOrigin={transformOrigin}
                open={Boolean(anchorEl)}
                onClose={handleClose}
            >
                <MenuItem
                    onClick={handleClose}
                >
                    Click-me
                </MenuItem>
            </Menu>
        </>
    )
}


/**
 * The user is logged in, but does not have the required permissions.
 */
export const Default: StoryFn<StoryProps> = Template.bind({});
Default.args = {};
