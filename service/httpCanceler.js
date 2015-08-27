/**
 * Created by artiom on 30/07/15.
 */
myapp.service('HTTPCanceler', [ '$q', function($q) {
	var
		promisesToReject = {},
		canceler         = {},
		inited           = {}
		;
	return {
		get: function(defer, namespace) {
			namespace = namespace || 'default';
			if (!promisesToReject[namespace]) {
				promisesToReject[namespace] = [];
				canceler[namespace]         = null;
				inited[namespace]           = false;
			}
			if (defer){
				promisesToReject[namespace].push(defer);
			}
			//Create new defer in first time and when the promise was canceled before
			if(!inited[namespace]){
				canceler[namespace] = $q.defer();
				inited[namespace]   = true;
			}
			return canceler[namespace];
		},
		cancel: function(namespace) {
			namespace = namespace || 'default';
			angular.forEach(promisesToReject, function(promises, promiseNamespace) {
				if (!canceler[promiseNamespace]) return;
				if ('default'!==namespace && namespace!=promiseNamespace) return;
				canceler[promiseNamespace].resolve();
				inited[promiseNamespace] = false;
				// Reject namespace promises
				angular.forEach(promises, function(defer) {
					defer.reject();
				});
				promisesToReject[promiseNamespace] = [];
			});
		}
	};
}]);
