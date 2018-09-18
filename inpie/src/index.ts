import {SensorService} from "./sensors/sensorService";

import {LambdaSender} from "./lambdaout";
import {Button} from "./sensors/button";


const sensorService = new SensorService();
sensorService.initializeSensors(sensor => {
  if (sensor instanceof Button) {
    const button = sensor as Button;
    button.onClick((state: boolean) => {
      const ls = new LambdaSender({
        url: "https://s868ogpjlj.execute-api.us-east-1.amazonaws.com/default/LambdaTheUltimate1",
        apiKey: process.env.API_KEY || "wrong API key"
      });

      ls.sendClick("testbutton", state ? "on" : "off");

    });
  }
});