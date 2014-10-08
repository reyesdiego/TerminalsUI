/**
 * Created by artiom on 08/10/14.
 */

myapp.factory('errorFactory', function($rootScope){

	var factory = {};

	factory.raiseError = function(error, evento){
		console.log(error);
		$rootScope.$broadcast(evento, error);
	};

	return factory;

});