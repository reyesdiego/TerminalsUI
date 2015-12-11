/**
 * Created by artiom on 13/07/15.
 */
myapp.factory('liquidacionesFactory', ['$http', 'loginService', 'formatService', 'invoiceFactory', '$q', 'HTTPCanceler', 'generalCache',
	function($http, loginService, formatService, invoiceFactory, $q, HTTPCanceler, generalCache){

		var factory = {};

		factory.createMat = function(data, callback){
			var inserturl = serverUrl + '/mats/create';
			$http.post(inserturl, data)
				.success(function(data){
					callback(data);
				}).error(function(error){
					callback(error);
				})
		};

		factory.getMAT = function(year, callback){
			var inserturl = serverUrl + '/mats';
			//var inserturl = 'mocks/mat.json'; //mocked route
			$http.get(inserturl)
				.success(function(data){
					callback(data);
				}).error(function(error){
					callback(error);
				})
		};

		factory.getMatFacturado = function(year, callback){
			// var inserturl = serverUrl + '/alguna ruta en donde se use el year;
			var inserturl = 'mocks/matFacturado.json'; //mocked route
			$http.get(inserturl)
				.success(function(data){
					callback(data);
				}).error(function(error){
					callback(error);
				})
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
				canceler = HTTPCanceler.get(defer, 'comprobantesLiquidarContainer');
			} else {
				canceler = HTTPCanceler.get(defer, 'comprobantesLiquidar');
			}
			var inserturl = serverUrl + '/paying/notPayed/' + loginService.getFiltro() + '/' + page.skip + '/' + page.limit;
			$http.get(inserturl, { params: formatService.formatearDatos(datos), timeout: canceler.promise })
				.success(function(data){
					data.data = factory.estadoAdapter(data.data);
					callback(invoiceFactory.setearInterfaz(data));
				}).error(function(error, status){
					if (status != 0){
						if (error == null){
							error = {
								status: 'ERROR'
							}
						}
						callback(error);
					}
				})
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
			var canceler = HTTPCanceler.get(defer, 'preliquidaciones');
			var inserturl = serverUrl + '/paying/prePayments/' + loginService.getFiltro() + '/' + page.skip + '/' + page.limit;
			$http.get(inserturl, { params: formatService.formatearDatos(datos), timeout: canceler.promise })
				.success(function(data){
					callback(data);
				}).error(function(error, status){
					if (status != 0) callback(error);
				})
		};

		factory.getPayments = function(page, datos, callback){
			factory.cancelRequest('liquidaciones');
			var defer = $q.defer();
			var canceler = HTTPCanceler.get(defer, 'liquidaciones');
			var inserturl = serverUrl + '/paying/payments/' + loginService.getFiltro() + '/' + page.skip + '/' + page.limit;
			$http.get(inserturl, { params: formatService.formatearDatos(datos), timeout: canceler.promise })
				.success(function(data){
					data.data = factory.setTotalesLiquidacion(data.data);
					callback(data);
				}).error(function(error, status){
					if (status != 0) callback(error);
				})
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
				canceler = HTTPCanceler.get(defer, 'comprobantesLiquidadosContainer');
			} else {
				canceler = HTTPCanceler.get(defer, 'comprobantesLiquidados');
			}
			var inserturl = serverUrl + '/paying/payed/' + loginService.getFiltro() + '/' + liquidacion + '/' + page.skip + '/' + page.limit;
			$http.get(inserturl, { params: formatService.formatearDatos(datos), timeout: canceler.promise })
				.success(function(data){
					callback(data);
				}).error(function(error, status){
					if (status != 0){
						if (error == null){
							error = {
								status: 'ERROR',
								message: 'Se ha producido un error al procesar la liquidación.'
							}
						}
						callback(error);
					}
				})
		};

		//No se debería poder cancelar
		factory.setPrePayment = function(callback){
			var inserturl = serverUrl + '/paying/prePayment';
			$http.post(inserturl, { terminal: loginService.getFiltro() })
				.success(function(data){
					callback(data);
				}).error(function(error){
					if (error == null){
						error = {
							status: 'ERROR'
						}
					}
					callback(error);
				})
		};

		factory.setPayment = function(preNumber, callback){
			var inserturl = serverUrl + '/paying/payment';
			$http.put(inserturl, {terminal: loginService.getFiltro(), preNumber: preNumber})
				.success(function(data){
					callback(data);
				}).error(function(error){
					callback(error);
				})
		};

		factory.deletePrePayment = function(paymentId, callback){
			var inserturl = serverUrl + '/paying/prePayment/' + paymentId;
			$http.delete(inserturl)
				.success(function(data){
					callback(data);
				}).error(function(error){
					callback(error);
				})
		};

		factory.addToPrePayment = function(preLiquidacion, datos, callback){
			var inserturl = serverUrl + '/paying/addToPrePayment/' + loginService.getFiltro();
			var liquidacion = {
				paymentId: preLiquidacion
			};
			$http.put(inserturl, liquidacion,{ params: formatService.formatearDatos(datos) })
				.success(function(data){
					callback(data);
				}).error(function(error){
					if (error == null){
						error = {
							status: 'ERROR'
						}
					}
					callback(error);
				})
		};

		factory.getPrePayment = function(datos, callback){
			var inserturl = serverUrl + '/paying/getPrePayment/' + loginService.getFiltro();
			$http.get(inserturl, { params: formatService.formatearDatos(datos)})
				.success(function(data){
					data.data = factory.setDescriptionTasas(data.data);
					callback(data);
				}).error(function(error){
					if (error == null){
						error = {
							status: 'ERROR'
						}
					}
					callback(error);
				})
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
			HTTPCanceler.cancel(request);
		};

		return factory;

	}]);