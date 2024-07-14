import * as React from 'react';
import {MenuItemFeature} from "../data/menu";
import {AcUnit, Grass, LocalFireDepartment, SoupKitchen} from "@mui/icons-material";

export function FeatureIcon(props: {feature: MenuItemFeature}) {
    switch (props.feature) {
        case "spicy": return <LocalFireDepartment />;
        case "vegetarian": return <Grass />;
        case "warm": return <SoupKitchen />;
        case "cold": return <AcUnit />;
    }
}
