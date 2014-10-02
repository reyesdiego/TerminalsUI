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

	factory.getReporteHorarios = function(fecha, callback){
		var inserturl = serverUrl + '/gates/' + loginService.getFiltro() + '/report?fechaInicio=' + formatDate.formatearFecha(fecha.fechaInicio) + '&fechaFin=' + formatDate.formatearFecha(fecha.fechaFin);
		console.log(inserturl);
		$http({
			method: 'GET',
			url: inserturl,
			headers:{token: loginService.getToken()}
		}).success(function (data){
			callback(data);
		}).error(function(errorText){
			dialogs.error('Error', 'Error al añadir comentario sobre el comprobante');
		});
	};

	factory.getReporteTarifas = function(fecha, tarifas, callback){
		var inserturl = serverUrl + '/invoices/byRates?fechaInicio=' + formatDate.formatearFecha(fecha.fechaInicio) + '&fechaFin=' + formatDate.formatearFecha(fecha.fechaFin);
		//El método que se va a usar para mandar la información
		$http({
			method: "POST",
			url: inserturl,
			data: JSON.stringify(tarifas),
			headers:{"Content-Type":"application/json", token: loginService.getToken()}
		}).success(function (response) {
			callback(response);
		}).error(function(errorText) {
			dialogs.error('Error', 'Error al añadir el Match en la base');
		});
	};

	return factory;
});
