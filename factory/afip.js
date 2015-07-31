/**
 * Created by artiom on 17/12/14.
 */

myapp.factory('afipFactory', ['$http', 'loginService', 'formatService', '$q', 'HTTPCanceler',
	function($http, loginService, formatService, $q, HTTPCanceler){

		var factory = {};

		factory.getAfip = function(tipoRegistro, filtros, page, callback){
			factory.cancelRequest();

			var ruta = '';
			switch (tipoRegistro) {
				case 'afip.afectacion.afectacion1':
					ruta = 'registro1_afectacion/';
					break;
				case 'afip.afectacion.afectacion2':
					ruta = 'registro2_afectacion/';
					break;
				case 'afip.detalle.detexpo1':
					ruta = 'registro1_detexpo/';
					break;
				case 'afip.detalle.detexpo2':
					ruta = 'registro2_detexpo/';
					break;
				case 'afip.detalle.detexpo3':
					ruta = 'registro3_detexpo/';
					break;
				case 'afip.detalle.detimpo1':
					ruta = 'registro1_detimpo/';
					break;
				case 'afip.detalle.detimpo2':
					ruta = 'registro2_detimpo/';
					break;
				case 'afip.detalle.detimpo3':
					ruta = 'registro3_detimpo/';
					break;
				case 'afip.sumatorias.expo1':
					ruta = 'registro1_sumexpomane/';
					break;
				case 'afip.sumatorias.expo2':
					ruta = 'registro2_sumexpomane/';
					break;
				case 'afip.sumatorias.expo3':
					ruta = 'registro3_sumexpomane/';
					break;
				case 'afip.sumatorias.expo4':
					ruta = 'registro4_sumexpomane/';
					break;
				case 'afip.sumatorias.expo5':
					ruta = 'registro5_sumexpomane/';
					break;
				case 'afip.sumatorias.impo1':
					ruta = 'registro1_sumimpomani/';
					break;
				case 'afip.sumatorias.impo2':
					ruta = 'registro2_sumimpomani/';
					break;
				case 'afip.sumatorias.impo3':
					ruta = 'registro3_sumimpomani/';
					break;
				case 'afip.sumatorias.impo4':
					ruta = 'registro4_sumimpomani/';
					break;
				case 'afip.solicitud.solicitud1':
					ruta = 'registro1_solicitud/';
					break;
				case 'afip.solicitud.solicitud2':
					ruta = 'registro2_solicitud/';
					break;
				case 'afip.solicitud.solicitud3':
					ruta = 'registro3_solicitud/';
					break;
				case 'afip.removido.removido1':
					ruta = 'registro1_remotrb/';
					break;
				case 'afip.removido.removido2':
					ruta = 'registro2_remotrb/';
					break;
				case 'afip.removido.removido3':
					ruta = 'registro3_remotrb/';
					break;
			}

			ruta += page.skip + '/' + page.limit;
			this.getRegistroAfip(ruta, filtros, function(data){
				callback(data);
			})
		};

		factory.getRegistroAfip = function(ruta, filtros, callback){
			var defer = $q.defer();
			var canceler = HTTPCanceler.get(defer);
			var inserturl = serverUrl + '/afip/' + ruta;
			$http.get(inserturl, { params: formatService.formatearDatos(filtros), timeout: canceler.promise })
				.success(function(data){
					callback(data);
				}).error(function(errorText, status){
					if (status != 0){
						var data={
							status: 'ERROR'
						};
						callback(data);
					}
				});
		};

		factory.getContainerSumaria = function(container, callback){
			var defer = $q.defer();
			var canceler = HTTPCanceler.get(defer);
			var inserturl = serverUrl + '/afip/sumariaImpo/' + container;
			$http.get(inserturl, {timeout: canceler.promise})
				.success(function(data){
					callback(data);
				}).error(function(error, status){
					if (status != 0){
						if (error == null){
							error = {
								status: 'ERROR'
							};
						}
						callback(error);
					}
				});
		};

		factory.getSumariaImpoBuques = function (callback) {
			var inserturl = serverUrl + '/afip/registro1_sumimpomani/buques';
			$http.get(inserturl)
				.success(function (data) {
					callback(data, false);
				})
				.error(function (error) {
					callback(error, true);
				})
		};

		factory.getSumariaExpoBuques = function (callback) {
			var inserturl = serverUrl + '/afip/registro1_sumexpomane/buques';
			$http.get(inserturl)
				.success(function (data) {
					callback(data, false);
				})
				.error(function (error) {
					callback(error, true);
				})
		};

		factory.getAfectacionBuques = function (callback) {
			var inserturl = serverUrl + '/afip/registro1_afectacion/buques';
			$http.get(inserturl)
				.success(function (data) {
					callback(data, false);
				})
				.error(function (error) {
					callback(error, true);
				})
		};

		factory.getSolicitudBuques = function(callback){
			var inserturl = serverUrl + '/afip/registro1_solicitud/buques';
			$http.get(inserturl)
				.success(function(data){
					callback(data, false);
				})
				.error(function(error){
					callback(error, true)
				})
		};

		factory.cancelRequest = function(){
			HTTPCanceler.cancel();
		};

		return factory;

	}]);