import React, {ChangeEvent, useContext, useEffect, useRef, useState} from 'react';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import MenuAppBar from "../components/appbar";
import Box from "@mui/material/Box";
import {ThemeProvider} from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import {theme} from "../components/theme";
import {useNavigate, useSearchParams} from "react-router-dom";
import {MenuItem, MenuItemExtra, MenuItemFeature, menuItems} from "../data/menu";
import ItemCard from "../components/itemCard";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import CardContent from "@mui/material/CardContent";
import {
    Checkbox, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Fab,
    FormControl,
    FormControlLabel,
    FormGroup,
    FormLabel,
    Radio,
    RadioGroup,
    Stack,
    Zoom
} from "@mui/material";
import {FeatureIcon} from "../components/icons";
import {Add} from "@mui/icons-material";
import {FirebaseServiceContext} from "../index";
import {Order, MessageData, getOrderNotification} from "../data/order";
import {OrdersStorage, useUsername} from "../data/storage";
import {generateUUID} from "../data/uuid";
import Button from "@mui/material/Button";
import {delay, Events} from "../services/events";
import NotFound from "./notFound";


type MenuItemExtrasState = Record<
    string,
    [string | Record<string, boolean>, ((state: string) => void) | ((state: Record<string, boolean>) => void)]
>


function capitalizeFirstLetter(value: string): string {
    return value.charAt(0).toUpperCase() + value.slice(1);
}


function MenuItemDetailsCard(props: {item: MenuItem}) {
    const firebaseService = useContext(FirebaseServiceContext);
    return (
        <Card sx={{ mt: 1, maxWidth: 860, ml: 'auto', mr: 'auto' }}>
            <CardContent>
                <Typography>
                    {props.item.longDescription}
                </Typography>
                {props.item.features.map((feature: MenuItemFeature) =>
                    <Stack direction="row" alignItems="center" gap={1} sx={{mt: 2}} key={feature}>
                        <FeatureIcon feature={feature} />
                        <Typography variant="body1">{capitalizeFirstLetter(feature)}</Typography>
                    </Stack>
                )}
                {firebaseService?.isBartender && <Typography sx={{mt: 2, whiteSpace: "break-spaces"}}>
                    {props.item.recipe}
                </Typography>}
            </CardContent>
        </Card>
    );
}


function MenuItemExtraRadio(props: {extra: MenuItemExtra, state: string, setState: (value: string) => void}) {
    return (
        <FormControl>
            <FormLabel>{props.extra.name}</FormLabel>
            <RadioGroup
                name={props.extra.name}
                value={props.state}
                onChange={(_: ChangeEvent<HTMLInputElement>, value: string) => props.setState(value)}
            >
                {props.extra.items.map((item: string) =>
                    <FormControlLabel value={item} control={<Radio />} label={item} key={item} />
                )}
            </RadioGroup>
        </FormControl>
    );
}


function MenuItemExtraChecklist(
    props: {extra: MenuItemExtra, state: Record<string, boolean>, setState: (state: Record<string, boolean>) => void}
) {
    return (
        <FormControl component="fieldset" variant="standard">
            <FormLabel>{props.extra.name}</FormLabel>
            <FormGroup>
                {props.extra.items.map((item: string) =>
                    <FormControlLabel
                        value={item}
                        control={
                            <Checkbox
                                checked={props.state[item]}
                                onChange={(_: ChangeEvent<HTMLInputElement>, checked: boolean) => {
                                    props.setState({
                                        ...props.state,
                                        [item]: checked,
                                    });
                                }}
                                name={item}
                            />
                        }
                        label={item}
                        key={item} />
                )}
            </FormGroup>
        </FormControl>
    );
}


const transitionDuration = {
    enter: theme.transitions.duration.enteringScreen,
    exit: theme.transitions.duration.leavingScreen,
};


function MenuItemExtrasCard(props: {item: MenuItem, states: MenuItemExtrasState}) {
    return (
        <Card sx={{ mt: 1, maxWidth: 860, ml: 'auto', mr: 'auto' }}>
            <CardContent>
                <Stack spacing={2}>
                    {Object.entries(props.item.extras).map(([name, extra]) =>
                        <Box key={name}>
                            {extra.type === "radio" && <MenuItemExtraRadio
                                extra={extra}
                                state={props.states[name][0] as string}
                                setState={props.states[name][1] as (state: string) => void}
                            />}
                            {extra.type === "checklist" && <MenuItemExtraChecklist
                                extra={extra}
                                state={props.states[name][0] as Record<string, boolean>}
                                setState={props.states[name][1] as (state: Record<string, boolean>) => void}
                            />}
                        </Box>
                    )}
                </Stack>
            </CardContent>
        </Card>
    );
}


function CreateOrderButton(props: {item: MenuItem, states: MenuItemExtrasState}) {
    const firebaseService = useContext(FirebaseServiceContext);
    const navigate = useNavigate();
    const [username] = useUsername();
    const [confirmation, setConfirmation] = useState(false);
    const [creating, _setCreating] = useState(false);
    let isCreating = useRef(creating);
    const setCreating = (value: boolean) => {
        _setCreating(value);
        isCreating.current = value;
    };
    const [created, setCreated] = useState(false);
    const [failed, setFailed] = useState(false);
    const [buttonDisabled, setButtonDisabled] = useState(firebaseService?.isBartender);
    const orderId: React.MutableRefObject<string | null> = useRef<string | null>(null);

    useEffect(() => {
        const onOrder = (event: any) => {
            console.log(event);
            if (
                isCreating.current
                && event.detail
                && event.detail.status
                && event.detail.id === orderId.current
                && event.detail.status === "confirmed"
            ) {
                setCreating(false);
                setCreated(true);
            }
        };
        Events.subscribe("order", onOrder);
        return () => Events.unsubscribe("order", onOrder);
    }, []);

    const onOrderConfirmed = async () => {
        setButtonDisabled(true);
        setConfirmation(false);
        setCreating(true);
        const extras: Record<string, string | string[]> = Object.assign(
            {},
            ...Object.entries(props.states).map(([name, [state, _]]) => {
                let processedState: string | string[];
                if (typeof state == "string") {
                    processedState = state as string;
                } else {
                    processedState = Object.entries(state as Record<string, boolean>).filter(([, selected]) => selected).map(
                        ([value, _]) => value
                    );
                }
                return {[name]: processedState}
            })
        );
        const order: Order = {
            id: generateUUID(),
            itemId: props.item.id,
            username: username,
            name: props.item.name,
            extras: extras,
            status: "new",
            createdAt: Date.now(),
        }
        const data: MessageData = {
            type: "new_order",
            order: order,
        };
        await new OrdersStorage().add(order);
        const notification = getOrderNotification(order, firebaseService!.isBartender);
        orderId.current = order.id;
        Events.trigger("order", order);
        console.log("Sending message: ", data, notification);
        await firebaseService!.send(firebaseService!.getTopicToSend(), data, notification);

        await delay(20000);
        if (isCreating.current) {
            console.log("Order confirmation timeout");
            setCreating(false);
            setFailed(true);
            setButtonDisabled(false);
            console.log("Deleting unconfirmed order: ", orderId.current);
            if (orderId.current) await new OrdersStorage().delete(orderId.current);
            orderId.current = null;
        }
    };

    return (<div>
        <Zoom
            in={true}
            timeout={transitionDuration}
            style={{
                transitionDelay: `${transitionDuration.exit}ms`,
            }}
            unmountOnExit
        >
            <Fab
                disabled={buttonDisabled}
                sx={{position: 'fixed', bottom: 16, right: 16}}
                color='primary'
                onClick={() => setConfirmation(true)}
            >
                <Add />
            </Fab>
        </Zoom>
        <Dialog open={confirmation} keepMounted={true}>
            <DialogTitle>Create order</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Are you sure you want to create new order?
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={onOrderConfirmed} autoFocus>
                    Confirm
                </Button>
                <Button onClick={() => setConfirmation(false)} autoFocus>
                    Cancel
                </Button>
            </DialogActions>
        </Dialog>
        <Dialog open={creating} keepMounted={true}>
            <DialogTitle>You order had been sent to kitchen</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Please wait for order to be confirmed
                </DialogContentText>
                <DialogContent>
                    <Box sx={{ m: 2, display: 'flex', justifyContent: 'center' }}>
                        <CircularProgress />
                    </Box>
                </DialogContent>
            </DialogContent>
        </Dialog>
        <Dialog open={created} keepMounted={true}>
            <DialogTitle>Order confirmed</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Your order is confirmed.
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => navigate("/?page=1")} autoFocus>
                    OK
                </Button>
            </DialogActions>
        </Dialog>
        <Dialog open={failed} keepMounted={true}>
            <DialogTitle>Order was not confirmed</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Your order was not confirmed in time.
                    You either don't have notifications enabled or bar is not receiving orders at the moment.
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => setFailed(false)} autoFocus>
                    OK
                </Button>
            </DialogActions>
        </Dialog>
    </div>);
}


export default function MenuItemScreen() {
    const [searchParams] = useSearchParams();
    if (!((searchParams.get("id") || "") in menuItems)) {
        return <NotFound />;
    }
    const item = menuItems[searchParams.get("id") || ""];
    const states: MenuItemExtrasState = Object.assign(
        {},
        ...Object.entries(item.extras).map(
            ([name, extra]) =>
                // eslint-disable-next-line react-hooks/rules-of-hooks
                ({[name]: useState(
                        (extra.type === "radio")
                            ? extra.items[0]
                            : Object.assign({}, ...extra.items.map((item: string) => ({[item]: false})))
                    )})
        )
    );

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Box sx={{ pt: 7 + 4, pb: 2 }}>
                <MenuAppBar showDrawer={false}></MenuAppBar>
                <ItemCard item={item} disabled />
                <MenuItemDetailsCard item={item} />
                {Object.keys(item.extras).length > 0 && <MenuItemExtrasCard item={item} states={states} />}
            </Box>
            <CreateOrderButton item={item} states={states} />
        </ThemeProvider>
    );
}
