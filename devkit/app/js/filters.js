'use strict';

/* Filters */

appmodule.filter('timestamp', function() {
	var dateFormat = d3.time.format("%c")
    return function(input) {
      return dateFormat(new Date(input));
    }
  });

appmodule.filter('floatValue', function(){
	return function(input) {
      return input.toFixed(1);
    }
});

appmodule.filter('temperatureAlert', function(){
	return function(input) {
		var alert
		if(input > 24 && input < 28){
			alert = "alert-success"
		} else if (input >= 28 && input < 30 || input <= 24 && input > 20){
			alert = "alert-warning"
		} else {
			alert = "alert-error"
		}
      return alert;
    }
})

appmodule.filter('humidityAlert', function(){
	return function(input) {
		var alert
		if(input > 50 && input < 70){
			alert = "alert-success"
		} else if (input > 20 && input < 51 || input < 90 && input > 69){
			alert = "alert-warning"
		} else {
			alert = "alert-error"
		}
      return alert;
    }
})

appmodule.filter('luminosityAlert', function(){
	return function(input) {
		var alert
		if(input > 70 && input < 200){
			alert = "alert-success"
		} else if (input > 200 || input < 70 && input >= 40){
			alert = "alert-warning"
		} else {
			alert = "alert-error"
		}
      return alert;
    }
})