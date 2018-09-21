import * as Tinkerforge from 'tinkerforge'
import { Led } from './sensors/led';
import { PubSub } from './middleware/pubsub';

import * as SQSPolling from './sqspolling';

const HOST = 'localhost';
const PORT = 4223;
const DEVICE_TYPE_LED = 271;

let ipcon = new Tinkerforge.IPConnection();

let pubsub = new PubSub();

ipcon.connect(HOST, PORT,
   function (error) {
       console.log('Error: ' + error);
   }
);

ipcon.on(Tinkerforge.IPConnection.CALLBACK_CONNECTED,
    function (connectReason) {
        ipcon.enumerate();
    }
 );

 ipcon.on(Tinkerforge.IPConnection.CALLBACK_ENUMERATE,
    function(uid, connectedUid, position, hardwareVersion, firmwareVersion, deviceIdentifier, enumerationType) {
        console.log('UID: ' + uid + ', Enumeration Type: ' + deviceIdentifier);
        if (deviceIdentifier == DEVICE_TYPE_LED) {
            var led = new Led(uid, ipcon);
            //pubsub.subscribe(led);
        }
        // pubsub.push('123');
    }
);


const lr = new SQSPolling.SQSMessageReceiverLoop({
    region: 'us-east-1',
    url: 'https://sqs.us-east-1.amazonaws.com/650451827578/jap-iot-queue.fifo'
});

lr.messageLoop(function(message: string) {
    console.log('message: ' + message);
    let messageJson = JSON.parse(message);
    pubsub.push(messageJson.action);
});
