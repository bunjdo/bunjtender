import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import NoFood from '@mui/icons-material/NoFood';
import {MenuItem, MenuItemFeature} from "../data/menu";
import {CardActionArea} from "@mui/material";
import {FeatureIcon} from "./icons";

export default function ItemCard(props: {item: MenuItem, disabled: boolean}) {
    const href = `/item?id=${props.item.id}`;
    return (
        <Card sx={{ display: 'flex', flex: '1 0 auto', maxWidth: 860, margin:'auto' }}>
            <CardActionArea disabled={props.disabled} sx={{ display: 'flex', flex: '1 0 auto' }} href={href}>
                <CardContent sx={{ display: 'flex', flex: '1 0 auto' }}>
                    <Box sx={{ display: 'flex', flex: '1 0 auto', flexDirection: 'column' }}>
                        <Box sx={{ flex: '1 0 auto' }}>
                            <Typography component="div" variant="h5">
                                {props.item.name}
                            </Typography>
                            <Typography variant="subtitle1" color="text.secondary" component="div">
                                {props.item.shortDescription}
                            </Typography>
                        </Box>
                        <Box>
                            {props.item.features.map((feature: MenuItemFeature) => <FeatureIcon key={feature} feature={feature} />)}
                        </Box>
                    </Box>
                    {!props.item.imageUrl && <NoFood sx={{ width: 100, height: 100, p: 3 }} />}
                    {props.item.imageUrl && <CardMedia
                        component="img"
                        sx={{ width: 100, height: 100 }}
                        image={props.item.imageUrl}
                    />}
                </CardContent>
            </CardActionArea>
        </Card>
    );
}
