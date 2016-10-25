/**
 * Created by gutierrez-g on 18/02/14.
 */
myapp.factory('priceFactory', ['$http', 'loginService', 'formatService', 'Price', 'APP_CONFIG', function($http, loginService, formatService, Price, APP_CONFIG){
	var priceFactory = {
		retrievePrice: function(priceData){
			var pricesArray = [];
			priceData.forEach(function(newPrice){
				pricesArray.push(new Price(newPrice))
			});
			return pricesArray;
		},
		getAllRates: function(callback){
			var inserturl = APP_CONFIG.SERVER_URL + '/prices/rates/1/all';
			$http.get(inserturl)
					.then(function (response){
						callback(response.data, false);
					}, function(response){
						callback(response.data, true);
					});
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
							callback(response.data, 'OK');
						} else {
							callback(response.data, 'ERROR');
						}
					}, function(response){
						callback(response.data, 'ERROR');
					});
		},
		//Se pasa la terminal al ser un método de caché
		getArrayMatches: function(terminal, callback){
			var inserturl = APP_CONFIG.SERVER_URL + '/matchPrices/price/' + terminal;
			$http.get(inserturl)
					.then(function (response){
						callback(response.data);
					}, function(response){
						console.log(response.data);
						//TODO verificar que pasa acá
					});
		},
		noMatches: function (data, callback){
			var inserturl = APP_CONFIG.SERVER_URL + '/matchPrices/noMatches/' + loginService.getFiltro();
			$http.get(inserturl, { params: formatService.formatearDatos(data) })
					.then(function (response){
						callback(response.data);
					}, function(response){
						callback(response.data);
					});
		},
		getUnitTypes: function(callback){
			var inserturl = APP_CONFIG.SERVER_URL + '/unitTypes';
			$http.get(inserturl)
					.then(function(response) {
						callback(response.data);
					}, function(response) {
						callback(response.data);
					});
		}
	};

	return priceFactory;

}]);