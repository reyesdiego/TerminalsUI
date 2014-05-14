/**
 * Created by gutierrez-g on 18/02/14.
 */
myapp.factory('priceFactory', function($http, $dialogs, loginService){
	var factory = {};

	factory.getPrice = function(callback) {
		var inserturl = serverUrl + '/agp/prices';
		$http({
			method: 'GET',
			url: inserturl,
			headers: { token: loginService.getToken() }
		}).success(function (data){
			console.log(data);
			callback(data);
		}).error(function(errorText){
			console.log(errorText);
			$dialogs.error('Error al cargar la lista');
		});
	};

	factory.getMatchPrices = function(terminal, datos, callback) {
		var inserturl = serverUrl + '/agp/matchprices/' + terminal + '?';
		var insertAux = inserturl;
		if (datos && datos != null){
			if(angular.isDefined(datos.codigo) && datos.codigo != ''){
				inserturl = inserturl + 'code=' + datos.codigo;
			}
			if(angular.isDefined(datos.codigoAsociado) && datos.codigoAsociado != ''){
				if(inserturl != insertAux){ inserturl = inserturl + '&'}
				inserturl = inserturl + 'matchCode=' + datos.codigoAsociado;
			}
		}
		$http({
			method: 'GET',
			url: inserturl,
			headers: { token: loginService.getToken() }
		}).success(function (data){
				console.log(data);
				callback(data);
			}).error(function(errorText){
				console.log(errorText);
				$dialogs.error('Error al cargar la lista');
			});
	};

	factory.addMatchPrice = function (data, callback) {
		var inserturl = serverUrl + '/agp/matchprice';
		$http({
			method: "POST",
			url: inserturl,
			data: JSON.stringify(data),
			headers:{"Content-Type":"application/json", token: loginService.getToken()}
		}).success(function (response) {
			console.log("success");
			callback(response);
		}).error(function(errorText) {
			console.log(errorText);
			$dialogs.error('Error al añadir el Match en la base');
		});
	};

	factory.addPrice = function (data, callback) {
		var inserturl = serverUrl + '/agp/price';
		$http({
			method: 'POST',
			url: inserturl,
			data: data,
			headers:{ token: loginService.getToken() }
		}).success(function(response) {
			console.log("success");
			callback(response);
		}).error(function(errorText) {
			console.log(errorText);
			$dialogs.error('Error al añadir el Precio en la base');
		});
	};

	return factory;

});