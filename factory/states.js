/**
 * Created by diego on 12/10/14.
 */

myapp.factory('statesFactory', ['$http', function($http){
	var factory = {};

	factory.getStatesType = function(callback){
		var inserturl = serverUrl + '/states';
		$http.get(inserturl)
			.success(function (data){
				callback(data);
			}).error(function(errorText){
				callback(errorText);
			});
	};

	return factory;
}]);
