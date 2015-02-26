/**
 * Created by diego on 5/16/14.
 */
(function() {
	myapp.factory('socket', function(){
		return io.connect(serverUrl, { query: 'loggeduser=user1' });
	});
})();