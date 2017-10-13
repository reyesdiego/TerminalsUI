/**
 * Created by leo on 14/04/14.
 */

myapp.factory('gatesFactory', ['$http', 'formatService', 'loginService', '$q', 'HTTPCanceler', 'APP_CONFIG',
    function($http, formatService, loginService, $q, HTTPCanceler, APP_CONFIG){

        class gatesFactory {
            constructor(){
                this.namespace = 'gates';
            }

            cancelRequest(request){
                HTTPCanceler.cancel(this.namespace, request);
            }

            getGate(datos, page) {
                this.cancelRequest('getGates');
                const deferred = $q.defer();
                const canceler = HTTPCanceler.get($q.defer(), this.namespace, 'getGates');
                const inserturl = `${APP_CONFIG.SERVER_URL}/gates/${loginService.filterTerminal}/${page.skip}/${page.limit}`;
                $http.get(inserturl, { params: formatService.formatearDatos(datos), timeout: canceler.promise }).then((response) => {
                    deferred.resolve(response.data);
                }).catch((response) => {
                    if (response.status != -5) deferred.reject(response.data);
                });
                return deferred.promise;
            }

            getMissingInvoices(datos, page, callback) {
                const defer = $q.defer();
                const canceler = HTTPCanceler.get(defer, this.namespace, 'getMissingInvoices');
                //var inserturl = APP_CONFIG.SERVER_URL + '/gates/' + loginService.getFiltro() + '/missingInvoices/' + page.skip + '/' + page.limit;
                const inserturl = `${APP_CONFIG.SERVER_URL}/gates/${loginService.filterTerminal}/missingInvoices`;
                $http.get(inserturl, { params: formatService.formatearDatos(datos), timeout: canceler.promise }).then((response) => {
                    callback(response.data);
                }).catch((response) => {
                    if (response.status != -5) callback(response.data);
                });
            }

            getGatesByType(datos, page) {
                this.cancelRequest('getGatesByType');
                const deferred = $q.defer();
                const canceler = HTTPCanceler.get($q.defer(), this.namespace, 'getGatesByType');
                const inserturl = `${APP_CONFIG.SERVER_URL}/gates/${loginService.filterTerminal}/byType`;
                $http.get(inserturl, { params: formatService.formatearDatos(datos), timeout: canceler.promise }).then((response) => {
                    deferred.resolve(response.data);
                }).catch((response) => {
                    if (response.status != -5) deferred.reject(response.data);
                });
                return deferred.promise;
            }

            getGatesByHourMov(datos) {
                this.cancelRequest('getGatesByHourMov');
                const deferred = $q.defer();
                const canceler = HTTPCanceler.get($q.defer(), this.namespace, 'getGatesByHourMov');
                const inserturl = `${APP_CONFIG.SERVER_URL}/gates/${loginService.filterTerminal}/byHourMov`;
                $http.get(inserturl, { params: formatService.formatearDatos(datos), timeout: canceler.promise }).then((response) => {
                    deferred.resolve(response.data);
                }).catch((response) => {
                    if (response.status != -5) deferred.reject(response.data);
                });
                return deferred.promise;
            }

            getGatesCountByDay(datos) {
                this.cancelRequest('getGatesByDay');
                const deferred = $q.defer();
                const canceler = HTTPCanceler.get($q.defer(), this.namespace, 'getGatesByDay');
                const inserturl = `${APP_CONFIG.SERVER_URL}/gates/byDay`;
                $http.get(inserturl, { params: formatService.formatearDatos(datos), timeout: canceler.promise }).then((response) => {
                    deferred.resolve(response.data);
                }).catch((response) => {
                    if (response.status != -5) deferred.reject(response.data);
                });
                return deferred.promise;
            }

        }

        return new gatesFactory();
    }]);