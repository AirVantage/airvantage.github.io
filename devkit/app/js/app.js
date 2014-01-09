'use strict';

/* App Module */

var appmodule = angular.module('greenhouse', ['ngCookies', '$strap.directives']).
  config(['$routeProvider', function($routeProvider) {
  $routeProvider.
      when('/system', {templateUrl: 'partials/system-list.html', controller: SystemListCtrl}).
      when('/data/:systemId', {templateUrl: 'partials/system-data.html', controller: SystemDataCtrl}).
      when('/history/:systemId', {templateUrl: 'partials/system-history.html', controller: SystemHistoryCtrl}).
      when('/login', {templateUrl: 'partials/default.html', controller: LoginCtrl}).
      otherwise({redirectTo: '/login'});
  }]);