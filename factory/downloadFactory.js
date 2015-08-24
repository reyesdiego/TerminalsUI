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
		}).success(function(data, status, headers) {
			var contentType = headers('Content-Type');
			if (contentType.indexOf('application/pdf') >= 0){
				callback(data, 'OK');
			} else {
				callback(data, 'ERROR');
			}
		});
	};

	return factory;
}]);
