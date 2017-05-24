/**
 * Created by leo on 28/04/14.
 */

myapp.factory('turnosFactory', ['$http', 'formatService', 'loginService', '$q', 'HTTPCanceler', 'APP_CONFIG', 'Appointment',
	function($http, formatService, loginService, $q, HTTPCanceler, APP_CONFIG, Appointment){

		class turnosFactory {
			constructor(){
				this.namespace = 'turnos';
			}

			cancelRequest(request){
				HTTPCanceler.cancel(this.namespace, request);
			}

			retrieveAppointments(appointmentsData){
				let appointmentsArray = [];
				appointmentsData.forEach((appointmentData) => {
					appointmentsArray.push(new Appointment(appointmentData));
				});
				return appointmentsArray;
			}

			consultarTurno(container){
				const deferred = $q.defer();
				const inserturl = `${APP_CONFIG.SERVER_URL}/containerTurno/${container}`;
				$http.get(inserturl).then((response) => {
					if (response.data.status == 'OK'){
						const turno = new Appointment(response.data.data);
						deferred.resolve(turno);
					} else {
						deferred.reject(response.data);
					}
				}).catch((error) => {
					console.log(error);
					deferred.reject(error.data);
				});
				return deferred.promise;
			}

			getTurnos(datos, page){
				this.cancelRequest('getTurnos');
				const deferred = $q.defer();
				const canceler = HTTPCanceler.get($q.defer(), this.namespace, 'getTurnos');
				const inserturl = `${APP_CONFIG.SERVER_URL}/appointments/${loginService.filterTerminal}/${page.skip}/${page.limit}`;
				$http.get(inserturl, { params: formatService.formatearDatos(datos), timeout: canceler.promise }).then((response) => {
					response.data.data = this.retrieveAppointments(response.data.data);
					//callback(response.data);
					deferred.resolve(response.data);
				}).catch((response) => {
					if (response.status != -5 ) deferred.reject(response.data);
				});
				return deferred.promise;
			}

			getQueuedMails(datos, page, callback){
				this.cancelRequest('getQueuedMails');
				const defer = $q.defer();
				const canceler = HTTPCanceler.get(defer, this.namespace, 'getQueuedMails');
				const inserturl = `${APP_CONFIG.SERVER_URL}/appointmentEmailQueues/${page.skip}/${page.limit}`;
				$http.get(inserturl, { params: formatService.formatearDatos(datos), timeout: canceler.promise }).then((response) => {
					response.data.data = this.retrieveAppointments(response.data.data);
					callback(response.data);
				}).catch((response) => {
					if (response.status != -5) callback(response.data);
				});
			}
		}

		return new turnosFactory();
	}]);