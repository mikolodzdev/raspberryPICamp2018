import * as Tinkerforge from "tinkerforge";

export  class TinkerforgeConnection{
  private _connection: any;
  private onConnect: Array<(connection: TinkerforgeConnection)=>void> = [];

  constructor(
      private hostname: String = 'localhost',
      private port: number = 4223
  ){
    this._connection = new Tinkerforge.IPConnection();
    this._connection.connect(hostname, port, () => {
      throw 'Error';
    });

    this._connection.on(Tinkerforge.IPConnection.CALLBACK_CONNECTED,
        (connectReason) => {
          this._connection.enumerate();
          this.onConnect.forEach(cb => cb(this));
        }
    );

    this._connection.on(Tinkerforge.IPConnection.CALLBACK_ENUMERATE,
        // Print incoming enumeration
        (uid, connectedUid, position, hardwareVersion, firmwareVersion,
         deviceIdentifier, enumerationType) => {
          console.log('UID:               ' + uid);
          console.log('Enumeration Type:  ' + enumerationType);
          if (enumerationType === Tinkerforge.IPConnection.ENUMERATION_TYPE_DISCONNECTED) {
            console.log('');
            return;
          }
          console.log('Connected UID:     ' + connectedUid);
          console.log('Position:          ' + position);
          console.log('Hardware Version:  ' + hardwareVersion);
          console.log('Firmware Version:  ' + firmwareVersion);
          console.log('Device Identifier: ' + deviceIdentifier);
          console.log('');
        }
    );
  }

  addOnConnectListener(cb: (connection: TinkerforgeConnection)=>void): void{
    this.onConnect.push(cb);
  }

  public get connection():any {
    return this._connection;
  }

}