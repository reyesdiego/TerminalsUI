/**
 * Created by leo on 14/04/14.
 */

myapp.factory('gatesFactory', ['$http', 'formatService', 'loginService', '$q', 'HTTPCanceler', 'APP_CONFIG',
	function($http, formatService, loginService, $q, HTTPCanceler, APP_CONFIG){
		var factory = {};
		var namespace = 'gates';

		factory.getGate = function(datos, page, callback){
			factory.cancelRequest('getGates');
			var defer = $q.defer();
			var canceler = HTTPCanceler.get(defer, namespace, 'getGates');
			var inserturl = APP_CONFIG.SERVER_URL + '/gates/' + loginService.getFiltro() + '/' + page.skip + '/' + page.limit;
			$http.get(inserturl, { params: formatService.formatearDatos(datos), timeout: canceler.promise })
				.then(function(response){
					callback(response.data);
				}, function(response){
					if (response.status != -5) callback(response.data);
				});
		};

		factory.gatesSinTurnos = function(datos, callback){
			factory.cancelRequest('gatesSinTurnos');
			var defer = $q.defer();
			var canceler = HTTPCanceler.get(defer, namespace, 'gatesSinTurnos');
			var inserturl = APP_CONFIG.SERVER_URL + '/gates/' + loginService.getFiltro() + '/missingAppointments';
			$http.get(inserturl, { params: formatService.formatearDatos(datos), timeout: canceler.promise })
				.then(function(response){
					callback(response.data);
				}, function(response){
					if (response.status != -5) callback(response.data);
				});
		};

		factory.getMissingGates = function(datos, page, callback){
			var defer = $q.defer();
			var canceler = HTTPCanceler.get(defer, namespace, 'getMissingGates');
			var inserturl = APP_CONFIG.SERVER_URL + '/gates/' + loginService.getFiltro() + '/missingGates/' + page.skip + '/' + page.limit;
			$http.get(inserturl, {params: formatService.formatearDatos(datos), timeout: canceler.promise })
				.then(function (response){
					callback(response.data);
				}, function(response){
					if (response.status != -5) callback(response.data);
				});
		};

		factory.getMissingInvoices = function(datos, page, callback){
			var defer = $q.defer();
			var canceler = HTTPCanceler.get(defer, namespace, 'getMissingInvoices');
			//var inserturl = APP_CONFIG.SERVER_URL + '/gates/' + loginService.getFiltro() + '/missingInvoices/' + page.skip + '/' + page.limit;
			var inserturl = APP_CONFIG.SERVER_URL + '/gates/' + loginService.getFiltro() + '/missingInvoices';
			$http.get(inserturl, { params: formatService.formatearDatos(datos), timeout: canceler.promise })
				.then(function (response){
					callback(response.data);
				}, function(response){
					if (response.status != -5) callback(response.data);
				});
		};

		factory.getTrains = function(terminal, callback){
			var inserturl = APP_CONFIG.SERVER_URL + '/gates/' + terminal + '/trains';
			$http.get(inserturl)
				.then(function(response){
					response.data.data = formatTrains(response.data.data);
					callback(response.data);
				}, function(response){
					if (response.data == null) response.data = {status: 'ERROR'};
					callback(response.data);
				});
		};

		function formatTrains (trains){
			var listaTransformada = [];
			trains.forEach(function(train){
				if (train != null){
					var trenJson = {
						tren: train
					};
					listaTransformada.push(trenJson);
				}
			});
			return listaTransformada;
		}

		factory.cancelRequest = function(request){
			HTTPCanceler.cancel(namespace, request);
		};

		return factory;
	}]);