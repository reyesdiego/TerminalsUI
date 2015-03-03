/**
 * Created by leo on 14/04/14.
 */
myapp.factory('gatesFactory', function($http, dialogs, formatDate, loginService){
	var factory = {};

	factory.getGate = function(datos, page, callback){
		var inserturl = serverUrl + '/gates/' + loginService.getFiltro() + '/' + page.skip + '/' + page.limit + '?';
		inserturl = this.aplicarFiltros(inserturl, datos);
		$http.get(inserturl)
			.success(function(data){
				callback(data);
			}).error(function(error){
				callback(error);
			});
	};

	factory.getReporteHorarios = function(datos, callback){
		var inserturl = serverUrl + '/gates/' + loginService.getFiltro() + '/report?';
		inserturl = this.aplicarFiltros(inserturl, datos);
		$http.get(inserturl)
			.success(function (data){
				callback(data);
			}).error(function(errorText){
				dialogs.error('Error', 'Error al añadir comentario sobre el comprobante');
			});
	};

	factory.getMissingGates = function(callback){
		var inserturl = serverUrl + '/gates/' + loginService.getFiltro() + '/missingGates';
		$http.get(inserturl)
			.success(function (data){
				callback(data);
			}).error(function(error){
				callback(error);
			});
	};

	factory.getMissingInvoices = function(callback){
		var inserturl = serverUrl + '/gates/' + loginService.getFiltro() + '/missingInvoices';
		$http.get(inserturl)
			.success(function (data){
				callback(data);
			}).error(function(error){
				callback(error);
			});
	};

	factory.aplicarFiltros = function(unaUrl, datos){
		var insertAux = unaUrl;
		if(angular.isDefined(datos.fechaDesde) && datos.fechaDesde != '' && datos.fechaDesde != null){
			unaUrl = unaUrl + 'fechaInicio=' + formatDate.formatearFechaHorasMinutosGMTLocal(datos.fechaDesde);
		}
		if(angular.isDefined(datos.fechaHasta) && datos.fechaHasta != '' && datos.fechaHasta != null){
			if(unaUrl != insertAux){ unaUrl = unaUrl + '&'}
			unaUrl = unaUrl + 'fechaFin=' + formatDate.formatearFechaHorasMinutosGMTLocal(datos.fechaHasta);
		}
		if(angular.isDefined(datos.contenedor) && datos.contenedor != ''){
			if(unaUrl != insertAux){ unaUrl = unaUrl + '&'}
			unaUrl = unaUrl + 'contenedor=' + datos.contenedor.toUpperCase();
		}
		if(angular.isDefined(datos.buque) && datos.buque != ''){
			if(unaUrl != insertAux){ unaUrl = unaUrl + '&'}
			unaUrl = unaUrl + 'buqueNombre=' + datos.buque.toUpperCase();
		}if(angular.isDefined(datos.viaje) && datos.viaje != ''){
			if(unaUrl != insertAux){ unaUrl = unaUrl + '&'}
			unaUrl = unaUrl + 'viaje=' + datos.viaje.toUpperCase();
		}
		if(angular.isDefined(datos.order) && datos.order != ''){
			if(unaUrl != insertAux){ unaUrl = unaUrl + '&'}
			unaUrl = unaUrl + 'order=' + '[{' + datos.order + '}]';
		}
		return unaUrl
	};

	return factory;
});