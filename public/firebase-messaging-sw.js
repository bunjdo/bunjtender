importScripts('https://www.gstatic.com/firebasejs/9.6.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.6.1/firebase-messaging-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.6.1/firebase-functions-compat.js');

const firebaseConfig = {
    apiKey: "AIzaSyBpzX-in5DvLARZ7qQH06vTPR0kjJ3myNk",
    authDomain: "bunjtender.firebaseapp.com",
    projectId: "bunjtender",
    storageBucket: "bunjtender.appspot.com",
    messagingSenderId: "242969383344",
    appId: "1:242969383344:web:4993c1164b44d829ba8675",
    measurementId: "G-W8BC2CFYSK"
};


var dbWrapper = (storeName, callback) => {
    var open = indexedDB.open("bunjtender", 1);

    open.onupgradeneeded = function() {
        var db = open.result;
        var ordersStore = db.createObjectStore("orders", {keyPath: "id"});
        ordersStore.createIndex("byCreatedAt", "createdAt");
        db.createObjectStore("config");
    };

    open.onsuccess = function() {
        var db = open.result;
        var tx = db.transaction(storeName, "readwrite");
        var store = tx.objectStore(storeName);
        callback(store);
        tx.oncomplete = function() {
            db.close();
        };
    }
}

var getClientTopic = (storedTopic) => {
    if (storedTopic && storedTopic.includes(":")) {
        var clientTopic = storedTopic.split(":", 2)[0];
        return clientTopic;
    }
    return undefined;
}

firebase.initializeApp(firebaseConfig);
var messaging = firebase.messaging();
var functions = firebase.functions();
// Customize background notification handling here
messaging.onBackgroundMessage((message) => {
    console.log("Background Message (service worker):", message);

    // var title = "";
    // var body = "";
    // var url = "/";

    if (message.data?.json) {
        var messageData = JSON.parse(message.data.json);

        if (messageData.type === "new_order" && messageData.order) {
            messageData.order.status = "confirmed";
            dbWrapper("orders", (store) => {
                store.add(messageData.order);
            })
            dbWrapper("config", (store) => {
                var getStoredTopic = store.get("topic");
                getStoredTopic.onsuccess = function() {
                    var clientTopic = getClientTopic(getStoredTopic.result);
                    var send = functions.httpsCallable("send");
                    send({
                        topic: clientTopic,
                        notification: {
                            title: "Order confirmed",
                            body: `${messageData.order.name} for ${messageData.order.username} is confirmed`,
                            image: "/notification.icon.png",
                        },
                        data: {
                            json: JSON.stringify({
                                type: "order_confirmed",
                                orderId: messageData.order.id,
                            })
                        }
                    }).then((result) => {
                        console.log(result.data.text);
                    });
                    return self.registration.showNotification(message.data?.title || "New order", {
                        body: message.data?.body || "",
                        icon: message.data?.image || '/notification.icon.png',
                    });
                };
            })
        } else if (["order_confirmed", "order_ready", "order_done"].includes(messageData.type) && messageData.orderId) {
            dbWrapper("orders", (store) => {
                console.log(messageData.orderId);
                var getOrder = store.get(messageData.orderId);
                getOrder.onsuccess = function() {
                    var order = getOrder.result;
                    console.log(getOrder);
                    console.log(order);
                    if (messageData.type === "order_confirmed") {
                        order.status = "ready";
                    } else if (messageData.type === "order_ready") {
                        order.status = "ready";
                    } else if (messageData.type === "order_done") {
                        order.status = "done";
                    }
                    store.put(order);
                    return self.registration.showNotification(message.data?.title || "Order update", {
                        body: message.data?.body || "",
                        icon: message.data?.image || '/notification.icon.png',
                    }) ;
                };
            })
        }
    }
});
