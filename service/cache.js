/**
 * Created by leo on 11/03/15.
 */
myapp.service('generalCache', ['CacheFactory', function (CacheFactory) {
	return CacheFactory.createCache('generalCache', { storageMode: 'localStorage' });
}]);

myapp.service('estadosArrayCache', ['CacheFactory', function (CacheFactory) {
	return CacheFactory.createCache('estadosArrayCache', { storageMode: 'localStorage' })
}]);

myapp.service('unitTypesArrayCache', ['CacheFactory', function (CacheFactory) {
	return CacheFactory.createCache('unitTypeArrayCache', { storageMode: 'localStorage' });
}]);

myapp.service('vouchersArrayCache', ['CacheFactory', function (CacheFactory) {
	return CacheFactory.createCache('vouchersArrayCache', { storageMode: 'localStorage' });
}]);

myapp.service('contenedoresCache', ['CacheFactory', function (CacheFactory) {
	return CacheFactory.createCache('contenedoresCache');
}]);