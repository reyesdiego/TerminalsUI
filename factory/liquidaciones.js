/**
 * Created by artiom on 13/07/15.
 */
myapp.factory('liquidacionesFactory', ['$http', 'loginService', 'formatService', 'invoiceFactory', function($http, loginService, formatService, invoiceFactory){

	var factory = {};

	factory.getComprobantesLiquidar = function(page, datos, callback){
		var inserturl = serverUrl + '/paying/notPayed/' + loginService.getFiltro() + '/' + page.skip + '/' + page.limit;
		$http.get(inserturl, { params: formatService.formatearDatos(datos) })
			.success(function(data){
				data.data = factory.estadoAdapter(data.data);
				callback(invoiceFactory.setearInterfaz(data));
			}).error(function(error){
				if (error == null){
					error = {
						status: 'ERROR'
					}
				}
				callback(error);
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
		var inserturl = serverUrl + '/paying/payments/' + loginService.getFiltro() + '/' + page.skip + '/' + page.limit;
		$http.get(inserturl)
			.success(function(data){
				callback(data);
			}).error(function(error){
				callback(error);
			})
	};

	factory.getComprobantesLiquidados = function(page, liquidacion, datos, callback){
		var inserturl = serverUrl + '/paying/payed/' + loginService.getFiltro() + '/' + liquidacion + '/' + page.skip + '/' + page.limit;
		$http.get(inserturl, { params: formatService.formatearDatos(datos) })
			.success(function(data){
				callback(invoiceFactory.setearInterfaz(data));
			}).error(function(error){
				if (error == null){
					error = {
						status: 'ERROR',
						message: 'Se ha producido un error al procesar la liquidación.'
					}
				}
				callback(error);
			})
	};

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

	return factory;

}]);