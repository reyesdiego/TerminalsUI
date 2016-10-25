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
		get: function(defer, namespace, callId){
			namespace = namespace || 'default';
			callId = callId || 'default';
			if (!promisesToReject[namespace]) {
				//define el espacio de nombres para las promesas
				promisesToReject[namespace] = {};
				canceler[namespace]         = {};
				inited[namespace]           = {};
				//separo las promesas por callid
				promisesToReject[namespace][callId] = [];
				canceler[namespace][callId]         = null;
				inited[namespace][callId]           = false;
			}
			if (!promisesToReject[namespace][callId]) {
				promisesToReject[namespace][callId] = [];
				canceler[namespace][callId]         = null;
				inited[namespace][callId]           = false;
			}
			if (defer){
				promisesToReject[namespace][callId].push(defer);
			}
			//Create new defer in first time and when the promise was canceled before
			if(!inited[namespace][callId]){
				canceler[namespace][callId] = $q.defer();
				inited[namespace][callId]   = true;
			}
			return canceler[namespace][callId];
		},
		cancel: function(namespace, callId) {
			namespace = namespace || 'default';
			callId = callId || 'default';
			//Por ahora no hago el caso de cancelar todos los namespaces
			angular.forEach(promisesToReject[namespace], function(promises, promiseId) {
				if (!canceler[namespace][promiseId]) return;
				if ('default'!==callId && callId!=promiseId) return;
				canceler[namespace][promiseId].resolve('canceled');
				inited[namespace][promiseId] = false;
				// Reject namespace promises
				angular.forEach(promises, function(defer) {
					defer.reject();
				});
				promisesToReject[namespace][promiseId] = [];
			});
		}
	};
}]);
