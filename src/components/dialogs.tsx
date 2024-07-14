import {Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle} from "@mui/material";
import Button from "@mui/material/Button";
import React from "react";

export function YesNoDialog(props: {
    open: boolean,
    title: string,
    yesText?: string,
    noText?: string,
    action: () => void,
    altAction? : () => void,
    children?: React.ReactNode,
}) {
    return (
        <Dialog open={props.open} keepMounted={true}>
            <DialogTitle>{props.title}</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    {props.children}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={props.action} autoFocus>
                    {props.yesText || "Confirm"}
                </Button>
                <Button onClick={props.altAction || (() => {})}>
                    {props.noText || "Cancel"}
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export function OkDialog(props: {
    open: boolean,
    title: string,
    buttonText?: string,
    action: () => void,
    children?: React.ReactNode,
}) {
    return (
        <Dialog open={props.open} keepMounted={true}>
            <DialogTitle>{props.title}</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    {props.children}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={props.action} autoFocus>
                    {props.buttonText || "OK"}
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export function NoButtonsDialog(props: {
    open: boolean,
    title: string,
    children?: React.ReactNode,
}) {
    return (
        <Dialog open={props.open} keepMounted={true}>
            <DialogTitle>{props.title}</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    {props.children}
                </DialogContentText>
            </DialogContent>
        </Dialog>
    )
}
