/**
 * Created by Diego Reyes on 3/19/14.
 */
myapp.factory('invoiceFactory', function($http, $rootScope, dialogs, loginService, formatDate){
	var factory = {};

	factory.getInvoice = function(datos, page, callback) {
		var inserturl = serverUrl + '/invoices/' + loginService.getFiltro() + '/' + page.skip + '/' + page.limit + '?'; // El que se va a usar
		inserturl = this.aplicarFiltros(inserturl, datos);
		console.log(inserturl);
		$http({
			method: 'GET',
			url: inserturl,
			headers:
			{token: loginService.getToken()}
		}).success(function(data){
			callback(factory.ponerDescripcionComprobantes(data));
		}).error(function(errorText){
			console.log(errorText);
			dialogs.error('Error', 'Error al cargar la lista Invoice');
		});
	};

	factory.getDescriptionItem = function(callback){
		var inserturl = serverUrl + '/matches/' + loginService.getFiltro();
		$http({
			method: 'GET',
			url: inserturl,
			headers:
			{token: loginService.getToken()}
		}).success(function(data) {
			callback(data);
		}).error(function(errorText) {
			console.log(errorText);
			dialogs.error('Error', 'Error al cargar la lista Invoice');
		});
	};

	factory.getByDate = function(desde, hasta, terminal, tipoComprobante, callback) {
//		var inserturl = serverUrl + '/invoices/' + loginService.getFiltro() + '/' + page.skip + '/' + page.limit + '?'; // El que se va a usar
		var inserturl = serverUrl + '/invoices/' + loginService.getFiltro() + '/' + '0' + '/' + '10' + '?';

		$http({
			method: 'GET',
			url: inserturl + 'codTipoComprob=' + tipoComprobante,
			headers:
			{token: loginService.getToken()}
		}).success(function (data){
				callback(factory.ponerDescripcionComprobantes(data));
			}).error(function(errorText){
				console.log(errorText);
				dialogs.error('Error', 'Error al cargar la lista de comprobantes');
			});
	};

	factory.getSinTasaCargas = function(datos, desde, hasta, terminal, page, callback){
		var inserturl = serverUrl + '/invoices/noRates/' + terminal + '/' + page.skip + '/' + page.limit + '?';
		inserturl = this.aplicarFiltros(inserturl, datos);
		$http({
			method: "GET",
			url: inserturl,
			headers:
			{token: loginService.getToken()}
		}).success(function (data){
				callback(factory.ponerDescripcionComprobantes(data));
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

	factory.getTarifasTerminal = function(terminal, callback){
		//var inserturl = serverUrl + '/invoices/algo/' + terminal;
		$http.get('mocks/tarifasTerminal.json')
			.success(function(data){
				callback(data);
			}).error(function(errorText){
				console.log(errorText);
				dialogs.error('Error', 'Error al traer los datos de las tarifas');
			});
	};

	factory.getInvoicesNoMatches = function(datos, page, callback){
		var inserturl = serverUrl + '/invoices/noMatches/' + loginService.getFiltro() + '/' + page.skip + '/' + page.limit + '?';
		inserturl = this.aplicarFiltros(inserturl, datos);
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
				dialogs.error('Error', 'Error en la carga de comprobantes sin códigos asociados.');
			}
		});
	};

	factory.invoiceById = function(id, callback){
		var inserturl = serverUrl + '/invoice/' + id;
		$http({
			method: "GET",
			url: inserturl,
			headers:
			{token: loginService.getToken()}
		}).success(function (data){
			callback(factory.ponerDescripcionComprobante(data.data));
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

	factory.aplicarFiltros = function(unaUrl, datos){
		var insertAux = unaUrl;
		if(angular.isDefined(datos.contenedor) && datos.contenedor != ''){
			if(unaUrl != insertAux){ unaUrl = unaUrl + '&'}
			unaUrl = unaUrl + 'contenedor=' + datos.contenedor.toUpperCase();
		}
		if(angular.isDefined(datos.nroComprobante) && datos.nroComprobante != ''){
			if(unaUrl != insertAux){ unaUrl = unaUrl + '&'}
			unaUrl = unaUrl + 'nroComprobante=' + datos.nroComprobante;
		}
		if(angular.isDefined(datos.codTipoComprob) && datos.codTipoComprob != ''){
			if(unaUrl != insertAux){ unaUrl = unaUrl + '&'}
			unaUrl = unaUrl + 'codTipoComprob=' + datos.codTipoComprob;
		}
		if(angular.isDefined(datos.razonSocial) && datos.razonSocial != ''){
			if(unaUrl != insertAux){ unaUrl = unaUrl + '&'}
			unaUrl = unaUrl + 'razonSocial=' + datos.razonSocial.toUpperCase();
		}
		if(angular.isDefined(datos.documentoCliente) && datos.documentoCliente != ''){
			if(unaUrl != insertAux){ unaUrl = unaUrl + '&'}
			unaUrl = unaUrl + 'documentoCliente=' + datos.documentoCliente;
		}
		if(angular.isDefined(datos.fechaDesde) && datos.fechaDesde != null && datos.fechaDesde != ''){
			if(unaUrl != insertAux){ unaUrl = unaUrl + '&'}
			unaUrl = unaUrl + 'fechaInicio=' + formatDate.formatearFecha(datos.fechaDesde);
		}
		if(angular.isDefined(datos.fechaHasta) && datos.fechaHasta != null && datos.fechaHasta != ''){
			if(unaUrl != insertAux){ unaUrl = unaUrl + '&'}
			unaUrl = unaUrl + 'fechaFin=' + formatDate.formatearFecha(datos.fechaHasta);
		}
		if(angular.isDefined(datos.codigo) && datos.codigo != ''){
			if(unaUrl != insertAux){ unaUrl = unaUrl + '&'}
			unaUrl = unaUrl + 'code=' + datos.codigo;
		}
		return unaUrl;
	};

	factory.ponerDescripcionComprobante = function(comprobante){
		comprobante.detalle.forEach(function(detalles){
			detalles.items.forEach(function(item){
				if (angular.isDefined($rootScope.itemsDescriptionInvoices[item.id])){
					item.descripcion = $rootScope.itemsDescriptionInvoices[item.id];
				} else {
					item.descripcion = "No se halló la descripción, verifique que el código esté asociado";
				}
			})
		});
		return comprobante;
	};

	factory.ponerDescripcionComprobantes = function(data){
		data.data.forEach(function(factura){
			factory.ponerDescripcionComprobante(factura);
		});
		return data;
	};

	return factory;

});