/**
 * Created by gutierrez-g on 18/02/14.
 */
myapp.factory('priceFactory', ['$http', 'loginService', 'formatService', function($http, loginService, formatService){
	var factory = {};

	factory.getAllRates = function(callback){
		var inserturl = serverUrl + '/prices/rates/1/all';
		$http.get(inserturl)
			.then(function (response){
				callback(response.data, false);
			}, function(response){
				callback(response.data, true);
			});
	};

	factory.getPrice = function(terminal, datos, callback) {
		var inserturl = serverUrl + '/prices/' + terminal;
		if (datos){ inserturl = inserturl + '?onlyRates=true' }
		$http.get(inserturl)
			.then(function (response){
				callback(response.data);
			}, function(response){
				callback(response.data);
			});
	};

	factory.getMatchPrices = function(datos, terminal, callback) {
		var inserturl = serverUrl + '/matchPrices/' + terminal;
		$http.get(inserturl, { params: formatService.formatearDatos(datos) })
			.then(function (response){
				callback(response.data);
			}, function(response){
				callback(response.data);
			});
	};

	factory.getMatchPricesCSV = function(datos, terminal, callback) {
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
	};

	//Se pasa la terminal al ser un método de caché
	factory.getArrayMatches = function(terminal, callback){
		var inserturl = serverUrl + '/matchPrices/price/' + terminal;
		$http.get(inserturl)
			.then(function (response){
				callback(response.data);
			}, function(response){
				console.log(response.data);
				//TODO verificar que pasa acá
			});
	};

	factory.addMatchPrice = function (data, callback) {
		var inserturl = serverUrl + '/matchPrices/matchprice';
		$http.post(inserturl, data)
			.then(function (response) {
				callback(response.data);
			}, function(response) {
				callback(response.data);
			});
	};

	factory.noMatches = function (data, callback){
		var inserturl = serverUrl + '/matchPrices/noMatches/' + loginService.getFiltro();
		$http.get(inserturl, { params: formatService.formatearDatos(data) })
			.then(function (response){
				callback(response.data);
			}, function(response){
				callback(response.data);
			});
	};

	factory.addPrice = function (data, callback) {
		var inserturl = serverUrl + '/prices/price';
		$http.post(inserturl, data)
			.then(function(response) {
				callback(response.data);
			}, function(response) {
				callback(response.data);
			});
	};

	factory.getPriceById = function(id, callback){
		var inserturl = serverUrl + '/prices/' + id + '/' + loginService.getFiltro();
		$http.get(inserturl)
			.then(function(response) {
				callback(response.data);
			}, function(response) {
				callback(response.data);
			});
	};

	factory.savePriceChanges = function(formData, id, callback){
		formData.topPrices.forEach(function(unPrecio){
			unPrecio.from = formatService.formatearFechaISOString(unPrecio.from);
		});
		var inserturl = serverUrl + '/prices/price/' + id;
		$http.put(inserturl, formData)
			.then(function(response) {
				callback(response.data);
			}, function(response) {
				callback(response.data);
			});
	};

	factory.getUnitTypes = function(callback){
		var inserturl = serverUrl + '/unitTypes';
		$http.get(inserturl)
			.then(function(response) {
				callback(response.data);
			}, function(response) {
				callback(response.data);
			});
	};

	factory.removePrice = function(id, callback){
		var inserturl = serverUrl + '/prices/price/' + id;
		$http.delete(inserturl)
			.then(function(response) {
				callback(response.data);
			}, function(response) {
				callback(response.data);
			});
	};

	return factory;

}]);