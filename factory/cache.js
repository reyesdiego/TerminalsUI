/**
 * Created by leo on 12/03/15.
 */
(function () {
	myapp.factory('cacheFactory', function (DSCacheFactory, controlPanelFactory, invoiceFactory, vouchersFactory, priceFactory, statesFactory, buqueViajeCache, clientesCache, contenedoresCache, contenedoresGatesCache, contenedoresTurnosCache, descripcionesCache, vouchersCache, vouchersArrayCache, unitTypesCache, unitTypesArrayCache, estadosComprobantesCache, estadosComprobantesArrayCache) {
		var factory = {};

		factory.cargaCache = function () {
			// Buque viaje cache
			invoiceFactory.getShipTrips(function (data) {
				if (data.status == 'OK') {
					buqueViajeCache.put('buqueViaje', data.data);
					//console.log(buqueViajeCache.get('buqueViaje'));
				}
			});

			// Clientes cache
			controlPanelFactory.getClients(function (data) {
				if (data.status == 'OK') {
					clientesCache.put('clientes', data.data);
					//console.log(clientesCache.get('clientes'));
				}
			});

			// Contenedores cache
			controlPanelFactory.getContainers(function (data) {
				if (data.status == 'OK') {
					contenedoresCache.put('contenedores', data.data);
					//console.log(contenedoresCache.get('contenedores'));
				}
			});

			// Contenedores gates cache
			controlPanelFactory.getContainersGates(function (data) {
				if (data.status == 'OK') {
					contenedoresGatesCache.put('contenedoresGates', data.data);
					//console.log(contenedoresGatesCache.get('contenedoresGates'));
				}
			});

			// Contenedores turnos cache
			controlPanelFactory.getContainersTurnos(function (data) {
				if (data.status == 'OK') {
					contenedoresTurnosCache.put('contenedoresTurnos', data.data);
					//console.log(contenedoresTurnosCache.get('contenedoresTurnos'));
				}
			});

			// Descripciones cache
			invoiceFactory.getDescriptionItem(function (data) {
				if (data.status == 'OK') {
					descripcionesCache.put('descripciones', data.data);
				}
			});

			// Vouchers cache
			vouchersFactory.getVouchersType(function (data) {
				if (data.status == 'OK') {
					vouchersCache.put('vouchers', data.data);
					data.data.forEach(function (dato) {
						vouchersArrayCache.put(dato._id, dato.description);
					});
				}
			});

			// Unit Type cache
			priceFactory.getUnitTypes(function (data) {
				if (data.status == 'OK') {
					unitTypesCache.put('unitTypes', data.data);
					data.data.forEach(function (dato) {
						unitTypesArrayCache.put(dato._id, dato.description);
					});
				}
			});

			// States cache
			statesFactory.getStatesType(function (data) {
				if (data.status == 'OK') {
					estadosComprobantesCache.put('estadosComprobantes', data.data);
					data.data.forEach(function (dato) {
						estadosComprobantesArrayCache.put(dato._id, dato);
					});
					//console.log(estadosComprobantesCache.get('Y'));
				}
			});
		};

		factory.borraCache = function () {
			DSCacheFactory.clearAll();
		};

		return factory;
	});
})();