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
		var inserturl = serverUrl + '/tasks';
		$http.get(inserturl)
			.success(function(data){
				callback(data);
			}).error(function(error){
				callback(error);
			});
	};

	factory.setAccess = function(id, acceso, callback){
		var inserturl = serverUrl + '/agp/account/' + id + '/tasks';
		$http.put(inserturl, acceso)
			.success(function(data){
				callback(data);
			}).error(function(data){
				callback(data);
			});
	};

	factory.setNotifications = function(id, notif, callback){
		var inserturl = serverUrl + '/agp/account/' + id + '/emailToApp';
		$http.put(inserturl, notif)
			.success(function(data){
				callback(data);
			}).error(function(data){
				callback(data);
			});
	};

	return factory;
}]);