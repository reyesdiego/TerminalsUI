/**
 * Created by leo on 28/04/14.
 */
myapp.factory('turnosFactory', function($http, $dialogs, formatDate){
	var factory = {};

	factory.getTurnosByDatesOrContainer = function(datos, page, callback){
		var inserturl = serverUrl + '/appointments/' + page.skip + '/' + page.limit;
		inserturl = inserturl + '?fechaInicio=' + formatDate.formatearFechaHorasMinutos(datos.fechaDesde);
		inserturl = inserturl + '&fechaFin=' + formatDate.formatearFechaHorasMinutos(datos.fechaHasta);
		if(angular.isDefined(datos.contenedor)){
			inserturl = inserturl + '&contenedor=' + datos.contenedor;
		}
		$http.get(inserturl)
			.success(function(data){
				console.log(data);
				callback(data);
			}).error(function(errorText){
				console.log(errorText);
				$dialogs.error('Error al cargar la lista de Turnos');
			});
	};

	return factory;
});