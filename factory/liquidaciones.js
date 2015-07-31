/**
 * Created by artiom on 13/07/15.
 */
myapp.factory('liquidacionesFactory', ['$http', 'loginService', 'formatService', 'invoiceFactory', '$q', 'HTTPCanceler',
	function($http, loginService, formatService, invoiceFactory, $q, HTTPCanceler){

		var factory = {};

		factory.getComprobantesLiquidar = function(page, datos, callback){
			factory.cancelRequest();
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

		factory.getPayments = function(page, callback){
			factory.cancelRequest();
			var defer = $q.defer();
			var canceler = HTTPCanceler.get(defer, 'liquidaciones');
			var inserturl = serverUrl + '/paying/payments/' + loginService.getFiltro() + '/' + page.skip + '/' + page.limit;
			$http.get(inserturl, { timeout: canceler.promise })
				.success(function(data){
					callback(data);
				}).error(function(error, status){
					if (status != 0) callback(error);
				})
		};

		factory.getComprobantesLiquidados = function(page, liquidacion, datos, callback){
			factory.cancelRequest();
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
		factory.payAll = function(data, callback){
			var inserturl = serverUrl + '/paying/setPayment/' + loginService.getFiltro();
			$http.post(inserturl, data)
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

		factory.cancelRequest = function(){
			HTTPCanceler.cancel();
		};

		return factory;

	}]);