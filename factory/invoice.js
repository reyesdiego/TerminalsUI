/**
 * Created by Diego Reyes on 3/19/14.
 */
myapp.factory('invoiceFactory', function($http, $rootScope, dialogs, loginService, formatDate){
	var factory = {};

	factory.getInvoice = function(datos, page, callback) {
		var inserturl = serverUrl + '/invoices/' + page.skip + '/' + page.limit + '?'; // El que se va a usar
		var insertAux = inserturl;
		if(angular.isDefined(datos.contenedor) && datos.contenedor != ''){
			if(inserturl != insertAux){ inserturl = inserturl + '&'}
			inserturl = inserturl + 'contenedor=' + datos.contenedor.toUpperCase();
		}
		if(angular.isDefined(datos.nroComprobante) && datos.nroComprobante != ''){
			if(inserturl != insertAux){ inserturl = inserturl + '&'}
			inserturl = inserturl + 'nroComprobante=' + datos.nroComprobante;
		}
		if(angular.isDefined(datos.razonSocial) && datos.razonSocial != ''){
			if(inserturl != insertAux){ inserturl = inserturl + '&'}
			inserturl = inserturl + 'razonSocial=' + datos.razonSocial.toUpperCase();
		}
		if(angular.isDefined(datos.documentoCliente) && datos.documentoCliente != ''){
			if(inserturl != insertAux){ inserturl = inserturl + '&'}
			inserturl = inserturl + 'documentoCliente=' + datos.documentoCliente;
		}
		if(angular.isDefined(datos.fecha) && datos.fecha != null && datos.fecha != ''){
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
			// Se carga el array de la descripcion de los items de las facturas
			factory.getDescriptionItem(function(data){
				itemsDescriptionInvoices = data.data;
			});
			data.data.forEach(function(factura){
				factura.detalle.forEach(function(detalles){
					detalles.items.forEach(function(item){
						if (angular.isDefined(itemsDescriptionInvoices[item.id])){
							item.descripcion = itemsDescriptionInvoices[item.id];
						}
						else{
							item.descripcion = "No se halló la descripción, verifique que el código esté asociado";
						}
					})
				})
			});
			callback(data);
		}).error(function(errorText) {
			console.log(errorText);
			dialogs.error('Error', 'Error al cargar la lista Invoice');
		});
	};

	factory.getDescriptionItem = function(callback){
		var inserturl = serverUrl + '/agp/matches/' + $rootScope.terminal.terminal;
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
			dialogs.error('Error', 'Error al cargar la lista Invoice');
		});
	};

	factory.getByDate = function(desde, hasta, terminal, tipoComprobante, callback) {
		//Por ahora trabaja solo con un mock
		var unaUrl;
		switch (tipoComprobante){
			case "0":
				unaUrl = 'mocks/facturasA.json';
				break;
			case "5":
				unaUrl = 'mocks/facturasB.json';
				break;
			case "10":
				unaUrl = 'mocks/facturasC.json';
				break;
			default:
				unaUrl = 'mocks/facturasC.json';
				break;
		}

		$http.get(unaUrl)
			.success(function (data){
				callback(data);
			}).error(function(errorText){
				console.log(errorText);
				dialogs.error('Error', 'Error al cargar la lista de comprobantes');
			});
	};

	factory.getSinTasaCargas = function(desde, hasta, terminal, page, callback){
		var inserturl = serverUrl + '/invoices/noRates/' + terminal + '/' + page.skip + '/' + page.limit;
		$http({
			method: "GET",
			url: inserturl,
			headers:
			{token: loginService.getToken()}
		}).success(function (data){
				callback(data);
			}).error(function(errorText){
				console.log(errorText);
				if (errorText.status === 'ERROR'){
					callback(errorText);
					//dialogs.error('Error', errorText.data);
				} else {
					dialogs.error('Error', 'Error en la carga de Tasa a las Cargas.');

				}
			});
	};

	return factory;

});