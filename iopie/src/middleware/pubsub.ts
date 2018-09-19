import { Subscriber } from './subscriber';
import * as PubSubJs from 'pubsub-js';

export class PubSub {

    subscribe(subscriber: Subscriber) {
        PubSubJs.subscribe('actions', function(msg, action) {
            subscriber.onAction(msg, action);
        });
    }
    
    push(action: string) {
        console.log('pushing ' + action);
        PubSubJs.publish('actions', action);
    }
}