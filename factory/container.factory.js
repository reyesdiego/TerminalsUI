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

			getContainersSinTasaCargas(datos, callback) {
				this.cancelRequest('containersSinTasaCargas');
				const defer = $q.defer();
				const canceler = HTTPCanceler.get(defer, this.namespace, 'containersSinTasaCargas');
				const inserturl = `${APP_CONFIG.SERVER_URL}/invoices/containersNoRates/${loginService.filterTerminal}`;
				$http.get(inserturl, { params: formatService.formatearDatos(datos), timeout: canceler.promise }).then((response) => {
					response.data.data = this.retrieveContainers(response.data.data.map((container) => {
						return {contenedor: container}
					}));
					callback(response.data);
				}).catch((response) => {
					if (response.data == null) response.data = { status: 'ERROR'};
					if (response.status != -5) callback(response.data)
				});
			}

			getShipContainers(datos, callback){
				this.cancelRequest('shipContainers');
				const defer = $q.defer();
				const canceler = HTTPCanceler.get(defer, this.namespace, 'shipContainers');
				const inserturl = `${APP_CONFIG.SERVER_URL }/invoices/${loginService.filterTerminal}/shipContainers`;
				$http.get(inserturl, { params: formatService.formatearDatos(datos), timeout: canceler.promise }).then((response) => {
					let formatData = [];
					response.data.data.forEach((dataContainer) => {
						let newContainer = {
							contenedor: dataContainer.contenedor.contenedor,
							toneladas: dataContainer.contenedor.toneladas,
							ship: datos.buqueNombre,
							trip: datos.viaje,
							gates:{
								data: dataContainer.gates,
								total: dataContainer.gates.length
							}
						};
						formatData.push(newContainer);
					});
					response.data.data = this.retrieveContainers(formatData);
					callback(response.data);
				}).catch((response) => {
					if (response.status != -5) callback(response.data);
				});
			}

		}

		return new containerFactory();

	}]);