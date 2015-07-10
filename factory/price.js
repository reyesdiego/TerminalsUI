/**
 * Created by gutierrez-g on 18/02/14.
 */
myapp.factory('priceFactory', ['$http', 'loginService', 'formatService', function($http, loginService, formatService){
	var factory = {};

	factory.getAllRates = function(callback){
		var inserturl = serverUrl + '/prices/rates/1/all';
		$http.get(inserturl)
			.success(function (data){
				callback(data, false);
			}).error(function(error){
				callback(error, true);
			});
	};

	factory.getPrice = function(terminal, datos, callback) {
		var inserturl = serverUrl + '/prices/' + terminal;
		if (datos){ inserturl = inserturl + '?onlyRates=true' }
		$http.get(inserturl)
			.success(function (data){
				callback(data);
			}).error(function(error){
				callback(error);
			});
	};

	factory.getMatchPrices = function(datos, callback) {
		var inserturl = serverUrl + '/matchPrices/' + loginService.getFiltro();
		$http.get(inserturl, { params: formatService.formatearDatos(datos) })
			.success(function (data){
				callback(data);
			}).error(function(error){
				callback(error);
			});
	};

	factory.getArrayMatches = function(callback){
		var inserturl = serverUrl + '/matchPrices/price/' + loginService.getFiltro();
		$http.get(inserturl)
			.success(function (data){
				callback(data);
			}).error(function(error){
				console.log(error);
			});
	};

	factory.addMatchPrice = function (data, callback) {
		var inserturl = serverUrl + '/matchPrices/matchprice';
		$http.post(inserturl, data)
			.success(function (response) {
				callback(response);
			}).error(function(error) {
				callback(error);
			});
	};

	factory.noMatches = function (data, callback){
		var inserturl = serverUrl + '/matchPrices/noMatches/' + loginService.getFiltro();
		$http.get(inserturl, { params: formatService.formatearDatos(data) })
			.success(function (data){
				callback(data);
			}).error(function(error){
				callback(error);
			});
	};

	factory.addPrice = function (data, callback) {
		var inserturl = serverUrl + '/prices/price';
		$http.post(inserturl, data)
			.success(function(response) {
				callback(response);
			}).error(function(error) {
				callback(error);
			});
	};

	factory.getPriceById = function(id, callback){
		var inserturl = serverUrl + '/prices/' + id + '/' + loginService.getFiltro();
		$http.get(inserturl)
			.success(function(response) {
				callback(response);
			}).error(function(error) {
				callback(error);
			});
	};

	factory.savePriceChanges = function(formData, id, callback){
		formData.topPrices.forEach(function(unPrecio){
			unPrecio.from = formatService.formatearFechaISOString(unPrecio.from);
		});
		var inserturl = serverUrl + '/prices/price/' + id;
		$http.put(inserturl, formData)
			.success(function(response) {
				callback(response);
			}).error(function(error) {
				callback(error);
			});
	};

	factory.getUnitTypes = function(callback){
		var inserturl = serverUrl + '/unitTypes';
		$http.get(inserturl)
			.success(function(response) {
				callback(response);
			}).error(function(errorText) {
				callback(errorText);
			});
	};

	factory.removePrice = function(id, callback){
		var inserturl = serverUrl + '/prices/price/' + id;
		$http.delete(inserturl)
			.success(function(response) {
				callback(response);
			}).error(function(error) {
				callback(error);
			});
	};

	return factory;

}]);