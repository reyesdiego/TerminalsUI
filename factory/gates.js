/**
 * Created by leo on 14/04/14.
 */
myapp.factory('gatesFactory', function($http){
	var factory = {};

	factory.getGateByDayOrContainer = function(datos, page, callback){
		var inserturl = serverUrl + '/gates/' + page.skip + '/' + page.limit;
		inserturl = inserturl + '?fechaDesde=' + datos.fechaDesde + '&fechaHasta=' + datos.fechaHasta;
		if(angular.isDefined(datos.contenedor)){
			inserturl = inserturl + '&contenedor=' + datos.contenedor;
		}
		$http.get(inserturl)
			.success(function(data){
				console.log(data);
				callback(data);
			}).error(function(){
				console.log('Error al cargar Gates')
			});
	};

	return factory;
});