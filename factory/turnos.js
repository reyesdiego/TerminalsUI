/**
 * Created by leo on 28/04/14.
 */

myapp.factory('turnosFactory', ['$http', 'dialogs', 'formatService', 'loginService', function($http, dialogs, formatService, loginService){
	var factory = {};

	factory.getTurnos = function(datos, page, callback){
		var inserturl = serverUrl + '/appointments/' + loginService.getFiltro() + '/' + page.skip + '/' + page.limit;
		$http.get(inserturl, { params: formatService.formatearDatos(datos) })
			.success(function(data){
				callback(data);
			}).error(function(error){
				callback(error);
			});
	};

	return factory;
}]);