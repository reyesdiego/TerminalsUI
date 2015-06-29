/**
 * Created by diego on 12/10/14.
 */

myapp.factory('statesFactory', ['$http', function($http){
	var factory = {};

	factory.getStatesType = function(callback){
		var inserturl = serverUrl + '/states';
		console.log('Cargo ruta: ' + inserturl);
		$http.get(inserturl)
			.success(function (data){
				console.log('OK ruta: ' + inserturl);
				callback(data);
			}).error(function(errorText){
				callback(errorText);
			});
	};

	return factory;
}]);
