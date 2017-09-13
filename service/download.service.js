/**
 * Created by kolesnikov-a on 25/10/2016.
 */

class DownloadService {
	constructor($window){
		this._$window = $window;
	}

	setDownloadPdf(reportName, data){

		const file = new Blob([data], {type: 'application/pdf'});

		if (this._$window.navigator.userAgent.indexOf('Trident') != -1 || this._$window.navigator.userAgent.indexOf('MSI') != -1){
			this._$window.navigator.msSaveOrOpenBlob(file, reportName);
		} else {
			const fileURL = URL.createObjectURL(file);

			const anchor = angular.element('<a/>');
			anchor.css({display: 'none'}); // Make sure it's not visible
			angular.element(document.body).append(anchor); // Attach to document

			anchor.attr({
				href: fileURL,
				target: '_blank',
				download: reportName
			})[0].click();

			anchor.remove(); // Clean it up afterwards
		}

	}

	setDownloadCsv(reportName, data){
		if (this._$window.navigator.userAgent.indexOf('Trident') != -1 || this._$window.navigator.userAgent.indexOf('MSI') != -1){
			const csvBlob = new Blob([data], {type: 'text/csv'});
			this._$window.navigator.msSaveOrOpenBlob(csvBlob, reportName);
		} else {
			data = "data:text/csv;charset=utf-8," + data;
			const encodedUri = encodeURI(data);

			const anchor = angular.element('<a/>');
			anchor.css({display: 'none'}); // Make sure it's not visible
			angular.element(document.body).append(anchor); // Attach to document

			anchor.attr({
				href: encodedUri,
				target: '_blank',
				download: reportName
			})[0].click();

			anchor.remove(); // Clean it up afterwards
		}
	}

}

DownloadService.$inject = ['$window'];

myapp.service('downloadService', DownloadService);