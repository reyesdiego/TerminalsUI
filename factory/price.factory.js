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

		getPricelistAgp() {
			const deferred = $q.defer();
			const inserturl = `${APP_CONFIG.SERVER_URL}/prices/agp`;
			const param = { onlyRates: true };

			let requests = [];
			requests.push($http.get(inserturl));
			requests.push($http.get(inserturl, { params: formatService.formatearDatos(param) }));
			$q.all(requests).then((responses) => {
				let responseData = {
					pricelist: [],
					pricelistTasas: []
				};
				let countControl = 0;
				//El que solo trae las tasas tiene un totalCount menor que el otro, me baso en eso para saber cual es cual
				responses.forEach((response) => {
					if (response.data.totalCount > countControl){
						countControl = response.data.totalCount;
						if (responseData.pricelist.length > 0) responseData.pricelistTasas = angular.copy(responseData.pricelist);
						responseData.pricelist = this.retrievePrice(response.data.data);
					} else {
						responseData.pricelistTasas = this.retrievePrice(response.data.data);
					}
				});
				deferred.resolve(responseData);
			}).catch((response) => {
				deferred.reject(response.data);
			});
			return deferred.promise;
		}

		getMatchPrices(tasas) {
			const deferred = $q.defer();
			const inserturl = `${APP_CONFIG.SERVER_URL}/matchPrices/${loginService.filterTerminal}`;
			const param = { onlyRates: tasas };
			$http.get(inserturl, { params: formatService.formatearDatos(param) }).then((response) => {
				if (response.data.status == 'OK'){
					response.data.data = this.retrievePrice(response.data.data);
					deferred.resolve(response.data);
				} else {
					deferred.reject(response.data);
				}
			}).catch((response) => {
				deferred.reject(response.data);
			});
			return deferred.promise;
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