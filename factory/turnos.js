/**
 * Created by leo on 28/04/14.
 */
myapp.factory('turnosFactory', function($http, dialogs, formatDate, loginService){
	var factory = {};

	factory.getTurnos = function(datos, page, callback){
		var inserturl = serverUrl + '/appointments/' + loginService.getFiltro() + '/' + page.skip + '/' + page.limit + '?';
		var insertAux = inserturl;
		if(angular.isDefined(datos.fechaDesde) && datos.fechaDesde != ''){
			inserturl = inserturl + 'fechaInicio=' + formatDate.formatearFechaHorasMinutosGMTLocal(datos.fechaDesde);
		}
		if(angular.isDefined(datos.fechaHasta) && datos.fechaHasta != ''){
			if(inserturl != insertAux){ inserturl = inserturl + '&'}
			inserturl = inserturl + 'fechaFin=' + formatDate.formatearFechaHorasMinutosGMTLocal(datos.fechaHasta);
		}
		if(angular.isDefined(datos.contenedor) && datos.contenedor != ''){
			if(inserturl != insertAux){ inserturl = inserturl + '&'}
			inserturl = inserturl + 'contenedor=' + datos.contenedor.toUpperCase();
		}
		if(angular.isDefined(datos.buque) && datos.buque != ''){
			if(inserturl != insertAux){ inserturl = inserturl + '&'}
			inserturl = inserturl + 'buque=' + datos.buque.toUpperCase();
		}

		$http.get(inserturl)
			.success(function(data){
				callback(data);
			}).error(function(error){
				callback(error);
			});
	};

	return factory;
});