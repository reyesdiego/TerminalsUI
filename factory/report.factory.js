/**
 * Created by Artiom on 17/06/14.
 */

myapp.factory('reportsFactory', ['$http', 'dialogs', 'formatService', 'loginService', 'APP_CONFIG', 'downloadService', '$q', function($http, dialogs, formatService, loginService, APP_CONFIG, downloadService, $q){

	class reportsFactory {

		processReportContainer(data){
			let result = [];
			let medidas = {};
			data.forEach(reg => {
				if (!medidas[reg.iso1]) medidas[reg.iso1] = [];
				medidas[reg.iso1].push(reg);
			});
			for (let medida in medidas){
				let reg = { medida: medida, contenedores: [], detalle: false, total: 0};
				medidas[medida].forEach((container) => {
					reg.contenedores.push(container);
					reg.total += container.total;
				});
				result.push(reg);
			}
			return result;
		}

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
				if (response.data.status == 'OK'){
					deferred.resolve(response.data);
				} else {
					deferred.reject(response.data);
				}
			}).catch((response) => {
				deferred.reject(response.data)
			});
			return deferred.promise;
		}

		getFacturacionEmpresas(datos, callback){
			const inserturl = `${APP_CONFIG.SERVER_URL}/invoices/totalClient`;
			$http.get(inserturl, {params: formatService.formatearDatos(datos)}).then((response) => {
				callback(response.data);
			}).catch((response) => {
				callback(response.data);
			});
		}

		getTopFacturacionEmpresas(datos, callback){
			const inserturl = `${APP_CONFIG.SERVER_URL}/invoices/totalClientTop`;
			$http.get(inserturl, {params: formatService.formatearDatos(datos)}).then((response) => {
				callback(response.data);
			}).catch((response) => {
				callback(response.data);
			});
		}

		getFacturacionEmpresasCSV(datos, callback){
			const inserturl = `${APP_CONFIG.SERVER_URL}/invoices/totalClient`;
			$http.get(inserturl, {params: formatService.formatearDatos(datos)}).then((response) => {
				const contentType = response.headers('Content-Type');
				if (contentType.indexOf('text/csv') >= 0){
					downloadService.setDownloadCsv('Facturacion_empresas.csv', response.data);
					callback('OK');
				} else {
					callback('ERROR');
				}
			}).catch((response) => {
				callback('ERROR');
			});
		}

		getReporteContainers(datos){
			datos.terminal = loginService.filterTerminal;
			const deferred = $q.defer();
			const inserturl = `${APP_CONFIG.SERVER_URL}/invoices/byContainerTotales`;
			$http.get(inserturl, { params: formatService.formatearDatos(datos)}).then(response => {
				console.log(response);
				if (response.data.status == 'OK'){

					deferred.resolve(this.processReportContainer(response.data.data));
				} else {
					deferred.reject(response.data);
				}
			}).catch(response => {
				deferred.reject(response.data);
			});
			return deferred.promise;
		}

	}

	return new reportsFactory();
}]);
