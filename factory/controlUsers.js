/**
 * Created by leo on 02/02/15.
 */
(function(){
	myapp.factory('ctrlUsersFactory', function($http, loginService, errorFactory){
		var factory = {};

		factory.getUsers = function(callback){
			var inserturl = serverUrl + '/agp/accounts';
			$http({
				method: 'GET',
				url: inserturl,
				headers:
				{token: loginService.getToken()}
			}).success(function(data){
				callback(data);
			}).error(function(error){
				callback(error);
				//errorFactory.raiseError(error.data, inserturl, 'errorDatos', error.data);
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
			}).error(function(errorText){
				errorFactory.raiseError(errorText, inserturl, 'errorDatos', 'Error al intentar habilitar un usuario');
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
			}).error(function(errorText){
				errorFactory.raiseError(errorText, inserturl, 'errorDatos', 'Error al intentar deshabilitar un usuario');
			});
		};

		return factory;
	})
})();