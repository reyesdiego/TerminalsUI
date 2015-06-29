/**
 * Created by diego on 5/16/14.
 */

myapp.factory('socket', function(){

	return io.connect(serverUrl);
	/*return io.connect(serverUrl, {
		'reconnection': true,
		'reconnectionDelay': 1000,
		'reconnectionDelayMax' : 5000,
		'reconnectionAttempts': 5
	});*/
	//return io.connect(serverUrl, { query: 'loggeduser=user1' });
});