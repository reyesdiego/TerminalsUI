/**
 * Created by leo on 14/04/14.
 */
myapp.factory('gatesFactory', function($http){
	var factory = {};

	factory.getGateByDayOrContainer = function(datos, callback){
		var inserturl = serverUrl + '/gates?fechaDesde=' + datos.fechaDesde + '&fechaHasta=' + datos.fechaHasta; // El que realmente se va a usar
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