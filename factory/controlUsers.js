/**
 * Created by leo on 02/02/15.
 */

myapp.factory('ctrlUsersFactory', ['$http', function($http){
	var factory = {};

	factory.getUsers = function(callback){
		var inserturl = serverUrl + '/agp/accounts';
		$http.get(inserturl)
			.success(function(data){
				callback(data);
			}).error(function(error){
				callback(error);
			});
	};

	factory.userEnabled = function(id, callback) {
		var inserturl = serverUrl + '/agp/account/' + id + '/enable';
		$http.put(inserturl)
			.success(function(data){
				callback(data);
			}).error(function(error){
				callback(error);
			});
	};

	factory.userDisabled = function(id, callback) {
		var inserturl = serverUrl + '/agp/account/' + id + '/disable';
		$http.put(inserturl)
			.success(function(data){
				callback(data);
			}).error(function(error){
				callback(error);
			});
	};

	factory.getRoutes = function(callback){
		//var inserturl = serverUrl + 'ruta';
		var mockRoute = 'mocks/rutas.json';
		$http.get(mockRoute)
			.success(function(data){
				callback(data);
			}).error(function(error){
				callback(error);
			});
	};

	return factory;
}]);