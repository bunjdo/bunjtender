import { initializeApp, FirebaseApp } from 'firebase/app';
import { getMessaging, getToken, MessagePayload, onMessage, Messaging } from 'firebase/messaging';
import { getFunctions, Functions, httpsCallable, HttpsCallable } from 'firebase/functions';
import { md5 } from 'js-md5';
import { MessageData, NotificationData } from "../data/order";


const firebaseConfig = {
    apiKey: "AIzaSyBpzX-in5DvLARZ7qQH06vTPR0kjJ3myNk",
    authDomain: "bunjtender.firebaseapp.com",
    projectId: "bunjtender",
    storageBucket: "bunjtender.appspot.com",
    messagingSenderId: "242969383344",
    appId: "1:242969383344:web:4993c1164b44d829ba8675",
    measurementId: "G-W8BC2CFYSK"
};

export interface IFirebaseService {

}

export class FirebaseService {
    topic: string = "";

    clientTopic: string = "";
    bartenderTopic: string = "";
    isBartender: boolean = false;

    app: FirebaseApp;
    messaging: Messaging;
    functions: Functions;

    onMessageCallback: ((arg0: MessagePayload) => void) | null;

    subscribeFirebaseFunction: HttpsCallable;
    unsubscribeFirebaseFunction: HttpsCallable;
    sendFirebaseFunction: HttpsCallable;

    isSetupNotificationsExecuted = false;

    constructor(topic: string = "", onMessageCallback: ((payload: MessagePayload) => void) | null = null) {
        console.log("Creating FirebaseService with topic: ", topic);
        this.setTopic(topic);

        this.app = initializeApp(firebaseConfig);
        this.messaging = getMessaging(this.app);
        this.functions = getFunctions(this.app);

        this.onMessageCallback = onMessageCallback;

        this.subscribeFirebaseFunction = httpsCallable(this.functions, 'subscribe');
        this.unsubscribeFirebaseFunction = httpsCallable(this.functions, 'unsubscribe');
        this.sendFirebaseFunction = httpsCallable(this.functions, 'send');

        onMessage(this.messaging, (payload: MessagePayload) => {
            console.log('Foreground Message:', payload);
            if (this.onMessageCallback) {
                this.onMessageCallback(payload)
            }
        });
    }

    setOnMessageCallback(onMessageCallback: (payload: MessagePayload) => void): void {
        this.onMessageCallback = onMessageCallback;
    }

    setTopic(topic: string): void {
        if (topic && topic.includes(":")) {
            this.topic = topic;
            [this.clientTopic, this.bartenderTopic] = topic.split(":", 2);
            if (this.bartenderTopic.includes("-")) {
                this.bartenderTopic = md5(this.bartenderTopic);
                this.isBartender = true;
            }
            console.log(this.clientTopic, this.bartenderTopic, this.isBartender);
        }
    }

    getTopicToSubscribe(): string {
        return this.isBartender ? this.bartenderTopic: this.clientTopic;
    }

    getTopicToSend(): string {
        return this.isBartender ? this.clientTopic: this.bartenderTopic;
    }

    isNotificationPermissionsGranted(): boolean {
        return Notification.permission === "granted";
    }

    async setupNotifications(): Promise<void> {
        try {
            const token = await getToken(this.messaging);
            console.log('FCM Token:', token);
            if (!this.topic) {
                const subscriptionTopic = localStorage.getItem("subscription") || "";
                if (subscriptionTopic) {
                    localStorage.setItem("subscription", "");
                    await this.unsubscribe(subscriptionTopic, token);
                }
                return;
            }
            if ((localStorage.getItem("subscription") || "") !== `${this.topic}.${token}`) {
                await this.subscribe(this.getTopicToSubscribe(), token);
                localStorage.setItem("subscription", `${this.topic}.${token}`);
                console.log('Subscribed to topic:', this.topic);
            } else {
                console.log('Already subscribed to topic:', this.topic);
            }
            this.isSetupNotificationsExecuted = true;
        } catch (error) {
            console.error('Error setting up notifications:', error);
        }
    }

    async subscribe(topic: string, token: string): Promise<any> {
        console.log('Subscribing to topic:', topic);
        let response = await this.subscribeFirebaseFunction({topic, token})
        console.log('Successfully subscribed to topic:', topic);
        return response.data;
    }

    async unsubscribe(topic: string, token: string): Promise<any> {
        console.log('Unsubscribing from topic:', topic);
        let response = await this.unsubscribeFirebaseFunction({topic, token})
        console.log('Successfully unsubscribed from topic:', topic);
        return response.data;
    }

    async send(topic: string, data: MessageData, notification?: NotificationData): Promise<any> {
        const dataString = JSON.stringify(data);
        let response = await this.sendFirebaseFunction(
            {topic: topic, notification: notification, data: {json: dataString}}
        )
        return response.data;
    }

}
