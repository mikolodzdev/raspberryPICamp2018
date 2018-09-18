import AWS = require('aws-sdk');

const credentials = new AWS.SharedIniFileCredentials({ profile: 'camp2018' });
AWS.config.credentials = credentials;

export interface SQSMessageReceiverLoopConfig {
    region: string
    url: string
}

interface MessageCallback {
    (message: string): void;
}

export class SQSMessageReceiverLoop {
    private config: SQSMessageReceiverLoopConfig;
    private sqs: AWS.SQS;

    constructor(config: SQSMessageReceiverLoopConfig) {
        this.config = config;
        this.sqs = new AWS.SQS({region: config.region});
    }

    public async messageLoop(callback:MessageCallback) {
        var params = {
            QueueUrl: this.config.url,
            MaxNumberOfMessages: 1,
            VisibilityTimeout: 5,
            WaitTimeSeconds: 20
        };
        var foo = await this.sqs.receiveMessage(params).promise();

        if (foo.Messages) {
            var message = foo.Messages[0];
    
            callback(message.Body!);
    
            var params2 = {
                QueueUrl: this.config.url,
                ReceiptHandle: message.ReceiptHandle!
            };
            this.sqs.deleteMessage(params2).promise();
        }
        else {
            console.log("no message");
        }

        this.messageLoop(callback); //FIXME verify assumption: this does not "fill up" the stack ;-)
    }
}

//usage sample (pre-cond: default user ~/.aws/credentials with sufficient permission):

// const lr = new SQSMessageReceiverLoop({
//     region: 'us-east-1',
//     url: 'https://sqs.us-east-1.amazonaws.com/650451827578/jap-iot-queue.fifo'
// });

// lr.messageLoop(function(message: string) {
//     console.log(message);
// });
