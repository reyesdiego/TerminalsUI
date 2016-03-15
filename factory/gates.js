/**
 * Created by leo on 14/04/14.
 */

myapp.factory('gatesFactory', ['$http', 'formatService', 'loginService', '$q', 'HTTPCanceler',
	function($http, formatService, loginService, $q, HTTPCanceler){
		var factory = {};
		var namespace = 'gates';

		factory.getGate = function(datos, page, callback){
			factory.cancelRequest('getGates');
			var defer = $q.defer();
			var canceler = HTTPCanceler.get(defer, namespace, 'getGates');
			var inserturl = serverUrl + '/gates/' + loginService.getFiltro() + '/' + page.skip + '/' + page.limit;
			$http.get(inserturl, { params: formatService.formatearDatos(datos), timeout: canceler.promise })
				.success(function(data){
					callback(data);
				}).error(function(error, status){
					if (status != 0) callback(error);
				});
		};

		factory.gatesSinTurnos = function(datos, callback){
			factory.cancelRequest('gatesSinTurnos');
			var defer = $q.defer();
			var canceler = HTTPCanceler.get(defer, namespace, 'gatesSinTurnos');
			var inserturl = serverUrl + '/gates/' + loginService.getFiltro() + '/missingAppointments';
			$http.get(inserturl, { params: formatService.formatearDatos(datos), timeout: canceler.promise })
				.success(function(data){
					callback(data);
				}).error(function(error, status){
					if (status != 0) callback(error);
				})
		};

		factory.getMissingGates = function(callback){
			var defer = $q.defer();
			var canceler = HTTPCanceler.get(defer, namespace, 'getMissingGates');
			var inserturl = serverUrl + '/gates/' + loginService.getFiltro() + '/missingGates';
			$http.get(inserturl, {timeout: canceler.promise })
				.success(function (data){
					callback(data);
				}).error(function(error, status){
					if (status != 0) callback(error);
				});
		};

		factory.getMissingInvoices = function(callback){
			var defer = $q.defer();
			var canceler = HTTPCanceler.get(defer, namespace, 'getMissingInvoices');
			var inserturl = serverUrl + '/gates/' + loginService.getFiltro() + '/missingInvoices';
			$http.get(inserturl, { timeout: canceler.promise })
				.success(function (data){
					callback(data);
				}).error(function(error, status){
					if (status != 0) callback(error);
				});
		};

		factory.getTrains = function(terminal, callback){
			var inserturl = serverUrl + '/gates/' + terminal + '/trains';
			$http.get(inserturl)
				.success(function(data){
					data.data = formatTrains(data.data);
					callback(data);
				}).error(function(errorText){
					if (errorText == null) errorText = {status: 'ERROR'};
					callback(errorText);
				})
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