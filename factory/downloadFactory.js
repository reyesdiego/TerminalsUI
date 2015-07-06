/**
 * Created by artiom on 24/06/15.
 */

myapp.factory('downloadFactory', ['$http', '$filter', function($http){
	var factory = {};

	factory.invoicePDF = function(invoice, callback){
		$http({
			method: 'POST',
			url: 'conversorPDF/invoiceToPdf.php',
			responseType : 'arraybuffer',
			data: invoice
		}).success(function(data, status, headers) {
			var contentType = headers('Content-Type');
			if (contentType.indexOf('text/html') >= 0){
				callback(data, 'ERROR');
			} else {
				callback(data, 'OK');
			}
		});
	};

	return factory;
}]);
