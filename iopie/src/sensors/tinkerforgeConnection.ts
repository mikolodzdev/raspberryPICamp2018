import * as Tinkerforge from "tinkerforge";
import {Config} from "../config";

export class TinkerforgeConnection {
  constructor() {
    const hostname = Config.tinkerforgeHostname;
    const port = Config.tinkerforgePort;
    console.log('Connecting to Brick deamon ' + hostname + ':' + port);
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