/**
 * Created by Artiom on 17/06/14.
 */

myapp.factory('reportsFactory', function($http, dialogs, formatDate, loginService){
	var factory = {};

	factory.getCumplimientoTurnos = function(fecha, callback){
		$http.get('mocks/cumplimientoHorarios.json')
			.success(function(data){
				callback(data);
			}).error(function(errorText){
				console.log(errorText);
				dialogs.error('Error', 'Error al traer los datos de los turnos');
			});
	};

	factory.getReporteTarifas = function(tarifas, callback){
		var insertUrl = serverUrl + '/' + loginService.getFiltro() + '/'; // El que se va a usar

		$http.get('mocks/tarifasCount.json')
			.success(function(data){
				callback(data);
			}).error(function(errorText){
				console.log(errorText);
				dialogs.error('Error', 'Error al traer los datos de los turnos');
			});
	};

	return factory;
});
