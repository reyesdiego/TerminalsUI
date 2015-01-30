/**
 * Created by Diego Reyes on 3/19/14.
 */
myapp.factory('userFactory', function($http, dialogs){
	var factory = {};

	factory.login = function(user, pass, callback){
		"use strict";
		var formData = {
			"email": user,
			"password": pass
		};
		var inserturl = serverUrl + '/login';
		$http({
			method: 'POST',
			url: inserturl,
			data: formData
		}).success(function(data) {
			callback(data, false);
		}).error(function(errorText, errorNumber, data) {
			if (errorNumber === 403){
				dialogs.error('Error al iniciar sesión', 'Usuario o clave incorrectos.');
			} else {
				dialogs.error('Error de servidor', 'Ha ocurrido un error al conectarse, inténtelo nuevamente más tarde');
			}
			callback(data, true);
		});
	};

	factory.cambiarContraseña = function(formData, callback){
		"use strict";
		var inserturl = serverUrl + '/agp/password';
		$http({
			method: 'POST',
			url: inserturl,
			data: formData
		}).success(function(data) {
				callback(data);
			}).error(function(err) {
				dialogs.error('Error en Cambio de Contraseña', err.data);
			});
	};

	factory.newUser = function(formData, callback){
		var inserturl = serverUrl + '/agp/register';
		$http({
			method: 'POST',
			url: inserturl,
			data: formData
		}).success(function(data) {
			callback(data);
		}).error(function(err) {
			dialogs.error('Error en Cambio de Contraseña', err.data);
		});
	};

	return factory;
});