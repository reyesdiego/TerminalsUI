/**
 * Created by gutierrez-g on 18/02/14.
 */
myapp.factory('priceFactory', ['$http', 'loginService', 'formatService', 'Price', 'APP_CONFIG', 'downloadService', function($http, loginService, formatService, Price, APP_CONFIG, downloadService){
	var priceFactory = {
		retrievePrice: function(priceData){
			var pricesArray = [];
			priceData.forEach(function(newPrice){
				pricesArray.push(new Price(newPrice))
			});
			return pricesArray;
		},
		getPrice: function(terminal, tasas, callback) {
			var inserturl = APP_CONFIG.SERVER_URL + '/prices/' + terminal;
			var param = { onlyRates: tasas };
			var factory = this;
			$http.get(inserturl, { params: formatService.formatearDatos(param) })
					.then(function (response){
						response.data.data = factory.retrievePrice(response.data.data);
						callback(response.data);
					}, function(response){
						callback(response.data);
					});
		},
		getMatchPrices: function(terminal, tasas, callback) {
			var inserturl = APP_CONFIG.SERVER_URL + '/matchPrices/' + terminal;
			var param = { onlyRates: tasas };
			var factory = this;
			$http.get(inserturl, { params: formatService.formatearDatos(param) })
					.then(function (response){
						response.data.data = factory.retrievePrice(response.data.data);
						callback(response.data);
					}, function(response){
						callback(response.data);
					});
		},
		getMatchPricesCSV: function(datos, terminal, callback) {
			var inserturl = APP_CONFIG.SERVER_URL + '/matchPrices/' + terminal;
			$http.get(inserturl, { params: formatService.formatearDatos(datos) })
					.then(function(response){
						var contentType = response.headers('Content-Type');
						if (contentType.indexOf('text/csv') >= 0){
							downloadService.setDownloadCsv('Asociacion_tarifario.csv', response.data);
							callback('OK');
						} else {
							callback('ERROR');
						}
					}, function(response){
						callback('ERROR');
					});
		},
		noMatches: function (data, callback){
			var inserturl = APP_CONFIG.SERVER_URL + '/matchPrices/noMatches/' + loginService.filterTerminal;
			$http.get(inserturl, { params: formatService.formatearDatos(data) })
					.then(function (response){
						callback(response.data);
					}, function(response){
						callback(response.data);
					});
		}
	};

	return priceFactory;

}]);