/**
 * Created by Diego Reyes on 3/19/14.
 */
myapp.factory('userFactory', function($http, $dialogs){
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
			data: JSON.stringify(formData),
			headers:{"Content-Type":"application/json"}
		}).success(function(data) {
				console.log("success");
				callback(data)
			}).error(function(errorText, errorNumber, e, request) {
				console.log(errorText);
			if (errorNumber === 403){
				$dialogs.error("Usuario o clave incorrectos.")
			} else {
				$dialogs.error("Ha ocurrido un error al conectarse con el servidor, inténtelo nuevamente más tarde")
			}
			});
	};

	return factory;
});