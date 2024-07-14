import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import LocalBar from '@mui/icons-material/LocalBar';
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import {Divider, Drawer} from "@mui/material";
import {AccountBox, Liquor, Logout, Settings, Wifi} from "@mui/icons-material";
import {useUsername} from "../data/storage";
import {useNavigate} from "react-router-dom";
import {useContext} from "react";
import {FirebaseServiceContext} from "../index";

export function AppDrawer(props: {open: boolean, setOpen: (open: boolean) => void}) {
    const [username, setUsername] = useUsername();
    let navigate = useNavigate();

    const logout = () => {
        setUsername("");
        navigate("/signup");
    };

    return (
        <Drawer open={props.open} onClose={() => props.setOpen(false)}>
            <Box sx={{ width: 250 }} role="presentation" onClick={() => props.setOpen(false)}>
                <List>
                    <ListItem disablePadding>
                        <ListItemIcon>
                            <AccountBox />
                        </ListItemIcon>
                        <ListItemText primary={username} />
                    </ListItem>
                </List>
                <Divider />
                <List>
                    <ListItem disablePadding>
                        <ListItemButton>
                            <ListItemIcon>
                                <Settings />
                            </ListItemIcon>
                            <ListItemText primary={"Settings"} />
                        </ListItemButton>
                    </ListItem>
                </List>
                <Divider />
                <List>
                    <ListItem disablePadding>
                        <ListItemButton onClick={logout}>
                            <ListItemIcon>
                                <Logout />
                            </ListItemIcon>
                            <ListItemText primary={"Logout"} />
                        </ListItemButton>
                    </ListItem>
                </List>
            </Box>
        </Drawer>
    );
}

export default function MenuAppBar(
    props: {
        showDrawer: boolean,
        children?: React.ReactNode,
    }
) {
    const firebaseService = useContext(FirebaseServiceContext);
    const [open, setOpen] = React.useState(false);

    return (
        <AppBar position="fixed">
            {props.showDrawer && <AppDrawer open={open} setOpen={setOpen}/>}
            <Toolbar>
                <IconButton
                    size="large"
                    edge="start"
                    color="inherit"
                    aria-label="menu"
                    sx={{ mr: 2 }}
                    onClick={() => setOpen(true)}
                >
                    {firebaseService?.isBartender ? <Liquor /> : <LocalBar />}
                </IconButton>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    {firebaseService?.isBartender ? "Bunjtender admin" : "Bunjtender"}
                </Typography>
                <div>
                    <IconButton
                        size="large"
                        aria-label="account of current user"
                        aria-controls="menu-appbar"
                        aria-haspopup="true"
                        color="inherit"
                    >
                        <Wifi />
                    </IconButton>
                </div>
            </Toolbar>
            {props.children}
        </AppBar>
    );
}
