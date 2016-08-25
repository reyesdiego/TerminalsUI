/**
 * Created by leo on 02/02/15.
 */

myapp.factory('ctrlUsersFactory', ['$http', 'APP_CONFIG', function($http, APP_CONFIG){
	var factory = {};

	factory.getUsers = function(callback){
		var inserturl = APP_CONFIG.SERVER_URL + '/agp/accounts';
		$http.get(inserturl)
			.then(function(response){
				callback(response.data);
			}, function(response){
				callback(response.data);
			});
	};

	factory.userEnabled = function(id, callback) {
		var inserturl = APP_CONFIG.SERVER_URL + '/agp/account/' + id + '/enable';
		$http.put(inserturl)
			.then(function(response){
				callback(response.data);
			}, function(response){
				callback(response.data);
			});
	};

	factory.userDisabled = function(id, callback) {
		var inserturl = APP_CONFIG.SERVER_URL + '/agp/account/' + id + '/disable';
		$http.put(inserturl)
			.then(function(response){
				callback(response.data);
			}, function(response){
				callback(response.data);
			});
	};

	factory.getRoutes = function(callback){
		var inserturl = APP_CONFIG.SERVER_URL + '/tasks';
		$http.get(inserturl)
			.then(function(response){
				callback(response.data);
			}, function(response){
				callback(response.data);
			});
	};

	factory.setAccess = function(id, acceso, callback){
		var inserturl = APP_CONFIG.SERVER_URL + '/agp/account/' + id + '/tasks';
		$http.put(inserturl, acceso)
			.then(function(response){
				callback(response.data);
			}, function(response){
				callback(response.data);
			});
	};

	factory.setNotifications = function(id, notif, callback){
		var inserturl = APP_CONFIG.SERVER_URL + '/agp/account/' + id + '/emailToApp';
		$http.put(inserturl, notif)
			.then(function(response){
				callback(response.data);
			}, function(response){
				callback(response.data);
			});
	};

	return factory;
}]);