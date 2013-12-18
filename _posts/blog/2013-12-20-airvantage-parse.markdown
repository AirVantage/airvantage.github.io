---
layout: post
category: blog
title: Connect Facebook users to Internet of Things using AirVantage and Parse
author: dsciamma
comments: true
---

In this article, we'll explain how __easy it is to connect Facebook users to Internet of Things (IoT) using AirVantage and Parse__.

Connect your objects to AirVantage
----------------------------------
We assume you already connected your objects to AirVantage. If not, you can use one of the following tutorials:

* [Using REST APIs on Raspberry pi](TODO)
* [Enable BeagleBone Black connection to AirVantage using MQTT](TODO)
* [ALEOS AF with AirVantage Tutorial](http://developer.sierrawireless.com/en/Resources/Resources/AirLink/ALEOS_AF/Tutorial_AAF_AirVantage_and_ALEOS_AF.aspx)
* [AirVantage Agent plugin for Open AT Application Framework](http://developer.sierrawireless.com/en/Resources/Resources/AirVantage/Tools/Open_AT_AF_ReadyAgent_plugin.aspx)

Once your objects are connected to AirVantage you operate the solution and interact the objects using AirVantage User Interface. You can create also a custom business web application using AirVantage API.

But perhaps one of your objectives is to __give this solution to end users__. In that case, the AirVantage User Interface will probably be too complex or you just want to create a mobile application allowing a end user to access to only its objects and a subset of data on these objects. In order to do so, you can use __Parse.com__ to manage user authentication using Facebook, the Parse Android SDK to develop your mobile application and Parse Cloud Code to connect Parse.com to AirVantage.

Parse.com
---------
[Parse.com](https://parse.com) is a Backend-As-A-Service (BAAS) providing user management, data storage, social network integration, push notifications, cloud code hosting and several SDK for Android, iOS, .NET, Javascript, Unity, etc. 

We also assume you have a valid Parse.com account. If not, you can create one [here](https://parse.com/#signup).

Initialize an application on Parse.com
----------------------------------
1. Go to your dashboard on Parse.com
2. Create a new application


Connect users using Facebook
----------------------------
In this example, we'll rely completely on Parse.com for user management. It offers all you need to manage users and connect them to their Facebook account. Each SDK have convenient methods to initialize an account connected to Facebook. 

Follow the different steps described in the [Parse.com documentation](https://www.parse.com/docs/) to learn how to connect Parse.com users with Facebook using one of the SDKs.

Now you have users in Parse.com and objects in AirVantage. The next step is to allow Parse.com to access to AirVantage API.


Connect Parse.com to AirVantage API using Cloud code
----------------------------------------------------

### Initialize cloud code

Parse.com offers to host Javascript code in order to define custom methods available through a simple API. Please [read the documentation](https://www.parse.com/docs/cloud_code_guide) to initialize Cloud code for your application.

### Import AirVantage module

Import the AirVantage Cloud Module [airvantage.js](https://gist.github.com/dsciamma/8023516) in the "cloud" folder initialized during the previous step. This module implements a subset of methods available in AirVantage API.

### Create an API Client for Parse

* In Airvantage, go to [Develop - API Clients](https://na.airvantage.net/develop/api/clients).
* Create a new API Client for your Parse application
** Put a random URL as the Redirect URL, it won't be used in this example
** Copy the client id and the secret key, we'll use it in the next step
* As Parse.com cannot handle the OAuth Authorization Code Flow, we need to use the Resource Owner Flow. Then you need to create a user in AirVantage. This user will be used to authenticate Parse.com.
 * Go to [Administration - Users](https://na.airvantage.net/admin/users/users)
 * Create a new user
 * Assign or create a profile with rights required by your application
 * Copy the email and password, we'll use it in the next step


### Create a simple cloud function

* Create a new file "main.js" in the "cloud" folder
* Copy the following code in this file and change the values with what you get during the previous step

~~~ javascript
var airvantage = require('cloud/airvantage.js');
airvantage.initialize('{client_id}', '{secret_key}', '{user_email}', '{user_password}');

Parse.Cloud.define("get", function(request, response) {
    if (!request.params.uid) {
        throw 'Missing initialization parameter';
    }
    else {
        airvantage.system({
            uid: request.params.uid
        },
        {
            success: function(system) {
                response.success(system);
            }
        });
    }
});
~~~

This function basically returns the details of the system matching the "uid" parameter sent in the request.

Deploy your cloud code on Parse.com and then you can call this function (after replacing the placeholders for the application id, the REST API key and the system uid):

Using command line:

~~~ 
curl -X POST \
  -H "X-Parse-Application-Id: {parse_application_id}" \
  -H "X-Parse-REST-API-Key: {parse_rest_api_key}" \
  -H "Content-Type: application/json" \
  -d '{"uid":"{system_uid}"}' \
  https://api.parse.com/1/functions/get
~~~

Using the Android SDK:

~~~ java
Parse.initialize(this, {parse_application_id}, {parse_client_key});
Map<String, String> params = new HashMap<String, String>();
params.put("uid", "{system_uid}");
Object result = ParseCloud.callFunction("get", params);
~~~

You can now access Airvantage objects using cloud code and your users are managed by Parse.com. The next step is to allow Parse to associate objects with users and do minimal controls.

Associate objects to the current user
-------------------------------------

### Create a new class on Parse.com
To associate objects with users, we are going to create a table in Parse.com to link object uid with users.

* Go to you application data browser in Parse.com
* Create a new custom class called "Thing"
* Create a new column on this class called "uid" of type "String". It will be used to store the uid of the AirVantage system.
* Create a new column called "owner" of type "Pointer" (pointing on _User). It will be used to store the reference to the user owning the object.

### Add a new cloud function to associate an object to a user
Paste the following code in you main.js file:

~~~ javascript
Parse.Cloud.define("add", function(request, response) {
    if (!request.params.uid || !request.user) {
        throw 'Missing initialization parameter';
    }
    else {
        var currentUser = Parse.User.current();

        var Thing = Parse.Object.extend("Thing");
        var newThing = new Thing();
         
        newThing.set("uid", system.uid);
        newThing.set("owner", currentUser);
         
        newThing.save(null, {
          success: function(thing) {
            response.success("Thing '" + system.uid + "' added to the current user");
          },
          error: function(thing, error) {
            response.error("Failed to add Thing '" + system.uid + "' to the current user");
          }
        });
    }
});
~~~

This code will create a new entry in the "Thing" table of your Parse application with the given uid and the current user. You can add more logic to perform more validation or complex queries.

### Update the "get" method
Now objects are linked to users we can update the "get" cloud function in order to validate the user have access to this object.
Update the "get" function in your main.js file:

~~~ javascript
Parse.Cloud.define("get", function(request, response) {
    if (!request.params.uid || !request.user) {
        throw 'Missing initialization parameter';
    }
    else {
        var currentUser = Parse.User.current();

        var Thing = Parse.Object.extend("Thing");
        var query = new Parse.Query(Thing);
        query.equalTo("owner", currentUser);
        query.first({
          success: function(object) {
            if (!object) {
                response.error("The current user doesn't have access to the thing '" + request.params.uid + "'");
            }
            else {
                airvantage.system({
                    uid: request.params.uid
                },
                {
                    success: function(system) {
                        response.success(system);
                    }
                });
            }
          },
          error: function(error) {
            response.error("Unable to retrieve things for the current user.");
          }
        });
    }
});
~~~

A complete example?
-------------------
A complete example of an Android application linking Facebook users to Airvantage is [available on GitHub](https://github.com/dsciamma/airvantage-universe). 


