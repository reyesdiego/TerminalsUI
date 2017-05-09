/**
 * Created by Artiom on 17/06/14.
 */

myapp.factory('reportsFactory', ['$http', 'dialogs', 'formatService', 'loginService', 'APP_CONFIG', 'downloadService', '$q', function($http, dialogs, formatService, loginService, APP_CONFIG, downloadService, $q){

	class reportsFactory {

		getTerminalesCSV(datos, reportName, callback) {
			const inserturl = `${APP_CONFIG.SERVER_URL}/invoices/${loginService.filterTerminal}/byRates`;
			$http.get(inserturl, { params: formatService.formatearDatos(datos) }).then((response) => {
				const contentType = response.headers('Content-Type');
				if (contentType.indexOf('text/csv') >= 0){
					downloadService.setDownloadCsv(reportName, response.data);
					callback('OK');
				} else {
					callback('ERROR');
				}
			}).catch((response) => {
				callback('ERROR');
			});
		}

		getReporteTerminales(param, callback){
			const inserturl = `${APP_CONFIG.SERVER_URL}/invoices/${loginService.filterTerminal}/byRates`;
			$http.get(inserturl, {params: formatService.formatearDatos(param)}).then((response) => {
				callback(response.data);
			}).catch((response) => {
				callback(response.data);
			});
		}

		getReporteTarifas(fecha, tarifas, callback){
			const inserturl = `${APP_CONFIG.SERVER_URL}/invoices/byRates`;
			$http.post(inserturl, tarifas, {params: formatService.formatearDatos(fecha)}).then((response) => {
				callback(response.data);
			}).catch((response) => {
				callback(response.data);
			});
		}

		getReporteTarifasPivot(fecha, tarifas){
			const deferred = $q.defer();
			const inserturl = `${APP_CONFIG.SERVER_URL}/invoices/byRates/pivot`;
			$http.post(inserturl, tarifas, {params: formatService.formatearDatos(fecha)}).then((response) => {
				deferred.resolve(response.data);
			}).catch((response) => {
				deferred.reject(response.data)
			});
			return deferred.promise;
		}

	}

	return new reportsFactory();
}]);
