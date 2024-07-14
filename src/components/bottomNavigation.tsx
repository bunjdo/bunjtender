import * as React from 'react';
import {BottomNavigation, BottomNavigationAction, Divider, Paper} from "@mui/material";
import ShoppingBasket from '@mui/icons-material/ShoppingBasket';
import {MenuBook} from "@mui/icons-material";


export default function BottomNavigationBar(props: {value: number, setValue: (value: number) => void}) {
    return (
        <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} elevation={3}>
            <Divider />
            <BottomNavigation
                showLabels
                value={props.value}
                onChange={(event, newValue) => {
                    props.setValue(newValue);
                }}
            >
                <BottomNavigationAction label="menu" icon={<MenuBook />} />
                <BottomNavigationAction label="orders" icon={<ShoppingBasket />} />
            </BottomNavigation>
        </Paper>
    );
}
