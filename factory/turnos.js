/**
 * Created by leo on 28/04/14.
 */

myapp.factory('turnosFactory', ['$http', 'dialogs', 'formatService', 'loginService', '$q', 'HTTPCanceler',
	function($http, dialogs, formatService, loginService, $q, HTTPCanceler){
		var factory = {};
		var namespace = 'turnos';

		factory.getTurnos = function(datos, page, callback){
			factory.cancelRequest('getTurnos');
			var defer = $q.defer();
			var canceler = HTTPCanceler.get(defer, namespace, 'getTurnos');
			var inserturl = serverUrl + '/appointments/' + loginService.getFiltro() + '/' + page.skip + '/' + page.limit;
			$http.get(inserturl, { params: formatService.formatearDatos(datos), timeout: canceler.promise })
				.success(function(data){
					callback(data);
				}).error(function(error, status){
					if (status != 0) callback(error);
				});
		};

		factory.getQueuedMails = function(datos, page, callback){
			factory.cancelRequest('getQueuedMails');
			var defer = $q.defer();
			var canceler = HTTPCanceler.get(defer, namespace, 'getQueuedMails');
			var inserturl = serverUrl + '/appointmentEmailQueues/' + page.skip + '/' + page.limit;
			$http.get(inserturl, { params: formatService.formatearDatos(datos), timeout: canceler.promise })
				.success(function(data){
					callback(data);
				}).error(function(error, status){
					if (status != 0) callback(error);
				});
		};

		factory.getMissingAppointments = function(callback){
			factory.cancelRequest('missingAppointments');
			var defer = $q.defer();
			var canceler = HTTPCanceler.get(defer, namespace, 'missingAppointments');
			var inserturl = serverUrl + '/appointments/' + loginService.getFiltro() + '/missingAppointments';
			$http.get(inserturl, { timeout: canceler.promise })
				.success(function(data){
					callback(data);
				}).error(function(error){
					callback(error);
				})
		};

		factory.comprobanteTurno = function(contenedor, id, callback){
			var insertUrl = serverUrl + "/appointments/container/" + contenedor;
			$http.get(insertUrl, {params:{ _id: id }}).success(function(data){
				callback(data, 'OK');
			}).error(function(data){
				callback(data, 'ERROR');
			})
		};

		factory.cancelRequest = function(request){
			HTTPCanceler.cancel(namespace, request);
		};

		return factory;
	}]);