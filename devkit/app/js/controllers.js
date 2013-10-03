'use strict';

/* Controllers */

function LoginCtrl($scope, $http, $cookies, config, $location) {
		$http.get(config.serverURL+'/api/oauth/token?grant_type=password&username=eclo.demo@gmail.com&password=eclo-live2013!&client_id=eabea6f63e8346ceb8c4016f8e0f2740&client_secret=54f40d77bbe348cb9e8b274fa25625ba')
		.success(function(data) { $cookies.avop_access_token = data.access_token ; $location.path("/data/b814c0981882494cb09830d93aeb0aaf"); })
		.error(function(){});	
}


function SystemListCtrl($scope, AirVantage) {
	$scope.systems = []
	AirVantage.getSystems(function(data){console.log(data); $scope.systems = data}, function(status){console.log(status)})
}

function SystemDataCtrl($scope, $routeParams, $timeout, AirVantage, config) {

	$scope.system = {}	

	AirVantage.getSystem($routeParams.systemId, function(data){$scope.system.name = data[0].name; $scope.system.uid = $routeParams.systemId}, function(status){console.log(status)})

	$scope.temperature = {value: 2.0, timestamp: 1370850088000}
	$scope.luminosity = {value: 256.3, timestamp: 1370850088000}
	$scope.humidity = {value: 25.0, timestamp: 1370850088000}
	$scope.roof = {value: "OFF", timestamp: 1370850088000}

	$scope.config = config

	$scope.refresh = function (){
		AirVantage.getSystemDetail($routeParams.systemId,
			function(data){
				var temperature = {}
				temperature.value=parseFloat(data[config.temperaturePath][0].value);
				temperature.timestamp=parseInt(data[config.temperaturePath][0].timestamp)
				$scope.temperature = temperature

				var luminosity = {}
				luminosity.value=parseFloat(data[config.luminosityPath][0].value);
				luminosity.timestamp=parseInt(data[config.luminosityPath][0].timestamp)
				$scope.luminosity = luminosity

				var humidity = {}
				humidity.value=parseFloat(data[config.humidityPath][0].value);
				humidity.timestamp=parseInt(data[config.humidityPath][0].timestamp)
				$scope.humidity = humidity

				var roof = {}
				roof.value=(data[config.roofPath][0].value == "true")?"CLOSE":"OPEN";
				roof.timestamp=parseInt(data[config.roofPath][0].timestamp)
				roof.img = 'roof_' + roof.value + '.svg' 
				roof.state = (data[config.roofPath][0].value == "true")
				$scope.roof = roof

			}, 
			function(status){console.log(status)});

		
	}

	$scope.toggleRoof = function() {

		var postData = {
			"application" : {
				"uid" : "05ca20da1d08451db9666f1c806136b0"
			},
			"commandId"   : config.roofCmd,
			"parameters" : 
			{
				"state" : !this.roof.state
			},
			"systems" : {
				"uids" : [$routeParams.systemId]
			},
		};
		AirVantage.sendCommand(postData, function(data){$scope.systems = data}, function(status){console.log(status)})
	}

	function clock() {
	 	$scope.refresh()
	 	$timeout(clock, 2000)
	}

	clock()

}


function SystemHistoryCtrl($scope, $routeParams, $timeout, AirVantage, config){
	
	var dataPaths = {Temperature: config.temperaturePath, Luminosity: config.luminosityPath, Humidity: config.humidityPath}
	var dataModels = {Temperature: 'temperatures', Luminosity: 'luminosities', Humidity: 'humidities'}

	$scope.system = {}


	AirVantage.getSystem($routeParams.systemId, function(data){$scope.system.name = data[0].name; $scope.system.uid = $routeParams.systemId}, function(status){console.log(status)})


	$scope.temperatures = []
	$scope.luminosities = []
	$scope.humidities = []
	$scope.lights = []
	
	$scope.config = config

	$scope.selectedTo = new Date().toString("YYYY-mm-dd HH:MM");

	$scope.refresh = function (){

		var selectedFrom
		var selectedTo

		if (typeof $scope.selectedFrom != 'undefined' && $scope.selectedFrom != "") {selectedFrom = new Date($scope.selectedFrom).getTime()}
		if (typeof $scope.selectedTo != 'undefined' && $scope.selectedTo != "") {selectedTo = new Date($scope.selectedTo).getTime()}


		$scope.active = $scope.selectedData;
		var data = $scope.selectedData;
	
		//for (var i = 0; i < data.length; i++) {
			var options = {fn: $scope.selectedFun[0], from: selectedFrom, to: selectedTo, interval: $scope.selectedInter}

			var d = dataPaths[data]
			var m = dataModels[data]

			AirVantage.getSystemData($routeParams.systemId, d, options,
				function(data){
					var buffer = []

					for (var i=0; i < data.length; i++){
						var t = {}
						if (data[i].value !== null){
							t.value=parseFloat(data[i].value);
							t.timestamp=parseInt(data[i].timestamp);
							buffer.unshift(t)
						}
					}
					$scope[m] = buffer

				}, 
				function(status){console.log(status)})
		// };


	}
}
