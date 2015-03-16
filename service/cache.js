/**
 * Created by leo on 11/03/15.
 */
myapp.service('generalCache', ['DSCacheFactory', function (DSCacheFactory) {
	return DSCacheFactory('generalCache', { storageMode: 'localStorage' });
}]);

myapp.service('estadosArrayCache', ['DSCacheFactory', function (DSCacheFactory) {
	return DSCacheFactory('estadosArrayCache', { storageMode: 'localStorage' })
}]);

myapp.service('unitTypesArrayCache', ['DSCacheFactory', function (DSCacheFactory) {
	return DSCacheFactory('unitTypeArrayCache', { storageMode: 'localStorage' });
}]);

myapp.service('vouchersArrayCache', ['DSCacheFactory', function (DSCacheFactory) {
	return DSCacheFactory('vouchersArrayCache', { storageMode: 'localStorage' });
}]);