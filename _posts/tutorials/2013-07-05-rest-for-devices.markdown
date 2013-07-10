---
category: tutorials
title: Using REST API for devices
author: dsciamma
comments: true
img: rest-for-devices.png
layout: default
---

Using REST API for devices
==========================

This article explains the different steps to create an application when you want to use the REST API for devices to connect your application to AirVantage. 


Application Model
------------------------------------------------

__Step 1.__ The first step is to create the application model. You can create a file named model.app with the following content, you just need to change the __type__ value with a unique identifier for your application and the __name__ and __revision__ with the apprioriate value for your use case.

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


__Step 2.__ You can then customize the "data" part to define the different variables and settings used by your application.

__Step 3.__ You create a zip file containing this file.

__Step 4.__ You release this zip file in your application repository in AirVantage. AirVantage > Develop > My Apps > Release

Once you validated everything is working fine, you can change the state of your application to "PUBLISHED" by selecting the application in My Apps and clicking on the "Publish" button. 
Now the application is available and in AirVantage and can be assigned to systems.


Register your system
------------------------------------------------ 

1. Go to Inventory > Systems
1. Click on the "Create" action
1. In the "Details" screen, create a new gateway and enter the identifier of the device in the "Serial Number" field.
1. You don't need to create or use a subscription
1. In the "Applications" screen, select the application you previously released
1. In the "Credentials" screen, enter the password used to authenticate the device
1. Click on "Create"
1. In the grid, select the newly created system and click on the "Activate" action


Send and Receive data
------------------------------------------------

Once your device is registered in AirVantage, you can start developing the embedded application that will use REST API for devices to communicate with AirVantage. Here are the different calls to integrate in the embedded application to send and receive data with AirVantage:

### Authentication

The REST API for devices uses [HTTP Basic Authentication](http://en.wikipedia.org/wiki/Basic_access_authentication) to authenticate devices.
So you need to specify the Authentication header for each API call. The username is the serial number of the gateway in AirVantage and the password is the one set during the creation of the system.
Then you need to combine the two into a string "username:password" and encode the resulted string using Base64.
Finally, you specify the Authentication header in the API calls.

  Authorization: Basic QWxhZGRpbjpvcGVuIHNlc2FtZQ==

### Send data to AirVantage

You can use the API messages to send data from the device to AirVantage. A message can contains several data and several datapoints for one data. Then you can easily send a complete status or historical values in one message.


__Request:__

~~~ json
POST https://na.airvantage.net/device/messages
Authorization: Basic QWxhZGRpbjpvcGVuIHNlc2FtZQ==
Content-Type: application/json
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

A device can not only push data to AirVantage but you can also use AirVantage to request the device to execute some tasks. Currently the REST API for devices supports 2 kind of tasks: read and write.

A __read__ task requests the device to send back to the server the current values for a set of data. It's a way for a user to request the device to "refresh" the value of a data on the server. This operation is only for variables and settings. To create this operation from AirVantage API, you need to call the "Retrieve data" API (see documentation of System API).

A __write__ task requests the device to change the value of a data locally on the device. It's a way to interact with the device and change the behaviour of the embedded application. This operation is only available for settings. To create this operation from AirVantage API, you need to call the "Apply settings" API (see documentation of System API).

The device needs to call periodically the following API:

__Request:__

~~~ json
GET https://na.airvantage.net/device/tasks
Authorization: Basic QWxhZGRpbjpvcGVuIHNlc2FtZQ==
~~~

__Response:__

~~~ json
HTTP/1.1 200 OK
Content-Type: application/json
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
