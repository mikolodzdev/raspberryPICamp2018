import * as Tinkerforge from 'tinkerforge'
import { Subscriber } from '../middleware/subscriber';

const deviceModule = require('aws-iot-device-sdk').device;

export class Led implements Subscriber {

    private led: Tinkerforge.BrickletRGBLED;
    private device = deviceModule({
        keyPath: process.env.CREDS_PATH + '5315881a04-private.pem.key',
        certPath: process.env.CREDS_PATH + '5315881a04-certificate.pem.crt',
        caPath: process.env.CREDS_PATH + 'root-CA.crt',
        clientId: 'sdk-nodejs-26a45225-bb3c-459b-910d-cd8e6eddd96d',
        host: 'a1uxmylv3609ae.iot.us-east-1.amazonaws.com',
        region: 'us-east-1'
    });

    

    constructor(private uuid: string, private connection: Tinkerforge.IPConnection) {
        this.uuid = uuid;
        this.connection = connection;

        this.led = new Tinkerforge.BrickletRGBLED(uuid, connection);
        this.setNeutralState();

        this.device.subscribe('topic_camp_1');

        this.device.on('message', (topic, payload) => {
            let action = JSON.parse(payload.toString()).action;
            if (action == 'on') {
                this.setOn();
            } else {
                this.setOff();
            }
        });

        this.device.on('error', (error) => {
            console.log('error', error);
            this.setErrorState();
        });

    }

    setNeutralState(): void {
        this.led.setRGBValue(255,255,255);
    }

    setErrorState(): void {
        this.led.setRGBValue(0,0,255);
    }

    setOn(): void {
        this.led.setRGBValue(0,255,0);
    }  
    
    setOff(): void {
        this.led.setRGBValue(255,0,0);
    }

    onAction(id: string, action: string) {
        console.log('ID: ' + id + ', Action: ' + action); 
    }

}