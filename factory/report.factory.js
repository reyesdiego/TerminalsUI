/**
 * Created by Artiom on 17/06/14.
 */

myapp.factory('reportsFactory', ['$http', 'dialogs', 'formatService', 'loginService', 'APP_CONFIG', 'downloadService', function($http, dialogs, formatService, loginService, APP_CONFIG, downloadService){
	var factory = {};

	factory.getTerminalesCSV = function(datos, reportName, callback) {
		var inserturl = APP_CONFIG.SERVER_URL + '/invoices/' + loginService.filterTerminal + '/byRates';
		$http.get(inserturl, { params: formatService.formatearDatos(datos) })
				.then(function(response){
					var contentType = response.headers('Content-Type');
					if (contentType.indexOf('text/csv') >= 0){
						downloadService.setDownloadCsv(reportName, response.data);
						callback('OK');
					} else {
						callback('ERROR');
					}
				}, function(response){
					callback('ERROR');
				});
	};

	factory.getReporteTerminales = function(param, callback){
		var inserturl = APP_CONFIG.SERVER_URL + '/invoices/' + loginService.filterTerminal + '/byRates';
		$http.get(inserturl, {params: formatService.formatearDatos(param)})
				.then(function(response){
					callback(response.data);
				}, function(response){
					callback(response.data);
				});
	};

	factory.getReporteTarifas = function(fecha, tarifas, callback){
		var inserturl = APP_CONFIG.SERVER_URL + '/invoices/byRates?fechaInicio=' + formatService.formatearFechaISOString(fecha.fechaInicio) + '&fechaFin=' + formatService.formatearFechaISOString(fecha.fechaFin);
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
