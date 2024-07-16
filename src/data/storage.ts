import {useState} from "react";
import {openDB, DBSchema} from 'idb';
import {Order, MessageData} from "./order";
import {menuItems} from "./menu";
import {Events} from "../services/events";
import {IDBPDatabase} from "idb/build/entry";

interface BunjtenderDB extends DBSchema {
    orders: {
        key: string;
        value: Order;
        indexes: {
            byCreatedAt: string
        };
    };
    config: {
        key: string;
        value: string;
    };
}

export async function getDB(): Promise<IDBPDatabase<BunjtenderDB>> {
    return await openDB<BunjtenderDB>("bunjtender", 1, {
        upgrade(db) {
            const ordersStore = db.createObjectStore('orders', {
                keyPath: 'id',
            });
            ordersStore.createIndex("byCreatedAt", "createdAt");
            db.createObjectStore("config");
        },
    });
}

export class OrdersStorage {
    private db?;

    constructor(db?: IDBPDatabase<BunjtenderDB>) {
        this.db = db;
    }

    private async ensureDB(): Promise<IDBPDatabase<BunjtenderDB>> {
        if (!this.db) {
            this.db = await getDB();
        }
        return this.db;
    }

    async add(order: Order): Promise<void> {
        await (await this.ensureDB()).add("orders", order);
    }

    async get(orderId: string): Promise<Order | undefined> {
        return (await this.ensureDB()).get("orders", orderId);
    }

    async update(order: Order): Promise<void> {
        await (await this.ensureDB()).put("orders", order);
    }

    async delete(orderId: string): Promise<void> {
        await (await this.ensureDB()).delete("orders", orderId);
    }

    async list(): Promise<Order[]> {
        const orders = await (await this.ensureDB()).getAllFromIndex("orders", "byCreatedAt");
        const doneOrders = orders.filter((order: Order) => order.status === "done");
        await Promise.all(doneOrders.map((order: Order) => this.delete(order.id)));
        return orders.filter((order: Order) => order.status !== "done");
    }

    async clear(): Promise<void> {
        await (await this.ensureDB()).clear("orders");
    }

    async onMessage(data: MessageData, isBartender: boolean): Promise<Order | undefined> {
        let order: Order | undefined;

        if (isBartender && data.order && data.type === "new_order") {
            order = data.order;
            if (!(order.itemId in menuItems)) {
                console.log("New order containing unknown item received: ", order);
                return undefined;
            }
            order.status = "confirmed";
            await this.add(order);
            console.log("New order: ", order);
            Events.trigger("order", order);
        } else if (!isBartender && data.orderId && ["order_confirmed", "order_ready", "order_done"].includes(data.type)) {
            order = await this.get(data.orderId);
            if (order) {
                if (data.type === "order_confirmed") order.status = "confirmed";
                if (data.type === "order_ready") order.status = "ready";
                if (data.type === "order_done") order.status = "done";
                this.update(order);
                console.log("Order updated: ", order);
            } else {
                console.log("Update for unknown order id received: ", data.orderId);
            }
            Events.trigger("order", order);
        } else {
            console.log("Unknown message received: ", data);
        }

        return order;
    }
}

export class ConfigStorage {
    private db?;

    constructor(db?: IDBPDatabase<BunjtenderDB>) {
        this.db = db;
    }

    private async ensureDB(): Promise<IDBPDatabase<BunjtenderDB>> {
        if (!this.db) {
            this.db = await getDB();
        }
        return this.db;
    }

    async get(key: string): Promise<string | undefined> {
        return (await this.ensureDB()).get("config", key);
    }

    async set(key: string, value: string): Promise<void> {
        await (await this.ensureDB()).put("config", value, key);
    }

    static async get(key: string): Promise<string | undefined> {
        return (await getDB()).get("config", key);
    }

    static async set(key: string, value: string): Promise<void> {
        await (await getDB()).put("config", value, key);
    }
}

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
        ConfigStorage.set("topic", value).then();
        _setTopic(value);
    }
    return [topic, setTopic];
}
