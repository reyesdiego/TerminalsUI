/**
 * Created by leo on 28/04/14.
 */
myapp.factory('turnosFactory', function($http, dialogs, formatDate, loginService){
	var factory = {};

	factory.getTurnos = function(datos, page, callback){
		var inserturl = serverUrl + '/appointments/' + loginService.getFiltro() + '/' + page.skip + '/' + page.limit + '?';
		var insertAux = inserturl;
		if(angular.isDefined(datos.fechaDesde) && datos.fechaDesde != ''){
			inserturl = inserturl + 'fechaInicio=' + formatDate.formatearFechaHorasMinutos(datos.fechaDesde);
		}
		if(angular.isDefined(datos.fechaHasta) && datos.fechaHasta != ''){
			if(inserturl != insertAux){ inserturl = inserturl + '&'}
			inserturl = inserturl + 'fechaFin=' + formatDate.formatearFechaHorasMinutos(datos.fechaHasta);
		}
		if(angular.isDefined(datos.contenedor) && datos.contenedor != ''){
			if(inserturl != insertAux){ inserturl = inserturl + '&'}
			inserturl = inserturl + 'contenedor=' + datos.contenedor.toUpperCase();
		}
		$http({
			method: 'GET',
			url: inserturl,
			headers: { token: loginService.getToken() }
		})
			.success(function(data){
				callback(data);
			}).error(function(errorText){
				console.log(errorText);
				dialogs.error('Error', 'Error al cargar la lista de Turnos');
			});
	};

	return factory;
});