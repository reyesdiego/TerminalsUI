/**
 * Created by artiom on 24/06/15.
 */

myapp.factory('downloadFactory', ['$http', '$q', 'downloadService', function($http, $q, downloadService){

	class downloadFactory {

		convertToPdf(data, route, reportName){
			const deferred = $q.defer();
			$http({
				method: 'POST',
				url: 'conversorPDF/' + route + '.php',
				responseType : 'arraybuffer',
				data: data
			}).then((response) => {
				const contentType = response.headers('Content-Type');
				if (contentType.indexOf('application/pdf') >= 0){
					downloadService.setDownloadPdf(reportName, response.data);
					deferred.resolve();
				} else {
					deferred.reject();
				}
			}).catch((response) => {
				deferred.reject();
			});
			return deferred.promise;
		}

	}

	return new downloadFactory();
}]);
