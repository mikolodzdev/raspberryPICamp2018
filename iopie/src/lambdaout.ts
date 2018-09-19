import * as httpm from 'typed-rest-client/HttpClient';
import * as ifm from 'typed-rest-client/Interfaces';

export interface LambdaSenderConfig {
    url: string;
    apiKey: string;
}

export class LambdaSender {
    private config: LambdaSenderConfig;
    private httpc: httpm.HttpClient;

    constructor(config: LambdaSenderConfig) {
        this.config = config;
        this.httpc = new httpm.HttpClient('my-client');
    }

    public async send(id:String,action:String) {
        let headers: ifm.IHeaders= {}
        headers["Content-Type"] = "application/json";
        headers["x-api-key"] = this.config.apiKey;
        let res: httpm.HttpClientResponse = await this.httpc.post(this.config.url,JSON.stringify({
            "id": id,
            "action": action
        }),headers)
        let body: string = await res.readBody();
        let body_s = JSON.parse(body);

        console.log("send response", body_s); //DEBUG
    }
}

/*

//usage sample:

const ls = new LambdaSender({
    url: "https://s868ogpjlj.execute-api.us-east-1.amazonaws.com/default/LambdaTheUltimate1",
    apiKey: process.env.API_KEY || "wrong API key" 
});

ls.sendClick("tewstbutton","on");

//invoke sample with (bash): 
//API_KEY="FIXME" node lambdaout.js

*/
