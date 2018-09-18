import { Sensor } from './sensor';
import { TinkerforgeConnection } from './tinkerforgeConnection';
import * as Tinkerforge from 'tinkerforge';
import { LambdaSender } from '../lambdaout';

export class Nfcr implements Sensor {
    
    private nfcr: Tinkerforge.BrickletNFCRFID;

    constructor(uid: string, tinkerforgeConnection: TinkerforgeConnection) {
        this.nfcr = new Tinkerforge.BrickletNFCRFID(uid, tinkerforgeConnection.connection);
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
                        const ls = new LambdaSender({
                            url: 'https://s868ogpjlj.execute-api.us-east-1.amazonaws.com/default/LambdaTheUltimate1',
                            apiKey: process.env.API_KEY || 'wrong API key'
                          });
                    
                          ls.sendClick('testnfcr', tagType == 0 ? 'on' : 'off');
                    
                        },
                        function (error) {
                            console.log('Error: ' + error);
                        }
                    )
                }
            }
        );
    }

}