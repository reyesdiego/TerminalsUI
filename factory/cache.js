/**
 * Created by leo on 12/03/15.
 */
myapp.factory('cacheFactory', ['$rootScope', 'CacheFactory', 'controlPanelFactory', 'invoiceFactory', 'vouchersFactory', 'priceFactory', 'statesFactory', 'contenedoresCache', 'generalCache', 'vouchersArrayCache', 'unitTypesArrayCache', 'estadosArrayCache', '$q', function ($rootScope, CacheFactory, controlPanelFactory, invoiceFactory, vouchersFactory, priceFactory, statesFactory, contenedoresCache, generalCache, vouchersArrayCache, unitTypesArrayCache, estadosArrayCache, $q) {
	var factory = {};

	factory.cargaBuques = function(){
		var deferred = $q.defer();
		invoiceFactory.getShipTrips(function (data) {
			if (data.status == 'OK') {
				generalCache.put('buques', data.data);
				$rootScope.$broadcast('progreso', {mensaje: 2});
				deferred.resolve();
				//console.log(generalCache.get('buqueViaje'));
			} else {
				deferred.reject();
			}
		});
		return deferred.promise;
	};

	factory.cargaClientes = function(){
		var deferred = $q.defer();
		controlPanelFactory.getClients(function (data) {
			if (data.status == 'OK') {
				var clientes = [];
				var i = 0;
				data.data.forEach(function (dato) {
					clientes.push({id: i++, nombre: dato})
				});
				generalCache.put('clientes', clientes);
				$rootScope.$broadcast('progreso', {mensaje: 2});
				deferred.resolve();
				//console.log(generalCache.get('clientes'));
			} else {
				deferred.reject();
			}
		});
		return deferred.promise;
	};

	factory.cargaContenedores = function(){
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
				console.log(contenedoresCache.info('contenedores'));
				deferred.resolve();
				//console.log(contenedoresCache.get('contenedores'));
			} else {
				deferred.reject();
			}
		});
		return deferred.promise;
	};

	factory.cargaContenedoresGates = function(){
		var deferred = $q.defer();
		controlPanelFactory.getContainersGates(function (data) {
			if (data.status == 'OK') {
				var contenedores = [];
				var i = 0;
				data.data.forEach(function (dato) {
					contenedores.push({id: i++, contenedor: dato})
				});
				contenedoresCache.put('contenedoresGates', contenedores);
				//console.log(contenedoresCache.get('contenedoresGates'));
				$rootScope.$broadcast('progreso', {mensaje: 2});
				deferred.resolve();
			} else {
				deferred.reject();
			}
		});
		return deferred.promise;
	};

	factory.cargaContenedoresTurnos = function(){
		var deferred = $q.defer();
		controlPanelFactory.getContainersTurnos(function (data) {
			if (data.status == 'OK') {
				var contenedores = [];
				var i = 0;
				data.data.forEach(function (dato) {
					contenedores.push({id: i++, contenedor: dato})
				});
				contenedoresCache.put('contenedoresTurnos', contenedores);
				//console.log(contenedoresCache.get('contenedoresTurnos'));
				$rootScope.$broadcast('progreso', {mensaje: 2});
				deferred.resolve();
			} else {
				deferred.reject();
			}
		});
		return deferred.promise;
	};

	factory.cargaDescripciones = function(){
		var deferred = $q.defer();
		invoiceFactory.getDescriptionItem(function (data) {
			if (data.status == 'OK') {
				generalCache.put('descripciones', data.data);
				//console.log(generalCache.get('descripciones'));
				$rootScope.$broadcast('progreso', {mensaje: 2});
				deferred.resolve();
			} else {
				deferred.reject();
			}
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
				//console.log(generalCache.get('vouchers'));
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
				//console.log(generalCache.get('unitTypes'));
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
				//console.log(generalCache.get('estados'));
				//console.log(estadosArrayCache.get('Y'))
				$rootScope.$broadcast('progreso', {mensaje: 2});
				deferred.resolve();
			} else {
				deferred.reject();
			}
		});
		return deferred.promise;
	};

	factory.cargaCache = function () {
		var deferred = $q.defer();
		var llamadas = [];
		// Buque viaje cache
		llamadas.push(factory.cargaBuques());
		// Clientes cache
		llamadas.push(factory.cargaClientes());
		// Contenedores cache
		llamadas.push(factory.cargaContenedores());
		// Contenedores gates cache
		llamadas.push(factory.cargaContenedoresGates());
		// Contenedores turnos cache
		llamadas.push(factory.cargaContenedoresTurnos());
		// Descripciones cache
		llamadas.push(factory.cargaDescripciones());
		// Vouchers cache
		llamadas.push(factory.cargaVouchers());
		// Unit Type cache
		llamadas.push(factory.cargaUnidades());
		// States cache
		llamadas.push(factory.cargaEstados());

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
		generalCache.remove('contenedores');
		generalCache.remove('contenedoresGates');
		generalCache.remove('contenedoreTurnos');
		generalCache.remove('descripciones');
	};

	factory.cambioTerminal = function(){
		factory.limpiarCacheTerminal();
		var deferred = $q.defer();
		var llamadas = [];
		// Buque viaje cache
		llamadas.push(factory.cargaBuques());
		// Clientes cache
		llamadas.push(factory.cargaClientes());
		// Contenedores cache
		llamadas.push(factory.cargaContenedores());
		// Contenedores gates cache
		llamadas.push(factory.cargaContenedoresGates());
		// Contenedores turnos cache
		llamadas.push(factory.cargaContenedoresTurnos());
		// Descripciones cache
		llamadas.push(factory.cargaDescripciones());

		$q.all(llamadas)
			.then(function(){
				deferred.resolve();
			},
			function(){
				deferred.reject();
			});
		return deferred.promise;
	};

	factory.cargaMemoryCache = function(){
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
	};

	factory.limpiaCache = function () {
		CacheFactory.clearAll();
	};

	return factory;
}]);