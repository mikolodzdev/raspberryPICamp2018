import { Sensor } from './sensor';
import { TinkerforgeConnection } from './tinkerforgeConnection';
import * as Tinkerforge from 'tinkerforge';

const deviceModule = require('aws-iot-device-sdk').device;

export class Nfcr implements Sensor {

    private device = deviceModule({
        keyPath: process.env.CREDS_PATH + '5315881a04-private.pem.key',
        certPath: process.env.CREDS_PATH + '5315881a04-certificate.pem.crt',
        caPath: process.env.CREDS_PATH + 'root-CA.crt',
        clientId: 'sdk-nodejs-26a45225-bb3c-459b-910d-cd8e6eddd96e',
        host: 'a1uxmylv3609ae.iot.us-east-1.amazonaws.com',
        region: 'us-east-1'
    });

    private nfcr: Tinkerforge.BrickletNFCRFID;
    private onState: boolean = false;

    constructor(uid: string, tinkerforgeConnection: TinkerforgeConnection) {
        this.nfcr = new Tinkerforge.BrickletNFCRFID(uid, tinkerforgeConnection.connection);
   
        this.device.on('connect', () => {
            console.log('connect');
        });

        this.device.on('close', () => {
            console.log('close');
        });

        this.device.on('reconnect',() => {
            console.log('reconnect');
        });

        this.device.on('offline', () => {
            console.log('offline');
        });

        this.device.on('error', (error) => {
            console.log('error', error);
        });

        this.device.on('message', (topic, payload) => {
            console.log('message', topic, payload.toString());
        });
    }

    onConnect() {
        let tagType = 0;
        this.nfcr.requestTagID(Tinkerforge.BrickletNFCRFID.TAG_TYPE_TYPE2);
        this.nfcr.on(Tinkerforge.BrickletNFCRFID.CALLBACK_STATE_CHANGED, (state, idle) => {
                if(idle) {
                    tagType = (tagType + 1) % 3;
                    this.nfcr.requestTagID(tagType);
                }
        
                if(state == Tinkerforge.BrickletNFCRFID.STATE_REQUEST_TAG_ID_READY) {
                    this.nfcr.getTagID((tagType, tidLength, tid) => {
                        let newOnState = tagType == 0 ? false : true;
                        
                        if (newOnState != this.onState) {
                            this.onState = newOnState;
 
                            console.log('State: ' + this.onState);

                            console.log('publish');
                            this.device.publish('topic_camp_1', JSON.stringify({
                                action: this.onState ? 'on' : 'off'
                            }));

                        }}, (error) => {
                            console.log('Error: ' + error);
                        }
                    )
                }
            }
        );
    }

}