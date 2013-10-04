---
layout: post
category: blog
title: Top AVEP features in Oct'13 release&#58; 1. MQTT support
author: kartben
comments: true
published: true
---

<p itemprop="description">
<img style="float:left; margin-right:15px; margin-bottom:5px;" src="/resources/img/blog/2013-10-04-top-avep-features-oct13-1-mqtt/mqtt.png" alt="MQTT" itemprop="image"/>
It is high time to unveil the feature we are the most excited about! In order to facilitate the connection of your devices to AirVantage M2M Cloud, and after having provided a new <a href="http://airvantage.github.io/tutorials/2013/07/05/rest-for-devices/">REST API</a> in the last release, we've added support for the very popular, lightweight, messaging protocol <strong>MQTT</strong>.
</p>

### What does this mean?

You can now connect your embedded applications to AirVantage using MQTT. We have picked a very simple model for the message topics: 

* You can **send data** by publishing messages to the <code>{YourSystemCommunicationId}/messages/json</code> topic,
* You can **listen for commands** by subscribing to the <code>{YourSystemCommunicationId}/tasks/json</code> topic.

The JSON messages in your payloads follow the same format than for the REST communication API (see an example [here](/tutorials/2013/07/05/rest-for-devices/#send-data-to-airvantage))

In order to enforce a secured communication, you must specify a password for you application, that will need to be used when opening a connection to the broker (username is your system comm. id, password is the secret you entered in AirVantage when installing the app).

We really think this is a nice addition to the list of protocols we were already supporting (OMA DM, MSCI, M3DA, HTTP) in that it makes it really simple to connect to AirVantage virtually any device that can run an MQTT client, even a small microcontroller! A good starting point for obtaining such MQTT clients implementations is the <a href="http://eclipse.org/paho" target="_blank">Eclipse Paho</a> open-source project.

It only takes a few seconds to create a new account on <a href="http://airvantage.net" target="_blank">AirVantage</a> and try out [all](/blog/2013/10/01/top-avep-features-oct13-5-alerts) [the](/blog/2013/10/02/top-avep-features-oct13-4-troubleshooting/) [new](/blog/2013/10/03/top-avep-features-oct13-3-application-views) [features](/blog/2013/10/03/top-avep-features-oct13-2-webhooks) we've talked about this week, as well as many others!<br/>
**Don't wait any longer** and **<a href="https://signup.airvantage.net/public/avep/" target="_blank">sign up</a>** now!

<br/><br/>