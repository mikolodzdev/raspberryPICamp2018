import * as Tinkerforge from "tinkerforge";

export interface ButtonConfig {
    hostname: string;
    port: number;
    uid: string;
}

export class Button{

    private connection: any;
    private button: any;
    private timer: any = undefined;

    constructor(config: ButtonConfig){
        this.connection = new Tinkerforge.IPConnection();
        this.connection.connect(config.hostname, config.port, () => {
            throw 'Error';
        });
        this.button = new Tinkerforge.BrickletDualButton('vRV', this.connection);

        this.connection.on(Tinkerforge.IPConnection.CALLBACK_CONNECTED,
            (connectReason) => {
                this.onConnect();
            }
        );

        this.button.on(Tinkerforge.BrickletDualButton.CALLBACK_STATE_CHANGED,
            (buttonL, buttonR, ledL, ledR) => {
                if(buttonL === Tinkerforge.BrickletDualButton.BUTTON_STATE_PRESSED) {
                    this.button.setLEDState(ledL, 2 );
                }
                else if(buttonL === Tinkerforge.BrickletDualButton.BUTTON_STATE_RELEASED) {
                    this.button.setLEDState(ledL, 3 );
                }

                if(buttonR === Tinkerforge.BrickletDualButton.BUTTON_STATE_PRESSED) {
                }
                else if(buttonR === Tinkerforge.BrickletDualButton.BUTTON_STATE_RELEASED) {
                    this.toggleTimer();
                }
            }
        );
    }

    protected onConnect(): void {
        this.button.setLEDState(
            3,
            3);
    }

    private toggleTimer(): void {
        if(this.timer === undefined){
            this.timer = setInterval(()=>{this.toggleLeftButton()}, 500);
        }else{
            clearInterval(this.timer);
            this.timer = undefined;
        }

    }

    private toggleLeftButton(): void {
        this.button.getLEDState((ledL: number, ledR: number)=>{
            if(ledL === 3)
                this.button.setLEDState(2, ledR);
            else
                this.button.setLEDState(3, ledR);
        });
    }
}