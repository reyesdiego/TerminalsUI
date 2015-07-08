/**
 * Created by Artiom on 17/06/14.
 */

myapp.factory('reportsFactory', ['$http', 'dialogs', 'formatService', function($http, dialogs, formatService){
	var factory = {};

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
