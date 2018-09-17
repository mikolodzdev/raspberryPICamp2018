import {Button} from "./button";
import {TinkerforgeConnection} from "./tinkerforgeConnection";
import {LambdaSender} from "./lambdaout";

const connection = new TinkerforgeConnection();

connection.addOnConnectListener((tc) => {
    const b = new Button(connection);
    b.onClick((state: boolean) => {
        const ls = new LambdaSender({
            url: "https://s868ogpjlj.execute-api.us-east-1.amazonaws.com/default/LambdaTheUltimate1",
            apiKey: process.env.API_KEY || "wrong API key"
        });

        ls.sendClick("testbutton",state ? "on" : "off");

    });
    b.onChangeColorAndBrightness((color: number, brightness: number) => console.log('color ' + color + ' brightness ' + brightness));
    b.onConnect()
});

