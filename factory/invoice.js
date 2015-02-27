/**
 * Created by Diego Reyes on 3/19/14.
 */
myapp.factory('invoiceFactory', function($http, $rootScope, dialogs, loginService, formatDate, errorFactory){
	var factory = {};

	factory.getInvoice = function(datos, page, callback) {
		var inserturl = serverUrl + '/invoices/' + loginService.getFiltro() + '/' + page.skip + '/' + page.limit + '?'; // El que se va a usar
		inserturl = this.aplicarFiltros(inserturl, datos);
		$http.get(inserturl)
			.success(function(data){
				data = factory.ponerDescripcionComprobantes(data);
				callback(factory.setearInterfaz(data));
			}).error(function(error) {
				callback(error);
			});
	};

	factory.getDescriptionItem = function(callback){
		var inserturl = serverUrl + '/matches/' + loginService.getFiltro();
		$http.get(inserturl)
			.success(function(data) {
				callback(data);
			}).error(function(errorText) {
				console.log(errorText);
		});
	};

	factory.getSinTasaCargas = function(datos, terminal, page, callback){
		var inserturl = serverUrl + '/invoices/noRates/' + terminal + '/' + page.skip + '/' + page.limit + '?';
		inserturl = this.aplicarFiltros(inserturl, datos);
		$http.get(inserturl)
			.success(function (data){
				data = factory.ponerDescripcionComprobantes(data);
				callback(factory.setearInterfaz(data));
			}).error(function(errorText){
				errorFactory.raiseError(errorText, inserturl, 'errorSinTasaCargas', 'Error al cargar la lista de comprobantes sin tasa a las cargas.');
			});
	};

	factory.getTarifasTerminal = function(callback){
		var inserturl = serverUrl + '/matches/' + loginService.getFiltro() + '?type=prices';
		$http.get(inserturl)
			.success(function (data){
				callback(data);
			}).error(function(errorText){
				errorFactory.raiseError(errorText, inserturl, 'errorDatos', 'Error al cargar las tarifas asociadas de la terminal.');
			});
	};

	factory.getInvoicesNoMatches = function(datos, page, callback){
		var inserturl = serverUrl + '/invoices/noMatches/' + loginService.getFiltro() + '/' + page.skip + '/' + page.limit + '?';
		inserturl = this.aplicarFiltros(inserturl, datos);
		$http.get(inserturl)
			.success(function (data) {
				if (data.data == null) data.data = [];

				data = factory.ponerDescripcionComprobantes(data);
				callback(factory.setearInterfaz(data));

			}).error(function(errorText) {
				//errorFactory.raiseError(errorText, inserturl, 'errorDatos', 'Error al cargar los códigos no asociados por la terminal.');
				callback(errorText);
			});
	};

	factory.getCorrelative = function(datos, socketIoRegister, callback){
		var inserturl = serverUrl + '/invoices/correlative/' + loginService.getFiltro() + '?';
		inserturl = this.aplicarFiltros(inserturl, datos);
		inserturl += '&x='+socketIoRegister;
		$http.get(inserturl)
			.success(function (data) {
				callback(data);
			}).error(function(error) {
				callback(error);
			});
	};

	factory.getCashbox = function(datos, callback){
		var inserturl = serverUrl + '/invoices/cashbox/' + loginService.getFiltro() + '?';
		inserturl = this.aplicarFiltros(inserturl, datos);
		$http.get(inserturl)
			.success(function(data){
				data.data.sort(function(a,b){
					return a - b;
				});
				callback(data);
			}).error(function(error){
				callback(error);
			});
	};

	factory.getShipTrips = function(callback){
		var inserturl = serverUrl + '/invoices/' + loginService.getFiltro() + '/shipTrips';
		$http.get(inserturl)
			.success(function(data){
				callback(data);
			}).error(function(errorText){
				console.log(errorText);
			});
	};

	factory.getShipContainers = function(datos, callback){
		var inserturl = serverUrl + '/invoices/' + loginService.getFiltro() + '/shipContainers?';
		inserturl = this.aplicarFiltros(inserturl, datos);
		$http.get(inserturl)
			.success(function(data){
				callback(data);
			}).error(function(errorText){
				errorFactory.raiseError(errorText, inserturl, 'errorDatos', 'Error al traer los contenedores para el buque y el viaje seleccionado.');
			});
	};

	factory.invoiceById = function(id, callback){
		var inserturl = serverUrl + '/invoice/' + id;
		$http.get(inserturl)
			.success(function (data){
				data.data = factory.setearInterfazComprobante(data.data);
				data.data.transferencia = formatDate.formatearFechaHorasMinutosSinGMT(idToDate(data.data._id));
				callback(factory.ponerDescripcionComprobante(data.data));
			}).error(function(error){
				errorFactory.raiseError(error, inserturl, 'errorDatos', 'Error al cargar el comprobante ' + id);
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
		if(angular.isDefined(datos.viaje) && datos.viaje != ''){
			if(unaUrl != insertAux){ unaUrl = unaUrl + '&'}
			unaUrl = unaUrl + 'viaje=' + datos.viaje;
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
		$http({
			method: 'PUT',
			url: inserturl,
			data: { estado: estado },
			headers: {"token": loginService.getToken() }
		}).success(function (data){
			callback(data);
		}).error(function(errorText){
			errorFactory.raiseError(errorText, inserturl, 'errorTrack', 'Error al cambiar el estado para el comprobante ' + invoiceId);
		});
	};

	factory.commentInvoice = function(data, callback){
		var inserturl = serverUrl + '/comment';
		$http({
			method: 'POST',
			url: inserturl,
			data: data,
			headers:{token: loginService.getToken()}
		}).success(function (data){
			callback(data);
		}).error(function(errorText){
			errorFactory.raiseError(errorText, inserturl, 'errorTrack', 'Error al añadir comentario al comprobante.');
		});
	};

	factory.getTrackInvoice = function(invoiceId, callback){
		var inserturl = serverUrl + '/invoice/' + invoiceId + '/comments';
		$http({
			method: 'GET',
			url: inserturl,
			cache: false
		}).success(function (data){
			data.data = factory.filtrarComentarios(data.data);
			data.data.forEach(function(comment){
				comment.fecha = formatDate.formatearFechaHorasMinutosSinGMT(idToDate(comment._id));
			});
			callback(data);
		}).error(function(error){
			//errorFactory.raiseError(errorText, inserturl, 'errorDatos', 'Error al obtener los comentarios del comprobante ' + invoiceId);
			callback(error);
		});
	};

	factory.setearInterfaz = function(comprobantes){
		comprobantes.data.forEach(function(comprobante) {
			factory.setearInterfazComprobante(comprobante);
		});
		return comprobantes;
	};

	factory.setearInterfazComprobante = function(comprobante){
		var estadoDefault = {
			'grupo': loginService.getGroup(),
			'estado': 'Y'
		};
		if (comprobante.estado.length > 0){
			var encontrado = false;
			comprobante.estado.forEach(function(estadoGrupo){
				if (estadoGrupo.grupo == loginService.getGroup() || estadoGrupo.grupo === 'ALL'){
					encontrado = true;
					comprobante.interfazEstado = $rootScope.estadosComprobantesArray[estadoGrupo.estado];
					switch (comprobante.interfazEstado.type){
						case 'WARN':
							comprobante.interfazEstado.btnEstado = 'text-warning';
							comprobante.interfazEstado.imagen = 'images/warn.png';
							break;
						case 'OK':
							comprobante.interfazEstado.btnEstado = 'text-success';
							comprobante.interfazEstado.imagen = 'images/ok.png';
							break;
						case 'ERROR':
							comprobante.interfazEstado.btnEstado = 'text-danger';
							comprobante.interfazEstado.imagen = 'images/error.png';
							break;
						case 'UNKNOWN':
							comprobante.interfazEstado.btnEstado = 'text-info';
							comprobante.interfazEstado.imagen = 'images/unknown.png';
							break;
						default :
							comprobante.estado.push(estadoDefault);
							comprobante.interfazEstado.btnEstado = 'text-info';
							comprobante.interfazEstado.imagen = 'images/unknown.png';
							break;
					}
				}
			});
			if (!encontrado){
				comprobante.estado.push(estadoDefault);
				comprobante.interfazEstado = {
					'name': 'Sin ver',
					'description': 'Sin ver',
					'btnEstado': 'text-info',
					'imagen': 'images/unknown.png'
				};
			}
		} else {
			comprobante.estado.push(estadoDefault);
			comprobante.interfazEstado = {
				'name': 'Sin ver',
				'description': 'Sin ver',
				'btnEstado': 'text-info',
				'imagen': 'images/unknown.png'
			};
		}
		return comprobante;
	};

	factory.filtrarComentarios = function(dataComentarios){
		var comentariosFiltrados = [];
		dataComentarios.forEach(function(comentario){
			if (comentario.group == loginService.getGroup() || comentario.group === 'ALL'){
				comentariosFiltrados.push(comentario);
			}
		});
		return comentariosFiltrados;
	};

	return factory;

});