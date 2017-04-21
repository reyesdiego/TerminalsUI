/**
 * Created by gutierrez-g on 18/02/14.
 */
myapp.factory('priceFactory', ['$http', 'loginService', 'formatService', 'Price', 'APP_CONFIG', 'downloadService', '$q', 'HTTPCanceler', function($http, loginService, formatService, Price, APP_CONFIG, downloadService, $q, HTTPCanceler){

	class priceFactory {

		constructor(){
			this.namespace = 'prices';
		}

		cancelRequest(request){
			HTTPCanceler.cancel(this.namespace, request);
		}

		retrievePrice(priceData){
			let pricesArray = [];
			priceData.forEach((newPrice) => {
				pricesArray.push(new Price(newPrice))
			});
			return pricesArray;
		}

		getPricelistAgp(tasas, callback) {
			const inserturl = `${APP_CONFIG.SERVER_URL}/prices/agp`;
			const param = { onlyRates: tasas };
			$http.get(inserturl, { params: formatService.formatearDatos(param) }).then((response) => {
				response.data.data = this.retrievePrice(response.data.data);
				callback(response.data);
			}).catch((response) => {
				callback(response.data);
			});
		}

		getMatchPrices(tasas, callback) {
			const inserturl = `${APP_CONFIG.SERVER_URL}/matchPrices/${loginService.filterTerminal}`;
			const param = { onlyRates: tasas };
			$http.get(inserturl, { params: formatService.formatearDatos(param) }).then((response) => {
				response.data.data = this.retrievePrice(response.data.data);
				callback(response.data);
			}).catch((response) => {
				callback(response.data);
			});
		}

		getMatchPricesCSV(datos, callback) {
			const inserturl = `${APP_CONFIG.SERVER_URL}/matchPrices/${loginService.filterTerminal}`;
			$http.get(inserturl, { params: formatService.formatearDatos(datos) }).then((response) => {
				const contentType = response.headers('Content-Type');
				if (contentType.indexOf('text/csv') >= 0){
					downloadService.setDownloadCsv('Asociacion_tarifario.csv', response.data);
					callback('OK');
				} else {
					callback('ERROR');
				}
			}).catch((response) => {
				callback('ERROR');
			});
		}

		noMatches(data){
			const deferred = $q.defer();
			this.cancelRequest('matchpricesNoMatches');
			const canceler = HTTPCanceler.get($q.defer(), this.namespace, 'matchpricesNoMatches');
			const inserturl = `${APP_CONFIG.SERVER_URL}/matchPrices/noMatches/${loginService.filterTerminal}`;
			$http.get(inserturl, { params: formatService.formatearDatos(data), timeout: canceler.promise }).then((response) => {
				deferred.resolve(response.data);
			}).catch((response) => {
				if (response.status != -5) deferred.reject(response.data);
			});
			return deferred.promise;
		}
	}

	return new priceFactory();

}]);