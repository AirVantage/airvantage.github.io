---
layout: post
category: blog
title: Top AVEP features in Oct'13 release&#58; 3. Application views
author: kartben
comments: true
published: true
---

<p itemprop="description">
When you manage applications in AirVantage, normally you would rely on a generic user interface for displaying the details of your application, i.e. see the data that your application has sent to the server and be able to update the application settings. This user interface comes in handy to have an overview of your app details, but what if you could actually provide your own view for displaying/editing these details?
</p>

{% lightbox blog/2013-10-03-top-avep-features-oct13-3-application-views/application-view-eclo.png, Example of an Application View for eclo, 250, float:left;margin-right:1.5em;position:relative; %}

We have added **Application Views** to allow you to associate your own web view to a specific embedded application.
Your application view will rely on OAuth to authentify against AirVantage, and will be able to use APIs for retrieving data, editing settings, etc. 

Read more on [how to configure an Application View](https://doc.airvantage.net/display/USERGUIDE/UI+changes+in+13.4#UIchangesin13.4-ApplicationView) in the AirVantage User Guide.

<br/><br/>
