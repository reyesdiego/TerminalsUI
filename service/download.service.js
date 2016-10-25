/**
 * Created by kolesnikov-a on 25/10/2016.
 */
myapp.service('downloadService', ['$window', function($window){

	this.setDownloadPdf = function(reportName, data){

		var file = new Blob([data], {type: 'application/pdf'});

		if ($window.navigator.userAgent.indexOf('Trident') != -1 || $window.navigator.userAgent.indexOf('MSI') != -1){
			$window.navigator.msSaveOrOpenBlob(file, reportName);
		} else {
			var fileURL = URL.createObjectURL(file);

			var anchor = angular.element('<a/>');
			anchor.css({display: 'none'}); // Make sure it's not visible
			angular.element(document.body).append(anchor); // Attach to document

			anchor.attr({
				href: fileURL,
				target: '_blank',
				download: reportName
			})[0].click();

			anchor.remove(); // Clean it up afterwards
		}

	};

	this.setDownloadCsv = function(reportName, data){
		if ($window.navigator.userAgent.indexOf('Trident') != -1 || $window.navigator.userAgent.indexOf('MSI') != -1){
			var csvBlob = new Blob([data], {type: 'text/csv'});
			$window.navigator.msSaveOrOpenBlob(csvBlob, reportName);
		} else {
			data = "data:text/csv;charset=utf-8," + data;
			var encodedUri = encodeURI(data);

			var anchor = angular.element('<a/>');
			anchor.css({display: 'none'}); // Make sure it's not visible
			angular.element(document.body).append(anchor); // Attach to document

			anchor.attr({
				href: encodedUri,
				target: '_blank',
				download: reportName
			})[0].click();

			anchor.remove(); // Clean it up afterwards
		}
	};

}]);