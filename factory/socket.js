/**
 * Created by diego on 5/16/14.
 */
(function() {
	myapp.factory('socket', function($rootScope){
		return io.connect(serverUrl, { query: 'loggeduser=user1' });
	});
})();
/*
myapp.factory('socket', function($rootScope, loginService){

	var socket = io.connect(serverUrl);

	return {
		on: function (eventName, id, callback) {

			if (typeof callback  !== 'function' && typeof id === 'function'){
				callback = id;
			}
			var args = [];
			args.push()
			socket.on(eventName, function () {
				var args = arguments;
				$rootScope.$apply(function () {
					callback.apply(socket, args);
				});
			});
		},
		emit: function (eventName, id, data, callback) {

			if (arguments.length === 2 && typeof id === 'function'){
				callback = id;
			}

			socket.emit(eventName, data, function () {
//			socket.emit(eventName,  function () {
				var args = arguments;
				$rootScope.$apply(function () {
					if (callback) {
						callback.apply(socket, args);
					}
				});
			})
		}
	};
});
*/