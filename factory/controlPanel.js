/**
 * Created by Diego Reyes on 3/19/14.
 */

myapp.factory('controlPanelFactory', ['$http', 'formatService', 'loginService', 'errorFactory', 'generalCache', function($http, formatService, loginService, errorFactory, generalCache){
	var factory = {};

	factory.getByDay = function(dia, callback){
		var inserturl = serverUrl + '/invoices/counts?fecha=' + dia;
		$http.get(inserturl)
			.success(function(data){
				if (data.status === 'OK'){
					var total = 0;
					for (var i = 0, len=data.data.length; i< len; i++){
						total += data.data[i].total;
					}
					data.data.invoicesCount = total;
					data.invoicesCount = total;
				}
				callback(data);
			}).error(function(errorText){
				errorFactory.raiseError(errorText, inserturl, 'errorGetByDay', 'Error al el conteo diario de comprobantes.');
			});
	};

	factory.getTasas = function(fecha, moneda, callback){
		var inserturl = serverUrl + '/invoices/ratesTotal/' + moneda + '/?fecha=' + formatService.formatearFecha(fecha);
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
				errorFactory.raiseError(errorText, inserturl, 'errorTasas', 'Error al cargar total de facturado por tasa a las cargas.');
			});
	};

	factory.getTotales = function(fecha, callback){
		var inserturl = serverUrl + '/invoices/counts';
		$http.get(inserturl)
			.success(function (data){
				callback(data.data);
			}).error(function(errorText){
				errorFactory.raiseError(errorText, inserturl, 'errorTotales', 'Error al cargar conteo total de comprobantes.');
			});
	};

	factory.getTasasContenedor = function(datos, callback){
		var inserturl = serverUrl + '/invoices/rates/' + loginService.getFiltro() + '/' + datos.contenedor + '/' + datos.currency;
		if (datos.contenedor != undefined && datos.contenedor != ''){
			$http.get(inserturl)
				.success(function (data){
					data.data = factory.ponerDescripcionCodigoItem(data.data);
					data = factory.calcularTotalTasas(data);
					callback(data);
				}).error(function(errorText){
					callback(errorText);
				});
		}
	};

	factory.getFacturasMeses = function(fecha, moneda, callback){
		var inserturl = serverUrl + '/invoices/countsByMonth/' + moneda + '?fecha=' + formatService.formatearFecha(fecha);
		$http.get(inserturl)
			.success(function (data){
				callback(data);
			}).error(function(errorText){
				errorFactory.raiseError(errorText, inserturl, 'errorFacturasMeses', 'Error al cargar gráfico de facturado por mes.');
			});
	};

	factory.getGatesMeses = function(fecha, callback){
		var inserturl = serverUrl + '/gates/ByMonth?fecha=' + formatService.formatearFecha(fecha);
		$http.get(inserturl)
			.success(function (data){
				callback(data.data);
			}).error(function(errorText){
				errorFactory.raiseError(errorText, inserturl, 'gatesMeses', 'Error al cargar gráfico de cantidad de Gates por mes.');
			});
	};

	factory.getTurnosMeses = function(fecha, callback){
		var inserturl = serverUrl + '/appointments/ByMonth?fecha=' + formatService.formatearFecha(fecha);
		$http.get(inserturl)
			.success(function (data){
				callback(data);
			}).error(function(errorText){
				errorFactory.raiseError(errorText, inserturl, 'turnosMeses', 'Error al cargar gráfico de cantidad de turnos por mes.');
			});
	};

	//A partir de la fecha pasada, devuelve la facturación por día, de la fecha y 4 fechas hacia atrás
	factory.getFacturadoPorDia = function(fecha, moneda, callback){
		var inserturl = serverUrl + '/invoices/countsByDate/' + moneda +'/?fecha=' + formatService.formatearFecha(fecha);
		$http.get(inserturl)
			.success(function (data){
				callback(data);
			}).error(function(errorText){
				errorFactory.raiseError(errorText, inserturl, 'errorFacturadoPorDia', 'Error al cargar monto facturado por día.');
			});
	};

	factory.getGatesDia = function(fecha, callback){
		var inserturl = serverUrl + '/gates/ByHour?fecha=' + formatService.formatearFecha(fecha);
		$http.get(inserturl)
			.success(function (data){
				callback(data.data);
			}).error(function(errorText){
				errorFactory.raiseError(errorText, inserturl, 'errorGatesTurnosDia', 'Error al cargar gráfico de gates por día.');
			});
	};

	factory.getTurnosDia = function(fecha, callback){
		var inserturl = serverUrl + '/appointments/ByHour?fecha=' + formatService.formatearFecha(fecha);
		$http.get(inserturl)
			.success(function (data){
				callback(data);
			}).error(function(errorText){
				errorFactory.raiseError(errorText, inserturl, 'errorGatesTurnosDia', 'Error al cargar gráfico de turnos por día.');
			});
	};

	factory.getClients = function(callback){
		var inserturl = serverUrl + '/invoices/'+loginService.getFiltro()+'/clients';
		$http.get(inserturl)
			.success(function (data){
				callback(data);
			}).error(function(errorText){
				callback(errorText);
			});
	};

	factory.getContainers = function(callback){
		var inserturl = serverUrl + '/invoices/'+loginService.getFiltro()+'/containers';
		$http.get(inserturl)
			.success(function (data){
				callback(data);
			}).error(function(errorText){
				callback(errorText);
			});
	};

	factory.getShips = function(callback){
		var inserturl = serverUrl + '/invoices/'+loginService.getFiltro()+'/ships';
		$http.get(inserturl)
			.success(function (data){
				callback(data);
			}).error(function(errorText){
				errorFactory.raiseError(errorText, inserturl, 'errorListaAutoCompletar', 'Error al cargar listado de buques.');
			});
	};

	factory.getContainersGates = function(callback){
		var inserturl = serverUrl + '/gates/'+loginService.getFiltro()+'/containers';
		$http.get(inserturl)
			.success(function (data){
				callback(data);
			}).error(function(errorText){
				callback(errorText);
			});
	};

	factory.getShipsGates = function(callback){
		var inserturl = serverUrl + '/gates/'+loginService.getFiltro()+'/ships';
		$http.get(inserturl)
			.success(function (data){
				callback(data);
			}).error(function(errorText){
				errorFactory.raiseError(errorText, inserturl, 'errorListaAutoCompletar', 'Error al cargar listado de buques.');
			});
	};

	factory.getContainersTurnos = function(callback){
		var inserturl = serverUrl + '/appointments/'+loginService.getFiltro()+'/containers';
		$http.get(inserturl)
			.success(function (data){
				callback(data);
			}).error(function(errorText){
				callback(errorText);
			});
	};

	factory.getShipsTurnos = function(callback){
		var inserturl = serverUrl + '/appointments/'+loginService.getFiltro()+'/ships';
		$http.get(inserturl)
			.success(function (data){
				callback(data);
			}).error(function(errorText){
				errorFactory.raiseError(errorText, inserturl, 'errorListaAutoCompletar', 'Error al cargar listado de buques.');
			});
	};

	factory.ponerDescripcionCodigoItem = function(data){
		data.forEach(function(detalle){
			detalle._id.descripcion = (generalCache.get('descripciones')[detalle._id.id]) ? generalCache.get('descripciones')[detalle._id.id] : 'No se halló la descripción, verifique que el código esté asociado';
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
}]);