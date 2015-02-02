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
			}).error(function(errorText){
				errorFactory.raiseError(errorText, inserturl, 'errorDatos', 'Error al cargar los datos de los usuarios.');
			});
		};

		return factory;
	})
})();