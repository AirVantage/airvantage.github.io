---
layout: post
category: blog
title: Top AVEP features in Oct'13 release&#58; 5. Alerts
author: kartben
comments: true
published: true
---

<p itemprop="description">
At the end of this week we will update <a href="https://na.airvantage.net" target="_blank">AirVantage M2M Cloud</a>! <br/>
We are all very excited and thought it would be nice to use this opportunity for walking you through what we think are the most noteworthy features of AirVantage Enterprise Platform in particular.
</p>

<br/>

<img style="float:left; margin-right:15px;" src="/resources/img/blog/2013-10-01-top-avep-features-oct13-5-alerts/sw-icon-alertRule.png" alt="alert-rule-icon" itemprop="image"/>

You may already be familiar with the notion of Alert Rules that you can configure in AVEP for triggering an alert when a specific condition is met for a system. This is how you can for example receive an e-mail when the temperature of a monitored refrigerator reaches a critical threshold, or when a system has stopped communicating for too long.

We've improved several aspects of Alerts in this new release:

### Alert notifications

From now on, you will receive an alert only the first time a condition is met, which will avoid flooding your inbox or your 3rd party app unnecessarily. Of course, the reception of alerts for a given rule is re-enabled whenever the current alert is acknowledged (via the UI, the <code>/acknowledge</code> API on a specific alert, or by creating an <code>alerts/acknowledge</code> operation for your company).

### Quickly browse pending notifications 

The alert popup now not only allows you to get an overview of the last alert notifications that haven't been acknowledged yet, but it can also take you directly to the list of all the alerts that occured for your company.

![alert details](/resources/img/blog/2013-10-01-top-avep-features-oct13-5-alerts/alert-popup.png)

This might look like a very small detail, but it's because of details like this that we think AirVantage M2M Cloud really makes one's life easier when it comes to managing thousands of devices!