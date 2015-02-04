/**
 * Created by gutierrez-g on 18/02/14.
 */
myapp.factory('priceFactory', function($http, dialogs, loginService, formatDate, errorFactory){
	var factory = {};

	factory.getPrice = function(terminal, datos, callback) {
		var inserturl = serverUrl + '/prices/' + terminal;
		if (datos){ inserturl = inserturl + '?onlyRates=true' }
		$http({
			method: 'GET',
			url: inserturl,
			headers: { token: loginService.getToken() }
		}).success(function (data){
			callback(data);
		}).error(function(error){
			//errorFactory.raiseError(errorText, inserturl, 'errorDatos', 'Error al cargar el tarifario.');
			callback(error);
		});
	};

	factory.getMatchPrices = function(terminal, datos, callback) {
		var inserturl = serverUrl + '/matchprices/' + terminal + '?';
		var insertAux = inserturl;
		if (datos && datos != null){
			if(angular.isDefined(datos.codigo) && datos.codigo != ''){
				inserturl = inserturl + 'code=' + datos.codigo.toUpperCase();
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
		$http({
			method: 'GET',
			url: inserturl,
			headers: { token: loginService.getToken() }
		}).success(function (data){
			callback(data);
		}).error(function(error){
			//dialogs.error('Error', 'Error al cargar la lista');
			callback(error);
		});
	};

	factory.getArrayMatches = function(terminal, callback){
		var inserturl = serverUrl + '/matchprices/' + terminal + '?';
		$http({
			method: 'GET',
			url: inserturl,
			headers: { token: loginService.getToken() }
		}).success(function (data){
			var arrayMatches = [];
			var addMatch;
			data.data.forEach(function(price){
				if (price.matches != null && price.matches.length > 0){
					factory.getPriceById(price._id, function(priceComplete){
						if (data.status == 'OK'){
							price.matches[0].match.forEach(function(code){
								addMatch = {
									codigo: code,
									topPrices: priceComplete.data.topPrices
								};
								addMatch.topPrices.sort(function(a, b){
									return a.from > b.from;
								});
								arrayMatches.push(addMatch);
							});
						}
					});
				}
			});
			callback(arrayMatches);
		}).error(function(error){
			//dialogs.error('Error', 'Error al cargar la lista');
			console.log(error);
		});
	};

	factory.addMatchPrice = function (data, callback) {
		var inserturl = serverUrl + '/matchprice';
		$http({
			method: "POST",
			url: inserturl,
			data: JSON.stringify(data),
			headers:{"Content-Type":"application/json", token: loginService.getToken()}
		}).success(function (response) {
			callback(response);
		}).error(function(error) {
			//dialogs.error('Error', 'Error al añadir el Match en la base');
			callback(error);
		});
	};

	factory.noMatches = function (desde, hasta, callback){
		var flagFea = false;
		var inserturl = serverUrl + '/noMatches/' + loginService.getFiltro() + '?';
		if (desde && desde != null) {
			inserturl += 'fechaInicio=' + formatDate.formatearFecha(desde);
			flagFea = true;
		}
		if (hasta && hasta != null) {
			if (flagFea) inserturl += '&';

			inserturl += 'fechaFin=' + formatDate.formatearFecha(hasta);
		}
		$http({
			method: 'GET',
			url: inserturl,
			headers: { token: loginService.getToken() }
		}).success(function (data){
			callback(data);
		}).error(function(error){
			//dialogs.error('Error', 'Error al cargar la lista');
			callback(error);
		});
	};

	factory.addPrice = function (data, callback) {
		var inserturl = serverUrl + '/price';
		$http({
			method: 'POST',
			url: inserturl,
			data: data,
			headers:{ token: loginService.getToken() }
		}).success(function(response) {
			callback(response);
		}).error(function(error) {
			//dialogs.error('Error', 'Error al añadir el Precio en la base');
			callback(error);
		});
	};

	factory.getPriceById = function(id, callback){
		var inserturl = serverUrl + '/price/' + id + '/' + loginService.getFiltro();
		$http({
			method: 'GET',
			url: inserturl,
			headers:{ token: loginService.getToken() }
		}).success(function(response) {
			callback(response);
		}).error(function(error) {
			//dialogs.error('Error', 'Error al añadir el Precio en la base');
			callback(error);
		});
	};

	factory.savePriceChanges = function(formData, id, callback){
		formData.topPrices.forEach(function(unPrecio){
			unPrecio.from = formatDate.formatearFecha(unPrecio.from);
		});
		var inserturl = serverUrl + '/price/' + id;
		$http({
			method: 'PUT',
			url: inserturl,
			data: JSON.stringify(formData),
			headers:{"Content-Type":"application/json", token: loginService.getToken() }
		}).success(function(response) {
			callback(response);
		}).error(function(error) {
			//dialogs.error('Error', 'Error al añadir el Precio en la base');
			callback(error);
		});
	};

	factory.getUnitTypes = function(callback){
		var inserturl = serverUrl + '/unitTypes'; //ver direccion
		$http({
			method: 'GET',
			url: inserturl,
			headers:{ token: loginService.getToken() }
		}).success(function(response) {
			callback(response);
		}).error(function(errorText) {
			//dialogs.error('Error', 'Error al añadir el Precio en la base');
			console.log(errorText);
		});
	};

	factory.getUnitTypesArray = function(callback){
		var inserturl = serverUrl + '/unitTypes?type=array'; //ver direccion
		$http({
			method: 'GET',
			url: inserturl,
			headers:{ token: loginService.getToken() }
		}).success(function(response) {
			callback(response);
		}).error(function(errorText) {
			//dialogs.error('Error', 'Error al añadir el Precio en la base');
			console.log(errorText);
		});
	};

	factory.removePrice = function(id, callback){
		var inserturl = serverUrl + '/price/' + id;
		$http({
			method: 'DELETE',
			url: inserturl,
			headers:{ token: loginService.getToken() }
		}).success(function(response) {
			callback(response);
		}).error(function(error) {
			//dialogs.error('Error', 'Error al añadir el Precio en la base');
			callback(error);
		});
	};

	return factory;

});