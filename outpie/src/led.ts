import * as Tinkerforge from "tinkerforge"

export class Led {

    private led: Tinkerforge.BrickletRGBLED;

    constructor(private uuid: string, private connection: Tinkerforge.IPConnection) {
        this.uuid = uuid;
        this.connection = connection;

        this.led = new Tinkerforge.BrickletRGBLED(uuid, connection);
    }

    setColor(): void {
        this.led.setRGBValue(255,0,0);
    }    

}