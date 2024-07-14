import {useState} from "react";
import {Order, MessageData} from "./order";
// @ts-ignore
import LockableStorage from "lockable-storage";
import {menuItems} from "./menu";
import {Events} from "../services/events";

export function useUsername(): [string, (username: string) => void] {
    const [username, _setUsername] = useState(localStorage.getItem("username") || "");
    const setUsername = (name: string) => {
        localStorage.setItem("username", name);
        _setUsername(name);
    }
    return [username, setUsername];
}

export function useTopic(): [string, (token: string) => void] {
    const [topic, _setTopic] = useState(localStorage.getItem("topic") || "");
    const setTopic = (value: string) => {
        localStorage.setItem("topic", value);
        _setTopic(value);
    }
    return [topic, setTopic];
}

export function getOrders(): Array<Order> {
    return (JSON.parse(localStorage.getItem("orders") || "[]") as Array<Order>).filter(
        (order) => order.status !== "done"
    );
}

export function saveOrder(order: Order): void {
    LockableStorage.trySyncLock("orders", function () {
        const orders = getOrders();
        orders.unshift(order);
        localStorage.setItem("orders", JSON.stringify(orders));
    });
}

export function updateOrder(order: Order): void {
    LockableStorage.trySyncLock("orders", function () {
        const orders = getOrders();
        let storedOrder: Order | null = null;
        for (const iterable of orders) {
            if (iterable.id === order.id) {
                storedOrder = iterable;
                break;
            }
        }
        if (!storedOrder) return;
        storedOrder.status = order.status
        localStorage.setItem("orders", JSON.stringify(orders));
    });
}

export function useOrders(): [Array<Order>, (orders: Array<Order>) => void] {
    const [orders, setOrders] = useState<Array<Order>>(
        getOrders()
    );
    return [orders, setOrders];
}

export function findOrderById(orders: Array<Order>, id: string): Order | null {
    for (let order of orders) {
        if (order.id === id) return order
    }
    return null;
}

export function deleteOrderById(id: string): void {
    LockableStorage.trySyncLock("orders", function () {
        let orders = getOrders().filter((value) => value.id !== id);
        localStorage.setItem("orders", JSON.stringify(orders));
    });
}

export function onMessageData(data: MessageData, isBartender: boolean): Order | null {
    let order: Order | null = null;
    LockableStorage.trySyncLock("orders", function () {
        const orders = getOrders();
        if (isBartender && data.order && data.type === "new_order") {
            order = data.order;
            if (!(order.itemId in menuItems)) {
                console.log("New order containing unknown item received: ", order);
                return;
            }
            order.status = "confirmed";
            orders.push(order);
            localStorage.setItem("orders", JSON.stringify(orders));
            console.log("New order: ", order);
            Events.trigger("order", order);
        } else if (!isBartender && data.order_id && ["order_received", "order_ready", "order_done"].includes(data.type)) {
            order = findOrderById(orders, data.order_id);
            if (order) {
                if (data.type === "order_received") order.status = "confirmed";
                if (data.type === "order_ready") order.status = "ready";
                if (data.type === "order_done") order.status = "done";
                localStorage.setItem("orders", JSON.stringify(orders));
                console.log("Order updated: ", order);
            } else {
                console.log("Update for unknown order id received: ", data.order_id);
            }
            Events.trigger("order", order);
        } else {
            console.log("Unknown message received: ", data);
        }
    });
    return order;
}
