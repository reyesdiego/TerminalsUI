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

			getTurnos(datos, page, callback){
				this.cancelRequest('getTurnos');
				const defer = $q.defer();
				const canceler = HTTPCanceler.get(defer, this.namespace, 'getTurnos');
				const inserturl = `${APP_CONFIG.SERVER_URL}/appointments/${loginService.filterTerminal}/${page.skip}/${page.limit}`;
				$http.get(inserturl, { params: formatService.formatearDatos(datos), timeout: canceler.promise }).then((response) => {
					response.data.data = this.retrieveAppointments(response.data.data);
					callback(response.data);
				}).catch((response) => {
					if (response.status != -5 ) callback(response.data);
				});
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