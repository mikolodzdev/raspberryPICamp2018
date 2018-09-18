import {Sensor, SensorConstructor} from "./sensor";
import {TinkerforgeConnection} from "./tinkerforgeConnection";
import * as Tinkerforge from "tinkerforge";
import {Button} from "./button";

interface SensorMapping {
  tinkerforgeBricklet: any;
  sensor: SensorConstructor;
}

export class SensorService {
  private tinkerforgeConnection: TinkerforgeConnection;
  private tinkerforgeSensorMapping: Array<SensorMapping> = [
    {tinkerforgeBricklet: Tinkerforge.BrickletDualButton, sensor: Button}
  ];

  constructor() {
    this.tinkerforgeConnection = new TinkerforgeConnection(this);
  }

  private _sensors: Array<Sensor> = [];

  get sensors(): Array<Sensor> {
    return this._sensors;
  }

  initializeSensors(onInitialize: ((sensor: Sensor) => void)): Promise<any> {
    return new Promise(resolve => {
      this.tinkerforgeConnection.enumerate((uid, deviceIdentifier) => {
        try {
          const sensor = this.initializeSensor(uid, deviceIdentifier);
          onInitialize(sensor);
        } catch (err) {
          console.log("Could not init sensor " + uid + ", " + err);
        }
      });
    });
  }

  private initializeSensor(uid: string, deviceIdentifier: number): Sensor {
    const mapping = this.tinkerforgeSensorMapping.find(value => deviceIdentifier === value.tinkerforgeBricklet.DEVICE_IDENTIFIER);

    if(mapping !== undefined){
      const sensor = new mapping.sensor(uid, this.tinkerforgeConnection);
      this._sensors.push(sensor);
      sensor.onConnect();
      return sensor;
    }

    throw 'Sensor not supported';
  }

}