/**
 * Created by artiom on 08/10/14.
 */

myapp.factory('errorFactory', function($rootScope, dialogs){

	var factory = {};

	factory.raiseError = function(error, url, evento, mensaje){
		if (error == null){
			error = {
				ruta: ''
			}
		}
		error.ruta = url;
		dialogs.error('Error', mensaje);
		$rootScope.$broadcast(evento, error);
	};

	return factory;

});