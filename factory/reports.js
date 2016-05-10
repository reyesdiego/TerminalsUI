/**
 * Created by Artiom on 17/06/14.
 */

myapp.factory('reportsFactory', ['$http', 'dialogs', 'formatService', 'loginService', function($http, dialogs, formatService, loginService){
	var factory = {};

	factory.getReporteTerminales = function(param, callback){
		var inserturl = serverUrl + '/invoices/' + loginService.getFiltro() + '/byRates';
		$http.get(inserturl, {params: formatService.formatearDatos(param)})
				.success(function(response){
					callback(response);
				}).error(function(error){
					callback(error);
				});
	};

	factory.getReporteTarifas = function(fecha, tarifas, callback){
		var inserturl = serverUrl + '/invoices/byRates?fechaInicio=' + formatService.formatearFechaISOString(fecha.fechaInicio) + '&fechaFin=' + formatService.formatearFechaISOString(fecha.fechaFin);
		$http.post(inserturl, tarifas)
			.success(function (response) {
				callback(response);
			}).error(function(errorText) {
				dialogs.error('Error', 'Error al añadir el Match en la base');
			});
	};

	return factory;
}]);
