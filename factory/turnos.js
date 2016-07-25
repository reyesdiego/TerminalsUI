/**
 * Created by leo on 28/04/14.
 */

myapp.factory('turnosFactory', ['$http', 'dialogs', 'formatService', 'loginService', '$q', 'HTTPCanceler',
	function($http, dialogs, formatService, loginService, $q, HTTPCanceler){
		var factory = {};
		var namespace = 'turnos';

		factory.cancelRequest = function(request){
			HTTPCanceler.cancel(namespace, request);
		};

		factory.getTurnos = function(datos, page, callback){
			factory.cancelRequest('getTurnos');
			var defer = $q.defer();
			var canceler = HTTPCanceler.get(defer, namespace, 'getTurnos');
			var inserturl = serverUrl + '/appointments/' + loginService.getFiltro() + '/' + page.skip + '/' + page.limit;
			$http.get(inserturl, { params: formatService.formatearDatos(datos), timeout: canceler.promise })
				.then(function(response){
					callback(response.data);
				}, function(response){
					if (response.status != -5 ) callback(response.data);
				});
		};

		factory.getQueuedMails = function(datos, page, callback){
			factory.cancelRequest('getQueuedMails');
			var defer = $q.defer();
			var canceler = HTTPCanceler.get(defer, namespace, 'getQueuedMails');
			var inserturl = serverUrl + '/appointmentEmailQueues/' + page.skip + '/' + page.limit;
			$http.get(inserturl, { params: formatService.formatearDatos(datos), timeout: canceler.promise })
				.then(function(response){
					callback(response.data);
				}, function(response){
					if (response.status != -5) callback(response.data);
				});
		};

		factory.getMissingAppointments = function(datos, callback){
			factory.cancelRequest('missingAppointments');
			var defer = $q.defer();
			var canceler = HTTPCanceler.get(defer, namespace, 'missingAppointments');
			var inserturl = serverUrl + '/appointments/' + loginService.getFiltro() + '/missingAppointments';
			$http.get(inserturl, { params: formatService.formatearDatos(datos), timeout: canceler.promise })
				.then(function(response){
					callback(response.data);
				}, function(response){
					if (response.status != -5) callback(response.data);
				});
		};

		factory.comprobanteTurno = function(contenedor, id, callback){
			var insertUrl = serverUrl + "/appointments/container/" + contenedor;
			$http.get(insertUrl, {params:{ _id: id }}).then(function(response){
				callback(response.data, 'OK');
			}, function(response){
				callback(response.data, 'ERROR');
			});
		};

		return factory;
	}]);