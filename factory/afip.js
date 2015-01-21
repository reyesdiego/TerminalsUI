/**
 * Created by artiom on 17/12/14.
 */
myapp.factory('afipFactory', function($http, $rootScope, dialogs, loginService, formatDate, errorFactory){

	var factory = {};

	factory.getAfip = function(tipoRegitro, filtroOrden, page, callback){
		switch (tipoRegitro) {
			case 'afectacion1':
				this.getRegistro1Afectacion(filtroOrden, page, function(data) {
					callback(data);
				});
				break;
			case 'afectacion2':
				this.getRegistro2Afectacion(filtroOrden, page, function(data) {
					callback(data);
				});
				break;
			case 'detexpo1':
				this.getRegistro1detExpo(filtroOrden, page, function(data) {
					callback(data);
				});
				break;
			case 'detexpo2':
				this.getRegistro2detExpo(filtroOrden, page, function(data) {
					callback(data);
				});
				break;
			case 'detexpo3':
				this.getRegistro3detExpo(filtroOrden, page, function(data) {
					callback(data);
				});
				break;
			case 'detimpo1':
				this.getRegistro1detImpo(filtroOrden, page, function(data) {
					callback(data);
				});
				break;
			case 'detimpo2':
				this.getRegistro2detImpo(filtroOrden, page, function(data) {
					callback(data);
				});
				break;
			case 'detimpo3':
				this.getRegistro3detImpo(filtroOrden, page, function(data) {
					callback(data);
				});
				break;
			case 'expo1':
				this.getRegistro1sumExpoMane(filtroOrden, page, function(data) {
					callback(data);
				});
				break;
			case 'expo2':
				this.getRegistro2sumExpoMane(filtroOrden, page, function(data) {
					callback(data);
				});
				break;
			case 'expo3':
				this.getRegistro3sumExpoMane(filtroOrden, page, function(data) {
					callback(data);
				});
				break;
			case 'expo4':
				this.getRegistro4sumExpoMane(filtroOrden, page, function(data) {
					callback(data);
				});
				break;
			case 'expo5':
				this.getRegistro5sumExpoMane(filtroOrden, page, function(data) {
					callback(data);
				});
				break;
			case 'impo1':
				this.getRegistro1sumImpoMani(filtroOrden, page, function(data) {
					callback(data);
				});
				break;
			case 'impo2':
				this.getRegistro2sumImpoMani(filtroOrden, page, function(data) {
					callback(data);
				});
				break;
			case 'impo3':
				this.getRegistro3sumImpoMani(filtroOrden, page, function(data) {
					callback(data);
				});
				break;
			case 'impo4':
				this.getRegistro4sumImpoMani(filtroOrden, page, function(data) {
					callback(data);
				});
				break;
			case 'solicitud1':
				this.getRegistro1Solicitud(filtroOrden, page, function(data) {
					callback(data);
				});
				break;
			case 'solicitud2':
				this.getRegistro2Solicitud(filtroOrden, page, function(data) {
					callback(data);
				});
				break;
			case 'solicitud3':
				this.getRegistro3Solicitud(filtroOrden, page, function(data) {
					callback(data);
				});
				break;
		}
	};

	factory.getRegistro1Afectacion = function(filtroOrden, page, callback){
		var inserturl = serverUrl + '/afip/registro1_afectacion/' + page.skip + '/' + page.limit;
		inserturl = factory.aplicarOrden(inserturl, filtroOrden);
		$http({
			method: 'GET',
			url: inserturl,
			headers:
			{token: loginService.getToken()}
		}).success(function(data){
			callback(data);
		}).error(function(errorText){
			errorFactory.raiseError(errorText, inserturl, 'errorDatos', 'Se ha producido un error al cargar los datos.');
			var data={
				status: 'ERROR'
			};
			callback(data);
		});
	};

	factory.getRegistro1detExpo = function(filtroOrden, page, callback){
		var inserturl = serverUrl + '/afip/registro1_detexpo/' + page.skip + '/' + page.limit;
		inserturl = factory.aplicarOrden(inserturl, filtroOrden);
		$http({
			method: 'GET',
			url: inserturl,
			headers:
			{token: loginService.getToken()}
		}).success(function(data){
			callback(data);
		}).error(function(errorText){
			errorFactory.raiseError(errorText, inserturl, 'errorDatos', 'Se ha producido un error al cargar los datos.');
			var data={
				status: 'ERROR'
			};
			callback(data);
		});
	};

	factory.getRegistro1detImpo = function(filtroOrden, page, callback){
		var inserturl = serverUrl + '/afip/registro1_detimpo/' + page.skip + '/' + page.limit;
		inserturl = factory.aplicarOrden(inserturl, filtroOrden);
		$http({
			method: 'GET',
			url: inserturl,
			headers:
			{token: loginService.getToken()}
		}).success(function(data){
			callback(data);
		}).error(function(errorText){
			errorFactory.raiseError(errorText, inserturl, 'errorDatos', 'Se ha producido un error al cargar los datos.');
			var data={
				status: 'ERROR'
			};
			callback(data);
		});
	};

	factory.getRegistro1Solicitud = function(filtroOrden, page, callback){
		var inserturl = serverUrl + '/afip/registro1_solicitud/' + page.skip + '/' + page.limit;
		inserturl = factory.aplicarOrden(inserturl, filtroOrden);
		$http({
			method: 'GET',
			url: inserturl,
			headers:
			{token: loginService.getToken()}
		}).success(function(data){
			callback(data);
		}).error(function(errorText){
			errorFactory.raiseError(errorText, inserturl, 'errorDatos', 'Se ha producido un error al cargar los datos.');
			var data={
				status: 'ERROR'
			};
			callback(data);
		});
	};

	factory.getRegistro1sumExpoMane = function(filtroOrden, page, callback){
		var inserturl = serverUrl + '/afip/registro1_sumexpomane/' + page.skip + '/' + page.limit;
		inserturl = factory.aplicarOrden(inserturl, filtroOrden);
		$http({
			method: 'GET',
			url: inserturl,
			headers:
			{token: loginService.getToken()}
		}).success(function(data){
			callback(data);
		}).error(function(errorText){
			errorFactory.raiseError(errorText, inserturl, 'errorDatos', 'Se ha producido un error al cargar los datos.');
			var data={
				status: 'ERROR'
			};
			callback(data);
		});
	};

	factory.getRegistro1sumImpoMani = function(filtroOrden, page, callback){
		var inserturl = serverUrl + '/afip/registro1_sumimpomani/' + page.skip + '/' + page.limit;
		inserturl = factory.aplicarOrden(inserturl, filtroOrden);
		$http({
			method: 'GET',
			url: inserturl,
			headers:
			{token: loginService.getToken()}
		}).success(function(data){
			callback(data);
		}).error(function(errorText){
			errorFactory.raiseError(errorText, inserturl, 'errorDatos', 'Se ha producido un error al cargar los datos.');
			var data={
				status: 'ERROR'
			};
			callback(data);
		});
	};

	factory.getRegistro2Afectacion = function(filtroOrden, page, callback){
		var inserturl = serverUrl + '/afip/registro2_afectacion/' + page.skip + '/' + page.limit;
		inserturl = factory.aplicarOrden(inserturl, filtroOrden);
		$http({
			method: 'GET',
			url: inserturl,
			headers:
			{token: loginService.getToken()}
		}).success(function(data){
			callback(data);
		}).error(function(errorText){
			errorFactory.raiseError(errorText, inserturl, 'errorDatos', 'Se ha producido un error al cargar los datos.');
			var data={
				status: 'ERROR'
			};
			callback(data);
		});
	};

	factory.getRegistro2detExpo = function(filtroOrden, page, callback){
		var inserturl = serverUrl + '/afip/registro2_detexpo/' + page.skip + '/' + page.limit;
		inserturl = factory.aplicarOrden(inserturl, filtroOrden);
		$http({
			method: 'GET',
			url: inserturl,
			headers:
			{token: loginService.getToken()}
		}).success(function(data){
			callback(data);
		}).error(function(errorText){
			errorFactory.raiseError(errorText, inserturl, 'errorDatos', 'Se ha producido un error al cargar los datos.');
			var data={
				status: 'ERROR'
			};
			callback(data);
		});
	};

	factory.getRegistro2detImpo = function(filtroOrden, page, callback){
		var inserturl = serverUrl + '/afip/registro2_detimpo/' + page.skip + '/' + page.limit;
		inserturl = factory.aplicarOrden(inserturl, filtroOrden);
		$http({
			method: 'GET',
			url: inserturl,
			headers:
			{token: loginService.getToken()}
		}).success(function(data){
			callback(data);
		}).error(function(errorText){
			errorFactory.raiseError(errorText, inserturl, 'errorDatos', 'Se ha producido un error al cargar los datos.');
			var data={
				status: 'ERROR'
			};
			callback(data);
		});
	};

	factory.getRegistro2Solicitud = function(filtroOrden, page, callback){
		var inserturl = serverUrl + '/afip/registro2_solicitud/' + page.skip + '/' + page.limit;
		inserturl = factory.aplicarOrden(inserturl, filtroOrden);
		$http({
			method: 'GET',
			url: inserturl,
			headers:
			{token: loginService.getToken()}
		}).success(function(data){
			callback(data);
		}).error(function(errorText){
			errorFactory.raiseError(errorText, inserturl, 'errorDatos', 'Se ha producido un error al cargar los datos.');
			var data={
				status: 'ERROR'
			};
			callback(data);
		});
	};

	factory.getRegistro2sumExpoMane = function(filtroOrden, page, callback){
		var inserturl = serverUrl + '/afip/registro2_sumexpomane/' + page.skip + '/' + page.limit;
		inserturl = factory.aplicarOrden(inserturl, filtroOrden);
		$http({
			method: 'GET',
			url: inserturl,
			headers:
			{token: loginService.getToken()}
		}).success(function(data){
			callback(data);
		}).error(function(errorText){
			errorFactory.raiseError(errorText, inserturl, 'errorDatos', 'Se ha producido un error al cargar los datos.');
			var data={
				status: 'ERROR'
			};
			callback(data);
		});
	};

	factory.getRegistro2sumImpoMani = function(filtroOrden, page, callback){
		var inserturl = serverUrl + '/afip/registro2_sumimpomani/' + page.skip + '/' + page.limit;
		inserturl = factory.aplicarOrden(inserturl, filtroOrden);
		$http({
			method: 'GET',
			url: inserturl,
			headers:
			{token: loginService.getToken()}
		}).success(function(data){
			callback(data);
		}).error(function(errorText){
			errorFactory.raiseError(errorText, inserturl, 'errorDatos', 'Se ha producido un error al cargar los datos.');
			var data={
				status: 'ERROR'
			};
			callback(data);
		});
	};

	factory.getRegistro3detExpo = function(filtroOrden, page, callback){
		var inserturl = serverUrl + '/afip/registro3_detexpo/' + page.skip + '/' + page.limit;
		inserturl = factory.aplicarOrden(inserturl, filtroOrden);
		$http({
			method: 'GET',
			url: inserturl,
			headers:
			{token: loginService.getToken()}
		}).success(function(data){
			callback(data);
		}).error(function(errorText){
			errorFactory.raiseError(errorText, inserturl, 'errorDatos', 'Se ha producido un error al cargar los datos.');
			var data={
				status: 'ERROR'
			};
			callback(data);
		});
	};

	factory.getRegistro3detImpo = function(filtroOrden, page, callback){
		var inserturl = serverUrl + '/afip/registro3_detimpo/' + page.skip + '/' + page.limit;
		inserturl = factory.aplicarOrden(inserturl, filtroOrden);
		$http({
			method: 'GET',
			url: inserturl,
			headers:
			{token: loginService.getToken()}
		}).success(function(data){
			callback(data);
		}).error(function(errorText){
			errorFactory.raiseError(errorText, inserturl, 'errorDatos', 'Se ha producido un error al cargar los datos.');
			var data={
				status: 'ERROR'
			};
			callback(data);
		});
	};

	factory.getRegistro3Solicitud = function(filtroOrden, page, callback){
		var inserturl = serverUrl + '/afip/registro3_solicitud/' + page.skip + '/' + page.limit;
		inserturl = factory.aplicarOrden(inserturl, filtroOrden);
		$http({
			method: 'GET',
			url: inserturl,
			headers:
			{token: loginService.getToken()}
		}).success(function(data){
			callback(data);
		}).error(function(errorText){
			errorFactory.raiseError(errorText, inserturl, 'errorDatos', 'Se ha producido un error al cargar los datos.');
			var data={
				status: 'ERROR'
			};
			callback(data);
		});
	};

	factory.getRegistro3sumExpoMane = function(filtroOrden, page, callback){
		var inserturl = serverUrl + '/afip/registro3_sumexpomane/' + page.skip + '/' + page.limit;
		inserturl = factory.aplicarOrden(inserturl, filtroOrden);
		$http({
			method: 'GET',
			url: inserturl,
			headers:
			{token: loginService.getToken()}
		}).success(function(data){
			callback(data);
		}).error(function(errorText){
			errorFactory.raiseError(errorText, inserturl, 'errorDatos', 'Se ha producido un error al cargar los datos.');
			var data={
				status: 'ERROR'
			};
			callback(data);
		});
	};

	factory.getRegistro3sumImpoMani = function(filtroOrden, page, callback){
		var inserturl = serverUrl + '/afip/registro3_sumimpomani/' + page.skip + '/' + page.limit;
		inserturl = factory.aplicarOrden(inserturl, filtroOrden);
		$http({
			method: 'GET',
			url: inserturl,
			headers:
			{token: loginService.getToken()}
		}).success(function(data){
			callback(data);
		}).error(function(errorText){
			errorFactory.raiseError(errorText, inserturl, 'errorDatos', 'Se ha producido un error al cargar los datos.');
			var data={
				status: 'ERROR'
			};
			callback(data);
		});
	};

	factory.getRegistro4sumExpoMane = function(filtroOrden, page, callback){
		var inserturl = serverUrl + '/afip/registro4_sumexpomane/' + page.skip + '/' + page.limit;
		inserturl = factory.aplicarOrden(inserturl, filtroOrden);
		$http({
			method: 'GET',
			url: inserturl,
			headers:
			{token: loginService.getToken()}
		}).success(function(data){
			callback(data);
		}).error(function(errorText){
			errorFactory.raiseError(errorText, inserturl, 'errorDatos', 'Se ha producido un error al cargar los datos.');
			var data={
				status: 'ERROR'
			};
			callback(data);
		});
	};

	factory.getRegistro4sumImpoMani = function(filtroOrden, page, callback){
		var inserturl = serverUrl + '/afip/registro4_sumimpomani/' + page.skip + '/' + page.limit;
		inserturl = factory.aplicarOrden(inserturl, filtroOrden);
		$http({
			method: 'GET',
			url: inserturl,
			headers:
			{token: loginService.getToken()}
		}).success(function(data){
			callback(data);
		}).error(function(errorText){
			errorFactory.raiseError(errorText, inserturl, 'errorDatos', 'Se ha producido un error al cargar los datos.');
			var data={
				status: 'ERROR'
			};
			callback(data);
		});
	};

	factory.getRegistro5sumExpoMane = function(filtroOrden, page, callback){
		var inserturl = serverUrl + '/afip/registro5_sumexpomane/' + page.skip + '/' + page.limit;
		inserturl = factory.aplicarOrden(inserturl, filtroOrden);
		$http({
			method: 'GET',
			url: inserturl,
			headers:
			{token: loginService.getToken()}
		}).success(function(data){
			callback(data);
		}).error(function(errorText){
			errorFactory.raiseError(errorText, inserturl, 'errorDatos', 'Se ha producido un error al cargar los datos.');
			var data={
				status: 'ERROR'
			};
			callback(data);
		});
	};

	factory.getContainerSumaria = function(container, callback){
		var inserturl = serverUrl + '/afip/sumariaImpo/' + container;
		$http({
			method: 'GET',
			url: inserturl,
			headers:
			{token: loginService.getToken()}
		}).success(function(data){
			callback(data);
		}).error(function(errorText){
			errorFactory.raiseError(errorText, inserturl, 'errorDatos', 'Se ha producido un error al cargar los datos.');
			var data={
				status: 'ERROR'
			};
			callback(data);
		});
	};

	factory.aplicarOrden = function(unaUrl, orden){
		if(angular.isDefined(orden) && orden != ''){
			unaUrl = unaUrl + '?order=' + '[{' + orden + '}]';
		}
		return unaUrl;
	};

	return factory;

});