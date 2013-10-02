---
layout: post
category: blog
title: Top AVEP features in Oct'13 release&#58; 4. System troubleshooting
author: kartben
comments: true
published: true
---

<p itemprop="description">
<img style="float:left; margin-right:15px; margin-bottom:15px;" src="/resources/img/blog/2013-10-02-top-avep-features-oct13-4-troubleshooting/troubleshooting-multimeter.jpg" alt="Troubleshooting a problem" itemprop="image"/>
We all know too well how annoying it can be to have an embedded M2M application that seems to be working OK, but for which you cannot manage to retrieve the actual data that it supposed to be sending.
</p>

There are several reasons why you may have such a problem and usually what you are interested in is knowing whether the data has actually reached AirVantage M2M Cloud or has been stuck before due to a bug in your embedded application, a problem with the network, &hellip;

This is why we have worked on making it much easier to display detailed system information right from the Monitor activity. 

### New Timeline View

{% lightbox blog/2013-10-02-top-avep-features-oct13-4-troubleshooting/timeline.png, Timeline View, 250, float:right;margin-left:15px;position:relative; %}

When you are browsing the details of a system in the Monitor activity, you have access to a new __Timeline View__ that displays, in a very visual way, all the history of all the exchanges between your embedded system and the server.

It is now very easy to see if a communication actually happened when it should have, and to see all its details (data that has been sent, with which protocol, etc.) by just clicking on the corresponding entry in the list of events.

### New Data History View

{% lightbox blog/2013-10-02-top-avep-features-oct13-4-troubleshooting/data-history.png, Data History View, 250, float:left;margin-right:15px;position:relative;  %}

You are probably aware of the _aggregated data_ API that allows you to retrieve consolidated data history for a specific system when you want, for example, the average temperature of your refrigerator, on an hourly basis, for the last 30 days. This API is pretty simple to use, but sometimes what you want is just very quickly troubleshoot a system on the field, and it'd be convenient to be able to display historical data right from the AirVantage Enterprise Platform. Well, guess what? We've added just that!

You can now access a __Data History View__ from a system's details. This view allows you to create your own charts, for the data you're interested in (applicative data, or device-related data such as RSSI, bandwidth consumption, &hellip;), with the aggregation function(s) of your choice (average, minimum, maximum, etc.).

<br/>

<div style="font-size:0.8em;">
Photo Credit: <a href="http://www.flickr.com/photos/44124348109@N01/197768962/">jurvetson</a> via <a href="http://compfight.com">Compfight</a> <a href="http://creativecommons.org/licenses/by/2.0/">cc</a>
</div>