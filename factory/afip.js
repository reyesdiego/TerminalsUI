/**
 * Created by artiom on 17/12/14.
 */

myapp.factory('afipFactory', ['$http', 'loginService', 'formatService', function($http, loginService, formatService){

	var factory = {};

	factory.getAfip = function(tipoRegitro, filtros, page, callback){
		switch (tipoRegitro) {
			case 'afip.afectacion.afectacion1':
				this.getRegistro1Afectacion(filtros, page, function(data) {
					callback(data);
				});
				break;
			case 'afip.afectacion.afectacion2':
				this.getRegistro2Afectacion(filtros, page, function(data) {
					callback(data);
				});
				break;
			case 'afip.detalle.detexpo1':
				this.getRegistro1detExpo(filtros, page, function(data) {
					callback(data);
				});
				break;
			case 'afip.detalle.detexpo2':
				this.getRegistro2detExpo(filtros, page, function(data) {
					callback(data);
				});
				break;
			case 'afip.detalle.detexpo3':
				this.getRegistro3detExpo(filtros, page, function(data) {
					callback(data);
				});
				break;
			case 'afip.detalle.detimpo1':
				this.getRegistro1detImpo(filtros, page, function(data) {
					callback(data);
				});
				break;
			case 'afip.detalle.detimpo2':
				this.getRegistro2detImpo(filtros, page, function(data) {
					callback(data);
				});
				break;
			case 'afip.detalle.detimpo3':
				this.getRegistro3detImpo(filtros, page, function(data) {
					callback(data);
				});
				break;
			case 'afip.sumatorias.expo1':
				this.getRegistro1sumExpoMane(filtros, page, function(data) {
					callback(data);
				});
				break;
			case 'afip.sumatorias.expo2':
				this.getRegistro2sumExpoMane(filtros, page, function(data) {
					callback(data);
				});
				break;
			case 'afip.sumatorias.expo3':
				this.getRegistro3sumExpoMane(filtros, page, function(data) {
					callback(data);
				});
				break;
			case 'afip.sumatorias.expo4':
				this.getRegistro4sumExpoMane(filtros, page, function(data) {
					callback(data);
				});
				break;
			case 'afip.sumatorias.expo5':
				this.getRegistro5sumExpoMane(filtros, page, function(data) {
					callback(data);
				});
				break;
			case 'afip.sumatorias.impo1':
				this.getRegistro1sumImpoMani(filtros, page, function(data) {
					callback(data);
				});
				break;
			case 'afip.sumatorias.impo2':
				this.getRegistro2sumImpoMani(filtros, page, function(data) {
					callback(data);
				});
				break;
			case 'afip.sumatorias.impo3':
				this.getRegistro3sumImpoMani(filtros, page, function(data) {
					callback(data);
				});
				break;
			case 'afip.sumatorias.impo4':
				this.getRegistro4sumImpoMani(filtros, page, function(data) {
					callback(data);
				});
				break;
			case 'afip.solicitud.solicitud1':
				this.getRegistro1Solicitud(filtros, page, function(data) {
					callback(data);
				});
				break;
			case 'afip.solicitud.solicitud2':
				this.getRegistro2Solicitud(filtros, page, function(data) {
					callback(data);
				});
				break;
			case 'afip.solicitud.solicitud3':
				this.getRegistro3Solicitud(filtros, page, function(data) {
					callback(data);
				});
				break;
		}
	};

	factory.getRegistro1Afectacion = function(filtros, page, callback){
		var inserturl = serverUrl + '/afip/registro1_afectacion/' + page.skip + '/' + page.limit;
		$http.get(inserturl, { params: formatService.formatearDatos(filtros) })
			.success(function(data){
				callback(data);
			}).error(function(errorText){
				var data={
					status: 'ERROR'
				};
				callback(data);
			});
	};

	factory.getRegistro1detExpo = function(filtros, page, callback){
		var inserturl = serverUrl + '/afip/registro1_detexpo/' + page.skip + '/' + page.limit;
		$http.get(inserturl, { params: formatService.formatearDatos(filtros) })
			.success(function(data){
				callback(data);
			}).error(function(errorText){
				var data={
					status: 'ERROR'
				};
				callback(data);
			});
	};

	factory.getRegistro1detImpo = function(filtros, page, callback){
		var inserturl = serverUrl + '/afip/registro1_detimpo/' + page.skip + '/' + page.limit;
		$http.get(inserturl, { params: formatService.formatearDatos(filtros) })
			.success(function(data){
				callback(data);
			}).error(function(errorText){
				var data={
					status: 'ERROR'
				};
				callback(data);
			});
	};

	factory.getRegistro1Solicitud = function(filtros, page, callback){
		var inserturl = serverUrl + '/afip/registro1_solicitud/' + page.skip + '/' + page.limit;
		$http.get(inserturl, { params: formatService.formatearDatos(filtros) })
			.success(function(data){
				callback(data);
			}).error(function(errorText){
				var data={
					status: 'ERROR'
				};
				callback(data);
			});
	};

	factory.getRegistro1sumExpoMane = function(filtros, page, callback){
		var inserturl = serverUrl + '/afip/registro1_sumexpomane/' + page.skip + '/' + page.limit;
		$http.get(inserturl, { params: formatService.formatearDatos(filtros) })
			.success(function(data){
				callback(data);
			}).error(function(errorText){
				var data={
					status: 'ERROR'
				};
				callback(data);
			});
	};

	factory.getRegistro1sumImpoMani = function(filtros, page, callback){
		var inserturl = serverUrl + '/afip/registro1_sumimpomani/' + page.skip + '/' + page.limit;
		$http.get(inserturl, { params: formatService.formatearDatos(filtros) })
			.success(function(data){
				callback(data);
			}).error(function(errorText){
				var data={
					status: 'ERROR'
				};
				callback(data);
			});
	};

	factory.getRegistro2Afectacion = function(filtros, page, callback){
		var inserturl = serverUrl + '/afip/registro2_afectacion/' + page.skip + '/' + page.limit;
		$http.get(inserturl, { params: formatService.formatearDatos(filtros) })
			.success(function(data){
				callback(data);
			}).error(function(errorText){
				var data={
					status: 'ERROR'
				};
				callback(data);
			});
	};

	factory.getRegistro2detExpo = function(filtros, page, callback){
		var inserturl = serverUrl + '/afip/registro2_detexpo/' + page.skip + '/' + page.limit;
		$http.get(inserturl, { params: formatService.formatearDatos(filtros) })
			.success(function(data){
				callback(data);
			}).error(function(errorText){
				var data={
					status: 'ERROR'
				};
				callback(data);
			});
	};

	factory.getRegistro2detImpo = function(filtros, page, callback){
		var inserturl = serverUrl + '/afip/registro2_detimpo/' + page.skip + '/' + page.limit;
		$http.get(inserturl, { params: formatService.formatearDatos(filtros) })
			.success(function(data){
				callback(data);
			}).error(function(errorText){
				var data={
					status: 'ERROR'
				};
				callback(data);
			});
	};

	factory.getRegistro2Solicitud = function(filtros, page, callback){
		var inserturl = serverUrl + '/afip/registro2_solicitud/' + page.skip + '/' + page.limit;
		$http.get(inserturl, { params: formatService.formatearDatos(filtros) })
			.success(function(data){
				callback(data);
			}).error(function(errorText){
				var data={
					status: 'ERROR'
				};
				callback(data);
			});
	};

	factory.getRegistro2sumExpoMane = function(filtros, page, callback){
		var inserturl = serverUrl + '/afip/registro2_sumexpomane/' + page.skip + '/' + page.limit;
		$http.get(inserturl, { params: formatService.formatearDatos(filtros) })
			.success(function(data){
				callback(data);
			}).error(function(errorText){
				var data={
					status: 'ERROR'
				};
				callback(data);
			});
	};

	factory.getRegistro2sumImpoMani = function(filtros, page, callback){
		var inserturl = serverUrl + '/afip/registro2_sumimpomani/' + page.skip + '/' + page.limit;
		$http.get(inserturl, { params: formatService.formatearDatos(filtros) })
			.success(function(data){
				callback(data);
			}).error(function(errorText){
				var data={
					status: 'ERROR'
				};
				callback(data);
			});
	};

	factory.getRegistro3detExpo = function(filtros, page, callback){
		var inserturl = serverUrl + '/afip/registro3_detexpo/' + page.skip + '/' + page.limit;
		$http.get(inserturl, { params: formatService.formatearDatos(filtros) })
			.success(function(data){
				callback(data);
			}).error(function(errorText){
				var data={
					status: 'ERROR'
				};
				callback(data);
			});
	};

	factory.getRegistro3detImpo = function(filtros, page, callback){
		var inserturl = serverUrl + '/afip/registro3_detimpo/' + page.skip + '/' + page.limit;
		$http.get(inserturl, { params: formatService.formatearDatos(filtros) })
			.success(function(data){
				callback(data);
			}).error(function(errorText){
				var data={
					status: 'ERROR'
				};
				callback(data);
			});
	};

	factory.getRegistro3Solicitud = function(filtros, page, callback){
		var inserturl = serverUrl + '/afip/registro3_solicitud/' + page.skip + '/' + page.limit;
		$http.get(inserturl, { params: formatService.formatearDatos(filtros) })
			.success(function(data){
				callback(data);
			}).error(function(errorText){
				var data={
					status: 'ERROR'
				};
				callback(data);
			});
	};

	factory.getRegistro3sumExpoMane = function(filtros, page, callback){
		var inserturl = serverUrl + '/afip/registro3_sumexpomane/' + page.skip + '/' + page.limit;
		$http.get(inserturl, { params: formatService.formatearDatos(filtros) })
			.success(function(data){
				callback(data);
			}).error(function(errorText){
				var data={
					status: 'ERROR'
				};
				callback(data);
			});
	};

	factory.getRegistro3sumImpoMani = function(filtros, page, callback){
		var inserturl = serverUrl + '/afip/registro3_sumimpomani/' + page.skip + '/' + page.limit;
		$http.get(inserturl, { params: formatService.formatearDatos(filtros) })
			.success(function(data){
				callback(data);
			}).error(function(errorText){
				var data={
					status: 'ERROR'
				};
				callback(data);
			});
	};

	factory.getRegistro4sumExpoMane = function(filtros, page, callback){
		var inserturl = serverUrl + '/afip/registro4_sumexpomane/' + page.skip + '/' + page.limit;
		$http.get(inserturl, { params: formatService.formatearDatos(filtros) })
			.success(function(data){
				callback(data);
			}).error(function(errorText){
				var data={
					status: 'ERROR'
				};
				callback(data);
			});
	};

	factory.getRegistro4sumImpoMani = function(filtros, page, callback){
		var inserturl = serverUrl + '/afip/registro4_sumimpomani/' + page.skip + '/' + page.limit;
		$http.get(inserturl, { params: formatService.formatearDatos(filtros) })
			.success(function(data){
				callback(data);
			}).error(function(errorText){
				var data={
					status: 'ERROR'
				};
				callback(data);
			});
	};

	factory.getRegistro5sumExpoMane = function(filtros, page, callback){
		var inserturl = serverUrl + '/afip/registro5_sumexpomane/' + page.skip + '/' + page.limit;
		$http.get(inserturl, { params: formatService.formatearDatos(filtros) })
			.success(function(data){
				callback(data);
			}).error(function(errorText){
				var data={
					status: 'ERROR'
				};
				callback(data);
			});
	};

	factory.getContainerSumaria = function(container, callback){
		var inserturl = serverUrl + '/afip/sumariaImpo/' + container;
		$http.get(inserturl)
			.success(function(data){
				callback(data);
			}).error(function(error){
				if (error == null){
					error = {
						status: 'ERROR'
					};
				}
				callback(error);
			});
	};

	factory.getSumariaImpoBuques = function (callback) {
		var inserturl = serverUrl + '/afip/registro1_sumimpomani/buques';
		$http.get(inserturl)
			.success(function (data) {
				callback(data);
			})
			.error(function (error) {
				callback(error);
			})
	};

	factory.getSumariaExpoBuques = function (callback) {
		var inserturl = serverUrl + '/afip/registro1_sumexpomane/buques';
		$http.get(inserturl)
			.success(function (data) {
				callback(data);
			})
			.error(function (error) {
				callback(error);
			})
	};

	factory.getAfectacionBuques = function (callback) {
		var inserturl = serverUrl + '/afip/registro1_afectacion/buques';
		$http.get(inserturl)
			.success(function (data) {
				callback(data);
			})
			.error(function (error) {
				callback(error);
			})
	};

	factory.getSolicitudBuques = function(callback){
		var inserturl = serverUrl + '/afip/registro1_solicitud/buques';
		$http.get(inserturl)
			.success(function(data){
				callback(data);
			})
			.error(function(error){
				callback(error)
			})
	};

	return factory;

}]);