import { Subscriber } from './Subscriber';
var PubSubJs = require('pubsub-js');

export class PubSub {

    subscribe(subscriber: Subscriber) {
        PubSubJs.subscribe('all-events', function(id, action) {
            subscriber.onAction(id, action);
        });
    }
    
    push(id: string, action: string) {
        PubSubJs.publish('all-events', id, action);
    }

}