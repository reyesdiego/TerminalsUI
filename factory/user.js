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
		console.log(formData);
		var inserturl = serverUrl + '/login';
		$http({
			method: 'POST',
			url: inserturl,
			data: formData
		}).success(function(data) {
			console.log("success");
			callback(data, false)
		}).error(function(errorText, errorNumber, data) {
			console.log(errorText);
			if (errorNumber === 403){
				dialogs.error('Error al iniciar sesión', 'Usuario o clave incorrectos.');
			} else {
				dialogs.error('Error de servidor', 'Ha ocurrido un error al conectarse, inténtelo nuevamente más tarde');
			}
			callback(data, true);
		});
	};

	return factory;
});