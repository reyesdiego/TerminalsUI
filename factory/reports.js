/**
 * Created by Artiom on 17/06/14.
 */

myapp.factory('reportsFactory', ['$http', 'dialogs', 'formatService', 'loginService', function($http, dialogs, formatService, loginService){
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

	factory.getReporteHorarios = function(fecha, callback){
		var inserturl = serverUrl + '/gates/' + loginService.getFiltro() + '/report?fechaInicio=' + formatService.formatearFecha(fecha.fechaInicio) + '&fechaFin=' + formatService.formatearFecha(fecha.fechaFin);
		$http.get(inserturl)
			.success(function (data){
				callback(data);
			}).error(function(errorText){
				dialogs.error('Error', 'Error al añadir comentario sobre el comprobante');
			});
	};

	factory.getReporteTarifas = function(fecha, tarifas, callback){
		var inserturl = serverUrl + '/invoices/byRates?fechaInicio=' + formatService.formatearFecha(fecha.fechaInicio) + '&fechaFin=' + formatService.formatearFecha(fecha.fechaFin);
		$http({
			method: "POST",
			url: inserturl,
			data: tarifas,
			headers: {token: loginService.getToken() }
		}).success(function (response) {
			callback(response);
		}).error(function(errorText) {
			dialogs.error('Error', 'Error al añadir el Match en la base');
		});
	};

	return factory;
}]);
