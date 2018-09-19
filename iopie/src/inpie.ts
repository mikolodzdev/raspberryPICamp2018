import {SensorService} from "./sensors/sensorService";

import {LambdaSender} from "./lambdaout";
import {Button} from "./sensors/button";
import {Config} from "./config";

const sensorService = new SensorService();
sensorService.initializeSensors(sensor => {
  if (sensor instanceof Button) {
    const button = sensor as Button;
    button.onClick((state: boolean) => {
      const ls = new LambdaSender({
        url: "https://s868ogpjlj.execute-api.us-east-1.amazonaws.com/default/LambdaTheUltimate1",
        apiKey: Config.apiKey
      });

      ls.send("testbutton", state ? "on" : "off");

    });
  }
});