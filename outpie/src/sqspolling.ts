import AWS = require('aws-sdk');

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



//usage sample:

const lr = new SQSMessageReceiverLoop({
    region: 'ew-west-1',
    url: 'https://sqs.eu-west-1.amazonaws.com/208464084183/campqueue1'
});

lr.messageLoop(function(message: string) {
    console.log(message);
});


