/**
 * Created by diego on 12/10/14.
 */

myapp.factory('statesFactory', ['$http', 'APP_CONFIG', function($http, APP_CONFIG){
	var factory = {};

	factory.getStatesType = function(callback){
		var inserturl = APP_CONFIG.SERVER_URL + '/states';
		$http.get(inserturl)
			.then(function (response){
				callback(response.data);
			}, function(response){
				callback(response.data);
			});
	};

	return factory;
}]);
