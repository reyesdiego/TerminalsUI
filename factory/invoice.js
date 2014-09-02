/**
 * Created by Diego Reyes on 3/19/14.
 */
myapp.factory('invoiceFactory', function($http, $rootScope, dialogs, loginService, formatDate){
	var factory = {};

	factory.getInvoice = function(datos, page, callback) {
		var inserturl = serverUrl + '/invoices/' + loginService.getFiltro() + '/' + page.skip + '/' + page.limit + '?'; // El que se va a usar
		inserturl = this.aplicarFiltros(inserturl, datos);
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
			console.log(data);
			callback(data);
		}).error(function(errorText) {
			console.log(errorText);
			dialogs.error('Error', 'Error al cargar la lista Invoice');
		});
	};

	factory.getSinTasaCargas = function(datos, terminal, page, callback){
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

	factory.getTarifasTerminal = function(callback){
		var inserturl = serverUrl + '/matches/' + loginService.getFiltro() + '?type=prices';
		$http({
			method: "GET",
			url: inserturl,
			headers:
			{token: loginService.getToken()}
		}).success(function (data){
			console.log(data);
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

	factory.getCorrelative = function(datos, callback){
		var inserturl = serverUrl + '/invoices/correlative/' + loginService.getFiltro() + '?';
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
		if (angular.isDefined(datos.nroPtoVenta) && datos.nroPtoVenta != ''){
			if(unaUrl != insertAux){ unaUrl = unaUrl + '&'}
			unaUrl = unaUrl + 'nroPtoVenta=' + datos.nroPtoVenta;
		}
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
		if(angular.isDefined(datos.order) && datos.order != ''){
			if(unaUrl != insertAux){ unaUrl = unaUrl + '&'}
			unaUrl = unaUrl + 'order=' + '[{' + datos.order + '}]';
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

	factory.getSellPoints = function(callback){
		var inserturl = serverUrl + '/invoices/sellPoints/' + loginService.getFiltro();
		console.log(inserturl);
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

	factory.cambiarEstado = function(invoiceId, estado, callback){
		var inserturl = serverUrl + '/invoice/' + invoiceId;
		console.log(inserturl);
		$http({
			method: 'PUT',
			url: inserturl,
			dataBody: { 'estado': estado},
			headers: { token: loginService.getToken() }
		}).success(function (data){
			callback(data);
		}).error(function(errorText){
			dialogs.error('Error', 'Error al actualizar el estado del comprobante');
		});
	};

	return factory;

});