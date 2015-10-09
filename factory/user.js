/**
 * Created by Diego Reyes on 3/19/14.
 */

myapp.factory('userFactory', ['$http', 'dialogs', 'formatService', function($http, dialogs, formatService){
	var factory = {};

	factory.login = function(datos, callback){
		var inserturl = serverUrl + '/login';
		$http.post(inserturl, datos)
			.success(function(data) {
				callback(data, false);
			}).error(function(error) {
				if (angular.isDefined(error) && error != null){
					// ACC-0001 usuario o contraseña incorrecto
					// ACC-0001 usuario o contraseñas vacío
					// ACC-0003 no entro al correo
					// ACC-0004 no habilitado en el sistema
					callback(error, true);
				} else {
					error = {
						code: 'ACC-0020',
						message: 'Se ha producido un error de comunicación con el servidor.'
					};
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
		var inserturl = serverUrl + '/agp/account/token';
		$http.get(inserturl, { params: formatService.formatearDatos(salt) })
			.success(function(data){
				callback(data);
			}).error(function(data){
				callback(data);
			});
	};

	return factory;
}]);