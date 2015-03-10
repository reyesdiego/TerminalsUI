/**
 * Created by gutierrez-g on 18/02/14.
 */
myapp.factory('priceFactory', function($http, dialogs, loginService, formatService){
	var factory = {};

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

	factory.getMatchPrices = function(terminal, datos, callback) {
		var inserturl = serverUrl + '/matchPrices/' + terminal + '?';
		var insertAux = inserturl;
		if (datos && datos != null){
			if(angular.isDefined(datos.code) && datos.code != ''){
				inserturl = inserturl + 'code=' + datos.code.toUpperCase();
			}
			if(angular.isDefined(datos.codigoAsociado) && datos.codigoAsociado != ''){
				if(inserturl != insertAux){ inserturl = inserturl + '&'}
				inserturl = inserturl + 'matchCode=' + datos.codigoAsociado.toUpperCase();
			}
			if(angular.isDefined(datos.tasaCargas) && datos.tasaCargas != ''){
				if(inserturl != insertAux){ inserturl = inserturl + '&'}
				inserturl = inserturl + 'onlyRates=' + datos.tasaCargas;
			}
		}
		$http.get(inserturl).success(function (data){
			callback(data);
		}).error(function(error){
			callback(error);
		});
	};

	factory.getArrayMatches = function(terminal, callback){
		var inserturl = serverUrl + '/matchPrices/price/' + terminal;
		$http.get(inserturl)
			.success(function (data){
				callback(data);
			}).error(function(error){
				console.log(error);
			});
	};

	factory.addMatchPrice = function (data, callback) {
		var inserturl = serverUrl + '/matchPrices/matchprice';
		$http({
			method: "POST",
			url: inserturl,
			data: data,
			headers: {token: loginService.getToken() }
		}).success(function (response) {
			callback(response);
		}).error(function(error) {
			callback(error);
		});
	};

	factory.noMatches = function (desde, hasta, callback){
		var flagFea = false;
		var inserturl = serverUrl + '/matchPrices/noMatches/' + loginService.getFiltro() + '?';
		if (desde && desde != null) {
			inserturl += 'fechaInicio=' + formatService.formatearFecha(desde);
			flagFea = true;
		}
		if (hasta && hasta != null) {
			if (flagFea) inserturl += '&';

			inserturl += 'fechaFin=' + formatService.formatearFecha(hasta);
		}
		$http.get(inserturl)
			.success(function (data){
				callback(data);
			}).error(function(error){
				callback(error);
			});
	};

	factory.addPrice = function (data, callback) {
		var inserturl = serverUrl + '/prices/price';
		$http({
			method: 'POST',
			url: inserturl,
			data: data,
			headers: {token: loginService.getToken() }
		}).success(function(response) {
			callback(response);
		}).error(function(error) {
			callback(error);
		});
	};

	factory.getPriceById = function(id, callback){
		var inserturl = serverUrl + '/price/' + id + '/' + loginService.getFiltro();
		$http.get(inserturl)
			.success(function(response) {
				callback(response);
			}).error(function(error) {
				callback(error);
			});
	};

	factory.savePriceChanges = function(formData, id, callback){
		formData.topPrices.forEach(function(unPrecio){
			unPrecio.from = formatService.formatearFecha(unPrecio.from);
		});
		var inserturl = serverUrl + '/prices/price/' + id;
		$http({
			method: 'PUT',
			url: inserturl,
			data: formData,
			headers: {token: loginService.getToken() }
		}).success(function(response) {
			callback(response);
		}).error(function(error) {
			callback(error);
		});
	};

	factory.getUnitTypes = function(callback){
		var inserturl = serverUrl + '/unitTypes'; //ver direccion
		$http.get(inserturl)
			.success(function(response) {
				callback(response);
			}).error(function(errorText) {
				callback(errorText);
			});
	};

	factory.getUnitTypesArray = function(callback){
		var inserturl = serverUrl + '/unitTypes?type=array'; //ver direccion
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

});