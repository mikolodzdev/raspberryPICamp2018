export interface Subscriber {
    onEvent(id: string, action: string);
}