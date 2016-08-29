/**
 * Created by Diego Reyes on 3/19/14.
 */
myapp.factory('containerFactory', ['$http', 'loginService', 'formatService', 'estadosArrayCache', 'generalCache', 'generalFunctions', '$q', 'HTTPCanceler', 'APP_CONFIG', 'Container',
	function($http, loginService, formatService, estadosArrayCache, generalCache, generalFunctions, $q, HTTPCanceler, APP_CONFIG, Container){
		var containerFactory = {
			namespace: 'container',
			retrieveContainers: function(containersData){
				var containersArray = [];
				containersData.forEach(function(containerData){
					var container = new Container(containerData);
					containersArray.push(container);
				});
				return containersArray;
			},
			//Se pasa la terminal al ser de caché
			getDescriptionItem: function(terminal, callback){
				var inserturl = APP_CONFIG.SERVER_URL + '/matchPrices/matches/' + terminal;
				$http.get(inserturl)
						.then(function(response) {
							callback(response.data);
						}, function(response) {
							if (response.data == null) response.data = {status: 'ERROR'};
							callback(response.data);
						});
			},
			getContainersSinTasaCargas: function(datos, callback) {
				this.cancelRequest('containersSinTasaCargas');
				var defer = $q.defer();
				var canceler = HTTPCanceler.get(defer, this.namespace, 'containersSinTasaCargas');
				var inserturl = APP_CONFIG.SERVER_URL + '/invoices/containersNoRates/' + loginService.getFiltro();
				var factory = this;
				$http.get(inserturl, { params: formatService.formatearDatos(datos), timeout: canceler.promise })
						.then(function(response) {
							response.data.data = factory.retrieveContainers(response.data.data.map(function(container){
								return {contenedor: container}
							}));
							callback(response.data);
						}, function(response) {
							if (response.data == null) response.data = { status: 'ERROR'};
							if (response.status != -5) callback(response.data)
						});
			},
			//Al ser un método de caché se le pasa la terminal
			getShipTrips: function(terminal, callback){
				var inserturl = APP_CONFIG.SERVER_URL + '/invoices/' + terminal + '/shipTrips';
				$http.get(inserturl)
						.then(function(response){
							callback(response.data);
						}, function(response){
							if(response.data == null) response.data = {status: 'ERROR'};
							callback(response.data);
						});
			},
			getShipContainers: function(datos, callback){
				this.cancelRequest('shipContainers');
				var defer = $q.defer();
				var canceler = HTTPCanceler.get(defer, this.namespace, 'shipContainers');
				var inserturl = APP_CONFIG.SERVER_URL + '/invoices/' + loginService.getFiltro() + '/shipContainers';
				var factory = this;
				$http.get(inserturl, { params: formatService.formatearDatos(datos), timeout: canceler.promise })
						.then(function(response){
							var formatData = [];
							response.data.data.forEach(function(dataContainer){
								var newContainer = {
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
							response.data.data = factory.retrieveContainers(formatData);
							callback(response.data);
						}, function(response){
							if (response.status != -5) callback(response.data);
						});
			},
			cancelRequest: function(request){
				HTTPCanceler.cancel(this.namespace, request);
			}
		};

		return containerFactory;

	}]);