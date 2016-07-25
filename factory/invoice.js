/**
 * Created by Diego Reyes on 3/19/14.
 */
myapp.factory('invoiceFactory', ['$http', 'loginService', 'formatService', 'errorFactory', 'estadosArrayCache', 'generalCache', 'generalFunctions', '$q', 'HTTPCanceler',
	function($http, loginService, formatService, errorFactory, estadosArrayCache, generalCache, generalFunctions, $q, HTTPCanceler){
		var factory = {};
		var namespace = 'invoices';

		factory.getInvoice = function(idLlamada, datos, page, callback) {
			factory.cancelRequest(idLlamada);
			var defer = $q.defer();
			var canceler = HTTPCanceler.get(defer, namespace, idLlamada);
			var inserturl = serverUrl + '/invoices/' + loginService.getFiltro() + '/' + page.skip + '/' + page.limit;
			$http.get(inserturl, { params: formatService.formatearDatos(datos), timeout: canceler.promise })
				.then(function(response){
					if (response.statusText == 'OK'){
						var data = ponerDescripcionComprobantes(response.data);
						callback(factory.setearInterfaz(data));
					}
				}, function(response) {
					if (response.status != -5) callback(response.data);
				});
		};

		//Se pasa la terminal al ser de caché
		factory.getDescriptionItem = function(terminal, callback){
			var inserturl = serverUrl + '/matchPrices/matches/' + terminal;
			$http.get(inserturl)
				.then(function(response) {
					callback(response.data);
				}, function(response) {
					if (response.data == null) response.data = {status: 'ERROR'};
					callback(response.data);
				});
		};

		factory.getContainersSinTasaCargas = function(datos, callback) {
			factory.cancelRequest('containersSinTasaCargas');
			var defer = $q.defer();
			var canceler = HTTPCanceler.get(defer, namespace, 'containersSinTasaCargas');
			var inserturl = serverUrl + '/invoices/containersNoRates/' + loginService.getFiltro();
			$http.get(inserturl, { params: formatService.formatearDatos(datos), timeout: canceler.promise })
				.then(function(response) {
					callback(response.data);
				}, function(response) {
					if (response.data == null) response.data = { status: 'ERROR'};
					if (response.status != -5) callback(response.data)
				});
		};

		//Comprobantes con códigos faltantes
		factory.getInvoicesNoMatches = function(datos, page, callback){
			factory.cancelRequest('invoicesNoMatches');
			var defer = $q.defer();
			var canceler = HTTPCanceler.get(defer, namespace, 'invoicesNoMatches');
			var inserturl = serverUrl + '/invoices/noMatches/' + loginService.getFiltro() + '/' + page.skip + '/' + page.limit;
			$http.get(inserturl, { params: formatService.formatearDatos(datos), timeout: canceler.promise })
				.then(function (response) {
					if (response.data == null) {
						response.data = {
							status: 'ERROR',
							data: []
						}
					}
					if (response.data.data == null) response.data.data = [];

					response.data = ponerDescripcionComprobantes(response.data);
					callback(factory.setearInterfaz(response.data));

				}, function(response) {
					if (response.status != -5) callback(response.data);
				});
		};

		factory.getCorrelative = function(datos, socketIoRegister, callback){
			factory.cancelRequest('correlative');
			var defer = $q.defer();
			var canceler = HTTPCanceler.get(defer, namespace, 'correlative');
			var inserturl = serverUrl + '/invoices/correlative/' + loginService.getFiltro();
			var param = formatService.formatearDatos(datos);
			param.x = socketIoRegister;
			$http.get(inserturl, { params: param, timeout: canceler.promise })
				.then(function (response) {
					callback(response.data);
				}, function(response) {
					if (response.status != -5) callback(response.data);
				});
		};

		factory.getCashbox = function(idLlamada, datos, callback){
			factory.cancelRequest(idLlamada);
			var defer = $q.defer();
			var canceler = HTTPCanceler.get(defer, namespace, idLlamada);
			var inserturl = serverUrl + '/invoices/cashbox/' + loginService.getFiltro();
			$http.get(inserturl, { params: formatService.formatearDatos(datos), timeout: canceler.promise })
				.then(function(response){
					if (response.data == null){
						response.data = {
							status: 'ERROR',
							data: []
						}
					}
					response.data.data.sort(function(a,b){
						return a - b;
					});
					callback(response.data);
				}, function(response){
					if (response.status != -5) callback(response.data);
				});
		};

		//Al ser un método de caché se le pasa la terminal
		factory.getShipTrips = function(terminal, callback){
			var inserturl = serverUrl + '/invoices/' + terminal + '/shipTrips';
			$http.get(inserturl)
				.then(function(response){
					callback(response.data);
				}, function(response){
					if(response.data == null) response.data = {status: 'ERROR'};
					callback(response.data);
				});
		};

		factory.getShipContainers = function(datos, callback){
			factory.cancelRequest('shipContainers');
			var defer = $q.defer();
			var canceler = HTTPCanceler.get(defer, namespace, 'shipContainers');
			var inserturl = serverUrl + '/invoices/' + loginService.getFiltro() + '/shipContainers';
			$http.get(inserturl, { params: formatService.formatearDatos(datos), timeout: canceler.promise })
				.then(function(response){
					callback(response.data);
				}, function(response){
					//errorFactory.raiseError(errorText, inserturl, 'errorDatos', 'Error al traer los contenedores para el buque y el viaje seleccionado.');
					if (response.status != -5) callback(response.data);
				});
		};

		factory.getInvoiceById = function(id, callback){
			var inserturl = serverUrl + '/invoices/invoice/' + id;
			$http.get(inserturl)
				.then(function (response){
					response.data.data = setearInterfazComprobante(response.data.data);
					response.data.data.transferencia = formatService.formatearFechaISOString(response.data.data.registrado_en);
					callback(ponerUnidadDeMedida(ponerDescripcionComprobante(response.data.data)));
				}, function(response){
					errorFactory.raiseError(response.data, inserturl, 'errorDatos', 'Error al cargar el comprobante ' + id);
				});
		};

		factory.putCambiarEstado = function(invoiceId, estado, callback){
			var inserturl = serverUrl + '/invoices/setState/' + loginService.getFiltro() + '/' + invoiceId;
			$http({
				method: 'PUT',
				url: inserturl,
				data: { estado: estado },
				headers: {token: loginService.getToken() }
			}).then(function (response){
				callback(response.data, 'OK');
			}, function(response){
				callback(response.data, 'ERROR');
				//errorFactory.raiseError(errorText, inserturl, 'errorTrack', 'Error al cambiar el estado para el comprobante ' + invoiceId);
			});
		};

		factory.postCommentInvoice = function(data, callback){
			var inserturl = serverUrl + '/comments/comment';
			$http.post(inserturl, data)
				.then(function (response){
					callback(response.data);
				}, function(response){
					errorFactory.raiseError(response.data, inserturl, 'errorTrack', 'Error al añadir comentario al comprobante.');
				});
		};

		factory.getTrackInvoice = function(invoiceId, callback){
			var inserturl = serverUrl + '/comments/' + invoiceId;
			$http.get(inserturl)
				.then(function (response){
					response.data.data = filtrarComentarios(response.data.data);
					response.data.data.forEach(function(comment){
						comment.fecha = formatService.formatearFechaISOString(comment.registrado_en);
					});
					callback(response.data);
				}, function(response){
					callback(response.data);
				});
		};

		factory.setResendInvoice = function(resend, id, callback){
			var inserturl = serverUrl + '/invoices/invoice/' + loginService.getFiltro() + '/' + id;
			$http.put(inserturl, resend)
				.then(function(response){
					callback(response.data);
				}, function(response){
					callback(response.data)
				});
		};

		factory.getRatesInvoices = function(datos, callback){
			factory.cancelRequest('ratesInvoices');
			var defer = $q.defer();
			var canceler = HTTPCanceler.get(defer, namespace, 'ratesInvoices');
			var inserturl = serverUrl + '/invoices/rates';
			$http.get(inserturl, { params: formatService.formatearDatos(datos), timeout: canceler.promise })
				.then(function(response){
					callback(response.data);
				}, function(response){
					if (response.status != -5) callback(response.data)
				});
		};

		factory.getDetailRates = function(datos, callback){
			factory.cancelRequest('ratesDetail');
			var defer = $q.defer();
			var canceler = HTTPCanceler.get(defer, namespace, 'ratesDetail');
			var inserturl = serverUrl + '/invoices/rates/' + datos.tipo;
			$http.get(inserturl, { params: formatService.formatearDatos(datos), timeout: canceler.promise })
				.then(function(response){
					callback(response.data);
				}, function(response){
					if (response.status != -5) callback(response.data)
				});
		};

		factory.getCSV = function(datos, callback){
			var inserturl = serverUrl + '/invoices/' + loginService.getFiltro() + '/down';
			$http.get(inserturl, { params: formatService.formatearDatos(datos)})
				.then(function(response) {
					var contentType = response.headers('Content-Type');
					if (contentType.indexOf('text/csv') >= 0){
						callback(response.data, 'OK');
					} else {
						callback(response.data, 'ERROR');
					}
				}, function(response){
					callback(response.data, 'ERROR');
				});
		};

		factory.setearInterfaz = function (comprobantes) {
			comprobantes.data.forEach(function(comprobante) {
				setearInterfazComprobante(comprobante);
			});
			return comprobantes;
		};

		function setearInterfazComprobante (comprobante) {
			var estadoDefault = {
				'grupo': loginService.getGroup(),
				'estado': 'Y'
			};
			if (angular.isDefined(comprobante.estado)){
				if (comprobante.estado.length > 0){
					var encontrado = false;
					comprobante.estado.forEach(function(estadoGrupo){
						if (estadoGrupo.grupo == loginService.getGroup() || estadoGrupo.grupo === 'ALL'){
							encontrado = true;
							comprobante.interfazEstado = (estadosArrayCache.get(estadoGrupo.estado)) ? estadosArrayCache.get(estadoGrupo.estado) : estadosArrayCache.get('Y');
						}
					});
					if (!encontrado){
						comprobante.estado.push(estadoDefault);
						comprobante.interfazEstado = {
							'name': 'Sin ver',
							'description': 'Sin ver',
							'btnEstado': 'text-info',
							'imagen': 'images/unknown.png',
							'_id': 'Y'
						};
					}
				} else {
					comprobante.estado.push(estadoDefault);
					comprobante.interfazEstado = {
						'name': 'Sin ver',
						'description': 'Sin ver',
						'btnEstado': 'text-info',
						'imagen': 'images/unknown.png',
						'_id': 'Y'
					};
				}
			} else {
				comprobante.estado = [];
				comprobante.estado.push(estadoDefault);
				comprobante.interfazEstado = {
					'name': 'Sin ver',
					'description': 'Sin ver',
					'btnEstado': 'text-info',
					'imagen': 'images/unknown.png',
					'_id': 'Y'
				};
			}
			return comprobante;
		}

		function ponerDescripcionComprobante (comprobante) {
			var descripciones = generalCache.get('descripciones' + loginService.getFiltro());
			if (angular.isDefined(comprobante.detalle)){
				comprobante.detalle.forEach(function(detalles){
					detalles.items.forEach(function(item){
						item.descripcion = (descripciones[item.id]) ? descripciones[item.id] : 'No se halló la descripción, verifique que el código esté asociado';
					});
				});
			}
			return comprobante;
		}

		function ponerDescripcionComprobantes (data) {
			data.data.forEach(function(factura){
				ponerDescripcionComprobante(factura);
			});
			return data;
		}

		function filtrarComentarios(dataComentarios) {
			var comentariosFiltrados = [];
			dataComentarios.forEach(function(comentario){
				if (comentario.group == loginService.getGroup() || comentario.group === 'ALL'){
					comentariosFiltrados.push(comentario);
				}
			});
			return comentariosFiltrados;
		}

		factory.cancelRequest = function(request){
			HTTPCanceler.cancel(namespace, request);
		};

		function ponerUnidadDeMedida (comprobante) {
			var cacheUnidades = generalCache.get('unitTypes');
			var unidadesTarifas = [];
			for (var i = 0, len = cacheUnidades.length; i < len; i++) {
				unidadesTarifas[cacheUnidades[i]._id] = cacheUnidades[i].description;
			}
			comprobante.detalle.forEach(function(contenedor){
				contenedor.items.forEach(function(item){
					if (angular.isDefined(unidadesTarifas[item.uniMed])){
						item.uniMed = unidadesTarifas[item.uniMed];
					}
				})
			});
			return comprobante;
		}

		return factory;

	}]);