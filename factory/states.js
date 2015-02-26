/**
 * Created by diego on 12/10/14.
 */

myapp.factory('statesFactory', function($http){
	var factory = {};

	factory.getStatesArray = function(callback){
		var inserturl = serverUrl + '/states?type=array';

		$http.get(inserturl)
			.success(function (data){
				callback(data);
			}).error(function(errorText){
				console.log(errorText);
			});
	};

	factory.getStatesType = function(callback){
		var inserturl = serverUrl + '/states';

		$http.get(inserturl)
			.success(function (data){
				callback(data);
			}).error(function(errorText){
				console.log(errorText);
			});
	};

	return factory;
});
