/**
 * Created by leo on 14/04/14.
 */
myapp.factory('gatesFactory', function($http, $dialogs, formatDate){
	var factory = {};

	factory.getGateByDayOrContainer = function(datos, page, callback){
		var inserturl = serverUrl + '/gates/' + page.skip + '/' + page.limit;
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
				$dialogs.error('Error al cargar la lista de Gates');
			});
	};

	return factory;
});