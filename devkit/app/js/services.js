'use strict';

/* Services */

appmodule.factory('AirVantage', function($http, $cookies, config){
	var services = {}

	services.getSystems = function(successHandler, errorHandler) {
		$http.get(config.serverURL+'/api/v1/systems/?fields=uid,name,applications&application=name:greenhouse&access_token='+$cookies.avop_access_token)
		.success(function(data) { return successHandler(data.items);})
		.error(errorHandler);
	};

	services.getAllSystems = function(successHandler, errorHandler) {
		$http.get(config.serverURL+'/api/v1/systems/?fields=uid,name&access_token='+$cookies.avop_access_token)
		.success(function(data) { return successHandler(data.items);})
		.error(errorHandler);
	};

	services.getSystem = function(systemId, successHandler, errorHandler) {
		$http.get(config.serverURL+'/api/v1/systems/?fields=uid,name,applications&uid='+systemId+'&access_token='+$cookies.avop_access_token)
		.success(function(data) { return successHandler(data.items);})
		.error(errorHandler);
	};

	services.getSystemDetail = function(systemId, successHandler, errorHandler){
		$http.get(config.serverURL+'/api/v1/systems/'+ systemId +'/data?ids='+config.temperaturePath+','+config.luminosityPath+','+config.humidityPath+','+config.roofPath+'&access_token='+encodeURIComponent($cookies.avop_access_token))
		.success(successHandler)
		.error(errorHandler);
	};

	services.sendCommand = function(command, successHandler, errorHandler){
		$http.post(config.serverURL+'/api/v1/operations/systems/command?access_token='+encodeURIComponent($cookies.avop_access_token), command)
		.success(successHandler)
		.error(errorHandler);
	};


	services.getSystemData = function(systemId, dataId, options, successHandler, errorHandler){
		var optionsQuery = ""
		if (typeof options.fn != 'undefined') {optionsQuery = optionsQuery + "fn=" + options.fn + "&"}
		if (typeof options.from != 'undefined') {optionsQuery = optionsQuery + "from=" + options.from + "&"}
		if (typeof options.to != 'undefined') {optionsQuery = optionsQuery + "to=" + options.to + "&"}
		if (typeof options.interval != 'undefined') {optionsQuery = optionsQuery + "interval=1" + options.interval + "&"}
		$http.get(config.serverURL+'/api/v1/systems/'+ systemId +'/data/'+ dataId +'/aggregated?'+optionsQuery+'access_token='+encodeURIComponent($cookies.avop_access_token))
		.success(successHandler)
		.error(errorHandler);
	}

	return services
});
