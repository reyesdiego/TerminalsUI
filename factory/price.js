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
		}).error(function(errorText){
			errorFactory.raiseError(errorText, inserturl, 'errorDatos', 'Error al cargar el tarifario.');
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
		}).error(function(errorText){
			dialogs.error('Error', 'Error al cargar la lista');
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
		}).error(function(errorText) {
			dialogs.error('Error', 'Error al añadir el Match en la base');
		});
	};

	factory.noMatches = function (desde, hasta, callback){
		var inserturl = serverUrl + '/noMatches/' + loginService.getFiltro() + '?fechaInicio=' + formatDate.formatearFecha(desde) + '&fechaFin=' + formatDate.formatearFecha(hasta);
		$http({
			method: 'GET',
			url: inserturl,
			headers: { token: loginService.getToken() }
		}).success(function (data){
			callback(data);
		}).error(function(errorText){
			dialogs.error('Error', 'Error al cargar la lista');
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
		}).error(function(errorText) {
			dialogs.error('Error', 'Error al añadir el Precio en la base');
		});
	};

	return factory;

});