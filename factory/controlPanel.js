/**
 * Created by Diego Reyes on 3/19/14.
 */

myapp.factory('controlPanelFactory', ['$http', 'formatService', 'loginService', 'errorFactory', 'generalCache', '$q', 'HTTPCanceler', 'APP_CONFIG',
	function($http, formatService, loginService, errorFactory, generalCache, $q, HTTPCanceler, APP_CONFIG){
		var factory = {};
		var namespace = 'control';

		factory.getByDay = function(dia, callback){
			var defer = $q.defer();
			var canceler = HTTPCanceler.get(defer, namespace, 'getByDay');
			var inserturl = APP_CONFIG.SERVER_URL + '/invoices/counts';
			$http.get(inserturl, { params: formatService.formatearDatos(dia), timeout: canceler.promise })
				.then(function(response){
					if (response.statusText === 'OK'){
						var invoicesCount = 0, totalCount = 0;
						for (var i = 0, len=response.data.data.length; i< len; i++){
							invoicesCount += response.data.data[i].cnt;
							totalCount += response.data.data[i].total;
						}
						response.data.data.invoicesCount = invoicesCount;
						response.data.data.totalCount = totalCount;
						response.data.invoicesCount = invoicesCount;
						response.data.totalCount = totalCount;
					}
					callback(response.data);
				}, function(response){
					if (response.status != -5) errorFactory.raiseError(response.data, inserturl, 'errorGetByDay', 'Error al cargar el conteo diario de comprobantes.');
				});
		};

		factory.getTasas = function(datos, callback){
			var defer = $q.defer();
			var canceler = HTTPCanceler.get(defer, namespace, 'getTasas');
			var inserturl = APP_CONFIG.SERVER_URL + '/invoices/ratesTotal/' + datos.moneda + '/';
			$http.get(inserturl, { params: formatService.formatearDatos(datos), timeout: canceler.promise })
				.then(function(response){
					var result = {
						"ratesCount": 0,
						"ratesTotal": 0,
						"dataGraf": []
					};
					if (response.data.data.length){
						var cnt = 0;
						var facturado = 0;
						for (var i = 0, len=response.data.data.length; i< len; i++){
							cnt += response.data.data[i].cnt;
							facturado += response.data.data[i].total;
						}
						result = {
							"ratesCount": cnt,
							"ratesTotal": facturado,
							"dataGraf": response.data.data
						}
					}
					callback(result);
				}, function(response){
					if (response.status != -5) errorFactory.raiseError(response.data, inserturl, 'errorTasas', 'Error al cargar total de facturado por tasa a las cargas.');
				});
		};

		factory.getTasasContenedor = function(datos, ruta, callback){
			var defer = $q.defer();
			var canceler = HTTPCanceler.get(defer, namespace, 'getTasasContenedor');
			var inserturl = APP_CONFIG.SERVER_URL + '/invoices/rates/' + loginService.getFiltro() + '/' + datos.contenedor + '/' + datos.currency;
			var queryString = {};
			if (ruta == 'buque') queryString = {
				buqueNombre: datos.buqueNombre,
				viaje: datos.viaje
			};
			if (datos.contenedor != undefined && datos.contenedor != ''){
				$http.get(inserturl, { params: formatService.formatearDatos(queryString), timeout: canceler.promise})
					.then(function (response){
						response.data = ponerDescripcionYTasas(response.data);
						callback(response.data);
					}, function(response){
						if (response.status != -5) callback(response.data);
					});
			}
		};

		factory.getFacturasMeses = function(datos, callback){
			var defer = $q.defer();
			var canceler = HTTPCanceler.get(defer, namespace, 'getFacturasMeses');
			var inserturl = APP_CONFIG.SERVER_URL + '/invoices/countsByMonth' ;
			$http.get(inserturl, { params: formatService.formatearDatos(datos), timeout: canceler.promise })
				.then(function (response){
					callback(response.data);
				}, function(response){
					if (response.status != -5) errorFactory.raiseError(response.data, inserturl, 'errorFacturasMeses', 'Error al cargar gráfico de facturado por mes.');
				});
		};

		factory.getGatesMeses = function(datos, callback){
			var defer = $q.defer();
			var canceler = HTTPCanceler.get(defer, namespace, 'getGatesMeses');
			var inserturl = APP_CONFIG.SERVER_URL + '/gates/ByMonth';
			$http.get(inserturl, { params: formatService.formatearDatos(datos), timeout: canceler.promise })
				.then(function (response){
					callback(response.data.data);
				}, function(response){
					if (response.status != -5) errorFactory.raiseError(response.data, inserturl, 'gatesMeses', 'Error al cargar gráfico de cantidad de Gates por mes.');
				});
		};

		factory.getTurnosMeses = function(datos, callback){
			var defer = $q.defer();
			var canceler = HTTPCanceler.get(defer, namespace, 'getTurnosMeses');
			var inserturl = APP_CONFIG.SERVER_URL + '/appointments/ByMonth';
			$http.get(inserturl, { params: formatService.formatearDatos(datos), timeout: canceler.promise })
				.then(function (response){
					callback(response.data);
				}, function(response){
					if (response.status != -5) errorFactory.raiseError(response.data, inserturl, 'turnosMeses', 'Error al cargar gráfico de cantidad de turnos por mes.');
				});
		};

		//A partir de la fecha pasada, devuelve la facturación por día, de la fecha y 4 fechas hacia atrás
		factory.getFacturadoPorDia = function(datos, callback){
			var defer = $q.defer();
			var canceler = HTTPCanceler.get(defer, namespace, 'getFacturadoPorDia');
			var inserturl = APP_CONFIG.SERVER_URL + '/invoices/countsByDate';
			$http.get(inserturl, { params: formatService.formatearDatos(datos), timeout: canceler.promise })
				.then(function (response){
					callback(response.data);
				}, function(response){
					if (response.status != -5) errorFactory.raiseError(response.data, inserturl, 'errorFacturadoPorDia', 'Error al cargar monto facturado por día.');
				});
		};

		factory.getGatesDia = function(datos, callback){
			var defer = $q.defer();
			var canceler = HTTPCanceler.get(defer, namespace, 'getGatesDia');
			var inserturl = APP_CONFIG.SERVER_URL + '/gates/ByHour';
			$http.get(inserturl, { params: formatService.formatearDatos(datos), timeout: canceler.promise })
				.then(function (response){
					callback(response.data.data);
				}, function(response){
					if (response.status != -5) errorFactory.raiseError(response.data, inserturl, 'errorGatesTurnosDia', 'Error al cargar gráfico de gates por día.');
				});
		};

		factory.getTurnosDia = function(datos, callback){
			var defer = $q.defer();
			var canceler = HTTPCanceler.get(defer, namespace, 'getTurnosDia');
			var inserturl = APP_CONFIG.SERVER_URL + '/appointments/ByHour';
			$http.get(inserturl, { params: formatService.formatearDatos(datos), timeout: canceler.promise })
				.then(function (response){
					callback(response.data);
				}, function(response){
					if (response.status != -5) errorFactory.raiseError(response.data, inserturl, 'errorGatesTurnosDia', 'Error al cargar gráfico de turnos por día.');
				});
		};

		//No es necesario poder cancelarlos por separado, no se hacen llamadas sucesivas
		factory.cancelRequest = function(){
			HTTPCanceler.cancel(namespace);
		};

		//Método de caché - No hace falta cancelarlo - Se pasa la terminal
		factory.getClients = function(terminal, callback){
			var inserturl = APP_CONFIG.SERVER_URL + '/invoices/' + terminal + '/clients';
			$http.get(inserturl)
				.then(function (response){
					callback(response.data);
				}, function(response){
					if (response.data == null) response.data = {status: 'ERROR'};
					callback(response.data);
				});
		};

		//Método de caché - No hace falta cancelarlo
		factory.getShips = function(callback){
			var inserturl = APP_CONFIG.SERVER_URL + '/invoices/'+loginService.getFiltro()+'/ships';
			$http.get(inserturl)
				.success(function (response){
					callback(response.data);
				}, function(response){
					errorFactory.raiseError(response.data, inserturl, 'errorListaAutoCompletar', 'Error al cargar listado de buques.');
				});
		};

		factory.getFacturacionEmpresas = function(datos, callback){
			var inserturl = APP_CONFIG.SERVER_URL + '/invoices/totalClient';
			$http.get(inserturl, {params: formatService.formatearDatos(datos)})
				.then(function(response){
					callback(response.data);
				}, function(response){
					callback(response.data);
				});
		};

		factory.getTopFacturacionEmpresas = function(datos, callback){
			var inserturl = APP_CONFIG.SERVER_URL + '/invoices/totalClientTop';
			$http.get(inserturl, {params: formatService.formatearDatos(datos)})
				.then(function(response){
					callback(response.data);
				}, function(response){
					callback(response.data);
				});
		};

		factory.getFacturacionEmpresasCSV = function(datos, callback){
			var inserturl = APP_CONFIG.SERVER_URL + '/invoices/totalClient';
			$http.get(inserturl, {params: formatService.formatearDatos(datos)})
				.then(function(response){
					var contentType = response.headers('Content-Type');
					if (contentType.indexOf('text/csv') >= 0){
						callback(response.data, 'OK');
					} else {
						callback(response.data, 'ERROR');
					}
				}, function(response){
					callback(response.data, 'ERROR');
				});
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