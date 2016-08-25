/**
 * Created by Diego Reyes on 3/19/14.
 */
myapp.factory('invoiceFactory', ['$http', 'loginService', 'formatService', 'estadosArrayCache', 'generalCache', 'generalFunctions', '$q', 'HTTPCanceler', 'APP_CONFIG',
	function($http, loginService, formatService, estadosArrayCache, generalCache, generalFunctions, $q, HTTPCanceler, APP_CONFIG){
		var factory = {};
		var namespace = 'invoices';

		//Se pasa la terminal al ser de caché
		factory.getDescriptionItem = function(terminal, callback){
			var inserturl = APP_CONFIG.SERVER_URL + '/matchPrices/matches/' + terminal;
			$http.get(inserturl)
				.then(function(response) {
					callback(response.data);
				}, function(response) {
					if (response.data == null) response.data = {status: 'ERROR'};
					callback(response.data);
				});
		};

		factory.getContainersSinTasaCargas = function(datos, callback) {
			factory.cancelRequest('containersSinTasaCargas');
			var defer = $q.defer();
			var canceler = HTTPCanceler.get(defer, namespace, 'containersSinTasaCargas');
			var inserturl = APP_CONFIG.SERVER_URL + '/invoices/containersNoRates/' + loginService.getFiltro();
			$http.get(inserturl, { params: formatService.formatearDatos(datos), timeout: canceler.promise })
				.then(function(response) {
					callback(response.data);
				}, function(response) {
					if (response.data == null) response.data = { status: 'ERROR'};
					if (response.status != -5) callback(response.data)
				});
		};

		//Al ser un método de caché se le pasa la terminal
		factory.getShipTrips = function(terminal, callback){
			var inserturl = APP_CONFIG.SERVER_URL + '/invoices/' + terminal + '/shipTrips';
			$http.get(inserturl)
				.then(function(response){
					callback(response.data);
				}, function(response){
					if(response.data == null) response.data = {status: 'ERROR'};
					callback(response.data);
				});
		};

		factory.getShipContainers = function(datos, callback){
			factory.cancelRequest('shipContainers');
			var defer = $q.defer();
			var canceler = HTTPCanceler.get(defer, namespace, 'shipContainers');
			var inserturl = APP_CONFIG.SERVER_URL + '/invoices/' + loginService.getFiltro() + '/shipContainers';
			$http.get(inserturl, { params: formatService.formatearDatos(datos), timeout: canceler.promise })
				.then(function(response){
					callback(response.data);
				}, function(response){
					if (response.status != -5) callback(response.data);
				});
		};

		factory.getRatesInvoices = function(datos, callback){
			factory.cancelRequest('ratesInvoices');
			var defer = $q.defer();
			var canceler = HTTPCanceler.get(defer, namespace, 'ratesInvoices');
			var inserturl = APP_CONFIG.SERVER_URL + '/invoices/rates';
			$http.get(inserturl, { params: formatService.formatearDatos(datos), timeout: canceler.promise })
				.then(function(response){
					callback(response.data);
				}, function(response){
					if (response.status != -5) callback(response.data)
				});
		};

		factory.getDetailRates = function(datos, callback){
			factory.cancelRequest('ratesDetail');
			var defer = $q.defer();
			var canceler = HTTPCanceler.get(defer, namespace, 'ratesDetail');
			var inserturl = APP_CONFIG.SERVER_URL + '/invoices/rates/' + datos.tipo;
			$http.get(inserturl, { params: formatService.formatearDatos(datos), timeout: canceler.promise })
				.then(function(response){
					callback(response.data);
				}, function(response){
					if (response.status != -5) callback(response.data)
				});
		};

		factory.cancelRequest = function(request){
			HTTPCanceler.cancel(namespace, request);
		};

		return factory;

	}]);