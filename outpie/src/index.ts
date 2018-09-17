import * as Tinkerforge from "tinkerforge"
import { Led } from "./LED";

let ipcon = new Tinkerforge.IPConnection();

ipcon.connect('localhost', 4223,
   function (error) {
       console.log('Error: ' + error);
   }
);

ipcon.on(Tinkerforge.IPConnection.CALLBACK_CONNECTED,
    function (connectReason) {
        ipcon.enumerate();
    }
 );

 ipcon.on(Tinkerforge.IPConnection.CALLBACK_ENUMERATE,
    function(uid, connectedUid, position, hardwareVersion, firmwareVersion, deviceIdentifier, enumerationType) {
        console.log('UID: '+uid+', Enumeration Type: '+deviceIdentifier);
        if (deviceIdentifier == 271) {
            var led = new Led(uid, ipcon);
            led.setColor();
        }
    }
);