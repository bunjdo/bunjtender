import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import ItemsList from "./itemsList";
import {MenuItem} from "../data/menu";
import {SxProps} from "@mui/material";

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function CustomTabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
        </div>
    );
}

export function TabHeader(props: {tabs: Array<string>, selectedTab: number, setSelectedTab: (selectedTab: number) => void}) {
    return (
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs
                value={props.selectedTab}
                onChange={(_: React.SyntheticEvent, selectedTab: number) => props.setSelectedTab(selectedTab)}
                indicatorColor="primary"
                textColor="primary"
                variant="scrollable"
                scrollButtons
                allowScrollButtonsMobile
            >
                {props.tabs.map((item, index) =>
                    <Tab label={item} key={index} />
                )}
            </Tabs>
        </Box>
    )
}

export default function MenuTabs(props: {tabs: Array<Array<MenuItem>>, selectedTab: number, sx?: SxProps}) {
    return (
        <Box sx={{ width: '100%', ...props.sx }}>
            {props.tabs.map((items, index) => <CustomTabPanel value={props.selectedTab} index={index} key={index}>
                <ItemsList items={items.filter((item) => !item.disabled)}/>
            </CustomTabPanel>)}
        </Box>
    );
}
