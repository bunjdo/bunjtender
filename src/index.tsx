import React, {createContext, ReactElement, useCallback, useEffect, useMemo, useState} from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import {registerServiceWorker} from "./services/serviceWorker";
import Main from "./screens/main";
import {BrowserRouter, Route, Routes, useLocation, useNavigate, useSearchParams} from "react-router-dom";
import SignUp from "./screens/signup";
import NotFound from "./screens/notFound";
import MenuItemScreen from "./screens/menuItem";
import {onMessageData, useTopic, useUsername} from "./data/storage";
import NoTopic from "./screens/noTopic";
import {FirebaseService} from "./services/firebase";
import {Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Snackbar} from "@mui/material";
import Button from "@mui/material/Button";
import {MessagePayload} from "firebase/messaging";
import {MessageData, getOrderNotification} from "./data/order";
import {useAudio} from "./services/audio";
import OrderScreen from "./screens/order";


registerServiceWorker();
const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);

export const FirebaseServiceContext = createContext<FirebaseService | null>(null);

function App(props: {children: ReactElement}): ReactElement {
    let location = useLocation();
    let navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [name, setName] = useUsername();
    const [topic, setTopic] = useTopic();
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [notificationDialogOpen, setNotificationDialogOpen] = useState(false);
    const [, setPlaying] = useAudio("/notification.mp3");

    const firebaseService: FirebaseService = useMemo(() => new FirebaseService(topic), []);
    const onMessageCallback = useCallback(async (message: MessagePayload) => {
        if (!message.data?.json) return;
        const order = onMessageData(
            JSON.parse(message.data.json) as MessageData,
            firebaseService.isBartender,
        );
        if (!order) return;

        const notification = getOrderNotification(order, firebaseService.isBartender);
        setSnackbarMessage(`${notification.title}\n${notification.body}`);
        setPlaying(true);

        if (order.status === "confirmed" && firebaseService.isBartender) {
            const data: MessageData = {
                type: "order_received",
                order_id: order.id,
            };
            await firebaseService.send(firebaseService.clientTopic, data);
        }
    }, [firebaseService, setPlaying])

    useEffect(() => {
        const inputTopic = searchParams.get("topic") || "";
        if (!inputTopic && !topic && location.pathname !== "/no-token") {
            console.log("!inputTopic && !topic");
            return navigate("/no-topic");
        }
        if (inputTopic && inputTopic.includes(":") && inputTopic !== topic) {
            console.log("inputTopic !== topic");
            setTopic(inputTopic);
            setName("");
            return navigate("/signup");
        }
        if (!name && location.pathname !== "/signup") {
            if (!localStorage.getItem("username")) {
                return navigate("/signup");
            }
        }
        if (name && location.pathname === "/signup") {
            console.log("/");
            return navigate("/");
        }

        firebaseService.setOnMessageCallback(onMessageCallback);
        if (firebaseService.isNotificationPermissionsGranted() && !firebaseService.isSetupNotificationsExecuted) {
            firebaseService.setupNotifications().then();
        }

        if (!firebaseService.isNotificationPermissionsGranted()) {
            setNotificationDialogOpen(true);
        }
    }, [firebaseService, location, name, navigate, onMessageCallback, searchParams, setName, setTopic, topic]);

    const onNotificationsDialogOk = async () => {
        await firebaseService.setupNotifications();
        if (firebaseService.isNotificationPermissionsGranted()) {
            firebaseService.setOnMessageCallback(onMessageCallback);
            setNotificationDialogOpen(false);
        }
    };

    return <FirebaseServiceContext.Provider value={firebaseService}>
        <Dialog
            open={notificationDialogOpen}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">This app requires notifications permissions</DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    This app requires notifications permissions to work properly.
                    Please allow notifications to continue.
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={onNotificationsDialogOk} autoFocus>
                    Continue
                </Button>
            </DialogActions>
        </Dialog>
        <Snackbar
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            open={Boolean(snackbarMessage)}
            message={snackbarMessage}
            onClose={() => setSnackbarMessage("")}
            disableWindowBlurListener
            sx={{whiteSpace: 'pre-line'}}
        />
        {props.children}
    </FirebaseServiceContext.Provider>
}

root.render(
  <React.StrictMode>
      <BrowserRouter>
          <Routes>
              <Route index element={<App><Main /></App>} />
              <Route path="/signup" element={<App><SignUp /></App>} />
              <Route path="/item" element={<App><MenuItemScreen /></App>} />
              <Route path="/order" element={<App><OrderScreen /></App>} />
              <Route path="/no-topic" element={<NoTopic />} />
              <Route path="*" element={<NotFound />} />
          </Routes>
      </BrowserRouter>
  </React.StrictMode>
);
