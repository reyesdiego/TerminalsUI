/**
 * Created by Diego Reyes on 3/19/14.
 */

myapp.factory('controlPanelFactory', ['$http', 'formatService', 'loginService', 'errorFactory', 'generalCache', '$q', 'HTTPCanceler',
	function($http, formatService, loginService, errorFactory, generalCache, $q, HTTPCanceler){
		var factory = {};
		var namespace = 'control';

		factory.getByDay = function(dia, callback){
			var defer = $q.defer();
			var canceler = HTTPCanceler.get(defer, namespace, 'getByDay');
			var inserturl = serverUrl + '/invoices/counts';
			$http.get(inserturl, { params: formatService.formatearDatos(dia), timeout: canceler.promise })
				.success(function(data){
					if (data.status === 'OK'){
						var invoicesCount = 0, totalCount = 0;
						for (var i = 0, len=data.data.length; i< len; i++){
							invoicesCount += data.data[i].cnt;
							totalCount += data.data[i].total;
						}
						data.data.invoicesCount = invoicesCount;
						data.data.totalCount = totalCount;
						data.invoicesCount = invoicesCount;
						data.totalCount = totalCount;
					}
					callback(data);
				}).error(function(errorText, status){
					if (status != 0) errorFactory.raiseError(errorText, inserturl, 'errorGetByDay', 'Error al cargar el conteo diario de comprobantes.');
				});
		};

		factory.getTasas = function(datos, callback){
			var defer = $q.defer();
			var canceler = HTTPCanceler.get(defer, namespace, 'getTasas');
			var inserturl = serverUrl + '/invoices/ratesTotal/' + datos.moneda + '/';
			$http.get(inserturl, { params: formatService.formatearDatos(datos), timeout: canceler.promise })
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
				}).error(function(errorText, status){
					if (status != 0) errorFactory.raiseError(errorText, inserturl, 'errorTasas', 'Error al cargar total de facturado por tasa a las cargas.');
				});
		};

		factory.getTasasContenedor = function(datos, ruta, callback){
			var defer = $q.defer();
			var canceler = HTTPCanceler.get(defer, namespace, 'getTasasContenedor');
			var inserturl = serverUrl + '/invoices/rates/' + loginService.getFiltro() + '/' + datos.contenedor + '/' + datos.currency;
			var queryString = {};
			if (ruta == 'buque') queryString = {
				buqueNombre: datos.buqueNombre,
				viaje: datos.viaje
			};
			if (datos.contenedor != undefined && datos.contenedor != ''){
				$http.get(inserturl, { params: formatService.formatearDatos(queryString), timeout: canceler.promise})
					.success(function (data){
						data = ponerDescripcionYTasas(data);
						callback(data);
					}).error(function(errorText, status){
						if (status != 0) callback(errorText);
					});
			}
		};

		factory.getFacturasMeses = function(datos, callback){
			var defer = $q.defer();
			var canceler = HTTPCanceler.get(defer, namespace, 'getFacturasMeses');
			var inserturl = serverUrl + '/invoices/countsByMonth' ;
			$http.get(inserturl, { params: formatService.formatearDatos(datos), timeout: canceler.promise })
				.success(function (data){
					callback(data);
				}).error(function(errorText, status){
					if (status != 0) errorFactory.raiseError(errorText, inserturl, 'errorFacturasMeses', 'Error al cargar gráfico de facturado por mes.');
				});
		};

		factory.getGatesMeses = function(datos, callback){
			var defer = $q.defer();
			var canceler = HTTPCanceler.get(defer, namespace, 'getGatesMeses');
			var inserturl = serverUrl + '/gates/ByMonth';
			$http.get(inserturl, { params: formatService.formatearDatos(datos), timeout: canceler.promise })
				.success(function (data){
					callback(data.data);
				}).error(function(errorText, status){
					if (status != 0) errorFactory.raiseError(errorText, inserturl, 'gatesMeses', 'Error al cargar gráfico de cantidad de Gates por mes.');
				});
		};

		factory.getTurnosMeses = function(datos, callback){
			var defer = $q.defer();
			var canceler = HTTPCanceler.get(defer, namespace, 'getTurnosMeses');
			var inserturl = serverUrl + '/appointments/ByMonth';
			$http.get(inserturl, { params: formatService.formatearDatos(datos), timeout: canceler.promise })
				.success(function (data){
					callback(data);
				}).error(function(errorText, status){
					if (status != 0) errorFactory.raiseError(errorText, inserturl, 'turnosMeses', 'Error al cargar gráfico de cantidad de turnos por mes.');
				});
		};

		//A partir de la fecha pasada, devuelve la facturación por día, de la fecha y 4 fechas hacia atrás
		factory.getFacturadoPorDia = function(datos, callback){
			var defer = $q.defer();
			var canceler = HTTPCanceler.get(defer, namespace, 'getFacturadoPorDia');
			var inserturl = serverUrl + '/invoices/countsByDate';
			$http.get(inserturl, { params: formatService.formatearDatos(datos), timeout: canceler.promise })
				.success(function (data){
					callback(data);
				}).error(function(errorText, status){
					if (status != 0) errorFactory.raiseError(errorText, inserturl, 'errorFacturadoPorDia', 'Error al cargar monto facturado por día.');
				});
		};

		factory.getGatesDia = function(datos, callback){
			var defer = $q.defer();
			var canceler = HTTPCanceler.get(defer, namespace, 'getGatesDia');
			var inserturl = serverUrl + '/gates/ByHour';
			$http.get(inserturl, { params: formatService.formatearDatos(datos), timeout: canceler.promise })
				.success(function (data){
					callback(data.data);
				}).error(function(errorText, status){
					if (status != 0) errorFactory.raiseError(errorText, inserturl, 'errorGatesTurnosDia', 'Error al cargar gráfico de gates por día.');
				});
		};

		factory.getTurnosDia = function(datos, callback){
			var defer = $q.defer();
			var canceler = HTTPCanceler.get(defer, namespace, 'getTurnosDia');
			var inserturl = serverUrl + '/appointments/ByHour';
			$http.get(inserturl, { params: formatService.formatearDatos(datos), timeout: canceler.promise })
				.success(function (data){
					callback(data);
				}).error(function(errorText, status){
					if (status != 0) errorFactory.raiseError(errorText, inserturl, 'errorGatesTurnosDia', 'Error al cargar gráfico de turnos por día.');
				});
		};

		//No es necesario poder cancelarlos por separado, no se hacen llamadas sucesivas
		factory.cancelRequest = function(){
			HTTPCanceler.cancel(namespace);
		};

		//Método de caché - No hace falta cancelarlo - Se pasa la terminal
		factory.getClients = function(terminal, callback){
			var inserturl = serverUrl + '/invoices/' + terminal + '/clients';
			$http.get(inserturl)
				.success(function (data){
					callback(data);
				}).error(function(errorText){
					if (errorText == null) errorText = {status: 'ERROR'};
					callback(errorText);
				});
		};

		//Método de caché - No hace falta cancelarlo
		factory.getShips = function(callback){
			var inserturl = serverUrl + '/invoices/'+loginService.getFiltro()+'/ships';
			$http.get(inserturl)
				.success(function (data){
					callback(data);
				}).error(function(errorText){
					errorFactory.raiseError(errorText, inserturl, 'errorListaAutoCompletar', 'Error al cargar listado de buques.');
				});
		};

		factory.getFacturacionEmpresas = function(datos, callback){
			var inserturl = serverUrl + '/invoices/totalClient';
			$http.get(inserturl, {params: formatService.formatearDatos(datos)})
				.success(function(data){
					callback(data);
				}).error(function(error){
					callback(error);
				})
		};

		factory.getTopFacturacionEmpresas = function(datos, callback){
			var inserturl = serverUrl + '/invoices/totalClientTop';
			$http.get(inserturl, {params: formatService.formatearDatos(datos)})
				.success(function(data){
					callback(data);
				}).error(function(error){
					callback(error);
				})
		};

		factory.getFacturacionEmpresasCSV = function(datos, callback){
			var inserturl = serverUrl + '/invoices/totalClient';
			$http.get(inserturl, {params: formatService.formatearDatos(datos)})
				.success(function(data, status, headers){
					var contentType = headers('Content-Type');
					if (contentType.indexOf('text/csv') >= 0){
						callback(data, 'OK');
					} else {
						callback(data, 'ERROR');
					}
				}).error(function(error){
					callback(error);
				})
		};

		function ponerDescripcionYTasas(data) {
			var datos = data;
			var descripciones = generalCache.get('descripciones' + loginService.getFiltro());
			datos.totalTasas = 0;
			data.data.forEach(function(detalle){
				detalle._id.descripcion = (descripciones[detalle._id.id]) ? descripciones[detalle._id.id] : 'No se halló la descripción, verifique que el código esté asociado';
				datos.totalTasas += detalle.total;
			});
			return datos;
		}

		return factory;
	}]);