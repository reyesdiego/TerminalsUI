/**
 * Created by artiom on 17/12/14.
 */

myapp.factory('afipFactory', ['$http', 'loginService', 'formatService', '$q', 'HTTPCanceler', 'APP_CONFIG', 'downloadService',
	function($http, loginService, formatService, $q, HTTPCanceler, APP_CONFIG, downloadService){

		class afipFactory {

			constructor(){
				this.namespace = 'afip';
			}

			cancelRequest(){
				HTTPCanceler.cancel(this.namespace);
			};

			obtenerRuta(tipoRegistro){
				switch (tipoRegistro) {
					case 'afip.afectacion.afectacion1':
						return 'registro1_afectacion/';
						break;
					case 'afip.afectacion.afectacion2':
						return 'registro2_afectacion/';
						break;
					case 'afip.detalle.detexpo1':
						return 'registro1_detexpo/';
						break;
					case 'afip.detalle.detexpo2':
						return 'registro2_detexpo/';
						break;
					case 'afip.detalle.detexpo3':
						return 'registro3_detexpo/';
						break;
					case 'afip.detalle.detimpo1':
						return 'registro1_detimpo/';
						break;
					case 'afip.detalle.detimpo2':
						return 'registro2_detimpo/';
						break;
					case 'afip.detalle.detimpo3':
						return 'registro3_detimpo/';
						break;
					case 'afip.sumatorias.expo1':
						return 'registro1_sumexpomane/';
						break;
					case 'afip.sumatorias.expo2':
						return 'registro2_sumexpomane/';
						break;
					case 'afip.sumatorias.expo3':
						return 'registro3_sumexpomane/';
						break;
					case 'afip.sumatorias.expo4':
						return 'registro4_sumexpomane/';
						break;
					case 'afip.sumatorias.expo5':
						return 'registro5_sumexpomane/';
						break;
					case 'afip.sumatorias.impo1':
						return 'registro1_sumimpomani/';
						break;
					case 'afip.sumatorias.impo2':
						return 'registro2_sumimpomani/';
						break;
					case 'afip.sumatorias.impo3':
						return 'registro3_sumimpomani/';
						break;
					case 'afip.sumatorias.impo4':
						return 'registro4_sumimpomani/';
						break;
					case 'afip.solicitud.solicitud1':
						return 'registro1_solicitud/';
						break;
					case 'afip.solicitud.solicitud2':
						return 'registro2_solicitud/';
						break;
					case 'afip.solicitud.solicitud3':
						return 'registro3_solicitud/';
						break;
					case 'afip.removido.removido1':
						return 'registro1_remotrb/';
						break;
					case 'afip.removido.removido2':
						return 'registro2_remotrb/';
						break;
					case 'afip.removido.removido3':
						return 'registro3_remotrb/';
						break;
					case 'afip.transbordos.impo':
						return 'transbordosImpo/';
						break;
					case 'afip.transbordos.expo':
						return 'transbordosExpo/';
						break;
				}
			}

			getDetalleSumaria(tipo, sumaria, callback){
				const inserturl = `${APP_CONFIG.SERVER_URL}/afip/transbordo${tipo}`;
				const data = {
					sumaria: sumaria
				};
				$http.get(inserturl, { params: data}).then(response => {
					callback(response.data);
				}).catch(response => {
					callback(response.data);
				})
			}

			getCSV(tipoRegistro, filtros, callback){
				let ruta = this.obtenerRuta(tipoRegistro);

				ruta += 'down';
				this.getRegistroCSV(ruta, filtros, (data, status) => {
					callback(data, status);
				});
			}

			getAfip(tipoRegistro, filtros, page, callback){
				this.cancelRequest();

				let ruta = this.obtenerRuta(tipoRegistro);

				ruta += page.skip + '/' + page.limit;
				this.getRegistroAfip(ruta, filtros, (data) => {
					callback(data);
				})
			}

			getRegistroCSV(ruta, filtros, callback){
				const inserturl = `${APP_CONFIG.SERVER_URL}/afip/${ruta}`;
				$http.get(inserturl, { params: formatService.formatearDatos(filtros) }).then((response) => {
					const contentType = response.headers('Content-Type');
					if (contentType.indexOf('text/csv') >= 0){
						downloadService.setDownloadCsv('ReporteAFIP.csv', response.data);
						callback('OK');
					} else {
						callback('ERROR');
					}
				}).catch((response) => {
					callback('ERROR');
				});
			}

			getRegistroAfip(ruta, filtros, callback){
				const defer = $q.defer();
				const canceler = HTTPCanceler.get(defer, this.namespace);
				const inserturl = `${APP_CONFIG.SERVER_URL}/afip/${ruta}`;
				$http.get(inserturl, { params: formatService.formatearDatos(filtros), timeout: canceler.promise }).then((response) => {
					callback(response.data);
				}).catch((response) => {
					if (response.status != -5){
						let data={
							status: 'ERROR'
						};
						callback(data);
					}
				});
			}

			/*getContainerSumaria(container, callback){
				const defer = $q.defer();
				const canceler = HTTPCanceler.get(defer, namespace);
				const inserturl = `${APP_CONFIG.SERVER_URL}/afip/sumariaImpo/${container}`;
				$http.get(inserturl, {timeout: canceler.promise}).then((response) => {
					callback(response.data);
				}).catch((response) => {
					if (response.status != -5){
						if (response.data == null){
							response.data = {
								status: 'ERROR'
							};
						}
						callback(response.data);
					}
				});
			}

			getContainerSumariaExpo(container, callback){
				const defer = $q.defer();
				const canceler = HTTPCanceler.get(defer, namespace);
				const inserturl = `${APP_CONFIG.SERVER_URL}/afip/sumariaExpo/${container}`;
				$http.get(inserturl, {timeout: canceler.promise}).then((response) => {
					callback(response.data);
				}).catch((response) => {
					if (response.status != -5){
						if (response.data == null){
							response.data = {
								status: 'ERROR'
							};
						}
						callback(response.data);
					}
				});
			}*/
		}


		/*factory.getManifiestoDetalle = function(manifiesto, callback){
			//var insertUrl = APP_CONFIG.SERVER_URL + '/alguna ruta';
			var rutaMockeada = '/TerminalsUI/mocks/manifiestoDetalle.json';
			$http.get(rutaMockeada)
				.then(function(response){
					callback(response.data);
				}, function(response){
					callback(response.data);
				})
		};*/

		return new afipFactory();

	}]);