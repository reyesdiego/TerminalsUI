/**
 * Created by Diego Reyes on 3/19/14.
 */
myapp.factory('controlPanelFactory', function($http, $rootScope, dialogs, formatDate, loginService, errorFactory){
	var factory = {};

	factory.getByDay = function(dia, callback, errCallBack){
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
				errorFactory.raiseError(errorText, 'errorGetByDay');
				//errCallBack(errorText);
			});
	};

	factory.getTasas = function(fecha, moneda, callback, errCallBack){
		var inserturl = serverUrl + '/invoices/ratesTotal/' + moneda + '/?fecha=' + formatDate.formatearFecha(fecha);
		$http.get(inserturl)
			.success(function(data){
				var result = {
					"ratesCount": 0,
					"ratesTotal": 0,
					"dataGraf": []
				};
				if (data.data.length){
					var cnt = 0;
					var facturado = 0;
					for (var i = 0, len=data.data.length; i< len; i++){
						cnt += data.data[i].cnt;
						facturado += data.data[i].total;
					}
					result = {
						"ratesCount": cnt,
						"ratesTotal": facturado,
						"dataGraf": data.data
					}
				}
				callback(result);
			}).error(function(errorText){
				errorFactory.raiseError(errorText, 'errorTasas');
				//errCallBack(errorText);
			});
	};

	factory.getTotales = function(fecha, callback){
		var inserturl = serverUrl + '/invoices/counts';
		$http.get(inserturl)
			.success(function (data){
				callback(data.data);
			}).error(function(errorText){
				errorFactory.raiseError(errorText, 'errorTotales');
				/*console.log(errorText);
				dialogs.error('Error', 'Error al cargar la lista PriceList');*/
			});
	};

	factory.getFacturasMeses = function(fecha, moneda, callback, errCallBack){
		var inserturl = serverUrl + '/invoices/countsByMonth/' + moneda + '?fecha=' + formatDate.formatearFecha(fecha);
		$http.get(inserturl)
			.success(function (data){
				callback(data);
			}).error(function(errorText){
				errorFactory.raiseError(errorText, 'errorFacturasMeses');
				//errCallBack(errorText);
			});
	};

	factory.getGatesMeses = function(fecha, callback, errCallBack){
		var inserturl = serverUrl + '/gatesByMonth?fecha=' + formatDate.formatearFecha(fecha);
		$http({
			method: "GET",
			url: inserturl,
			headers:
			{token: loginService.getToken()}
		}).success(function (data){
				callback(data);
			}).error(function(errorText){
				errorFactory.raiseError(errorText, 'gatesMeses');
				//errCallBack(errorText);
			});
	};

	factory.getTurnosMeses = function(fecha, callback, errCallBack){
		var inserturl = serverUrl + '/appointmentsByMonth?fecha=' + formatDate.formatearFecha(fecha);
		$http({
			method: "GET",
			url: inserturl,
			headers:
				{token: loginService.getToken()}
		}).success(function (data){
				callback(data);
			}).error(function(errorText){
				errorFactory.raiseError(errorText);
				//errCallBack(errorText);
			});
	};

	//A partir de la fecha pasada, devuelve la facturación por día, de la fecha y 4 fechas hacia atrás
	factory.getFacturadoPorDia = function(fecha, moneda, callback, errCallBack){
		var inserturl = serverUrl + '/invoices/countsByDate/' + moneda +'/?fecha=' + formatDate.formatearFecha(fecha);
		$http.get(inserturl)
			.success(function (data){
				callback(data);
			}).error(function(errorText){
				errorFactory.raiseError(errorText, 'errorFacturadoPorDia');
			});
	};

	factory.getGatesDia = function(fecha, callback, errCallBack){
		var inserturl = serverUrl + '/gatesByHour?fecha=' + formatDate.formatearFecha(fecha);
		$http({
			method: "GET",
			url: inserturl,
			headers:
			{token: loginService.getToken()}
		}).success(function (data){
			callback(data);
		}).error(function(errorText){
			errorFactory.raiseError(errorText, 'errorDatos');
		});
	};

	factory.getTurnosDia = function(fecha, callback, errCallBack){
		var inserturl = serverUrl + '/appointmentsByHour?fecha=' + formatDate.formatearFecha(fecha);
		$http({
			method: "GET",
			url: inserturl,
			headers:
			{token: loginService.getToken()}
		}).success(function (data){
			callback(data);
		}).error(function(errorText){
			errorFactory.raiseError(errorText, 'errorDatos');
		});
	};

	factory.getClients = function(callback){
		var inserturl = serverUrl + '/clients';
		$http({
			method: "GET",
			url: inserturl,
			headers:
			{token: loginService.getToken()}
		}).success(function (data){
			callback(data);
		}).error(function(errorText){
			errorFactory.raiseError(errorText, 'errorListaAutoCompletar');
		});
	};

	factory.getContainers = function(callback){
		var inserturl = serverUrl + '/containers';
		$http({
			method: "GET",
			url: inserturl,
			headers:
			{token: loginService.getToken()}
		}).success(function (data){
			callback(data);
		}).error(function(errorText){
			errorFactory.raiseError(errorText, 'errorListaAutoCompletar');
		});
	};

	factory.getShips = function(callback){
		var inserturl = serverUrl + '/ships';
		$http({
			method: "GET",
			url: inserturl,
			headers:
			{token: loginService.getToken()}
		}).success(function (data){
			callback(data);
		}).error(function(errorText){
			errorFactory.raiseError(errorText, 'errorListaAutoCompletar');
		});
	};

	factory.getContainersGates = function(callback){
		var inserturl = serverUrl + '/gates/containers';
		$http({
			method: "GET",
			url: inserturl,
			headers:
			{token: loginService.getToken()}
		}).success(function (data){
			callback(data);
		}).error(function(errorText){
			errorFactory.raiseError(errorText, 'errorListaAutoCompletar');
		});
	};

	factory.getShipsGates = function(callback){
		var inserturl = serverUrl + '/gates/ships';
		$http({
			method: "GET",
			url: inserturl,
			headers:
			{token: loginService.getToken()}
		}).success(function (data){
			callback(data);
		}).error(function(errorText){
			errorFactory.raiseError(errorText, 'errorListaAutoCompletar');
		});
	};

	return factory;
});