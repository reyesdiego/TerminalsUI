/**
 * Created by gutierrez-g on 18/02/14.
 */
myapp.factory('priceFactory', ['$http', 'loginService', 'formatService', 'Price', 'APP_CONFIG', 'downloadService', function($http, loginService, formatService, Price, APP_CONFIG, downloadService){

	class priceFactory {

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

		noMatches(data, callback){
			const inserturl = `${APP_CONFIG.SERVER_URL}/matchPrices/noMatches/${loginService.filterTerminal}`;
			$http.get(inserturl, { params: formatService.formatearDatos(data) }).then((response) => {
				callback(response.data);
			}).catch((response) => {
				callback(response.data);
			});
		}
	}

	return new priceFactory();

}]);