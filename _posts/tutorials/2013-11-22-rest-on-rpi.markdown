---
category: tutorials
title: Using REST API on Raspberry Pi
author: kinfoo
comments: true
img: restpi.png
layout: default
permalink: /tutorials/raspberry-pi-rest
published: false
---

# Using REST APIs on Raspberry pi

This article is about using AirVantage API for devices. It will focus on a device: the famous _Raspberry Pi_.

## Set up

Starting this tutorial, I assume you and flushed a [Rapsbian](http://www.raspberrypi.org/downloads) on your _Raspberry Pi_ SD. To find it on the network, I used the [Internet sharing capabilities of my Mac](http://bringebaerpai.wordpress.com/2013/05/14/raspberry-pi-ethernet-connection/) and `nmap`.

~~~sh
$ sudo nmap -sn 192.168.2.0/24
Starting Nmap 6.40 ( http://nmap.org ) at 2013-11-25 16:49 CET
Nmap scan report for 192.168.2.6
Host is up (0.00070s latency).
MAC Address: B8:27:EB:76:EA:56 (Raspberry Pi Foundation)
Nmap scan report for 192.168.2.1
Host is up.
Nmap done: 256 IP addresses (2 hosts up) scanned in 2.02 seconds
~~~

## Define your data

First of all, to be able to send and receive data, we have to explain our data to AirVantage. Here is my description, you just need to change the __type__ value with a unique identifier for your application and the __name__ and __revision__ with the appropriate value for your use case.

~~~xml
<?xml version="1.0" encoding="ISO-8859-1"?>
<app:application xmlns:app="http://www.sierrawireless.com/airvantage/application/1.0" 
        type="com.test.airvantagepiapp" 
        name="AirVantage Pi App"
        revision="0.0.1">
 <capabilities>

  <communication>
   <protocol comm-id="SERIAL" type="REST" />
  </communication>

  <data>
   <encoding type="REST">
    <asset default-label="AirVantage Pi" id="airvantagepi">
     <variable default-label="Temperature" path="temperature" type="double"/>
      <setting default-label="Threshold" path="threshold" type="int"/>
     </asset>
   </encoding>
  </data>

 </capabilities>
</app:application>
~~~

You can modify the `<data>`area. Once it matches your needs, save everything as __model.app__. Zip this file, mine is named _model.app.zip_.

## Get access

The application we are about to code needs access to AirVantage's platform to be able to send and receive data. In order to do so, [sign-in](https://signup.airvantage.net/public/avep/) and [connect](https://na.airvantage.net/login) to the platform, then follow these steps:

1. Go to _Inventory_ > _Systems_.
1. Click on the _"Create"_ action.
1. In the _"Create system"_ dialog:
    1. __Name__ : A name your system, _"AirVantage Pi"_ for example.
    1. __Gateway__: An identifier for your device.
        * Click on __+__ and fill the __Serial Number__ address field. I trimmed the MAC address `nmap` gave it to me earlier _B827EB76EA56_, .
    1. __Subscriptions__: So far, you do not need one.
    1. __Applications__: Provide your data description.
        1. Click on __+__ and select the _.zip_ file we just created and _"start"_ the upload.
    1. Click on __&#128274;__ which just appeared, then define your __REST__ password.
    1. Check _"I want to activate my system after creating it"_.
    1. Click on _"Create"_.

Now, you are ready.

## Writing an application

It is now time to write an app for our Pi. I tend to like simple and Python's [Requests](http://www.python-requests.org/en/latest/) got my attention. So I choose to code with _Python_.

### Install Requests

Before enjoying easy _Requests_, let's install it.

~~~sh
# Installing Setuptools
wget https://bitbucket.org/pypa/setuptools/raw/bootstrap/ez_setup.py
sudo python3.2 ez_setup.py
# Installing pip
wget https://raw.github.com/pypa/pip/master/contrib/get-pip.py
sudo python3.2 get-pip.py
# Installing Requests
$ sudo pip install requests
~~~

__Note:__ If you are wondering about `Setuptools` and `pip`, they are just prerequisites for [installing Requests](http://www.python-requests.org/en/latest/user/install/#install).

### The app

Here is the app wich communicate with _AirVantage_'s RESTful APIs:

~~~python
#!/usr/bin/env python3.2
from argparse import ArgumentParser
import json
import requests
from time import time

# Parse arguments
parser = ArgumentParser(description="Using RESTful AirVantage.")
parser.add_argument("identifier",
  help="Your identifier, like a trimmed a MAC address.")
parser.add_argument("password", help="REST password.")
args = parser.parse_args()

#
# Sending data to AirVantage
#
timestamp = int( time() )
data = [
  {
    "machine.temperature": [
      { "value" : "23.2", "timestamp" : timestamp },
      { "value" : "24.5", "timestamp" : timestamp },
      { "value" : "22.9", "timestamp" : timestamp }
    ]
  },
  {
    "machine.threshold": [
      { "value" : "30", "timestamp" : timestamp }
    ]
  }
]

# Using Basic Authentication
url = "https://na.airvantage.net/device/messages"
print("Sending to {}.".format(url))
response = requests.post( url,
  auth=(args.identifier, args.password),
  data=json.dumps(data),
  headers={'Content-type': 'application/json'}
)
print("Response: {}. Content: {}".format(response.status_code, response.text))

# Check if there are messages
message_url = "https://na.airvantage.net/device/tasks"
print("Checking for messages at {}.".format(message_url))
response = requests.get( message_url,
  auth=(args.identifier, args.password),
  headers={'Content-type': 'application/json'}
)
print("Response: {}. Content: {}".format(response.status_code, response.text))
print("Done")
~~~

Look, it is alive:

~~~sh
$ ./rest.py "B827EB76EA56" your_rest_password
Sending to https://na.airvantage.net/device/messages.
Response: 200. Content: []
Checking for messages at https://na.airvantage.net/device/tasks.
Response: 200. Content: []
Done
~~~
Your data is now sent. You can check your data communication. Just go to _Inventory_ > _Systems_, then pick your own and click __Timeline__. That is it.

If you want to try it but feeling a bit lazy, it is all available at [GitHub](https://github.com/KINFOO/airvantage-rpi-rest).
