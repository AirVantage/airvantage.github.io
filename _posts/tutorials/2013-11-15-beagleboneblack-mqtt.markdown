---
category: tutorials
title: Using MQTT protocol
author: maubry
comments: true
img: bbb-mqtt.png
layout: default
---

Enable BeagleBone Black connection to AirVantage using MQTT
==========================

This article explains the different steps to enable AirVantage connection for BeagleBoneBlack using MQTT. 


Prerequisite
------------------------------------------------

* Have a basic knownlege of MQTT. See the other tutorial about MQTT for airvantage: [MQTT API](/tutorials/2013/07/05/mqtt-for-devices/).
* Have a basic knownlege of NodeJS.
* Have a BeagleBone Black setup with a Ångström distribution with an access to internet.

The first two steps are the same as in the (see).


Setup Hardware
------------------------------------------------

__Step 1.__ Plug the USB.

__Step 2.__ Set up internet on your device by plugin a ethernet cable.

__Step 2.__ Go to the Could9 IDE by openning the following url in a browser : [http://192.168.7.2:3000/](http://192.168.7.2:3000/). Where `192.168.7.2` is the default IP of the BeagleBone.

__Step 3.__ Create a new file in the workspace.


Application Model
------------------------------------------------

The procedure to create an application model is decribed in the [MQTT Tutorial](/tutorials/2013/07/05/mqtt-for-devices/), follow it because we need for the rest of this tutorial.


Retreive the name and the password of your beaglebone
--------------------------------------------------------

Open a browser to this url: [http://192.168.7.2/Support/BoneScript/getPlatform/](http://192.168.7.2/Support/BoneScript/getPlatform/). Click on the run button. Take note of the serial number and the name, we will use it for the next step.


Register your system
------------------------------------------------ 

The registring procedure is decribed in the [MQTT Tutorial](/tutorials/2013/07/05/mqtt-for-devices/), follow theses steps and use previously noted serial-number and name of the BeagleBord to create a system for your BeagleBone.


Send and Receive data
------------------------------------------------

Open the created file to start coding an example using the following snippets.


### Intialize the MQTT channel:

At first, we need to create a MQTT client instance with the right congfiguration.

~~~ js
var mqtt = require('mqtt');

var port = 1883;
var server = "tcp://na.airvantage.net";

var serialnumber = "3713BBBK7777"; //serialnumber
var password = "1234";

var mqtt_options = {clientId: serialnumber, username: serialnumber, password: password};

var client = mqtt.createClient(port, server, mqtt_options);

console.log("Client started");
~~~

Where the `serialnumber` and `password` variables have to be initialized with the corresponding values in the previously created system on AirVantage.


### Send datas to Airvantage

We will send three temperature values and one threshold value. The variables string identifier  `machine.temperature` and `machine.threshold` are the same as definied in the application model of the created system.

~~~ js
//Send values
console.log("Sending value");

//Publish a message on the right topic
client.publish(serialnumber+'/messages/json',JSON.stringify([
  {
    "machine.temperature": [{
      "timestamp" : new Date().getTime(), 
      "value" : "42.2"
    },
    {
      "timestamp" : new Date().getTime(), 
      "value" : "24.5"
    },
    {
      "timestamp" : new Date().getTime(), 
      "value" : "42.9"
    }]
  },
  {
    "machine.threshold": [{
      "timestamp" : new Date().getTime(), 
      "value" : "30"
    }]
  }
]));
~~~


### Receive messages

This snippet handle two differents messages sended by AirVantage.
The first message contains an updated value of the threshold setting.
The second message contains a request from AirVantage to know the current temperature.

~~~ js
console.log("Waiting for task");

//wait for a incoming message
client.on('message', function (topic,message){

      var data = JSON.parse(message);

      //receiving a new threshold value
      if ("write" in data[0] && data[0].write[0] === "machine.threshold") {
          console.log("new threshold received: " + data[0].write[0]["machine.threshold"]);          
      }
      
      //receiving a request to send back the current temperature
      if ("read" in data[0] && data[0].read[0] === "machine.temperature") {
          console.log("AirVantage is asking for the last temperature");
          
	  //publish on the right topic the current temperature
          client.publish(serialnumber+'/messages/json',JSON.stringify([
              {
                "machine.temperature": [{
                  "timestamp" : new Date().getTime(), 
                  "value" : 12 //quite cold indeed
               }]
            }]
          ));
      }
});
~~~


### Going forward, send an IO.

The following snippet send an IO value every 5 seconds.

~~~ js
//Send an IO
var b = require('bonescript');

//function to send a value
function sendValue(x) {
    console.log("Sending P8_19 value: "+ x.value);
    if ( x.err !== null) {
        client.publish(serialnumber+'/messages/json',JSON.stringify([
            {
                "machine.P8_19": [{
                    "timestamp" : new Date().getTime(), 
                    "value" : x.value
                }]
            }
        ]));
    } else {
        console.log("Error while retriving pin P8_19 value: "+ x.err);
    }
}

//set pin as Input
b.pinMode('P8_19', b.INPUT);

//get a pin value and send it every 5s
setInterval( function(){
    b.digitalRead('P8_19', sendValue);
}, 5000);
~~~


Testing 
------------------------------------------------

Here some pointor to be test your code using the webUI of AirVantange.

### See communications received by Airvantage

On Airvantage datas are stored by system. So you need find your system in the "Monitor" activity and consult his [timeline](https://doc.airvantage.net/display/USERGUIDE/Monitor+Activity#MonitorActivity-Timeline) from his detail page.

### Send a value to the device

To send a value, you need to have declared a setting in the application model associated to your system. Then you can edit it by following some steps:

__Step 1.__ Find your system in the "Monitor" activity and open his detail page.

__Step 2.__ Go to the [detail page](https://doc.airvantage.net/display/USERGUIDE/Monitor+Activity#MonitorActivity-Configuration) of the application containing the setting you what to modify. Here you can see the values sended by the BeagleBone.

__Step 3.__ To modify a value, click on the edit button.

__Step 4.__ Modify the value and click on apply. An operation is created to do the stuff. Go back to the system detail page to monitor all the operations for the system.


### Request the device to send back a value

The mechanism to request device value in Airvantage works throught "Report". So first, you need to [create a report](https://doc.airvantage.net/display/USERGUIDE/Configure+Activity#ConfigureActivity-Tocreateareport). Then from the "Monitor" activity, on your system detail, you will be able to launch a [retrieve data](https://doc.airvantage.net/display/USERGUIDE/Monitor+Activity#MonitorActivity-Toretrievedatafromoneorseveralsystem%28s%29) operation.

