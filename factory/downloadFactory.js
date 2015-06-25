/**
 * Created by artiom on 24/06/15.
 */

myapp.factory('downloadFactory', ['$http', '$filter', function($http){
	var factory = {};

	factory.invoicePDF = function(invoice, callback){
		$http({
			method: 'POST',
			url: 'http://localhost/conversorPDF/invoiceToPdf.php',
			responseType : 'arraybuffer',
			data: invoice,
			contentType: 'application/json'
		}).success(function(data) {
			callback(data);
		});
	};

	return factory;
}]);
