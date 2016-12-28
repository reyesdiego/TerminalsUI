/**
 * Created by artiom on 17/12/14.
 */

myapp.factory('afipFactory', ['$http', 'loginService', 'formatService', '$q', 'HTTPCanceler', 'APP_CONFIG', 'downloadService',
	function($http, loginService, formatService, $q, HTTPCanceler, APP_CONFIG, downloadService){

		var factory = {};
		var namespace = 'afip';

		var obtenerRuta = function(tipoRegistro){
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
		};

		factory.getDetalleSumaria = function(tipo, sumaria, callback){
			var inserturl = APP_CONFIG.SERVER_URL + '/afip/transbordo' + tipo;
			var data = {
				sumaria: sumaria
			};
			$http.get(inserturl, { params: data })
				.then(function(response){
					callback(response.data);
				}, function(response){
					callback(response.data);
				})
		};


		factory.getCSV = function(tipoRegistro, filtros, callback){
			var ruta = obtenerRuta(tipoRegistro);

			ruta += 'down';
			this.getRegistroCSV(ruta, filtros, function(data, status){
				callback(data, status);
			});
		};

		factory.getAfip = function(tipoRegistro, filtros, page, callback){
			factory.cancelRequest();

			var ruta = obtenerRuta(tipoRegistro);

			ruta += page.skip + '/' + page.limit;
			this.getRegistroAfip(ruta, filtros, function(data){
				callback(data);
			})
		};

		factory.getRegistroCSV = function(ruta, filtros, callback){
			var inserturl = APP_CONFIG.SERVER_URL + '/afip/' + ruta;
			$http.get(inserturl, { params: formatService.formatearDatos(filtros) })
				.then(function(response) {
					var contentType = response.headers('Content-Type');
					if (contentType.indexOf('text/csv') >= 0){
						downloadService.setDownloadCsv('ReporteAFIP.csv', response.data);
						callback('OK');
					} else {
						callback('ERROR');
					}
				}, function(response){
					callback('ERROR');
				});
		};

		factory.getRegistroAfip = function(ruta, filtros, callback){
			var defer = $q.defer();
			var canceler = HTTPCanceler.get(defer, namespace);
			var inserturl = APP_CONFIG.SERVER_URL + '/afip/' + ruta;
			$http.get(inserturl, { params: formatService.formatearDatos(filtros), timeout: canceler.promise })
				.then(function(response){
					callback(response.data);
				}, function(response){
					if (response.status != -5){
						var data={
							status: 'ERROR'
						};
						callback(data);
					}
				});
		};

		factory.getContainerSumaria = function(container, callback){
			var defer = $q.defer();
			var canceler = HTTPCanceler.get(defer, namespace);
			var inserturl = APP_CONFIG.SERVER_URL + '/afip/sumariaImpo/' + container;
			$http.get(inserturl, {timeout: canceler.promise})
				.then(function(response){
					callback(response.data);
				}, function(response){
					if (response.status != -5){
						if (response.data == null){
							response.data = {
								status: 'ERROR'
							};
						}
						callback(response.data);
					}
				});
		};

		factory.getContainerSumariaExpo = function(container, callback){
			var defer = $q.defer();
			var canceler = HTTPCanceler.get(defer, namespace);
			var inserturl = APP_CONFIG.SERVER_URL + '/afip/sumariaExpo/' + container;
			$http.get(inserturl, {timeout: canceler.promise})
				.then(function(response){
					callback(response.data);
				}, function(response){
					if (response.status != -5){
						if (response.data == null){
							response.data = {
								status: 'ERROR'
							};
						}
						callback(response.data);
					}
				});
		};

		factory.getManifiestoDetalle = function(manifiesto, callback){
			//var insertUrl = APP_CONFIG.SERVER_URL + '/alguna ruta';
			var rutaMockeada = '/TerminalsUI/mocks/manifiestoDetalle.json';
			$http.get(rutaMockeada)
				.then(function(response){
					callback(response.data);
				}, function(response){
					callback(response.data);
				})
		};

		factory.cancelRequest = function(){
			HTTPCanceler.cancel(namespace);
		};

		return factory;

	}]);