/**
 * Created by artiom on 17/12/14.
 */
myapp.factory('afipFactory', function($http, $rootScope, dialogs, loginService, formatDate, errorFactory){

	var factory = {};

	factory.getAfip = function(tipoRegitro, page, callback){
		switch (tipoRegitro) {
			case 'afectacion1':
				this.getRegistro1Afectacion(page, function(data) {
					callback(data);
				});
				break;
			case 'afectacion2':
				this.getRegistro2Afectacion(page, function(data) {
					callback(data);
				});
				break;
			case 'detexpo1':
				this.getRegistro1detExpo(page, function(data) {
					callback(data);
				});
				break;
			case 'detexpo2':
				this.getRegistro2detExpo(page, function(data) {
					callback(data);
				});
				break;
			case 'detexpo3':
				this.getRegistro3detExpo(page, function(data) {
					callback(data);
				});
				break;
			case 'detimpo1':
				this.getRegistro1detImpo(page, function(data) {
					callback(data);
				});
				break;
			case 'detimpo2':
				this.getRegistro2detImpo(page, function(data) {
					callback(data);
				});
				break;
			case 'detimpo3':
				this.getRegistro3detImpo(page, function(data) {
					callback(data);
				});
				break;
			case 'expo1':
				this.getRegistro1sumExpoMane(page, function(data) {
					callback(data);
				});
				break;
			case 'expo2':
				this.getRegistro2sumExpoMane(page, function(data) {
					callback(data);
				});
				break;
			case 'expo3':
				this.getRegistro3sumExpoMane(page, function(data) {
					callback(data);
				});
				break;
			case 'expo4':
				this.getRegistro4sumExpoMane(page, function(data) {
					callback(data);
				});
				break;
			case 'expo5':
				this.getRegistro5sumExpoMane(page, function(data) {
					callback(data);
				});
				break;
			case 'impo1':
				this.getRegistro1sumImpoMani(page, function(data) {
					callback(data);
				});
				break;
			case 'impo2':
				this.getRegistro2sumImpoMani(page, function(data) {
					callback(data);
				});
				break;
			case 'impo3':
				this.getRegistro3sumImpoMani(page, function(data) {
					callback(data);
				});
				break;
			case 'impo4':
				this.getRegistro4sumImpoMani(page, function(data) {
					callback(data);
				});
				break;
			case 'solicitud1':
				this.getRegistro1Solicitud(page, function(data) {
					callback(data);
				});
				break;
			case 'solicitud2':
				this.getRegistro2Solicitud(page, function(data) {
					callback(data);
				});
				break;
			case 'solicitud3':
				this.getRegistro3Solicitud(page, function(data) {
					callback(data);
				});
				break;
		}
	};

	factory.getRegistro1Afectacion = function(page, callback){
		var inserturl = serverUrl + '/afip/registro1_afectacion/' + page.skip + '/' + page.limit;
		$http({
			method: 'GET',
			url: inserturl,
			headers:
			{token: loginService.getToken()}
		}).success(function(data){
			callback(data);
		}).error(function(errorText){
			errorFactory.raiseError(errorText, inserturl, 'errorDatos', 'Error al cargar los datos de comprobantes.');
		});
	};

	factory.getRegistro1detExpo = function(page, callback){
		var inserturl = serverUrl + '/afip/registro1_detexpo/' + page.skip + '/' + page.limit;
		$http({
			method: 'GET',
			url: inserturl,
			headers:
			{token: loginService.getToken()}
		}).success(function(data){
			callback(data);
		}).error(function(errorText){
			errorFactory.raiseError(errorText, inserturl, 'errorDatos', 'Error al cargar los datos de comprobantes.');
		});
	};

	factory.getRegistro1detImpo = function(page, callback){
		var inserturl = serverUrl + '/afip/registro1_detimpo/' + page.skip + '/' + page.limit;
		$http({
			method: 'GET',
			url: inserturl,
			headers:
			{token: loginService.getToken()}
		}).success(function(data){
			callback(data);
		}).error(function(errorText){
			errorFactory.raiseError(errorText, inserturl, 'errorDatos', 'Error al cargar los datos de comprobantes.');
		});
	};

	factory.getRegistro1Solicitud = function(page, callback){
		var inserturl = serverUrl + '/afip/registro1_solicitud/' + page.skip + '/' + page.limit;
		$http({
			method: 'GET',
			url: inserturl,
			headers:
			{token: loginService.getToken()}
		}).success(function(data){
			callback(data);
		}).error(function(errorText){
			errorFactory.raiseError(errorText, inserturl, 'errorDatos', 'Error al cargar los datos de comprobantes.');
		});
	};

	factory.getRegistro1sumExpoMane = function(page, callback){
		var inserturl = serverUrl + '/afip/registro1_sumexpomane/' + page.skip + '/' + page.limit;
		$http({
			method: 'GET',
			url: inserturl,
			headers:
			{token: loginService.getToken()}
		}).success(function(data){
			callback(data);
		}).error(function(errorText){
			errorFactory.raiseError(errorText, inserturl, 'errorDatos', 'Error al cargar los datos de comprobantes.');
		});
	};

	factory.getRegistro1sumImpoMani = function(page, callback){
		var inserturl = serverUrl + '/afip/registro1_sumimpomani/' + page.skip + '/' + page.limit;
		$http({
			method: 'GET',
			url: inserturl,
			headers:
			{token: loginService.getToken()}
		}).success(function(data){
			callback(data);
		}).error(function(errorText){
			errorFactory.raiseError(errorText, inserturl, 'errorDatos', 'Error al cargar los datos de comprobantes.');
		});
	};

	factory.getRegistro2Afectacion = function(page, callback){
		var inserturl = serverUrl + '/afip/registro2_afectacion/' + page.skip + '/' + page.limit;
		$http({
			method: 'GET',
			url: inserturl,
			headers:
			{token: loginService.getToken()}
		}).success(function(data){
			callback(data);
		}).error(function(errorText){
			errorFactory.raiseError(errorText, inserturl, 'errorDatos', 'Error al cargar los datos de comprobantes.');
		});
	};

	factory.getRegistro2detExpo = function(page, callback){
		var inserturl = serverUrl + '/afip/registro2_detexpo/' + page.skip + '/' + page.limit;
		$http({
			method: 'GET',
			url: inserturl,
			headers:
			{token: loginService.getToken()}
		}).success(function(data){
			callback(data);
		}).error(function(errorText){
			errorFactory.raiseError(errorText, inserturl, 'errorDatos', 'Error al cargar los datos de comprobantes.');
		});
	};

	factory.getRegistro2detImpo = function(page, callback){
		var inserturl = serverUrl + '/afip/registro2_detimpo/' + page.skip + '/' + page.limit;
		$http({
			method: 'GET',
			url: inserturl,
			headers:
			{token: loginService.getToken()}
		}).success(function(data){
			callback(data);
		}).error(function(errorText){
			errorFactory.raiseError(errorText, inserturl, 'errorDatos', 'Error al cargar los datos de comprobantes.');
		});
	};

	factory.getRegistro2Solicitud = function(page, callback){
		var inserturl = serverUrl + '/afip/registro2_solicitud/' + page.skip + '/' + page.limit;
		$http({
			method: 'GET',
			url: inserturl,
			headers:
			{token: loginService.getToken()}
		}).success(function(data){
			callback(data);
		}).error(function(errorText){
			errorFactory.raiseError(errorText, inserturl, 'errorDatos', 'Error al cargar los datos de comprobantes.');
		});
	};

	factory.getRegistro2sumExpoMane = function(page, callback){
		var inserturl = serverUrl + '/afip/registro2_sumexpomane/' + page.skip + '/' + page.limit;
		$http({
			method: 'GET',
			url: inserturl,
			headers:
			{token: loginService.getToken()}
		}).success(function(data){
			callback(data);
		}).error(function(errorText){
			errorFactory.raiseError(errorText, inserturl, 'errorDatos', 'Error al cargar los datos de comprobantes.');
		});
	};

	factory.getRegistro2sumImpoMani = function(page, callback){
		var inserturl = serverUrl + '/afip/registro2_sumimpomani/' + page.skip + '/' + page.limit;
		$http({
			method: 'GET',
			url: inserturl,
			headers:
			{token: loginService.getToken()}
		}).success(function(data){
			callback(data);
		}).error(function(errorText){
			errorFactory.raiseError(errorText, inserturl, 'errorDatos', 'Error al cargar los datos de comprobantes.');
		});
	};

	factory.getRegistro3detExpo = function(page, callback){
		var inserturl = serverUrl + '/afip/registro3_detexpo/' + page.skip + '/' + page.limit;
		$http({
			method: 'GET',
			url: inserturl,
			headers:
			{token: loginService.getToken()}
		}).success(function(data){
			callback(data);
		}).error(function(errorText){
			errorFactory.raiseError(errorText, inserturl, 'errorDatos', 'Error al cargar los datos de comprobantes.');
		});
	};

	factory.getRegistro3detImpo = function(page, callback){
		var inserturl = serverUrl + '/afip/registro3_detimpo/' + page.skip + '/' + page.limit;
		$http({
			method: 'GET',
			url: inserturl,
			headers:
			{token: loginService.getToken()}
		}).success(function(data){
			callback(data);
		}).error(function(errorText){
			errorFactory.raiseError(errorText, inserturl, 'errorDatos', 'Error al cargar los datos de comprobantes.');
		});
	};

	factory.getRegistro3Solicitud = function(page, callback){
		var inserturl = serverUrl + '/afip/registro3_solicitud/' + page.skip + '/' + page.limit;
		$http({
			method: 'GET',
			url: inserturl,
			headers:
			{token: loginService.getToken()}
		}).success(function(data){
			callback(data);
		}).error(function(errorText){
			errorFactory.raiseError(errorText, inserturl, 'errorDatos', 'Error al cargar los datos de comprobantes.');
		});
	};

	factory.getRegistro3sumExpoMane = function(page, callback){
		var inserturl = serverUrl + '/afip/registro3_sumexpomane/' + page.skip + '/' + page.limit;
		$http({
			method: 'GET',
			url: inserturl,
			headers:
			{token: loginService.getToken()}
		}).success(function(data){
			callback(data);
		}).error(function(errorText){
			errorFactory.raiseError(errorText, inserturl, 'errorDatos', 'Error al cargar los datos de comprobantes.');
		});
	};

	factory.getRegistro3sumImpoMani = function(page, callback){
		var inserturl = serverUrl + '/afip/registro3_sumimpomani/' + page.skip + '/' + page.limit;
		$http({
			method: 'GET',
			url: inserturl,
			headers:
			{token: loginService.getToken()}
		}).success(function(data){
			callback(data);
		}).error(function(errorText){
			errorFactory.raiseError(errorText, inserturl, 'errorDatos', 'Error al cargar los datos de comprobantes.');
		});
	};

	factory.getRegistro4sumExpoMane = function(page, callback){
		var inserturl = serverUrl + '/afip/registro4_sumexpomane/' + page.skip + '/' + page.limit;
		$http({
			method: 'GET',
			url: inserturl,
			headers:
			{token: loginService.getToken()}
		}).success(function(data){
			callback(data);
		}).error(function(errorText){
			errorFactory.raiseError(errorText, inserturl, 'errorDatos', 'Error al cargar los datos de comprobantes.');
		});
	};

	factory.getRegistro4sumImpoMani = function(page, callback){
		var inserturl = serverUrl + '/afip/registro4_sumimpomani/' + page.skip + '/' + page.limit;
		$http({
			method: 'GET',
			url: inserturl,
			headers:
			{token: loginService.getToken()}
		}).success(function(data){
			callback(data);
		}).error(function(errorText){
			errorFactory.raiseError(errorText, inserturl, 'errorDatos', 'Error al cargar los datos de comprobantes.');
		});
	};

	factory.getRegistro5sumExpoMane = function(page, callback){
		var inserturl = serverUrl + '/afip/registro5_sumexpomane/' + page.skip + '/' + page.limit;
		$http({
			method: 'GET',
			url: inserturl,
			headers:
			{token: loginService.getToken()}
		}).success(function(data){
			callback(data);
		}).error(function(errorText){
			errorFactory.raiseError(errorText, inserturl, 'errorDatos', 'Error al cargar los datos de comprobantes.');
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
			errorFactory.raiseError(errorText, inserturl, 'errorDatos', 'Error al cargar los datos de comprobantes.');
		});
	};

	return factory;

});