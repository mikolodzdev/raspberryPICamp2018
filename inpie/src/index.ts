import {Button} from "./button";
import {TinkerforgeConnection} from "./tinkerforgeConnection";

const connection = new TinkerforgeConnection();

connection.addOnConnectListener((tc) => {
  const b = new Button(connection);
  b.onClick(() => console.log('Click'));
  b.onConnect()
});

