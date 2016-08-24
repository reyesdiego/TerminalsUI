/**
 * Created by gutierrez-g on 18/02/14.
 */
myapp.factory('priceFactory', ['$http', 'loginService', 'formatService', 'Price', function($http, loginService, formatService, Price){
	var priceFactory = {
		retrievePrice: function(priceData){
			var pricesArray = [];
			priceData.forEach(function(newPrice){
				pricesArray.push(new Price(newPrice))
			});
			return pricesArray;
		},
		getAllRates: function(callback){
			var inserturl = serverUrl + '/prices/rates/1/all';
			$http.get(inserturl)
					.then(function (response){
						callback(response.data, false);
					}, function(response){
						callback(response.data, true);
					});
		},
		getPrice: function(terminal, datos, callback) {
			var inserturl = serverUrl + '/prices/' + terminal;
			if (datos){ inserturl = inserturl + '?onlyRates=true' }
			var factory = this;
			$http.get(inserturl)
					.then(function (response){
						response.data.data = factory.retrievePrice(response.data.data);
						callback(response.data);
					}, function(response){
						callback(response.data);
					});
		},
		getMatchPrices: function(datos, terminal, callback) {
			var inserturl = serverUrl + '/matchPrices/' + terminal;
			var factory = this;
			$http.get(inserturl, { params: formatService.formatearDatos(datos) })
					.then(function (response){
						response.data.data = factory.retrievePrice(response.data.data);
						callback(response.data);
					}, function(response){
						callback(response.data);
					});
		},
		getMatchPricesCSV: function(datos, terminal, callback) {
			var inserturl = serverUrl + '/matchPrices/' + terminal;
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
			var inserturl = serverUrl + '/matchPrices/price/' + terminal;
			$http.get(inserturl)
					.then(function (response){
						callback(response.data);
					}, function(response){
						console.log(response.data);
						//TODO verificar que pasa acá
					});
		},
		noMatches: function (data, callback){
			var inserturl = serverUrl + '/matchPrices/noMatches/' + loginService.getFiltro();
			$http.get(inserturl, { params: formatService.formatearDatos(data) })
					.then(function (response){
						callback(response.data);
					}, function(response){
						callback(response.data);
					});
		},
		getUnitTypes: function(callback){
			var inserturl = serverUrl + '/unitTypes';
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