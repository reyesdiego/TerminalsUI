/**
 * Created by leo on 02/02/15.
 */

myapp.factory('ctrlUsersFactory', ['$http', 'loginService', function($http, loginService){
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
		$http({
			method: 'PUT',
			url: inserturl,
			headers:
			{token: loginService.getToken()}
		}).success(function(data){
			callback(data);
		}).error(function(error){
			callback(error);
		});
	};

	factory.userDisabled = function(id, callback) {
		var inserturl = serverUrl + '/agp/account/' + id + '/disable';
		$http({
			method: 'PUT',
			url: inserturl,
			headers:
			{token: loginService.getToken()}
		}).success(function(data){
			callback(data);
		}).error(function(error){
			callback(error);
		});
	};

	return factory;
}]);