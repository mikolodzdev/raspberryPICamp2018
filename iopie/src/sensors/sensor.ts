import {TinkerforgeConnection} from "./tinkerforgeConnection";

export interface SensorConstructor {
  new(uid: string, tinkerforgeConnection: TinkerforgeConnection): Sensor;
}

export interface Sensor {
  onConnect();
}