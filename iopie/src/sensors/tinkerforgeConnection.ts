import * as Tinkerforge from "tinkerforge";
import {SensorService} from "./sensorService";

export class TinkerforgeConnection {
  constructor(private sensorService: SensorService,
              private hostname: String = 'localhost',
              private port: number = 4223) {
    this._connection = new Tinkerforge.IPConnection();
    this._connection.connect(hostname, port, () => {
      throw 'Error, could not connect';
    });
  }

  private _connection: any;

  get connection(): any {
    return this._connection;
  }

  enumerate(cb: ((uid: string, deviceIdentifier: number) => void)): void {
    this._connection.on(Tinkerforge.IPConnection.CALLBACK_CONNECTED,
        (connectReason) => {
          this._connection.enumerate();
        }
    );
    this._connection.on(Tinkerforge.IPConnection.CALLBACK_ENUMERATE,
        (uid, connectedUid, position, hardwareVersion, firmwareVersion,
         deviceIdentifier, enumerationType) => {
          if (enumerationType !== Tinkerforge.IPConnection.ENUMERATION_TYPE_DISCONNECTED) {
            cb(uid, deviceIdentifier);
          }
        }
    );
  }

}