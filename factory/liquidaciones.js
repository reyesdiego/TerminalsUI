/**
 * Created by artiom on 13/07/15.
 */
myapp.factory('liquidacionesFactory', ['$http', 'loginService', 'formatService', 'invoiceFactory', '$q', 'HTTPCanceler', 'generalCache',
	function($http, loginService, formatService, invoiceFactory, $q, HTTPCanceler, generalCache){

		var factory = {};
		var namespace = 'liquidaciones';

		factory.getNotPayedCsv = function(datos, callback){
			var inserturl = serverUrl + '/paying/notPayed/' + loginService.getFiltro() +'/download';
			$http.get(inserturl, { params: formatService.formatearDatos(datos)})
				.then(function(response){
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

		factory.getPriceDollar = function(callback){
			var inserturl = serverUrl + '/afip/dollars';
			$http.get(inserturl)
				.then(function(response){
					callback(response.data);
				}, function(response){
					callback(response.data);
				});
		};

		factory.saveMat = function(data, update, callback){
			var inserturl = serverUrl + '/mats/mat';
			if (update){
				$http.put(inserturl, data)
					.then(function(response){
						callback(response.data);
					}, function(response){
						callback(response.data);
					});
			} else {
				$http.post(inserturl, data)
					.then(function(response){
						callback(response.data);
					}, function(response){
						callback(response.data);
					});
			}
		};

		factory.getMAT = function(year, callback){
			var inserturl = serverUrl + '/mats';
			//var inserturl = 'mocks/mat.json'; //mocked route
			$http.get(inserturl)
				.then(function(response){
					callback(response.data);
				}, function(response){
					callback(response.data);
				});
		};

		factory.getMatFacturado = function(year, callback){
			// var inserturl = serverUrl + '/alguna ruta en donde se use el year;
			var inserturl = 'mocks/matFacturado.json'; //mocked route
			$http.get(inserturl)
				.then(function(response){
					callback(response.data);
				}, function(response){
					callback(response.data);
				});
		};

		factory.getComprobantesLiquidar = function(page, datos, callback){
			if (datos.byContainer){
				factory.cancelRequest('comprobantesLiquidarContainer');
			} else {
				factory.cancelRequest('comprobantesLiquidar');
			}
			var defer = $q.defer();
			var canceler;
			if (datos.byContainer){
				canceler = HTTPCanceler.get(defer, namespace, 'comprobantesLiquidarContainer');
			} else {
				canceler = HTTPCanceler.get(defer, namespace, 'comprobantesLiquidar');
			}
			var inserturl = serverUrl + '/paying/notPayed/' + loginService.getFiltro() + '/' + page.skip + '/' + page.limit;
			$http.get(inserturl, { params: formatService.formatearDatos(datos), timeout: canceler.promise })
				.then(function(response){
					response.data.data = factory.estadoAdapter(response.data.data);
					callback(invoiceFactory.setearInterfaz(response.data));
				}, function(response){
					if (response.status != -5){
						if (response.data == null){
							response.data = {
								status: 'ERROR'
							}
						}
						callback(response.data);
					}
				});
		};

		factory.estadoAdapter = function(comprobantes){
			comprobantes.forEach(function(comprobante){
				var tempEstado = comprobante.estado;
				comprobante.estado = [];
				comprobante.estado.push(tempEstado);
			});
			return comprobantes;
		};

		factory.getPrePayments = function(page, datos, callback){
			factory.cancelRequest('preliquidaciones');
			var defer = $q.defer();
			var canceler = HTTPCanceler.get(defer, namespace, 'preliquidaciones');
			var inserturl = serverUrl + '/paying/prePayments/' + loginService.getFiltro() + '/' + page.skip + '/' + page.limit;
			$http.get(inserturl, { params: formatService.formatearDatos(datos), timeout: canceler.promise })
				.then(function(response){
					callback(response.data);
				}, function(response){
					if (response.status != -5) callback(response.data);
				});
		};

		factory.getPayments = function(page, datos, callback){
			factory.cancelRequest('liquidaciones');
			var defer = $q.defer();
			var canceler = HTTPCanceler.get(defer, namespace, 'liquidaciones');
			var inserturl = serverUrl + '/paying/payments/' + loginService.getFiltro() + '/' + page.skip + '/' + page.limit;
			$http.get(inserturl, { params: formatService.formatearDatos(datos), timeout: canceler.promise })
				.then(function(response){
					response.data.data = factory.setTotalesLiquidacion(response.data.data);
					callback(response.data);
				}, function(response){
					if (response.status != -5) callback(response.data);
				});
		};

		factory.setTotalesLiquidacion = function(detallesLiquidaciones){
			var descripciones = generalCache.get('descripciones' + loginService.getFiltro());
			detallesLiquidaciones.forEach(function(liquidacion){
				liquidacion.detail.forEach(function(detalle){
					detalle.desc = descripciones[detalle._id];
				});
			});
			return detallesLiquidaciones;
		};

		factory.getComprobantesLiquidados = function(page, liquidacion, datos, callback){
			if (datos.byContainer){
				factory.cancelRequest('comprobantesLiquidadosContainer');
			} else {
				factory.cancelRequest('comprobantesLiquidados');
			}
			var defer = $q.defer();
			var canceler;
			if (datos.byContainer){
				canceler = HTTPCanceler.get(defer, namespace, 'comprobantesLiquidadosContainer');
			} else {
				canceler = HTTPCanceler.get(defer, namespace, 'comprobantesLiquidados');
			}
			var inserturl = serverUrl + '/paying/payed/' + loginService.getFiltro() + '/' + liquidacion + '/' + page.skip + '/' + page.limit;
			$http.get(inserturl, { params: formatService.formatearDatos(datos), timeout: canceler.promise })
				.then(function(response){
					callback(response.data);
				}, function(response){
					if (response.status != -5){
						if (response.data == null){
							response.data = {
								status: 'ERROR',
								message: 'Se ha producido un error al procesar la liquidación.'
							}
						}
						callback(response.data);
					}
				});
		};

		//No se debería poder cancelar
		factory.setPrePayment = function(callback){
			var inserturl = serverUrl + '/paying/prePayment';
			$http.post(inserturl, { terminal: loginService.getFiltro() })
				.then(function(response){
					callback(response.data);
				}, function(response){
					if (response.data == null){
						response.data = {
							status: 'ERROR'
						}
					}
					callback(response.data);
				});
		};

		factory.setPayment = function(preNumber, callback){
			var inserturl = serverUrl + '/paying/payment';
			$http.put(inserturl, {terminal: loginService.getFiltro(), preNumber: preNumber})
				.then(function(response){
					callback(response.data);
				}, function(response){
					callback(response.data);
				});
		};

		factory.deletePrePayment = function(paymentId, callback){
			var inserturl = serverUrl + '/paying/prePayment/' + paymentId;
			$http.delete(inserturl)
				.then(function(response){
					callback(response.data);
				}, function(response){
					callback(response.data);
				});
		};

		factory.addToPrePayment = function(preLiquidacion, datos, callback){
			var inserturl = serverUrl + '/paying/addToPrePayment/' + loginService.getFiltro();
			var liquidacion = {
				paymentId: preLiquidacion
			};
			$http.put(inserturl, liquidacion,{ params: formatService.formatearDatos(datos) })
				.then(function(response){
					callback(response.data);
				}, function(response){
					if (response.data == null){
						response.data = {
							status: 'ERROR'
						}
					};
					callback(response.data);
				});
		};

		factory.getPrePayment = function(datos, callback){
			var inserturl = serverUrl + '/paying/getPrePayment/' + loginService.getFiltro();
			$http.get(inserturl, { params: formatService.formatearDatos(datos)})
				.then(function(response){
					response.data.data = factory.setDescriptionTasas(response.data.data);
					callback(response.data);
				}, function(response){
					if (response.data == null){
						response.data = {
							status: 'ERROR'
						}
					}
					callback(response.data);
				});
		};

		factory.setDescriptionTasas = function(detallesLiquidacion){
			var descripciones = generalCache.get('descripciones' + loginService.getFiltro());
			var totalFinal = 0;
			var totalFinalAgp = 0;
			detallesLiquidacion.forEach(function(detalle){
				detalle.descripcion = descripciones[detalle._id.code];
				totalFinal += detalle.totalPeso;
				totalFinalAgp += detalle.totalPesoAgp;
			});
			detallesLiquidacion.totalFinal = totalFinal;
			detallesLiquidacion.totalFinalAgp = totalFinalAgp;
			return detallesLiquidacion;
		};

		factory.cancelRequest = function(request){
			HTTPCanceler.cancel(namespace, request);
		};

		return factory;

	}]);