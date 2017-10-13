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
                return appointmentsData.map(item => (new Appointment(item)));
            }

            consultarTurno(container){
                const deferred = $q.defer();
                const inserturl = `${APP_CONFIG.SERVER_URL}/containerTurno/${container}`;
                $http.get(inserturl).then((response) => {
                    if (response.data.status == 'OK'){
                        if (response.data.data.length > 0){
                            const turnos = this.retrieveAppointments(response.data.data);
                            deferred.resolve(turnos);
                        } else {
                            const error = {
                                message: `No se ha encontrado ningún turno para el contenedor ${container}`
                            };
                            deferred.reject(error);
                        }
                    } else {
                        deferred.reject(response.data);
                    }
                }).catch((error) => {
                    deferred.reject(error.data);
                });
                return deferred.promise;
            }

            consultarTurnoCamion(patente){
                const deferred = $q.defer();
                const inserturl = `${APP_CONFIG.SERVER_URL}/camionTurno/${patente}`;
                $http.get(inserturl).then((response) => {
                    if (response.data.status == 'OK'){
                        if (response.data.data.length > 0){
                            const turnos = this.retrieveAppointments(response.data.data);
                            deferred.resolve(turnos);
                        } else {
                            const error = {
                                message: `No se ha encontrado ningún turno para el camión de patente ${container}`
                            };
                            deferred.reject(error);
                        }
                    } else {
                        deferred.reject(response.data);
                    }
                }).catch((error) => {
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
                    deferred.resolve(response.data);
                }).catch((response) => {
                    if (response.status != -5 ) deferred.reject(response.data);
                });
                return deferred.promise;
            }

            getTurnosByDay(datos){
                this.cancelRequest('getTurnosByDay');
                const deferred = $q.defer();
                const canceler = HTTPCanceler.get($q.defer(), this.namespace, 'getTurnosByDay');
                const inserturl = `${APP_CONFIG.SERVER_URL}/appointments/byDay`;
                $http.get(inserturl, { params: formatService.formatearDatos(datos), timeout: canceler.promise }).then((response) => {
                    //response.data.data = this.retrieveAppointments(response.data.data);
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