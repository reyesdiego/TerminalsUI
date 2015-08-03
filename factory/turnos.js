/**
 * Created by leo on 28/04/14.
 */

myapp.factory('turnosFactory', ['$http', 'dialogs', 'formatService', 'loginService', '$q', 'HTTPCanceler',
	function($http, dialogs, formatService, loginService, $q, HTTPCanceler){
		var factory = {};

		factory.getTurnos = function(datos, page, callback){
			factory.cancelRequest('getTurnos');
			var defer = $q.defer();
			var canceler = HTTPCanceler.get(defer, 'getTurnos');
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
			var canceler = HTTPCanceler.get(defer, 'getQueuedMails');
			var inserturl = serverUrl + '/appointmentEmailQueues/' + page.skip + '/' + page.limit;
			$http.get(inserturl, { params: formatService.formatearDatos(datos), timeout: canceler.promise })
				.success(function(data){
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