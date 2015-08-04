/**
 * Created by leo on 12/03/15.
 */
myapp.factory('cacheFactory', ['$rootScope', 'CacheFactory', 'controlPanelFactory', 'invoiceFactory', 'vouchersFactory', 'priceFactory', 'statesFactory', 'contenedoresCache', 'generalCache', 'vouchersArrayCache', 'unitTypesArrayCache', 'estadosArrayCache', 'afipFactory', 'afipCache', '$q', 'loginService', function ($rootScope, CacheFactory, controlPanelFactory, invoiceFactory, vouchersFactory, priceFactory, statesFactory, contenedoresCache, generalCache, vouchersArrayCache, unitTypesArrayCache, estadosArrayCache, afipFactory, afipCache, $q, loginService) {
	var factory = {};

	factory.cargaBuques = function(){
		var deferred = $q.defer();
		var llamadas = [];
		$rootScope.listaTerminales.forEach(function(terminal){
			llamadas.push(invoiceFactory.getShipTrips(terminal, function (data) {
				if (data.status == 'OK') {
					generalCache.put('buques' + terminal, data.data);
					$rootScope.$broadcast('progreso', {mensaje: 2});
				}
			}));
		});
		$q.all(llamadas)
			.then(function(){
				deferred.resolve();
			},
			function(){
				deferred.reject();
			});
		return deferred.promise;
	};

	factory.cargaClientes = function(){
		var deferred = $q.defer();
		var llamadas = [];
		$rootScope.listaTerminales.forEach(function(terminal){
			llamadas.push(controlPanelFactory.getClients(terminal, function (data) {
				if (data.status == 'OK') {
					var clientes = [];
					var i = 0;
					data.data.forEach(function (dato) {
						clientes.push({id: i++, nombre: dato})
					});
					generalCache.put('clientes' + terminal, clientes);
					$rootScope.$broadcast('progreso', {mensaje: 2});
				}
			}));
		});
		$q.all(llamadas)
			.then(function(){
				deferred.resolve();
			},
			function(){
				deferred.reject();
			});
		return deferred.promise;
	};

	/*factory.cargaContenedores = function(){
		var deferred = $q.defer();
		controlPanelFactory.getContainers(function (data) {
			if (data.status == 'OK') {
				var contenedores = [];
				var i = 0;
				data.data.forEach(function (dato) {
					contenedores.push({id: i++, contenedor: dato})
				});
				contenedoresCache.put('contenedores', contenedores);
				$rootScope.$broadcast('progreso', {mensaje: 2});
				deferred.resolve();
			} else {
				deferred.reject();
			}
		});
		return deferred.promise;
	};*/

	/*factory.cargaContenedoresGates = function(){
		var deferred = $q.defer();
		controlPanelFactory.getContainersGates(function (data) {
			if (data.status == 'OK') {
				var contenedores = [];
				var i = 0;
				data.data.forEach(function (dato) {
					contenedores.push({id: i++, contenedor: dato})
				});
				contenedoresCache.put('contenedoresGates', contenedores);
				$rootScope.$broadcast('progreso', {mensaje: 2});
				deferred.resolve();
			} else {
				deferred.reject();
			}
		});
		return deferred.promise;
	};*/

	/*factory.cargaContenedoresTurnos = function(){
		var deferred = $q.defer();
		controlPanelFactory.getContainersTurnos(function (data) {
			if (data.status == 'OK') {
				var contenedores = [];
				var i = 0;
				data.data.forEach(function (dato) {
					contenedores.push({id: i++, contenedor: dato})
				});
				contenedoresCache.put('contenedoresTurnos', contenedores);
				$rootScope.$broadcast('progreso', {mensaje: 2});
				deferred.resolve();
			} else {
				deferred.reject();
			}
		});
		return deferred.promise;
	};*/

	factory.cargaDescripciones = function(){
		var deferred = $q.defer();
		var llamadas = [];
		$rootScope.listaTerminales.forEach(function(terminal){
			llamadas.push(invoiceFactory.getDescriptionItem(terminal, function (data) {
				if (data.status == 'OK') {
					generalCache.put('descripciones' + terminal, data.data);
					$rootScope.$broadcast('progreso', {mensaje: 2});
				}
			}));
		});
		$q.all(llamadas)
			.then(function(){
				deferred.resolve();
			},
			function(){
				deferred.reject();
			});
		return deferred.promise;
	};

	factory.cargaVouchers = function(){
		var deferred = $q.defer();
		vouchersFactory.getVouchersType(function (data) {
			if (data.status == 'OK') {
				generalCache.put('vouchers', data.data);
				data.data.forEach(function (dato) {
					vouchersArrayCache.put(dato._id, dato.description);
				});
				$rootScope.$broadcast('progreso', {mensaje: 2});
				deferred.resolve();
			} else {
				deferred.reject();
			}
		});
		return deferred.promise;
	};

	factory.cargaUnidades = function(){
		var deferred = $q.defer();
		priceFactory.getUnitTypes(function (data) {
			if (data.status == 'OK') {
				generalCache.put('unitTypes', data.data);
				data.data.forEach(function (dato) {
					unitTypesArrayCache.put(dato._id, dato.description);
				});
				$rootScope.$broadcast('progreso', {mensaje: 2});
				deferred.resolve();
			} else {
				deferred.reject();
			}
		});
		return deferred.promise;
	};

	factory.cargaEstados = function(){
		var deferred = $q.defer();
		statesFactory.getStatesType(function (data) {
			if (data.status == 'OK') {
				var estados = data.data;
				estados.forEach(function (estado) {
					switch (estado.type) {
						case 'WARN':
							estado.btnEstado = 'text-warning';
							estado.icon = '<img src="images/warn.png" />';
							estado.imagen = 'images/warn.png';
							break;
						case 'ERROR':
							estado.btnEstado = 'text-danger';
							estado.icon = '<img src="images/error.png" />';
							estado.imagen = 'images/error.png';
							break;
						case 'UNKNOWN':
							estado.btnEstado = 'text-info';
							estado.icon = '<img src="images/unknown.png" />';
							estado.imagen = 'images/unknown.png';
							break;
						case 'OK':
							estado.btnEstado = 'text-success';
							estado.icon = '<img src="images/ok.png" />';
							estado.imagen = 'images/ok.png';
							break;
					}
				});
				generalCache.put('estados', estados);
				data.data.forEach(function (dato) {
					estadosArrayCache.put(dato._id, dato);
				});
				$rootScope.$broadcast('progreso', {mensaje: 2});
				deferred.resolve();
			} else {
				deferred.reject();
			}
		});
		return deferred.promise;
	};

	factory.cargaMatchesArray = function(){
		var deferred = $q.defer();
		var llamadas = [];
		$rootScope.listaTerminales.forEach(function(terminal){
			llamadas.push(priceFactory.getArrayMatches(terminal, function(data){
				if (data.status == 'OK'){
					generalCache.put('matches' + terminal, data.data);
					$rootScope.$broadcast('progreso', {mensaje: 2});
				}
			}));
		});
		$q.all(llamadas)
			.then(function(){
				deferred.resolve();
			},
			function(){
				deferred.reject();
			});
		return deferred.promise;
	};

	factory.cargaMatchesRates = function(){
		var deferred = $q.defer();
		var llamadas = [];
		$rootScope.listaTerminales.forEach(function(terminal) {
			llamadas.push(priceFactory.getMatchPrices({onlyRates: true}, terminal, function (data) {
				if (data.status == 'OK') {
					var tasasCargasTerminal = [];
					data.data.forEach(function (tasaCargas) {
						if (tasaCargas.matches != null && tasaCargas.matches.length > 0) {
							tasasCargasTerminal.push(tasaCargas.matches[0].match[0])
						}
					});
					generalCache.put('ratesMatches' + terminal, tasasCargasTerminal);
					$rootScope.$broadcast('progreso', {mensaje: 2});
				}
			}));
		});
		$q.all(llamadas)
			.then(function(){
				deferred.resolve();
			},
			function(){
				deferred.reject();
			});
		return deferred.promise;
	};

	factory.cargaAllRates = function(){
		var deferred = $q.defer();
		if (loginService.getType() == 'agp'){
			priceFactory.getAllRates(function(data, error){
				if (!error){
					generalCache.put('allRates', data);
					$rootScope.$broadcast('progreso', {mensaje: 2});
					deferred.resolve();
				} else {
					deferred.reject()
				}
			});
		} else {
			deferred.resolve();
		}
		return deferred.promise;
	};

	factory.cargaSumariaImpoBuques = function(){
		var deferred = $q.defer();
		if (loginService.getType() == 'agp'){
			afipFactory.getSumariaImpoBuques(function(data, error){
				if (!error){
					afipCache.put('SumImpoBuques', data.data);
					$rootScope.$broadcast('progreso', {mensaje: 2});
					deferred.resolve();
				} else {
					deferred.reject();
				}
			})
		} else {
			deferred.resolve();
		}
		return deferred.promise;
	};

	factory.cargaSumariaExpoBuques = function(){
		var deferred = $q.defer();
		if (loginService.getType() == 'agp'){
			afipFactory.getSumariaExpoBuques(function(data, error){
				if (!error){
					afipCache.put('SumExpoBuques', data.data);
					$rootScope.$broadcast('progreso', {mensaje: 2});
					deferred.resolve();
				} else {
					deferred.reject();
				}
			})
		} else {
			deferred.resolve();
		}
		return deferred.promise;
	};

	factory.cargaAfectacionBuques = function(){
		var deferred = $q.defer();
		if (loginService.getType() == 'agp'){
			afipFactory.getAfectacionBuques(function(data, error){
				if (!error){
					afipCache.put('AfectacionBuques', data.data);
					$rootScope.$broadcast('progreso', {mensaje: 2});
					deferred.resolve();
				} else {
					deferred.reject();
				}
			})
		} else {
			deferred.resolve();
		}
		return deferred.promise;
	};

	factory.cargaSolicitudBuques = function(){
		var deferred = $q.defer();
		if (loginService.getType() == 'agp'){
			afipFactory.getSolicitudBuques(function(data, error){
				if (!error){
					afipCache.put('SolicitudBuques', data.data);
					$rootScope.$broadcast('progreso', {mensaje: 2});
					deferred.resolve();
				} else {
					deferred.reject();
				}
			})
		} else {
			deferred.resolve();
		}
		return deferred.promise;
	};

	factory.cargaCache = function () {
		var deferred = $q.defer();
		var llamadas = [];
		// Buque viaje cache
		llamadas.push(factory.cargaBuques()); //prueba sacando los métodos que usan oracle
		// Clientes cache
		llamadas.push(factory.cargaClientes());
		// Contenedores cache
		//llamadas.push(factory.cargaContenedores());
		// Contenedores gates cache
		//llamadas.push(factory.cargaContenedoresGates());
		// Contenedores turnos cache
		//llamadas.push(factory.cargaContenedoresTurnos());
		// Descripciones cache
		llamadas.push(factory.cargaDescripciones());
		// Vouchers cache
		llamadas.push(factory.cargaVouchers());
		// Unit Type cache
		llamadas.push(factory.cargaUnidades());
		// States cache
		llamadas.push(factory.cargaEstados());
		// Matches cache
		llamadas.push(factory.cargaMatchesArray());
		// Rates matches cache
		llamadas.push(factory.cargaMatchesRates());
		// All rates cache
		llamadas.push(factory.cargaAllRates());
		//afip cache
		llamadas.push(factory.cargaAfectacionBuques());
		llamadas.push(factory.cargaSolicitudBuques());
		llamadas.push(factory.cargaSumariaImpoBuques());
		llamadas.push(factory.cargaSumariaExpoBuques());

		$q.all(llamadas)
			.then(function(){
				deferred.resolve();
			},
			function(){
				deferred.reject();
			});
		return deferred.promise;
	};

	factory.limpiarCacheTerminal = function(){
		generalCache.remove('buques');
		generalCache.remove('clientes');
		//generalCache.remove('contenedores');
		//generalCache.remove('contenedoresGates');
		//generalCache.remove('contenedoreTurnos');
		generalCache.remove('descripciones');
		generalCache.remove('matches');
		generalCache.remove('ratesMatches');
	};

	factory.cambioTerminal = function(){
		factory.limpiarCacheTerminal();
		var deferred = $q.defer();
		var llamadas = [];
		// Buque viaje cache
		llamadas.push(factory.cargaBuques()); //prueba sacando metodos que usan oracle
		// Clientes cache
		llamadas.push(factory.cargaClientes());
		// Contenedores cache
		//llamadas.push(factory.cargaContenedores());
		// Contenedores gates cache
		//llamadas.push(factory.cargaContenedoresGates());
		// Contenedores turnos cache
		//llamadas.push(factory.cargaContenedoresTurnos());
		// Descripciones cache
		llamadas.push(factory.cargaDescripciones());
		// Matches cache
		llamadas.push(factory.cargaMatchesArray());
		// Rates matches cache
		llamadas.push(factory.cargaMatchesRates());

		$q.all(llamadas)
			.then(function(){
				deferred.resolve();
			},
			function(){
				deferred.reject();
			});
		return deferred.promise;
	};

	/*factory.cargaMemoryCache = function(){
		var deferred = $q.defer();
		var llamadas = [];
		// Contenedores cache
		llamadas.push(factory.cargaContenedores());
		// Contenedores gates cache
		llamadas.push(factory.cargaContenedoresGates());
		// Contenedores turnos cache
		llamadas.push(factory.cargaContenedoresTurnos());
		$q.all(llamadas)
			.then(function(){
				deferred.resolve();
			},
			function(){
				deferred.reject();
			});
		return deferred.promise;
	};*/

	factory.limpiaCache = function () {
		CacheFactory.clearAll();
	};

	return factory;
}]);