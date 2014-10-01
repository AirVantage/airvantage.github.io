---
category: tutorials
title: Using MQTT on BeagleBone Black
author: maubry
comments: true
img: bbb-mqtt.png
layout: default
published: false
---

Enable BeagleBone Black connection to AirVantage using MQTT
===========================================================

This article explains the different steps to enable AirVantage connection for BeagleBoneBlack using MQTT. 


Prerequisite
------------

* Have a basic knownlege of MQTT. See the other tutorial about MQTT for airvantage: [MQTT API](/tutorials/2013/11/12/mqtt-protocol/).
* Have a basic knownlege of NodeJS.
* Have a BeagleBone Black setup with an Ångström distribution with an Internet access.

Setup Hardware
--------------

__Step 1.__ Plug the BeagleBone Black to USB and install USB drivers by reading this [getting started](http://beagleboard.org/getting-started).

__Step 2.__ Set up Internet on your device with an ethernet cable.

__Step 3.__ Go to the Cloud9 IDE by openning the following url in a browser: [http://192.168.7.2:3000/](http://192.168.7.2:3000/). Where `192.168.7.2` is the default IP of the BeagleBone.

__Step 4.__ Create a new file in the workspace.

Application Model
-----------------

The procedure to create an application model is decribed in the [MQTT Tutorial](/tutorials/2013/11/12/mqtt-protocol/), we need this _application package_ to continue.


Retreive the name and the password of your beaglebone
-----------------------------------------------------

Open a browser to this url: [http://192.168.7.2/Support/BoneScript/getPlatform/](http://192.168.7.2/Support/BoneScript/getPlatform/). Click on the run button. Take note of the serial number and the name, we will use it for the next step.


Register your system
--------------------

The registration procedure is decribed in the [MQTT Tutorial](/tutorials/2013/11/12/mqtt-protocol/), follow theses steps and use previously noted _serial-number_ and _name_ of the BeagleBone to create a system for your device.

Send and Receive data
---------------------

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

With same `serialnumber` and `password` used for system creation on AirVantage.

### Send data to Airvantage

We will send three temperature values and one threshold value. The variables string identifier  `machine.temperature` and `machine.threshold` are the same as definied in your system _application model_.

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

This snippet handles two different messages sent by AirVantage.
The first message contains an updated value of the threshold setting.
The second message contains a request from AirVantage to get current temperature.

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
-------

Here are some hints to be test your code using AirVantange webUI.

### See communications received by Airvantage

On AirVantage data are stored by system. So you need find your system in the _Monitor_ activity and consult its [timeline](https://doc.airvantage.net/display/USERGUIDE/Monitor+Activity#MonitorActivity-Timeline) from its details page.

### Send a value to the device

To send a value, you need to have declared a setting in the application model associated to your system. Then you can edit it by following some steps:

__Step 1.__ Find your system in the _Monitor_ activity and open its detail page.

__Step 2.__ Go to the [detail page](https://doc.airvantage.net/display/USERGUIDE/Monitor+Activity#MonitorActivity-Configuration) of the application containing the setting you want to modify. Here you can see the values sent by the BeagleBone.

__Step 3.__ To modify a value, click on the _Edit_ button.

__Step 4.__ Modify the value and click on _Apply_. An operation is created to perform the task. Go back to the system details page to monitor all system operations.

### Request the device to send back a value

The mechanism enabling to request values from a device using Airvantage works throught _Report_. So first, you need to [create a report](https://doc.airvantage.net/display/USERGUIDE/Configure+Activity#ConfigureActivity-Tocreateareport). Then from the _Monitor_ activity, on your system detail, you will be able to launch a [retrieve data](https://doc.airvantage.net/display/USERGUIDE/Monitor+Activity#MonitorActivity-Toretrievedatafromoneorseveralsystem%28s%29) operation.
