import * as Tinkerforge from "tinkerforge";
import {TinkerforgeConnection} from "./tinkerforgeConnection";
import {Sensor} from "./sensor";
import Timer = NodeJS.Timer;

class ButtonControl{
  static speed: number = .1;

  onValueChange: ((value: number)=>void)|undefined = undefined;
  private timer: Timer|undefined = undefined;
  private _value: number = 0;
  private _direction: number = 1;

  get value() : number {return this._value;}

  get increasing(): boolean {return this._direction > 0;}

  start(): void {
    if(this.timer === undefined){
      this.timer = setInterval(()=>{
        this.changeValue();
      }, 100);
    }
  }

  stop(): void {
    if(this.timer !== undefined){
      this._direction = -this._direction;
      clearInterval(this.timer);
      this.timer = undefined;
    }
  }

  private changeValue(): void {
    let newVal = Math.max(0, Math.min(1, this._value + this._direction * ButtonControl.speed));
    if(this._value !== newVal){
      this._value = newVal;
      if(this.onValueChange !== undefined)
        this.onValueChange(this._value);
    }
  }
}

export class Button implements Sensor {
  private button: any;
  private colorControl: ButtonControl = new ButtonControl();
  private brightnessControl: ButtonControl = new ButtonControl();
  private _onClicks: Array<(state: boolean)=>void> = [];
  private _onChangeColor: Array<(color: number, brightness: number)=>void> = [];

  constructor(uid: string, tinkerforgeConnection: TinkerforgeConnection) {
    this.button = new Tinkerforge.BrickletDualButton(uid, tinkerforgeConnection.connection);

    this.button.on(Tinkerforge.BrickletDualButton.CALLBACK_STATE_CHANGED,
        (buttonL, buttonR, ledL, ledR) => {
          if(buttonL === Tinkerforge.BrickletDualButton.BUTTON_STATE_PRESSED) {
            this._onClicks.forEach(cb=>cb(false));
            this.colorControl.start();
          }
          else if(buttonL === Tinkerforge.BrickletDualButton.BUTTON_STATE_RELEASED) {
            this.colorControl.stop();
            this.updateButtonStates();
          }

          if(buttonR === Tinkerforge.BrickletDualButton.BUTTON_STATE_PRESSED) {
            this._onClicks.forEach(cb=>cb(true));
            this.brightnessControl.start();
          }
          else if(buttonR === Tinkerforge.BrickletDualButton.BUTTON_STATE_RELEASED) {
            this.brightnessControl.stop();
            this.updateButtonStates();
          }
        }
    );

    this.brightnessControl.onValueChange = (brightness: number) => {
      this.setColorAndBrightness(this.colorControl.value, brightness);
      this.toggleRightButton();
    }
    this.colorControl.onValueChange = (color: number) => {
      this.setColorAndBrightness(color, this.brightnessControl.value);
      this.toggleLeftButton();
    }
  }

  private setColorAndBrightness(color: number, brightness: number): void {
    this._onChangeColor.forEach(cb=>cb(color, brightness));
  }

  onClick(cb: (state: boolean)=>void): void {
    this._onClicks.push(cb);
  }

  onConnect(): void {
    this.updateButtonStates();
    this.onChangeColorAndBrightness((color: number, brightness: number) => console.log('color ' + color + ' brightness ' + brightness));
  }

  onChangeColorAndBrightness(cb: (color: number, brightness: number)=>void): void {
    this._onChangeColor.push(cb);
  }

  private updateButtonStates(): void {
    this.button.setLEDState(this.colorControl.increasing ? 2 : 3, this.brightnessControl.increasing ? 2 : 3);
  }

  private toggleLeftButton(): void {
    this.button.getLEDState((ledL: number, ledR: number)=>{
      if(ledL === 3)
        this.button.setLEDState(2, ledR);
      else
        this.button.setLEDState(3, ledR);
    });
  }

  private toggleRightButton(): void {
    this.button.getLEDState((ledL: number, ledR: number)=>{
      if(ledR === 3)
        this.button.setLEDState(ledL, 2);
      else
        this.button.setLEDState(ledL, 3);
    });
  }
}