/**
 * Created by artiom on 13/07/15.
 */
myapp.factory('liquidacionesFactory', ['$http', 'loginService', 'formatService', 'invoiceFactory', '$q', 'HTTPCanceler',
	function($http, loginService, formatService, invoiceFactory, $q, HTTPCanceler){

		var factory = {};

		factory.getComprobantesLiquidar = function(page, datos, callback){
			factory.cancelRequest('comprobantesLiquidar');
			var defer = $q.defer();
			var canceler = HTTPCanceler.get(defer, 'comprobantesLiquidar');
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

		factory.getPayments = function(page, datos, callback){
			factory.cancelRequest('liquidaciones');
			var defer = $q.defer();
			var canceler = HTTPCanceler.get(defer, 'liquidaciones');
			var inserturl = serverUrl + '/paying/payments/' + loginService.getFiltro() + '/' + page.skip + '/' + page.limit;
			$http.get(inserturl, { params: formatService.formatearDatos(datos), timeout: canceler.promise })
				.success(function(data){
					callback(data);
				}).error(function(error, status){
					if (status != 0) callback(error);
				})
		};

		factory.getComprobantesLiquidados = function(page, liquidacion, datos, callback){
			factory.cancelRequest('comprobantesLiquidados');
			var defer = $q.defer();
			var canceler = HTTPCanceler.get(defer, 'comprobantesLiquidados');
			var inserturl = serverUrl + '/paying/payed/' + loginService.getFiltro() + '/' + liquidacion + '/' + page.skip + '/' + page.limit;
			$http.get(inserturl, { params: formatService.formatearDatos(datos), timeout: canceler.promise })
				.success(function(data){
					callback(invoiceFactory.setearInterfaz(data));
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

		factory.getPrePayment = function(preLiquidacion, callback){
			var inserturl = serverUrl + '/paying/getPrePayment/' + loginService.getFiltro() + '/' + preLiquidacion;
			$http.get(inserturl)
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

		factory.cancelRequest = function(request){
			HTTPCanceler.cancel(request);
		};

		return factory;

	}]);