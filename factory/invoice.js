/**
 * Created by Diego Reyes on 3/19/14.
 */
myapp.factory('invoiceFactory', function($http, $dialogs, loginService, formatDate){
	var factory = {};

	factory.getInvoice = function(datos, page, callback) {
		var inserturl = serverUrl + '/invoices/' + page.skip + '/' + page.limit + '?'; // El que se va a usar
		var insertAux = inserturl;
		if(angular.isDefined(datos.codigo)){
			if(inserturl != insertAux){ inserturl = inserturl + '&'}
			inserturl = inserturl + 'codigo=' + datos.codigo;
		}
		if(angular.isDefined(datos.codigoAsociado)){
			if(inserturl != insertAux){ inserturl = inserturl + '&'}
			inserturl = inserturl + 'codigoAsociado=' + datos.codigoAsociado;
		}
		if(angular.isDefined(datos.contenedor)){
			if(inserturl != insertAux){ inserturl = inserturl + '&'}
			inserturl = inserturl + 'contenedor=' + datos.contenedor;
		}
		if(angular.isDefined(datos.nroComprobante)){
			if(inserturl != insertAux){ inserturl = inserturl + '&'}
			inserturl = inserturl + 'nroComprobante=' + datos.nroComprobante;
		}
		if(angular.isDefined(datos.razonSocial)){
			if(inserturl != insertAux){ inserturl = inserturl + '&'}
			inserturl = inserturl + 'razonSocial=' + datos.razonSocial;
		}
		if(angular.isDefined(datos.documentoCliente)){
			if(inserturl != insertAux){ inserturl = inserturl + '&'}
			inserturl = inserturl + 'documentoCliente=' + datos.documentoCliente;
		}
		if(angular.isDefined(datos.fecha) && datos.fecha != null){
			if(inserturl != insertAux){ inserturl = inserturl + '&'}
			inserturl = inserturl + 'fechaInicio=' + formatDate.formatearFecha(datos.fecha);
			var fechaFin = new Date(datos.fecha);
			fechaFin.setDate(fechaFin.getDate() + 1);
			inserturl = inserturl + '&fechaFin=' + formatDate.formatearFecha(fechaFin);
		}
		$http({
			method: 'GET',
			url: inserturl,
			headers:
			{token: loginService.getToken()}
		}).success(function(data) {
			console.log(data);
			callback(data);
		}).error(function(errorText) {
			console.log(errorText);
			$dialogs.error('Error al cargar la lista Invoice');
		});
	};

	factory.getByDate = function(desde, hasta, terminal, callback) {
		//Por ahora trabaja solo con un mock
		$http.get('mocks/correlativo.json')
			.success(function (data){
				callback(data);
			}).error(function(errorText){
				console.log(errorText);
				$dialogs.error("Error al cargar la lista PriceList");
			});
	};

	factory.getSinTasaCargas = function(desde, hasta, terminal, callback){
		$http.get('mocks/correlativo.json')
			.success(function (data){
				callback(data);
			}).error(function(errorText){
				console.log(errorText);
				$dialogs.error("Error al cargar la lista PriceList");
			});
	};

	return factory;

});