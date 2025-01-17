import React, {useCallback, useEffect, useState} from 'react';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import MenuAppBar from "../components/appbar";
import BottomNavigationBar from "../components/bottomNavigation";
import MenuTabs, {TabHeader} from "../components/menuTabs";
import Box from "@mui/material/Box";
import {menu} from "../data/menu";
import {ThemeProvider} from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import {theme} from "../components/theme";
import {OrdersList} from "../components/orders";
import {OrdersStorage} from "../data/storage";
import {Events} from "../services/events";
import {useSearchParams} from "react-router-dom";
import {Order} from "../data/order";


export default function MainScreen() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [page, setPage] = useState(parseInt(searchParams.get("page") || "0"));
    const [tab, setTab] = useState(parseInt(searchParams.get("tab") || "0"));
    const [orders, setOrders] = useState<Order[]>([]);

    const loadOrders = useCallback(() => {
        new OrdersStorage().list().then(setOrders);
    }, [])

    useEffect(() => {
        searchParams.set("page", page.toString());
        searchParams.set("tab", tab.toString());
        setSearchParams(searchParams);
    }, [searchParams, page, tab, setSearchParams]);

    useEffect(() => {
        loadOrders();
    }, [loadOrders]);

    useEffect(() => {
        Events.subscribe("order", loadOrders);
        return () => Events.unsubscribe("order", loadOrders);
    });

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Box>
                <MenuAppBar showDrawer>
                    {page === 0 && <TabHeader tabs={Object.keys(menu)} selectedTab={tab} setSelectedTab={setTab}/>}
                </MenuAppBar>
                {page === 0 && <MenuTabs tabs={Object.values(menu)} selectedTab={tab} sx={{ pt: 14, pb: 7 }}/>}
                {page === 1 && <OrdersList orders={orders} sx={{ pt: 10, pb: 9 }}/>}
                <BottomNavigationBar value={page} setValue={setPage} />
            </Box>
        </ThemeProvider>
    );
}
