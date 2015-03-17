/**
 * Created by leo on 14/04/14.
 */

myapp.factory('gatesFactory', ['$http', 'dialogs', 'formatService', 'loginService', function($http, dialogs, formatService, loginService){
	var factory = {};

	factory.getGate = function(datos, page, callback){
		var inserturl = serverUrl + '/gates/' + loginService.getFiltro() + '/' + page.skip + '/' + page.limit;
		$http.get(inserturl, { params: formatService.formatearDatos(datos) })
			.success(function(data){
				callback(data);
			}).error(function(error){
				callback(error);
			});
	};

	factory.getReporteHorarios = function(datos, callback){
		var inserturl = serverUrl + '/gates/' + loginService.getFiltro() + '/report';
		$http.get(inserturl, { params: formatService.formatearDatos(datos) })
			.success(function (data){
				callback(data);
			}).error(function(errorText){
				dialogs.error('Error', 'Error al añadir comentario sobre el comprobante');
			});
	};

	factory.getMissingGates = function(callback){
		var inserturl = serverUrl + '/gates/' + loginService.getFiltro() + '/missingGates';
		$http.get(inserturl)
			.success(function (data){
				callback(data);
			}).error(function(error){
				callback(error);
			});
	};

	factory.getMissingInvoices = function(callback){
		var inserturl = serverUrl + '/gates/' + loginService.getFiltro() + '/missingInvoices';
		$http.get(inserturl)
			.success(function (data){
				callback(data);
			}).error(function(error){
				callback(error);
			});
	};

	return factory;
}]);