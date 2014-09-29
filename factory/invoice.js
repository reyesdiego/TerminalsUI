/**
 * Created by Diego Reyes on 3/19/14.
 */
myapp.factory('invoiceFactory', function($http, $rootScope, dialogs, loginService, formatDate, $templateCache){
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
			data = factory.ponerDescripcionComprobantes(data);
			callback(factory.setearInterfaz(data));
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

	factory.getSinTasaCargas = function(datos, terminal, page, callback){
		var inserturl = serverUrl + '/invoices/noRates/' + terminal + '/' + page.skip + '/' + page.limit + '?';
		inserturl = this.aplicarFiltros(inserturl, datos);
		$http({
			method: "GET",
			url: inserturl,
			headers:
			{token: loginService.getToken()}
		}).success(function (data){
				data = factory.ponerDescripcionComprobantes(data)
				callback(factory.setearInterfaz(data));
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

	factory.getCashbox = function(datos, callback){
		var inserturl = serverUrl + '/invoices/cashbox/' + loginService.getFiltro() + '?';
		inserturl = this.aplicarFiltros(inserturl, datos);
		$http({
			method: 'GET',
			url: inserturl,
			headers:
			{token: loginService.getToken()}
		}).success(function(data){
			data.data.sort(function(a,b){
				return a - b;
			});
			callback(data);
		}).error(function(errorText){
			console.log(errorText);
			dialogs.error('Error', 'Error al cargar los distintos puntos de venta');
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
			data.data = factory.setearInterfazComprobante(data.data);
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
		if(angular.isDefined(datos.buque) && datos.buque != ''){
			if(unaUrl != insertAux){ unaUrl = unaUrl + '&'}
			unaUrl = unaUrl + 'buqueNombre=' + datos.buque;
		}
		if(angular.isDefined(datos.estado) && datos.estado != '' && datos.estado != 'N'){
			if(unaUrl != insertAux){ unaUrl = unaUrl + '&'}
			unaUrl = unaUrl + 'estado=' + datos.estado;
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
			});
		});
		return comprobante;
	};

	factory.ponerDescripcionComprobantes = function(data){
		data.data.forEach(function(factura){
			factory.ponerDescripcionComprobante(factura);
		});
		return data;
	};

	factory.cambiarEstado = function(invoiceId, estado, callback){
		var inserturl = serverUrl + '/invoice/setState/' + loginService.getFiltro() + '/' + invoiceId;
		//var inserturl = serverUrl + '/invoice/' + invoiceId;
		$http({
			method: 'PUT',
			url: inserturl,
			data: { estado: estado },
			headers: {"Content-Type":"application/x-www-form-urlencoded; charset=utf-8", "token": loginService.getToken() }
		}).success(function (data){
			callback(data);
		}).error(function(errorText){
			dialogs.error('Error', 'Error al actualizar el estado del comprobante');
		});
	};

	factory.commentInvoice = function(data, callback){
		var inserturl = serverUrl + '/comment';
		console.log(data);
		$http({
			method: 'POST',
			url: inserturl,
			data: JSON.stringify(data),
			headers:{"Content-Type":"application/json", token: loginService.getToken()}
		}).success(function (data){
			callback(data);
		}).error(function(errorText){
			dialogs.error('Error', 'Error al añadir comentario sobre el comprobante');
		});
	};

	factory.getTrackInvoice = function(invoiceId, callback){
		var inserturl = serverUrl + '/invoice/' + invoiceId + '/comments';
		$http({
			method: 'GET',
			url: inserturl,
			cache: false,
			headers:{ token: loginService.getToken()}
		}).success(function (data){
			data.data = factory.filtrarComentarios(data.data);
			data.data.forEach(function(comment){
				comment.fecha = formatDate.formatearFechaHorasMinutosSinGMT(idToDate(comment._id));
			});
			callback(data);
		}).error(function(errorText){
			dialogs.error('Error', 'Error al obtener comentarios sobre el comprobante');
		});
	};

	factory.setearInterfaz = function(comprobantes){
		comprobantes.data.forEach(function(comprobante) {
			factory.setearInterfazComprobante(comprobante);
		});
		return comprobantes;
	};

	factory.setearInterfazComprobante = function(comprobante){
		if (comprobante.estado.length > 0){
			var encontrado = false;
			comprobante.estado.forEach(function(estadoGrupo){
				if (estadoGrupo.grupo == loginService.getGroup()){
					encontrado = true;
					switch (estadoGrupo.estado){
						case 'Y':
							comprobante.interfazEstado = {
								'estado': 'Revisar',
								'btnEstado': 'btn-warning'
							};
							break;
						case 'G':
							comprobante.interfazEstado = {
								'estado': 'Controlado',
								'btnEstado': 'btn-success'
							};
							break;
						case 'R':
							comprobante.interfazEstado = {
								'estado': 'Error',
								'btnEstado': 'btn-danger'
							};
							break;
						default :
							var estadoDefault = {
								'grupo': loginService.getGroup(),
								'estado': 'Y'
							};
							comprobante.estado.push(estadoDefault);
							comprobante.interfazEstado = {
								'estado': 'Revisar',
								'btnEstado': 'btn-warning'
							};
							break;
					}
				}
			});
			if (!encontrado){
				var estadoDefault = {
					'grupo': loginService.getGroup(),
					'estado': 'Y'
				};
				comprobante.estado.push(estadoDefault);
				comprobante.interfazEstado = {
					'estado': 'Revisar',
					'btnEstado': 'btn-warning'
				};
			}
		} else {
			var estadoDefault = {
				'grupo': loginService.getGroup(),
				'estado': 'Y'
			};
			comprobante.estado.push(estadoDefault);
			comprobante.interfazEstado = {
				'estado': 'Revisar',
				'btnEstado': 'btn-warning'
			};
		}
		return comprobante;
	};

	factory.filtrarComentarios = function(dataComentarios){
		var comentariosFiltrados = [];
		dataComentarios.forEach(function(comentario){
			if (comentario.group == loginService.getGroup()){
				comentariosFiltrados.push(comentario);
			}
		});
		return comentariosFiltrados;
	};

	return factory;

});