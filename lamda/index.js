'use strict';
var Alexa = require("alexa-sdk");
var https = require("https");
// For detailed tutorial on how to making a Alexa skill,
// please visit us at http://alexa.design/build


exports.handler = function(event, context) {
    var alexa = Alexa.handler(event, context);
    alexa.registerHandlers(handlers);
    alexa.execute();
};

var handlers = {
    'LaunchRequest': function () {
        this.emit('SayHello');
    },
    'HelloWorldIntent': function () {
        this.emit('SayHello');
    },
    'MyNameIsIntent': function () {
        this.emit('SayHelloName');
    },
    'SayHello': function () {
        //https://pbtb4p8bsc.execute-api.us-east-1.amazonaws.com/dev/healthcheck
        var options = {
            host:'pbtb4p8bsc.execute-api.us-east-1.amazonaws.com',
            port:443,
            method:'GET',
            path:'/dev/healthcheck'
        }
        var req = https.request(options, res => {
            res.setEncoding('utf8');
            var returnData = '';

            res.on('data', chunk => {
                returnData = returnData + chunk;
                console.log('Data :', returnData);
            });
            res.on('end', () => {
                var result = JSON.parse(returnData);
                console.log('result :', result.message);
                var text = 'The health status is ' + result.message;
                 this.response.speak(text);
                 this.emit(':responseReady');
            });
        });   
        req.end();
    },
    'SayHelloName': function () {
        var name = this.event.request.intent.slots.name.value;
        this.response.speak('Hello ' + name)
            .cardRenderer('hello world', 'hello ' + name);
        this.emit(':responseReady');
    },
    'SessionEndedRequest' : function() {
        console.log('Session ended with reason: ' + this.event.request.reason);
    },
    'AMAZON.StopIntent' : function() {
        this.response.speak('Bye');
        this.emit(':responseReady');
    },
    'AMAZON.HelpIntent' : function() {
        this.response.speak("You can try: 'alexa, hello world' or 'alexa, ask hello world my" +
            " name is awesome Aaron'");
        this.emit(':responseReady');
    },
    'AMAZON.CancelIntent' : function() {
        this.response.speak('Bye');
        this.emit(':responseReady');
    },
    'Unhandled' : function() {
        this.response.speak("Sorry, I didn't get that. You can try: 'alexa, hello world'" +
            " or 'alexa, ask hello world my name is awesome Aaron'");
    }
};

