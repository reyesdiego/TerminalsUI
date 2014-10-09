/**
 * Created by artiom on 08/10/14.
 */

myapp.factory('errorFactory', function($rootScope, dialogs){

	var factory = {};

	factory.raiseError = function(error, url, evento, mensaje){
		error.ruta = url;
		console.log(error);
		dialogs.error('Error', mensaje);
		$rootScope.$broadcast(evento, error);
	};

	return factory;

});