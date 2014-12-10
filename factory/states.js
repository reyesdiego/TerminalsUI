/**
 * Created by diego on 12/10/14.
 */

myapp.factory('statesFactory', function($http){
	var factory = {};

	factory.getStatesArray = function(callback){
		"use strict";
		var inserturl = serverUrl + '/states?type=array';

		$http({
			method: 'GET',
			url: inserturl
		}).success(function (data){
			callback(data);
		}).error(function(errorText){
			console.log(errorText);
		});
	};

	factory.getStatesType = function(callback){
		"use strict";
		var inserturl = serverUrl + '/states';

		$http({
			method: 'GET',
			url: inserturl
		}).success(function (data){
			callback(data);
		}).error(function(errorText){
			console.log(errorText);
		});
	};

	return factory;
});
