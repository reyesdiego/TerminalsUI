/**
 * Created by artiom on 02/07/15.
 */

myapp.factory('appSocket', ['socketFactory', 'loginService', function(socketFactory, loginService){

	//La dirrección deberá ser pasado por config
	var ioSocket = io.connect(socketUrl);

	var mySocket = socketFactory({ioSocket: ioSocket});

	mySocket.forward('appointment');
	mySocket.forward('gate');
	mySocket.forward('invoice');
	mySocket.forward('onlineUsers');
	mySocket.forward('logOff');

	mySocket.on('connect', function(){
		if (loginService.getStatus()){
			mySocket.emit('login', loginService.getInfo().user);
		}
	});

	mySocket.on('reconnect', function(){
		if (loginService.getStatus()){
			mySocket.emit('login', loginService.getInfo().user);
		}
	});

	return mySocket;

}]);

myapp.factory('correlativeSocket', ['socketFactory', function(socketFactory){
	var ioSocket = io.connect(socketUrl);

	return socketFactory({ioSocket: ioSocket});
}]);
