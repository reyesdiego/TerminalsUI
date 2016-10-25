/**
 * Created by artiom on 24/06/15.
 */

myapp.factory('downloadFactory', ['$http', '$q', 'downloadService', function($http, $q, downloadService){
	var factory = {};

	factory.convertToPdf = function(data, route, reportName){
		var deferred = $q.defer();
		$http({
			method: 'POST',
			url: 'conversorPDF/' + route + '.php',
			responseType : 'arraybuffer',
			data: data
		}).then(function(response) {
			var contentType = response.headers('Content-Type');
			if (contentType.indexOf('application/pdf') >= 0){
				downloadService.setDownloadPdf(reportName, response.data);
				deferred.resolve();
			} else {
				deferred.reject();
			}
		}, function(response){
			deferred.reject();
		});
		return deferred.promise;
	};

	return factory;
}]);
