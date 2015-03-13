/**
 * Created by leo on 11/03/15.
 */
(function () {
	myapp.service('buqueViajeCache', function (DSCacheFactory) {
		return DSCacheFactory('buqueViajeCache', { storageMode: 'localStorage' });
	});

	myapp.service('clientesCache', function (DSCacheFactory) {
		return DSCacheFactory('clientesCache', { storageMode: 'localStorage' });
	});

	myapp.service('contenedoresCache', function (DSCacheFactory) {
		return DSCacheFactory('contenedoresCache', { storageMode: 'localStorage' });
	});

	myapp.service('contenedoresGatesCache', function (DSCacheFactory) {
		return DSCacheFactory('contenedoresGatesCache', { storageMode: 'localStorage' });
	});

	myapp.service('contenedoresTurnosCache', function (DSCacheFactory) {
		return DSCacheFactory('contenedoresTurnosCache', { storageMode: 'localStorage' });
	});

	myapp.service('descripcionesCache', function (DSCacheFactory) {
		return DSCacheFactory('descripcionesCache', { storageMode: 'localStorage' });
	});

	myapp.service('estadosComprobantesCache', function (DSCacheFactory) {
		return DSCacheFactory('estadosComprobantesCache', { storageMode: 'localStorage' });
	});

	myapp.service('estadosComprobantesArrayCache', function (DSCacheFactory) {
		return DSCacheFactory('estadosComprobantesArrayCache', { storageMode: 'localStorage' })
	});

	myapp.service('unitTypesCache', function (DSCacheFactory) {
		return DSCacheFactory('unitTypeCache', { storageMode: 'localStorage' });
	});

	myapp.service('unitTypesArrayCache', function (DSCacheFactory) {
		return DSCacheFactory('unitTypeArrayCache', { storageMode: 'localStorage' });
	});

	myapp.service('vouchersCache', function (DSCacheFactory) {
		return DSCacheFactory('vouchersCache', { storageMode: 'localStorage' });
	});

	myapp.service('vouchersArrayCache', function (DSCacheFactory) {
		return DSCacheFactory('vouchersArrayCache', { storageMode: 'localStorage' });
	});
})();