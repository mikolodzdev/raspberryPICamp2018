import * as Tinkerforge from "tinkerforge"

let ipcon = new Tinkerforge.IPConnection();
var rgbLED = new Tinkerforge.BrickletRGBLED("AQ4", ipcon);

ipcon.connect('localhost', 4223,
   function (error) {
       console.log('Error: ' + error);
   }
);

ipcon.on(Tinkerforge.IPConnection.CALLBACK_CONNECTED,
    function (connectReason) {
        ipcon.enumerate();
          rgbLED.setRGBValue(255,0,0);
    }
 );

 ipcon.on(Tinkerforge.IPConnection.CALLBACK_ENUMERATE,
    function(uid, connectedUid, position, hardwareVersion, firmwareVersion, deviceIdentifier, enumerationType) {
        console.log('UID: '+uid+', Enumeration Type: '+enumerationType);
    }
);