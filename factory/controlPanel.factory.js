/**
 * Created by Diego Reyes on 3/19/14.
 */

myapp.factory('controlPanelFactory', ['$http', 'formatService', 'loginService', '$q', 'HTTPCanceler', 'APP_CONFIG', 'downloadService',
	function($http, formatService, loginService, $q, HTTPCanceler, APP_CONFIG, downloadService){

		class controlPanelFactory {

			constructor(){
				this.namespace = 'control';
			}

			getByDay(dia){
				const defer = $q.defer();
				const canceler = HTTPCanceler.get(defer, namespace, 'getByDay');
				const inserturl = `${APP_CONFIG.SERVER_URL}/invoices/counts`;
				$http.get(inserturl, { params: formatService.formatearDatos(dia), timeout: canceler.promise }).then((response) => {
					if (response.statusText === 'OK'){
						let invoicesCount = 0, totalCount = 0;
						for (let i = 0, len=response.data.data.length; i< len; i++){
							invoicesCount += response.data.data[i].cnt;
							totalCount += response.data.data[i].total;
						}
						response.data.data.invoicesCount = invoicesCount;
						response.data.data.totalCount = totalCount;
						response.data.invoicesCount = invoicesCount;
						response.data.totalCount = totalCount;
					}
					defer.resolve(response.data);
				}).catch((response) => {
					defer.reject(response);
				});
				return defer.promise;
			}

			getFacturasMeses(datos){
				const defer = $q.defer();
				const canceler = HTTPCanceler.get(defer, namespace, 'getFacturasMeses');
				const inserturl = `${APP_CONFIG.SERVER_URL}/invoices/countsByMonth`;
				$http.get(inserturl, { params: formatService.formatearDatos(datos), timeout: canceler.promise }).then((response) => {
					defer.resolve(response.data);
				}).catch((response) => {
					defer.reject(response);
				});
				return defer.promise;
			}

			getGatesMeses(datos){
				const defer = $q.defer();
				const canceler = HTTPCanceler.get(defer, namespace, 'getGatesMeses');
				const inserturl = APP_CONFIG.SERVER_URL + '/gates/ByMonth';
				$http.get(inserturl, { params: formatService.formatearDatos(datos), timeout: canceler.promise }).then((response) => {
					defer.resolve(response.data.data);
				}).catch((response) => {
					defer.reject(response);
				});
				return defer.promise;
			}

			getTurnosMeses(datos){
				const defer = $q.defer();
				const canceler = HTTPCanceler.get(defer, namespace, 'getTurnosMeses');
				const inserturl = `${APP_CONFIG.SERVER_URL}/appointments/ByMonth`;
				$http.get(inserturl, { params: formatService.formatearDatos(datos), timeout: canceler.promise }).then((response) => {
					defer.resolve(response.data);
				}).catch((response) => {
					defer.reject(response);
				});
				return defer.promise;
			}

			//A partir de la fecha pasada, devuelve la facturación por día, de la fecha y 4 fechas hacia atrás
			getFacturadoPorDia(datos){
				const defer = $q.defer();
				const canceler = HTTPCanceler.get(defer, namespace, 'getFacturadoPorDia');
				const inserturl = `${APP_CONFIG.SERVER_URL}/invoices/countsByDate`;
				$http.get(inserturl, { params: formatService.formatearDatos(datos), timeout: canceler.promise }).then((response) => {
					defer.resolve(response.data);
				}).catch((response) => {
					defer.reject(response);
				});
				return defer.promise;
			}

			getGatesDia(datos){
				const defer = $q.defer();
				const canceler = HTTPCanceler.get(defer, namespace, 'getGatesDia');
				const inserturl = `${APP_CONFIG.SERVER_URL}/gates/ByHour`;
				$http.get(inserturl, { params: formatService.formatearDatos(datos), timeout: canceler.promise }).then((response) => {
					defer.resolve(response.data.data)
				}).catch((response) => {
					defer.reject(response);
				});
				return defer.promise;
			}

			getTurnosDia(datos){
				const defer = $q.defer();
				const canceler = HTTPCanceler.get(defer, namespace, 'getTurnosDia');
				const inserturl = `${APP_CONFIG.SERVER_URL}/appointments/ByHour`;
				$http.get(inserturl, { params: formatService.formatearDatos(datos), timeout: canceler.promise }).then((response) => {
					defer.resolve(response.data);
				}).catch((response) => {
					defer.reject(response);
				});
				return defer.promise;
			}

			//*************** REPORTES **********************\\
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

			/*getTasas(datos, callback){
				var defer = $q.defer();
				var canceler = HTTPCanceler.get(defer, namespace, 'getTasas');
				var inserturl = APP_CONFIG.SERVER_URL + '/invoices/ratesTotal/' + datos.moneda + '/';
				$http.get(inserturl, { params: formatService.formatearDatos(datos), timeout: canceler.promise })
						.then(function(response){
							var result = {
								"ratesCount": 0,
								"ratesTotal": 0,
								"dataGraf": []
							};
							if (response.data.data.length){
								var cnt = 0;
								var facturado = 0;
								for (var i = 0, len=response.data.data.length; i< len; i++){
									cnt += response.data.data[i].cnt;
									facturado += response.data.data[i].total;
								}
								result = {
									"ratesCount": cnt,
									"ratesTotal": facturado,
									"dataGraf": response.data.data
								}
							}
							callback(result);
						}, function(response){
							if (response.status != -5) errorFactory.raiseError(response.data, inserturl, 'errorTasas', 'Error al cargar total de facturado por tasa a las cargas.');
						});
			}*/

		}

		//Método de caché - No hace falta cancelarlo
		/*factory.getShips = function(callback){
			var inserturl = APP_CONFIG.SERVER_URL + '/invoices/'+loginService.getFiltro()+'/ships';
			$http.get(inserturl)
				.success(function (response){
					callback(response.data);
				}, function(response){
					errorFactory.raiseError(response.data, inserturl, 'errorListaAutoCompletar', 'Error al cargar listado de buques.');
				});
		};*/

		return new controlPanelFactory();
	}]);