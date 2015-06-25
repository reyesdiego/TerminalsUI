/**
 * Created by Diego Reyes on 3/19/14.
 */

myapp.factory('userFactory', ['$http', 'dialogs', function($http, dialogs){
	var factory = {};

	factory.login = function(datos, callback){
		var inserturl = serverUrl + '/login';
		$http.post(inserturl, datos)
			.success(function(data) {
				callback(data, false);
			}).error(function(error, status) {
				if (status === 403){
					error.status = status;
					//dialogs.error('Error de inicio de sesión', error.data);
					callback(error, true);
				} else {
					dialogs.error('Error de inicio de sesión', "El servidor no se encuentra disponible. Consulte con el Administrador del sistema.");
					callback(error, true);
				}
			});
	};

	factory.cambiarContraseña = function(formData, callback){
		var inserturl = serverUrl + '/agp/password';
		$http.post(inserturl, formData)
			.success(function(data) {
				callback(data);
			}).error(function(err) {
				callback(err);
			});
	};

	factory.newUser = function(formData, callback){
		var inserturl = serverUrl + '/agp/register';
		$http.post(inserturl, formData)
			.success(function(data) {
				callback(data);
			}).error(function(err) {
				callback(err);
			});
	};

	factory.resetPassword = function(mail, callback){
		var inserturl = serverUrl + '/agp/resetPassword/' + mail;
		$http.post(inserturl)
			.success(function(data) {
				callback(data);
			}).error(function(err) {
				callback(err);
			});
	};

	factory.validateUser = function(salt, callback){
		var inserturl = serverUrl + '/agp/token';
		$http.post(inserturl, salt)
			.success(function(data){
				callback(data);
			}).error(function(data){
				callback(data);
			});
	};

	return factory;
}]);