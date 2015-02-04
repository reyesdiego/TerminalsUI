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
			}).error(function(error){
				//errorFactory.raiseError(errorText, inserturl, 'errorGetByDay', 'Error al el conteo diario de comprobantes.');
				callback(error);
			});
	};

	factory.getTasas = function(fecha, moneda, callback){
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
			}).error(function(error){
				//errorFactory.raiseError(errorText, inserturl, 'errorTasas', 'Error al cargar total de facturado por tasa a las cargas.');
				callback(error);
			});
	};

	factory.getTotales = function(fecha, callback){
		var inserturl = serverUrl + '/invoices/counts';
		$http.get(inserturl)
			.success(function (data){
				callback(data.data);
			}).error(function(error){
				//errorFactory.raiseError(errorText, inserturl, 'errorTotales', 'Error al cargar conteo total de comprobantes.');
				callback(error)
			});
	};

	factory.getTasasContenedor = function(data, callback){
		var inserturl = serverUrl + '/invoices/rates/' + loginService.getFiltro() + '/' + data.contenedor + '/' + data.currency;
		if (data.contenedor != undefined && data.contenedor != ''){
			$http({
				method: "GET",
				url: inserturl,
				headers:
				{token: loginService.getToken()}
			}).success(function (data){
				data.data = factory.ponerDescripcionCodigoItem(data.data);
				data = factory.calcularTotalTasas(data);
				callback(data);
			}).error(function(error){
				callback(error);
			});
		}
	};

	factory.getFacturasMeses = function(fecha, moneda, callback){
		var inserturl = serverUrl + '/invoices/countsByMonth/' + moneda + '?fecha=' + formatDate.formatearFecha(fecha);
		$http.get(inserturl)
			.success(function (data){
				callback(data);
			}).error(function(error){
				//errorFactory.raiseError(errorText, inserturl, 'errorFacturasMeses', 'Error al cargar gráfico de facturado por mes.');
				callback(error)
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
			}).error(function(error){
				//errorFactory.raiseError(errorText, inserturl, 'gatesMeses', 'Error al cargar gráfico de cantidad de Gates por mes.');
				callback(error);
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
			}).error(function(error){
				//errorFactory.raiseError(errorText, inserturl, 'turnosMeses', 'Error al cargar gráfico de cantidad de turnos por mes.');
				callback(error);
			});
	};

	//A partir de la fecha pasada, devuelve la facturación por día, de la fecha y 4 fechas hacia atrás
	factory.getFacturadoPorDia = function(fecha, moneda, callback){
		var inserturl = serverUrl + '/invoices/countsByDate/' + moneda +'/?fecha=' + formatDate.formatearFecha(fecha);
		$http.get(inserturl)
			.success(function (data){
				callback(data);
			}).error(function(error){
				//errorFactory.raiseError(errorText, inserturl, 'errorFacturadoPorDia', 'Error al cargar monto facturado por día.');
				callback(error);
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
		}).error(function(error){
			//errorFactory.raiseError(errorText, inserturl, 'errorGatesTurnosDia', 'Error al cargar gráfico de gates por día.');
			callback(error);
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
		}).error(function(error){
			//errorFactory.raiseError(errorText, inserturl, 'errorGatesTurnosDia', 'Error al cargar gráfico de turnos por día.');
			callback(error);
		});
	};

	factory.getClients = function(callback){
		var inserturl = serverUrl + '/invoices/'+loginService.getFiltro()+'/clients';
		$http({
			method: "GET",
			url: inserturl,
			headers:
			{token: loginService.getToken()}
		}).success(function (data){
			callback(data);
		}).error(function(errorText){
			//errorFactory.raiseError(errorText, inserturl, 'errorListaAutoCompletar', 'Error al cargar listado de clientes.');
			console.log(errorText);
		});
	};

	factory.getContainers = function(callback){
		var inserturl = serverUrl + '/invoices/'+loginService.getFiltro()+'/containers';
		$http({
			method: "GET",
			url: inserturl,
			headers:
			{token: loginService.getToken()}
		}).success(function (data){
			callback(data);
		}).error(function(errorText){
			//errorFactory.raiseError(errorText, inserturl, 'errorListaAutoCompletar', 'Error al cargar listado de containers.');
			console.log(errorText);
		});
	};

	/*factory.getShips = function(callback){
		var inserturl = serverUrl + '/invoices/'+loginService.getFiltro()+'/ships';
		$http({
			method: "GET",
			url: inserturl,
			headers:
			{token: loginService.getToken()}
		}).success(function (data){
			callback(data);
		}).error(function(errorText){
			errorFactory.raiseError(errorText, inserturl, 'errorListaAutoCompletar', 'Error al cargar listado de buques.');
		});
	};*/ //No se está usando

	factory.getContainersGates = function(callback){
		var inserturl = serverUrl + '/gates/'+loginService.getFiltro()+'/containers';
		$http({
			method: "GET",
			url: inserturl,
			headers:
			{token: loginService.getToken()}
		}).success(function (data){
			callback(data);
		}).error(function(errorText){
			//errorFactory.raiseError(errorText, inserturl, 'errorListaAutoCompletar', 'Error al cargar listado de containers.');
			console.log(errorText);
		});
	};

	/*factory.getShipsGates = function(callback){
		var inserturl = serverUrl + '/gates/'+loginService.getFiltro()+'/ships';
		$http({
			method: "GET",
			url: inserturl,
			headers:
			{token: loginService.getToken()}
		}).success(function (data){
			callback(data);
		}).error(function(errorText){
			errorFactory.raiseError(errorText, inserturl, 'errorListaAutoCompletar', 'Error al cargar listado de buques.');
		});
	};*/ //No se está usando

	factory.getContainersTurnos = function(callback){
		var inserturl = serverUrl + '/appointments/'+loginService.getFiltro()+'/containers';
		$http({
			method: "GET",
			url: inserturl,
			headers:
			{token: loginService.getToken()}
		}).success(function (data){
			callback(data);
		}).error(function(errorText){
			//errorFactory.raiseError(errorText, inserturl, 'errorListaAutoCompletar', 'Error al cargar listado de containers.');
			console.log(errorText);
		});
	};

	/*factory.getShipsTurnos = function(callback){
		var inserturl = serverUrl + '/appointments/'+loginService.getFiltro()+'/ships';
		$http({
			method: "GET",
			url: inserturl,
			headers:
			{token: loginService.getToken()}
		}).success(function (data){
			callback(data);
		}).error(function(errorText){
			errorFactory.raiseError(errorText, inserturl, 'errorListaAutoCompletar', 'Error al cargar listado de buques.');
		});
	};*/ // No se está usando

	factory.ponerDescripcionCodigoItem = function(data){
		data.forEach(function(detalle){
			if (angular.isDefined($rootScope.itemsDescriptionInvoices[detalle._id.id])){
				detalle._id.descripcion = $rootScope.itemsDescriptionInvoices[detalle._id.id];
			} else {
				detalle._id.descripcion = "No se halló la descripción, verifique que el código esté asociado";
			}
		});
		return data;
	};

	factory.calcularTotalTasas = function(data){
		var datos = data;
		datos.totalTasas = 0;
		data.data.forEach(function(detalle){
			datos.totalTasas += detalle.total;
		});
		return datos;
	};

	return factory;
});