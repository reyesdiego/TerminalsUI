/**
 * Created by diego on 5/16/14.
 */

myapp.factory('socket', function($rootScope){

	var socket = io.connect(serverUrl);

	return socket;

});