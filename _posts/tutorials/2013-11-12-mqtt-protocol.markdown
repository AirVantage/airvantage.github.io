---
category: tutorials
title: Using MQTT protocol
author: gaetan
comments: true
img: rest-for-devices.png
layout: default
---

Using MQTT protocol
==========================

This article, like the one on [REST API](/tutorials/2013/07/05/rest-for-devices/), explains the different steps to create an application when you want to use the MQTT protocol to connect your application to AirVantage. 


Application Model
------------------------------------------------

__Step 1.__ The first step is to create the application model. You can create a file named `model.app` with the following content, you just need to change the __type__ value with a unique identifier for your application and the __name__ and __revision__ with the apprioriate value for your use case.

__Application Model__

~~~ xml
<?xml version="1.0" encoding="ISO-8859-1"?>
<app:application xmlns:app="http://www.sierrawireless.com/airvantage/application/1.0" 
        type="com.test.myapplication" 
        name="My Application" 
        revision="0.0.1">
 <capabilities>
  
  <communication>
   <protocol comm-id="SERIAL" type="REST" />
  </communication>
   
  <data>
   <encoding type="REST">
    <asset default-label="My Machine" id="machine">
     <variable default-label="Temperature" path="temperature" type="double"/>
      <setting default-label="Threshold" path="threshold" type="int"/>
     </asset>
   </encoding>
  </data>  

 </capabilities>
</app:application>
~~~

The used encoding is currently "REST" has the format of data is the same for the REST API and the MQTT protocol.

__Step 2.__ You can then customize the "data" part to define the different variables and settings used by your application.

__Step 3.__ You create a zip file containing this file.

__Step 4.__ You release this zip file in your application repository in AirVantage. AirVantage > Develop > My Apps > Release

Once you validated everything is working fine, you can change the state of your application to "PUBLISHED" by selecting the application in My Apps and clicking on the "Publish" button. 
Now the application is available and in AirVantage and can be assigned to systems.


Register your system
------------------------------------------------ 

1. Go to Inventory > Systems.
1. Click on the "Create" action.
1. In the "Create System" dialog:
    1. "System" step: Specify an optional name for your system.
    1. "Details" step: Click "Create gateway" and enter the identifier of the device in the "Serial Number" field.
    1. "Subscription" step: You won't create nor use any.
    1. "Applications" step: Select the application you previously released.
    1. "Credentials" step: Enter the password used to authenticate the device.
    1. Click on "Create".
1. In the grid, select the newly created system and click on the "Activate" action.


Send and Receive data
------------------------------------------------

Once your device is registered in AirVantage, you can start developing the embedded application that will use the MQTT protocol to communicate with AirVantage. You can use several MQTT clients to develop the embedded client: [Mosquitto](http://mosquitto.org/), [Paho](http://eclipse.org/paho/), [MQTT for node](https://github.com/adamvr/MQTT.js/). Here are the different calls to integrate in the embedded application to send and receive data with AirVantage:

### Server

The Airvantage MQTT broker is available throught the default MQTT standards of your favorite Airvantage server. For clarification, the protocol used is `TCP` and the port `1883` so for north-america the full url is: tcp://na.airvantage.net:1883.

### Authentication

The MQTT protocol support on AirVantage uses [Username and Password](http://public.dhe.ibm.com/software/dw/webservices/ws-mqtt/mqtt-v3r1.html#connect) to authenticate devices.
So you need to specify the username and the password when you connect to the client to the broker (AirVantage). The username is the serial number of the gateway in AirVantage and the password is the one set during the creation of the system.

### Send data to AirVantage

You can publish on the `<username>/messages/json` topic to send your data to AirVantage, where the username is the is the serial number of the gateway in AirVantage. The data shall be encoded in JSON using the same format as the one used by the REST API for devices: a message can contains several data and several datapoints for one data. Then you can easily send a complete status or historical values in one message.


__Publish on the `<username>/messages/json` topic__

~~~ json
[
  {
    "machine.temperature": [{
      "timestamp" : 1349907137, 
      "value" : "23.2"
    },
    {
      "timestamp" : 1349908137, 
      "value" : "24.5"
    },
    {
      "timestamp" : 1349909137, 
      "value" : "22.9"
    }]
  },
  {
    "machine.threshold": [{
      "timestamp" : 1349907137, 
      "value" : "30"
    }]
  }
]
~~~

This message sends 3 values for the temperature with different timestamp and one value for the threshold parameter.

Once AirVantage receives this message, data are stored and can be accessed by the Data API on System (Last datapoints, Historical aggregated datapoints, Historical raw datapoints, Export datapoints) 

### Receive tasks from AirVantage

A device can not only push data to AirVantage but you can also use AirVantage to subscribe to new tasks to be executed. Currently the MQTT protocol supports 2 kind of tasks: read and write.

A __read__ task requests the device to send back to the server the current values for a set of data. It's a way for a user to request the device to "refresh" the value of a data on the server. This operation is only for variables and settings. To create this operation from AirVantage API, you need to call the "Retrieve data" API (see documentation of System API).

A __write__ task requests the device to change the value of a data locally on the device. It's a way to interact with the device and change the behaviour of the embedded application. This operation is only available for settings. To create this operation from AirVantage API, you need to call the "Apply settings" API (see documentation of System API).

The device needs to subscribe to the `<username>/tasks/json` topic, where the username is the is the serial number of the gateway in AirVantage.

__Payload received from a subscription to the `<username>/tasks/json` topic__

~~~ json
[
  {
    "uid" : "3c12547b613740adb686271bdc8f097c",
    "timestamp" : 1348836320188,
    "read" : ["machine.temperature"]
  }, 
  {
    "uid": "8006cc58ba2141f69161a78f1bfdea1d",
    "timestamp": 1348836320566,
    "write" : [{"machine.threshold" : 25}}]
  }
] 
~~~

In this example, AirVantage is asking to the device to send the current temperature and requests to change the value of the threshold to 25. Once the API is called, AirVantage assumed the tasks have been retrieved by the device and then acknowledge automatically the tasks. In the current example, the device will probably directly call the message API to send back to AirVantage the last value of the temperature.
