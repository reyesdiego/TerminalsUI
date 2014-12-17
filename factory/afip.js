/**
 * Created by artiom on 17/12/14.
 */
myapp.factory('afipFactory', function($http, $rootScope, dialogs, loginService, formatDate, errorFactory){

	var factory = {};

	factory.getRegistro1Afectacion = function(page, callback){
		var inserturl = serverUrl + '/afip/registro1_afectacion/' + page.skip + '/' + page.limit;
		inserturl = this.aplicarFiltros(inserturl, datos);
		$http({
			method: 'GET',
			url: inserturl,
			headers:
			{token: loginService.getToken()}
		}).success(function(data){
			data = factory.ponerDescripcionComprobantes(data);
			callback(factory.setearInterfaz(data));
		}).error(function(errorText){
			errorFactory.raiseError(errorText, inserturl, 'errorDatos', 'Error al cargar los datos de comprobantes.');
		});
	}

});