import {useNavigate, useSearchParams} from "react-router-dom";
import NotFound from "./notFound";
import React, {useContext, useMemo, useState} from "react";
import {ThemeProvider} from "@mui/material/styles";
import {theme} from "../components/theme";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import MenuAppBar from "../components/appbar";
import {findOrderById, getOrders, updateOrder} from "../data/storage";
import {OrderCard} from "../components/orders";
import {FirebaseServiceContext} from "../index";
import {
    getNextMessagePayloadType,
    getNextOrderStatus,
    getOrderActionName,
    MessagePayloadType,
    Order, OrderStatus
} from "../data/order";
import CardContent from "@mui/material/CardContent";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import {MenuItem, menuItems} from "../data/menu";
import {Fab, Stack} from "@mui/material";
import {Send} from "@mui/icons-material";
import {OkDialog, YesNoDialog} from "../components/dialogs";

function isString(value: any) {
    return typeof value === 'string' || value instanceof String;
}

function ChangeOrderButton(props: {order: Order}) {
    const firebaseService = useContext(FirebaseServiceContext);
    const navigate = useNavigate();
    const [confirmationDialogOpen, setConfirmationDialogOpen] = useState(false);
    const [okDialogOpen, setOkDialogOpen] = useState(false);

    if (props.order.status === "done") {
        return (<Box />);
    }

    const updateStatus = () => {
        setConfirmationDialogOpen(false);
        firebaseService?.send(
            firebaseService?.clientTopic,
            {
                type: getNextMessagePayloadType(props.order) as MessagePayloadType,
                order_id: props.order.id,
            }
        )
        updateOrder({
            ...props.order,
            status: getNextOrderStatus(props.order) as OrderStatus
        });
        setOkDialogOpen(true);
    };
    const onStatusUpdatedOk = () => {
        console.log("Updated order status: ", props.order.status);
        setOkDialogOpen(false);
        if (props.order.status === "ready") {
            navigate("/?page=1");
        } else {
            window.location.reload();
        }
    };

    return (
        <Box>
            <YesNoDialog
                open={confirmationDialogOpen}
                title={"Send status update?"}
                action={updateStatus}
                altAction={() => setConfirmationDialogOpen(false)}
            >
                Sending status update for order "{props.order.name}" for {props.order.username}: {getOrderActionName(props.order)}
            </YesNoDialog>
            <OkDialog open={okDialogOpen} action={onStatusUpdatedOk} title={getOrderActionName(props.order)}>
                Order status updated successfully
            </OkDialog>
            <Fab
                sx={{position: 'fixed', bottom: 16, left: "50%", transform: "translate(-50%, 0)"}}
                variant="extended"
                color="primary"
                onClick={() => setConfirmationDialogOpen(true)}
            >
                <Send sx={{ mr: 2 }} />
                {getOrderActionName(props.order)}
            </Fab>
        </Box>
    )
}

function OrderExtrasCard(props: {order: Order}) {
    return (
        <Card sx={{ mt: 1, maxWidth: 860, ml: 'auto', mr: 'auto' }}>
            <CardContent>
                <Stack spacing={2}>
                    {Object.entries(props.order.extras).map(([name, extra]) =>
                        <Box id={name} key={name}>
                            {isString(extra) && <Typography>{name}: {extra as string}</Typography>}
                            {!isString(extra) && <Typography>
                                {name}: {(extra as string[]).length > 0 ? (extra as string[]).join(", ") : "-"}
                            </Typography>}
                        </Box>
                    )}
                </Stack>
            </CardContent>
        </Card>
    )
}

function OrderItemCard(props: {item: MenuItem}) {
    if (!props.item.recipe) return <Box />;
    return (
        <Card sx={{ mt: 1, maxWidth: 860, ml: 'auto', mr: 'auto' }}>
            <CardContent>
                <Typography sx={{whiteSpace: "break-spaces"}}>{props.item.recipe}</Typography>
            </CardContent>
        </Card>
    )
}

export default function OrderScreen() {
    const [searchParams] = useSearchParams();
    const firebaseService = useContext(FirebaseServiceContext);
    console.log(firebaseService);
    console.log(firebaseService?.isBartender);
    const order = useMemo(() => {
        const orders = getOrders();
        return findOrderById(orders, searchParams.get("id") || "");
    }, [searchParams]);
    const item = useMemo(() => {
        if (!order || !(order.itemId in menuItems)) return null;
        return menuItems[order.itemId];
    }, [order]);

    if (order === null) {
        return <NotFound />;
    }

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Box sx={{ pt: 7 + 4, pb: 2 }}>
                <MenuAppBar showDrawer={false}></MenuAppBar>
                <OrderCard order={order} disabled />
            </Box>
            {Object.keys(order.extras).length > 0 && <OrderExtrasCard order={order} />}
            {firebaseService?.isBartender && item && <OrderItemCard item={item} />}
            {firebaseService?.isBartender && <ChangeOrderButton order={order} />}
        </ThemeProvider>
    );
}
