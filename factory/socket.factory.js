/**
 * Created by artiom on 02/07/15.
 */

myapp.factory('appSocket', ['socketFactory', 'loginService', 'APP_CONFIG', function(socketFactory, loginService, APP_CONFIG) {

	//La dirrección deberá ser pasado por config
	var ioSocket;
	var mySocket;

	return {
		connect: function () {
			ioSocket = io.connect(APP_CONFIG.SOCKET_URL, { transports: ['polling', 'websocket', 'xhr-polling']});
			mySocket = socketFactory({ioSocket: ioSocket});

			mySocket.on('connect', function () {

				mySocket.forward('appointment');
				mySocket.forward('gate');
				mySocket.forward('invoice');
				mySocket.forward('loggedIn');
				mySocket.forward('loggedOff');

				if (loginService.isLoggedIn) {
					this.emit('login', loginService.info.user);
				}
			});

			mySocket.on('reconnect', function () {
				if (loginService.isLoggedIn) {
					this.emit('login', loginService.info.user);
				}
			});

			mySocket.on('disconnect', function() {
				console.log('socket se desconecto');
			})
		},
		disconnect: function () {
			ioSocket.disconnect();
		},
		emit: function(ev, data){
			mySocket.emit(ev, data);
		}
	}

}]);

myapp.factory('correlativeSocket', ['socketFactory', 'APP_CONFIG', function(socketFactory, APP_CONFIG){
	const ioSocket = io.connect(APP_CONFIG.SOCKET_URL);

	return socketFactory({ioSocket: ioSocket});
}]);

myapp.factory('consultaTurnosSocket', ['socketFactory', 'APP_CONFIG', function(socketFactory, APP_CONFIG){
	const ioSocket = io.connect(APP_CONFIG.SOCKET_URL);

	return socketFactory({ioSocket: ioSocket});
}]);
