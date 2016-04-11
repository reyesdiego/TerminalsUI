/**
 * Created by artiom on 02/07/15.
 */

myapp.factory('appSocket', ['socketFactory', 'loginService', function(socketFactory, loginService) {

	//La dirrección deberá ser pasado por config
	var ioSocket;
	var mySocket;

	return {
		connect: function () {
			ioSocket = io.connect(socketUrl);
			mySocket = socketFactory({ioSocket: ioSocket});

			mySocket.on('connect', function () {
				console.log('socket se conecto');

				mySocket.forward('appointment');
				mySocket.forward('gate');
				mySocket.forward('invoice');
				mySocket.forward('loggedIn');
				mySocket.forward('loggedOff');

				if (loginService.getStatus()) {
					console.log('hace login');
					this.emit('login', loginService.getInfo().user);
				}
			});

			mySocket.on('reconnect', function () {
				console.log('socket se reconecto');
				if (loginService.getStatus()) {
					console.log('hace login');
					this.emit('login', loginService.getInfo().user);
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
			console.log('socket emite ' + ev);
			mySocket.emit(ev, data);
		}
	}

}]);

myapp.factory('correlativeSocket', ['socketFactory', function(socketFactory){
	var ioSocket = io.connect(socketUrl);

	return socketFactory({ioSocket: ioSocket});
}]);
