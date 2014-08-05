/**
 * Created by Diego Reyes on 3/19/14.
 */
myapp.factory('controlPanelFactory', function($http, $rootScope, dialogs, formatDate, loginService){
	var factory = {};

	factory.getByDay = function(dia, callback){
		var inserturl = serverUrl + '/invoices/counts?fecha=' + dia;
		$http.get(inserturl)
			.success(function(data){
				var result = [];
				if (data.status === 'OK'){
					var total = 0;
					for (var i = 0, len=data.data.length; i< len; i++){
						total += data.data[i].cnt;
					}
					result = {"invoicesCount": total};
				}
				callback(result);
			}).error(function(errorText){
				console.log(errorText);
				dialogs.error('Error', 'Error al cargar lista por día');
			});
	};

	factory.getTasas = function(fecha, callback){

		var inserturl = serverUrl + '/invoices/ratesTotal/'+$rootScope.moneda+'/?fecha=' + formatDate.formatearFecha(fecha);
		$http.get(inserturl)
			.success(function(data){
				var result = {
					"ratesCount": 0,
					"ratesTotal": 0,
					"dataGraf": []
				};
				if (data.length){
					var cnt = 0;
					var facturado = 0;
					for (var i = 0, len=data.length; i< len; i++){
						cnt += data[i].cnt;
						facturado += data[i].total;
					}
					result = {
						"ratesCount": cnt,
						"ratesTotal": facturado,
						"dataGraf": data
					}
				}
				callback(result);
			}).error(function(errorText){
				console.log(errorText);
				dialogs.error('Error', 'Error al cargar lista por día');
			});
	};

	factory.getTotales = function(fecha, callback){
		var inserturl = serverUrl + '/invoices/counts';
		$http.get(inserturl)
			.success(function (data){
				callback(data.data);
			}).error(function(errorText){
				console.log(errorText);
				dialogs.error('Error', 'Error al cargar la lista PriceList');
			});
	};

	factory.getFacturasMeses = function(fecha, callback){
		var inserturl = serverUrl + '/invoices/countsByMonth?fecha=' + formatDate.formatearFecha(fecha);
		$http.get(inserturl)
			.success(function (data){
				callback(data);
			}).error(function(errorText){
				console.log(errorText);
				dialogs.error('Error', 'Error al cargar los datos de la facturación por mes');
			});
	};

	factory.getGatesMeses = function(fecha, callback){
		var inserturl = serverUrl + '/gatesByMonth?fecha=' + formatDate.formatearFecha(fecha);
		$http({
			method: "GET",
			url: inserturl,
			headers:
			{token: loginService.getToken()}
		}).success(function (data){
				callback(data);
			}).error(function(errorText){
				console.log(errorText);
				dialogs.error('Error', 'Error al cargar la lista PriceList');
			});
	};

	factory.getTurnosMeses = function(fecha, callback){
		var inserturl = serverUrl + '/appointmentsByMonth?fecha=' + formatDate.formatearFecha(fecha);
		$http({
			method: "GET",
			url: inserturl,
			headers:
				{token: loginService.getToken()}
		}).success(function (data){
				callback(data);
			}).error(function(errorText){
				console.log(errorText);
				dialogs.error('Error', 'Error al cargar la lista PriceList');
			});
	};

	//A partir de la fecha pasada, devuelve la facturación por día, de la fecha y 4 fechas hacia atrás
	factory.getFacturadoPorDia = function(fecha, callback){
		var inserturl = serverUrl + '/invoices/countsByDate?fecha=' + formatDate.formatearFecha(fecha);
		$http.get(inserturl)
			.success(function (data){
				callback(data);
			}).error(function(errorText){
				console.log(errorText);
				dialogs.error('Error', 'Error al cargar la lista PriceList');
			});
	};

	factory.getGatesDia = function(fecha, callback){
		var inserturl = serverUrl + '/gatesByHour?fecha=' + formatDate.formatearFecha(fecha);
		$http({
			method: "GET",
			url: inserturl,
			headers:
			{token: loginService.getToken()}
		}).success(function (data){
			callback(data);
		}).error(function(errorText){
			console.log(errorText);
			dialogs.error('Error', 'Error al cargar los Gates del dia');
		});
	};

	factory.getTurnosDia = function(fecha, callback){
		var inserturl = serverUrl + '/appointmentsByHour?fecha=' + formatDate.formatearFecha(fecha);
		$http({
			method: "GET",
			url: inserturl,
			headers:
			{token: loginService.getToken()}
		}).success(function (data){
			callback(data);
		}).error(function(errorText){
			console.log(errorText);
			dialogs.error('Error', 'Error al cargar los Turnos del dia');
		});
	};

	return factory;
});