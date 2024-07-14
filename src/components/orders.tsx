import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import {getOrderColor, Order} from "../data/order";
import {menuItems} from "../data/menu";
import Card from "@mui/material/Card";
import {CardActionArea, Chip, SxProps} from "@mui/material";
import CardContent from "@mui/material/CardContent";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import NoFood from "@mui/icons-material/NoFood";
import CardMedia from "@mui/material/CardMedia";

export function OrderCard(props: {order: Order, disabled: boolean}) {
    const href = `/order?id=${props.order.id}`;
    const item = menuItems[props.order.itemId];
    return (
        <Card sx={{ display: 'flex', flex: '1 0 auto', maxWidth: 860, margin:'auto' }}>
            <CardActionArea disabled={props.disabled} sx={{ display: 'flex', flex: '1 0 auto' }} href={href}>
                <CardContent sx={{ display: 'flex', flex: '1 0 auto' }}>
                    <Box sx={{ display: 'flex', flex: '1 0 auto', flexDirection: 'column' }}>
                        <Box sx={{ flex: '1 0 auto' }}>
                            <Typography component="div" variant="h5">
                                {props.order.name}
                            </Typography>
                            <Typography variant="subtitle1" color="text.secondary" component="div">
                                {"for " + props.order.username}
                            </Typography>
                        </Box>
                        <Box>
                            <Chip label={props.order.status} color={getOrderColor(props.order)} />
                        </Box>
                    </Box>
                    {item && !item.imageUrl && <NoFood sx={{ width: 100, height: 100, p: 3 }} />}
                    {item && item.imageUrl && <CardMedia
                        component="img"
                        sx={{ width: 100, height: 100 }}
                        image={item.imageUrl}
                    />}
                </CardContent>
            </CardActionArea>
        </Card>
    );
}


export function OrdersList(props: {orders: Array<Order>, sx?: SxProps}) {
    return (
        <List disablePadding sx={props.sx}>
            {props.orders.map((order, index) =>
                <ListItem disableGutters key={index}>
                    <OrderCard order={order} disabled={order.status === "done"} />
                </ListItem>
            )}
        </List>
    );
}
