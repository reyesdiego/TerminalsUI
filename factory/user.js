/**
 * Created by Diego Reyes on 3/19/14.
 */

myapp.factory('userFactory', ['$http', 'dialogs', 'formatService', 'APP_CONFIG', function($http, dialogs, formatService, APP_CONFIG){
	var factory = {};

	factory.login = function(datos, callback){
		var inserturl = APP_CONFIG.SERVER_URL + '/login';
		$http.post(inserturl, datos)
			.then(function(response) {
				callback(response.data, false);
			}, function(response) {
				if (angular.isDefined(response.data.data) && response.data.data != null){
					// ACC-0001 usuario o contraseña incorrecto
					// ACC-0001 usuario o contraseñas vacío
					// ACC-0003 no entro al correo
					// ACC-0004 no habilitado en el sistema
					callback(response.data, true);
				} else {
					//console.log(response);
					/*response.data = {
						code: 'ACC-0020',
						message: 'Se ha producido un error de comunicación con el servidor.'
					};*/
					callback(response.data, true);
				}
			});
	};

	factory.cambiarContraseña = function(formData, callback){
		var inserturl = APP_CONFIG.SERVER_URL + '/agp/password';
		$http.post(inserturl, formData)
			.then(function(response) {
				callback(response.data);
			}, function(response) {
				callback(response.data);
			});
	};

	factory.newUser = function(formData, callback){
		var inserturl = APP_CONFIG.SERVER_URL + '/agp/register';
		$http.post(inserturl, formData)
			.then(function(response) {
				callback(response.data);
			}, function(response) {
				callback(response.data);
			});
	};

	factory.resetPassword = function(mail, callback){
		var inserturl = APP_CONFIG.SERVER_URL + '/agp/resetPassword/' + mail;
		$http.post(inserturl)
			.then(function(response) {
				callback(response.data);
			}, function(response) {
				callback(response.data);
			});
	};

	factory.validateUser = function(salt, callback){
		var inserturl = APP_CONFIG.SERVER_URL + '/agp/account/token';
		$http.get(inserturl, { params: formatService.formatearDatos(salt) })
			.then(function(response){
				callback(response.data);
			}, function(response){
				callback(response.data);
			});
	};

	return factory;
}]);