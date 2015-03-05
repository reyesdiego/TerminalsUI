/**
 * Created by leo on 28/04/14.
 */
myapp.factory('turnosFactory', function($http, dialogs, formatService, loginService){
	var factory = {};

	factory.getTurnos = function(datos, page, callback){
		var inserturl = serverUrl + '/appointments/' + loginService.getFiltro() + '/' + page.skip + '/' + page.limit + '?';
		var insertAux = inserturl;
		if(angular.isDefined(datos.fechaInicio) && datos.fechaInicio != '' && datos.fechaInicio != null){
			inserturl = inserturl + 'fechaInicio=' + formatService.formatearFechaHorasMinutosGMTLocal(datos.fechaInicio);
		}
		if(angular.isDefined(datos.fechaFin) && datos.fechaFin != '' && datos.fechaFin != null){
			if(inserturl != insertAux){ inserturl = inserturl + '&'}
			inserturl = inserturl + 'fechaFin=' + formatService.formatearFechaHorasMinutosGMTLocal(datos.fechaFin);
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