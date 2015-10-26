/**
 * Created by leo on 14/04/14.
 */

myapp.factory('gatesFactory', ['$http', 'formatService', 'loginService', '$q', 'HTTPCanceler',
	function($http, formatService, loginService, $q, HTTPCanceler){
		var factory = {};

		factory.getGate = function(datos, page, callback){
			factory.cancelRequest('getGates');
			var defer = $q.defer();
			var canceler = HTTPCanceler.get(defer, 'getGates');
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
			var canceler = HTTPCanceler.get(defer, 'gatesSinTurnos');
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
			var canceler = HTTPCanceler.get(defer, 'getMissingGates');
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
			var canceler = HTTPCanceler.get(defer, 'getMissingInvoices');
			var inserturl = serverUrl + '/gates/' + loginService.getFiltro() + '/missingInvoices';
			$http.get(inserturl, { timeout: canceler.promise })
				.success(function (data){
					callback(data);
				}).error(function(error, status){
					if (status != 0) callback(error);
				});
		};

		factory.cancelRequest = function(request){
			HTTPCanceler.cancel(request);
		};

		return factory;
	}]);