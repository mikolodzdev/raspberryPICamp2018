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
      while(true) { 
         rgbLED.setRGBValue(Math.floor(Math.random() * 255), Math.floor(Math.random() * 255), Math.floor(Math.random() * 255));
         Thread.sleep(1000);
      }
       
   }
);

var Thread = {
	sleep: function(ms) {
		var start = Date.now();
		
		while (true) {
			var clock = (Date.now() - start);
			if (clock >= ms) break;
		}
		
	}
};