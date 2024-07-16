export type OrderStatus = "new" | "confirmed" | "ready" | "done";

export interface Order {
    id: string;
    name: string;
    username: string;
    itemId: string;
    extras: Record<string, string | string[]>;
    status: OrderStatus;
    createdAt: number;
}

export type MessagePayloadType = "new_order" | "order_confirmed" | "order_ready" | "order_done";

export interface MessageData {
    type: MessagePayloadType;
    order?: Order;
    orderId?: string;
}

export interface NotificationData {
    title: string;
    body: string;
    image: string;
}

export function getOrderNotification(order: Order, isBartender: boolean): NotificationData {
    let status = order.status;
    if (isBartender && status === "confirmed") status = "new";
    switch (status) {
        case "new": return {title: "New order", body: `${order.name} for ${order.username}`, image: "/notification.icon.png"};
        case "confirmed": return {title: "Order confirmed", body: `${order.name} for ${order.username} is confirmed`, image: "/notification.icon.png"};
        case "ready": return {title: "Order is ready", body: `${order.name} for ${order.username} is ready`, image: "/notification.icon.png"};
        case "done": return {title: "Order was picked up", body: `${order.name} for ${order.username} was picked up`, image: "/notification.icon.png"};
    }
}

export function getOrderColor(order: Order): "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning" | undefined {
    switch (order.status) {
        case "new": return "error";
        case "confirmed": return "primary";
        case "ready": return "secondary";
        case "done": return "default";
    }
}

export function getOrderActionName(order: Order): string {
    switch (order.status) {
        case "new": return "";
        case "confirmed": return "Ready";
        case "ready": return "Picked up";
        case "done": return "";
    }
}

export function getNextMessagePayloadType(order: Order): MessagePayloadType | null {
    switch (order.status) {
        case "new": return "order_confirmed";
        case "confirmed": return "order_ready";
        case "ready": return "order_done";
        case "done": return null;
    }
}

export function getNextOrderStatus(order: Order): OrderStatus | null {
    switch (order.status) {
        case "new": return "confirmed";
        case "confirmed": return "ready";
        case "ready": return "done";
        case "done": return null;
    }
}
