/**
 * Created by artiom on 02/07/15.
 */

myapp.factory('appSocket', ['socketFactory', function(socketFactory){

	var ioSocket = io.connect(serverUrl);

	var mySocket = socketFactory({ioSocket: ioSocket});

	mySocket.forward('appointment');
	mySocket.forward('gate');
	mySocket.forward('invoice');

	return mySocket;

}]);

myapp.factory('correlativeSocket', ['socketFactory', function(socketFactory){
	var ioSocket = io.connect(serverUrl);

	return socketFactory({ioSocket: ioSocket});
}]);
