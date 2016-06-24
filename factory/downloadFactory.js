/**
 * Created by artiom on 24/06/15.
 */

myapp.factory('downloadFactory', ['$http', '$filter', function($http){
	var factory = {};

	factory.convertToPdf = function(data, route, callback){
		$http({
			method: 'POST',
			url: 'conversorPDF/' + route + '.php',
			responseType : 'arraybuffer',
			data: data
		}).then(function(response) {
			var contentType = response.headers('Content-Type');
			if (contentType.indexOf('application/pdf') >= 0){
				callback(response.data, 'OK');
			} else {
				callback(response.data, 'ERROR');
			}
		}, function(response){
			callback(response.data, 'ERROR')
		});
	};

	return factory;
}]);
