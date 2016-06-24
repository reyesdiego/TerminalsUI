/**
 * Created by Artiom on 17/06/14.
 */

myapp.factory('reportsFactory', ['$http', 'dialogs', 'formatService', 'loginService', function($http, dialogs, formatService, loginService){
	var factory = {};

	factory.getTerminalesCSV = function(datos, callback) {
		var inserturl = serverUrl + '/invoices/' + loginService.getFiltro() + '/byRates';
		$http.get(inserturl, { params: formatService.formatearDatos(datos) })
				.then(function(response){
					var contentType = response.headers('Content-Type');
					if (contentType.indexOf('text/csv') >= 0){
						callback(response.data, 'OK');
					} else {
						callback(response.data, 'ERROR');
					}
				}, function(response){
					callback(response.data, 'ERROR');
				});
	};

	factory.getReporteTerminales = function(param, callback){
		var inserturl = serverUrl + '/invoices/' + loginService.getFiltro() + '/byRates';
		$http.get(inserturl, {params: formatService.formatearDatos(param)})
				.then(function(response){
					callback(response.data);
				}, function(response){
					callback(response.data);
				});
	};

	factory.getReporteTarifas = function(fecha, tarifas, callback){
		var inserturl = serverUrl + '/invoices/byRates?fechaInicio=' + formatService.formatearFechaISOString(fecha.fechaInicio) + '&fechaFin=' + formatService.formatearFechaISOString(fecha.fechaFin);
		$http.post(inserturl, tarifas)
			.then(function (response) {
				callback(response.data);
			}, function(response) {
				dialogs.error('Error', 'Error al añadir el Match en la base');
				//TODO ver que pasa aca
			});
	};

	return factory;
}]);
