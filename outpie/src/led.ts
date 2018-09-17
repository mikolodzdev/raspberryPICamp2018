import * as Tinkerforge from 'tinkerforge'
import { Subscriber } from './middleware/subscriber';

export class Led implements Subscriber {

    private led: Tinkerforge.BrickletRGBLED;

    constructor(private uuid: string, private connection: Tinkerforge.IPConnection) {
        this.uuid = uuid;
        this.connection = connection;

        this.led = new Tinkerforge.BrickletRGBLED(uuid, connection);
    }

    setOn(): void {
        this.led.setRGBValue(0,255,0);
    }  
    
    setOff(): void {
        this.led.setRGBValue(255,0,0);
    }

    onEvent(id: string, action: string) {
        console.log('ID: ' + id + ', Action: ' + action);
        this.setOn();
    }

}