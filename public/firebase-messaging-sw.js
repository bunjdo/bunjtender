importScripts('https://www.gstatic.com/firebasejs/9.6.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.6.1/firebase-messaging-compat.js');

const firebaseConfig = {
    apiKey: "AIzaSyBpzX-in5DvLARZ7qQH06vTPR0kjJ3myNk",
    authDomain: "bunjtender.firebaseapp.com",
    projectId: "bunjtender",
    storageBucket: "bunjtender.appspot.com",
    messagingSenderId: "242969383344",
    appId: "1:242969383344:web:4993c1164b44d829ba8675",
    measurementId: "G-W8BC2CFYSK"
};
firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();
// Customize background notification handling here
messaging.onBackgroundMessage((message) => {
    console.log('Background Message (service worker):', message);
    const notificationTitle = "I'm a message";
    const notificationOptions = {
        body: message.data.payload,
    };
    self.registration.showNotification(notificationTitle, notificationOptions);
});
