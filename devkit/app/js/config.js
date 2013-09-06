'use strict';

appmodule.factory('config', function() {
  var config = {
    serverURL: "https://na.airvantage.net",
    applicationName: "greenhouse",
    temperaturePath: "greenhouse.data.temperature",
    luminosityPath: "greenhouse.data.luminosity",
    humidityPath: "greenhouse.data.humidity",
    roofPath: "greenhouse.data.open",
    roofCmd: "greenhouse.data.toggleRoof"
  };
  return config;
});