/**
 * Created by leo on 12/03/15.
 */
myapp.factory('cacheFactory', ['DSCacheFactory', 'controlPanelFactory', 'invoiceFactory', 'vouchersFactory', 'priceFactory', 'statesFactory', 'generalCache', 'vouchersArrayCache', 'unitTypesArrayCache', 'estadosArrayCache', function (DSCacheFactory, controlPanelFactory, invoiceFactory, vouchersFactory, priceFactory, statesFactory, generalCache, vouchersArrayCache, unitTypesArrayCache, estadosArrayCache) {
	var factory = {};

	factory.cargaCache = function () {
		// Buque viaje cache
		invoiceFactory.getShipTrips(function (data) {
			if (data.status == 'OK') {
				generalCache.put('buques', data.data);
				//console.log(generalCache.get('buqueViaje'));
			}
		});

		// Clientes cache
		controlPanelFactory.getClients(function (data) {
			if (data.status == 'OK') {
				var clientes = [];
				var i = 0;
				data.data.forEach(function (dato) {
					clientes.push({id: i++, nombre: dato})
				});
				generalCache.put('clientes', clientes);
				//console.log(generalCache.get('clientes'));
			}
		});

		// Contenedores cache
		controlPanelFactory.getContainers(function (data) {
			if (data.status == 'OK') {
				var contenedores = [];
				var i = 0;
				data.data.forEach(function (dato) {
					contenedores.push({id: i++, contenedor: dato})
				});
				generalCache.put('contenedores', contenedores);
				//console.log(generalCache.get('contenedores'));
			}
		});

		// Contenedores gates cache
		controlPanelFactory.getContainersGates(function (data) {
			if (data.status == 'OK') {
				var contenedores = [];
				var i = 0;
				data.data.forEach(function (dato) {
					contenedores.push({id: i++, contenedor: dato})
				});
				generalCache.put('contenedoresGates', contenedores);
				//console.log(generalCache.get('contenedoresGates'));
			}
		});

		// Contenedores turnos cache
		controlPanelFactory.getContainersTurnos(function (data) {
			if (data.status == 'OK') {
				var contenedores = [];
				var i = 0;
				data.data.forEach(function (dato) {
					contenedores.push({id: i++, contenedor: dato})
				});
				generalCache.put('contenedoresTurnos', contenedores);
				//console.log(generalCache.get('contenedoresTurnos'));
			}
		});

		// Descripciones cache
		invoiceFactory.getDescriptionItem(function (data) {
			if (data.status == 'OK') {
				generalCache.put('descripciones', data.data);
				//console.log(generalCache.get('descripciones'));
			}
		});

		// Vouchers cache
		vouchersFactory.getVouchersType(function (data) {
			if (data.status == 'OK') {
				generalCache.put('vouchers', data.data);
				data.data.forEach(function (dato) {
					vouchersArrayCache.put(dato._id, dato.description);
				});
				//console.log(generalCache.get('vouchers'));
			}
		});

		// Unit Type cache
		priceFactory.getUnitTypes(function (data) {
			if (data.status == 'OK') {
				generalCache.put('unitTypes', data.data);
				data.data.forEach(function (dato) {
					unitTypesArrayCache.put(dato._id, dato.description);
				});
				//console.log(generalCache.get('unitTypes'));
			}
		});

		// States cache
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
			}
		});
	};

	factory.limpiaCache = function () {
		DSCacheFactory.clearAll();
	};

	return factory;
}]);