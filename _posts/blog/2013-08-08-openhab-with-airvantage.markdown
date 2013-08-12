---
layout: post
category: blog
title: Setting up an AirVantage persistence service for openHAB
author: kartben
comments: true
published: true
---


<center style="margin-bottom: 2em; /*margin-top: 1em;*/"><iframe width="560" height="315" src="//www.youtube.com/embed/aHqghpPgJQs" frameborder="0" allowfullscreen></iframe></center>

<img style="float:left; margin-right:15px;" src="/resources/img/blog/2013-08-08-openhab-with-airvantage/openHAB_Logo.png" itemprop="image" />
[openHAB](https://code.google.com/p/openhab/) is a Java/OSGi-based open-source project that aims at providing a universal integration platform for all things around home automation.

It's a project I've been following from a distance for the last couple years and that I find particularly impressive, both in terms of features it exposes to the end user and in terms of architecture and design, being in my opinion a brilliant example of how one can use OSGi to build a modular application.

openHAB in a nutshell
---------------------

DISCLAIMER: I am by no means an openHAB expert! :-)

Anyone playing with openHAB for a few minutes will understand the gist of it. In a nutshell, it allows to bind logical representations of physical objects (that send events and may be actionable) with each other via an event bus. The way objects will eventually interact with each other can be expressed using a rules engine, and it is also possible to build very fancy UIs by binding widgets on the physical "items". Last but not least, openHAB is not only able to orchestrate the physical objects on the fly, but it can also be configured with persistence rules for e.g logging some events, plotting them on charts, or store them in an online service. You get it: why not adding the capability to persist data in [AirVantage](http://airvantage.net)?

openHAB persistence services
----------------------------

Implementing a new persistence provider for openHAB is actually rather straightforward: you simply need to register a `PersistenceService` implementation that will be in charge of storing (i.e. logging, POSTing to a REST API, &hellip;) items. The items you wish to store are described in a persistence rules file which is, again, rather straightforward:

~~~ json
Strategies {
  everyMinute : "0 * * * * ?"
}

Items {
  // log all temperatures every minute
  Temperature* -> "temperatures" : strategy = everyMinute
}
~~~

AirVantage persistence service
------------------------------

The idea here is to provision a system on AirVantage that is configured for REST communications, and a good start is definitely to follow the [dedicated tutorial](http://airvantage.github.io/tutorials/2013/07/05/rest-for-devices/). When your system is properly configured, next step is to add an AirVantage persistence bundle to your openHAB setup, and to propertly configure it.

I have [put on GitHub](https://github.com/kartben/org.openhab.persistence.airvantage) the source code of a bundle corresponding to the AirVantage persistence provider that I wrote. You can install it very simply by following the [instructions](https://code.google.com/p/openhab/wiki/Addons) on openHAB, for the JAR that you can download [here](https://kartben.github.com/org.openhab.persistence.airvantage/org.openhab.persistence.airvantage-1.3.0-SNAPSHOT.jar).

Add to your openHAB configuration the two following lines:

~~~ bash
# The serial number of the system you created in AirVantage
airvantage:systemId=OHAB49258684236
# The password you configured for this system's REST communication channel
airvantage:systemPassword=secret
~~~

And then, you will need to create an `airvantage.persist` file in your `persist/` folder for indicating what items you want to synchronize with AirVantage. For each item, you will want to set the path of the variable as indicated in your model. An example of such a file could be:

~~~
Strategies {
  default = everyChange 
}

Items {
  Temperature_GF_Corridor -> "demohouse.gf.corridor.temperature"
  Temperature_GF_Toilet -> "demohouse.gf.toilet.temperature"

  Temperature_FF_Bath -> "demohouse.ff.bathroom.temperature"
  Heating_FF_Bath -> "demohouse.ff.bathroom.heating"
}
~~~

With very little effort, you should be able to do something very similar, and therefore enable server-side consolidation of all your home automation data for years, and use the AirVantage API to display graphs and the like.

Please comment below if you give this work a try, and also feel free to fork the GitHub repo if you feel like this could be improved (and it certainly can!).