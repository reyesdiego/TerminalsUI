/**
 * Created by leo on 28/04/14.
 */

myapp.factory('turnosFactory', ['$http', 'formatService', 'loginService', '$q', 'HTTPCanceler', 'APP_CONFIG', 'Appointment',
	function($http, formatService, loginService, $q, HTTPCanceler, APP_CONFIG, Appointment){
		var turnosFactory = {
			namespace: 'turnos',
			retrieveAppointments: function(appointmentsData){
				var appointmentsArray = [];
				appointmentsData.forEach(function(appointmentData){
					var appointment = new Appointment(appointmentData);
					appointmentsArray.push(appointment);
				});
				return appointmentsArray;
			},
			cancelRequest: function(request){
				HTTPCanceler.cancel(this.namespace, request);
			},
			getTurnos: function(datos, page, callback){
				this.cancelRequest('getTurnos');
				var defer = $q.defer();
				var canceler = HTTPCanceler.get(defer, this.namespace, 'getTurnos');
				var inserturl = APP_CONFIG.SERVER_URL + '/appointments/' + loginService.getFiltro() + '/' + page.skip + '/' + page.limit;
				var factory = this;
				$http.get(inserturl, { params: formatService.formatearDatos(datos), timeout: canceler.promise })
						.then(function(response){
							response.data.data = factory.retrieveAppointments(response.data.data);
							callback(response.data);
						}, function(response){
							if (response.status != -5 ) callback(response.data);
						});
			},
			getQueuedMails: function(datos, page, callback){
				this.cancelRequest('getQueuedMails');
				var defer = $q.defer();
				var canceler = HTTPCanceler.get(defer, this.namespace, 'getQueuedMails');
				var inserturl = APP_CONFIG.SERVER_URL + '/appointmentEmailQueues/' + page.skip + '/' + page.limit;
				var factory = this;
				$http.get(inserturl, { params: formatService.formatearDatos(datos), timeout: canceler.promise })
						.then(function(response){
							response.data.data = factory.retrieveAppointments(response.data.data);
							callback(response.data);
						}, function(response){
							if (response.status != -5) callback(response.data);
						});
			}
		};

		return turnosFactory;
	}]);