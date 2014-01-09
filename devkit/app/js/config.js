'use strict';

appmodule.factory('config', function() {
  var config = {
    serverURL: "https://edge.airvantage.net",
    applicationName: "greenhouse",
    temperaturePath: "greenhouse.temperature",
    luminosityPath: "greenhouse.luminosity",
    humidityPath: "greenhouse.humidity",
    roofPath: "greenhouse.open",
    roofCmd: "greenhouse.toggleRoof"
  };
  return config;
});