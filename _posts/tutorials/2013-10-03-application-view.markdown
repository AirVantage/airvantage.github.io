---
category: tutorials
title: Configure an application view
author: sebz
comments: true
img: rest-for-devices.png
layout: default
---

Configure an application view
==========================

This article explains the different steps to create an application view. It allows you to associate your own web view to a specific embedded application. Your application view will rely on OAuth to authentify against AirVantage, and will be able to use APIs for retrieving data, editing settings, etc.


Application view requirements
------------------------------------------------

As we have already seen, an application view is a web application using AirVantage APIs. Therefore you will need:

1. An **API Client identifier**
1. Support for **OAuth Implicit Code Flow**
1. A **View URL** to access your view accepting the following parameters
    * **system**: the monitored system uid
    * **application**: the embedded application uid

Create an API Client
------------------------------------------------

1. Go to **Develop > API Clients**
2. Click on the **Create** action
3. In the **Create API Client** modal:
  * Provide a **Name**
  * A **Redirect URL**
    * Required by the **OAuth Implicit Code Flow**
    * More info here

[screenshot]

Develop your web application
------------------------------------------------

Help yourself, choose the web framework that best works for you, just remember that you need:
  * An URL (the redirect URL) that will be used during the *Implicit Code Flow* step to get an *access_token*
  * An URL (the view URL) that will be used as entry point of your application view
  
Here is a small *AngularJS* web application we developped which can be helpful.


Setup your application view
------------------------------------------------

OK! So now you have a running application, don't forget to deploy it on a web server that can be accessed by AirVantage. For a better integration with AirVantage, HTTPS access to your application is recommended.

Now you can declare a new *application view*:
1. Go to *Develop > My Apps* and open the details page of your embedded application
2. Click on the *Add View* button
3. Select the previously created *API Client*
4. And provide the *View URL*
5. Hit the *Save* button and you're good to go

[screenshot]

Test it on a system
------------------------------------------------

Now that your embedded application is set up, you can check the integration in your system details page:
1. Go to *Monitor > Systems* and open the details of your System
2. You should see a new button next to your application name
3. Clicking on the button opens your application view
  * If you provided an HTTP based *View URL* your view will be opened in a separated tab.

[screenshot] 
