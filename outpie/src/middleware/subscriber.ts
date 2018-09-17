export interface Subscriber {
    onAction(id: string, action: string);
}