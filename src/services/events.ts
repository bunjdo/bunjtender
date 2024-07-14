export class Events {
    static subscribe(event: string, eventListener: EventListener) {
        document.addEventListener(event, eventListener);
    }

    static unsubscribe(event: string, listener: EventListener) {
        document.removeEventListener(event, listener);
    }

    static trigger(event: string, detail: any) {
        document.dispatchEvent(new CustomEvent(event, {detail: detail}));
    }
}

export function delay(ms: number): Promise<void> {
    return new Promise( resolve => setTimeout(resolve, ms) );
}
