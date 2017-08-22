/**
 * Created by Diego Reyes on 3/19/14.
 */
myapp.factory('containerFactory', ['$http', 'loginService', 'formatService', 'cacheService', 'generalFunctions', '$q', 'HTTPCanceler', 'APP_CONFIG', 'Container',
	function($http, loginService, formatService, cacheService, generalFunctions, $q, HTTPCanceler, APP_CONFIG, Container){

		class containerFactory {

			constructor(){
				this.namespace = 'container';
			}

			cancelRequest(request){
				HTTPCanceler.cancel(this.namespace, request);
			}

			retrieveContainers(containersData){
				let containersArray = [];
				containersData.forEach(function(containerData){
					containersArray.push(new Container(containerData));
				});
				return containersArray;
			}

			getMissingGates(datos, page, callback){
				const defer = $q.defer();
				const canceler = HTTPCanceler.get(defer, this.namespace, 'getMissingGates');
				const inserturl = `${APP_CONFIG.SERVER_URL}/gates/${loginService.filterTerminal}/missingGates/${page.skip}/${page.limit}`;
				$http.get(inserturl, {params: formatService.formatearDatos(datos), timeout: canceler.promise }).then((response) => {
					response.data.data = this.retrieveContainers(response.data.data);
					callback(response.data);
				}).catch((response) => {
					if (response.status != -5) callback(response.data);
				});
			}

			gatesSinTurnos(datos, callback){
				this.cancelRequest('gatesSinTurnos');
				const defer = $q.defer();
				const canceler = HTTPCanceler.get(defer, this.namespace, 'gatesSinTurnos');
				const inserturl = `${APP_CONFIG.SERVER_URL}/gates/${loginService.filterTerminal}/missingAppointments`;
				$http.get(inserturl, { params: formatService.formatearDatos(datos), timeout: canceler.promise }).then((response) => {
					response.data.data = this.retrieveContainers(response.data.data.map((container) => {
						return {contenedor: container.c, fecha: container.g}
					}));
					callback(response.data);
				}).catch((response) => {
					if (response.status != -5) callback(response.data);
				});
			}

			getMissingAppointments(datos, callback){
				this.cancelRequest('missingAppointments');
				const defer = $q.defer();
				const canceler = HTTPCanceler.get(defer, this.namespace, 'missingAppointments');
				const inserturl = `${APP_CONFIG.SERVER_URL}/appointments/${loginService.filterTerminal}/missingAppointments`;
				$http.get(inserturl, { params: formatService.formatearDatos(datos), timeout: canceler.promise }).then((response) => {
					response.data.data = this.retrieveContainers(response.data.data.map((container) => {
						return {contenedor: container.c, fecha: container.f}
					}));
					callback(response.data);
				}).catch((response) => {
					if (response.status != -5) callback(response.data);
				});
			}

			getContainersSinTasaCargas(datos) {
				this.cancelRequest('containersSinTasaCargas');
				const deferred = $q.defer();
				const canceler = HTTPCanceler.get($q.defer(), this.namespace, 'containersSinTasaCargas');
				const inserturl = `${APP_CONFIG.SERVER_URL}/invoices/containersNoRates/${loginService.filterTerminal}`;
				$http.get(inserturl, { params: formatService.formatearDatos(datos), timeout: canceler.promise }).then((response) => {
					response.data.data = this.retrieveContainers(response.data.data.map((container) => {
						return {contenedor: container}
					}));
					deferred.resolve(response.data);
				}).catch((response) => {
					if (response.data == null) response.data = { status: 'ERROR'};
					if (response.status != -5) deferred.reject(response.data)
				});
				return deferred.promise;
			}

			getShipContainers(datos){
				this.cancelRequest('shipContainers');
				const deferred = $q.defer();
				const canceler = HTTPCanceler.get($q.defer(), this.namespace, 'shipContainers');
				const inserturl = `${APP_CONFIG.SERVER_URL }/invoices/${loginService.filterTerminal}/shipContainers`;
				$http.get(inserturl, { params: formatService.formatearDatos(datos), timeout: canceler.promise }).then((response) => {
					let formatData = [];
					response.data.data.forEach((dataContainer) => {
						let newContainer = {
							contenedor: dataContainer.contenedor,
							toneladas: dataContainer.toneladas,
							ship: datos.buqueNombre,
							trip: datos.viaje,
							gatesCnt: dataContainer.gatesCnt
						};
						formatData.push(newContainer);
					});
					response.data.data = this.retrieveContainers(formatData);
					deferred.resolve(response.data);
				}).catch((response) => {
					if (response.status != -5) deferred.reject(response.data);
				});
				return deferred.promise;
			}

		}

		return new containerFactory();

	}]);