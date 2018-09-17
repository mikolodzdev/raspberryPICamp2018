import * as Tinkerforge from "tinkerforge";
import {TinkerforgeConnection} from "./tinkerforgeConnection";


export class Button{
    private button: any;
    private timer: any = undefined;
    private _onClicks: Array<()=>void> = [];

    constructor(tinkerforgeConnection: TinkerforgeConnection){
        this.button = new Tinkerforge.BrickletDualButton('vRV', tinkerforgeConnection.connection);

        this.button.on(Tinkerforge.BrickletDualButton.CALLBACK_STATE_CHANGED,
            (buttonL, buttonR, ledL, ledR) => {
                if(buttonL === Tinkerforge.BrickletDualButton.BUTTON_STATE_PRESSED) {
                    this.button.setLEDState(ledL, 2 );
                }
                else if(buttonL === Tinkerforge.BrickletDualButton.BUTTON_STATE_RELEASED) {
                    this.button.setLEDState(ledL, 3 );
                    this._onClicks.forEach(cb=>cb());
                }

                if(buttonR === Tinkerforge.BrickletDualButton.BUTTON_STATE_PRESSED) {
                }
                else if(buttonR === Tinkerforge.BrickletDualButton.BUTTON_STATE_RELEASED) {
                    this.toggleTimer();
                }
            }
        );
    }

    onClick(cb: ()=>void): void {
        this._onClicks.push(cb);
    }

    onConnect(): void {
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
            this._onClicks.forEach(cb=>cb());
        });
    }
}