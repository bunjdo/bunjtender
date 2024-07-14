import React from 'react';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import MenuAppBar from "../components/appbar";
import {ThemeProvider} from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import {theme} from "../components/theme";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Avatar from "@mui/material/Avatar";
import Container from "@mui/material/Container";


export default function NoTopic() {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <MenuAppBar showDrawer={false}></MenuAppBar>
            <Container component="main" maxWidth="xs">
                <Card sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    mt: 16
                }}>
                    <CardContent sx={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                        <Avatar sx={{m: 1, bgcolor: 'secondary.main', mb: 3}}>
                            <LockOutlinedIcon/>
                        </Avatar>
                        <Typography>Please scan bar QR code to use this app.</Typography>
                    </CardContent>
                </Card>
            </Container>
        </ThemeProvider>
    );
}
