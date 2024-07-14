import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ItemCard from "./itemCard";

export default function ItemsList(props: {items: Array<any>}) {
    return (
        <List disablePadding>
            {props.items.map((item, index) =>
                <ListItem disableGutters key={index}>
                    <ItemCard item={item} disabled={false} />
                </ListItem>
            )}
        </List>
    );
}
