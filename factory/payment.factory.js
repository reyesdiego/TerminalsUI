/**
 * Created by artiom on 13/07/15.
 */
myapp.factory('liquidacionesFactory', ['$http', 'loginService', 'formatService', 'invoiceFactory', '$q', 'HTTPCanceler', 'cacheService', 'APP_CONFIG', 'Payment', 'downloadService',
	function($http, loginService, formatService, invoiceFactory, $q, HTTPCanceler, cacheService, APP_CONFIG, Payment, downloadService){

		var liquidacionesFactory = {
			namespace: 'liquidaciones',
			retrievePayment: function(paymentsData, searchParams){
				var paymentsArray = [];
				paymentsData.forEach(function(paymentData){
					var payment = new Payment(searchParams, paymentData);
					paymentsArray.push(payment);
				});
				return paymentsArray;
			},
			getNotPayedCsv: function(datos, callback){
				var inserturl = APP_CONFIG.SERVER_URL + '/paying/notPayed/' + loginService.getFiltro() +'/download';
				$http.get(inserturl, { params: formatService.formatearDatos(datos)})
						.then(function(response){
							var contentType = response.headers('Content-Type');
							if (contentType.indexOf('text/csv') >= 0){
								downloadService.setDownloadCsv('SinLiquidar.csv', response.data);
								callback('OK');
							} else {
								callback('ERROR');
							}
						}, function(response){
							callback('ERROR');
						});
			},
			getPriceDollar: function(callback){
				var inserturl = APP_CONFIG.SERVER_URL + '/afip/dollars';
				$http.get(inserturl)
						.then(function(response){
							callback(response.data);
						}, function(response){
							callback(response.data);
						});
			},
			saveMat: function(data, update, callback){
				var inserturl = APP_CONFIG.SERVER_URL + '/mats/mat';
				if (update){
					$http.put(inserturl, data)
							.then(function(response){
								callback(response.data);
							}, function(response){
								callback(response.data);
							});
				} else {
					$http.post(inserturl, data)
							.then(function(response){
								callback(response.data);
							}, function(response){
								callback(response.data);
							});
				}
			},
			getMAT: function(year, callback){
				var inserturl = APP_CONFIG.SERVER_URL + '/mats';
				//var inserturl = 'mocks/mat.json'; //mocked route
				$http.get(inserturl)
						.then(function(response){
							callback(response.data);
						}, function(response){
							callback(response.data);
						});
			},
			getMatFacturado: function(year, callback){
				// var inserturl = APP_CONFIG.SERVER_URL + '/alguna ruta en donde se use el year;
				var inserturl = 'mocks/matFacturado.json'; //mocked route
				$http.get(inserturl)
						.then(function(response){
							callback(response.data);
						}, function(response){
							callback(response.data);
						});
			},
			estadoAdapter: function(comprobantes){
				comprobantes.forEach(function(comprobante){
					var tempEstado = comprobante.estado;
					comprobante.estado = [];
					comprobante.estado.push(tempEstado);
				});
				return comprobantes;
			},
			getPrePayments: function(page, datos, callback){
				this.cancelRequest('preliquidaciones');
				var defer = $q.defer();
				var canceler = HTTPCanceler.get(defer, this.namespace, 'preliquidaciones');
				var inserturl = APP_CONFIG.SERVER_URL + '/paying/prePayments/' + loginService.getFiltro() + '/' + page.skip + '/' + page.limit;
				var factory = this;
				$http.get(inserturl, { params: formatService.formatearDatos(datos), timeout: canceler.promise })
						.then(function(response){
							response.data.data = factory.retrievePayment(response.data.data, datos);
							callback(response.data);
						}, function(response){
							if (response.status != -5) callback(response.data);
						});
			},
			getPayments: function(page, datos, callback){
				this.cancelRequest('liquidaciones');
				var defer = $q.defer();
				var canceler = HTTPCanceler.get(defer, this.namespace, 'liquidaciones');
				var inserturl = APP_CONFIG.SERVER_URL + '/paying/payments/' + loginService.getFiltro() + '/' + page.skip + '/' + page.limit;
				var factory = this;
				$http.get(inserturl, { params: formatService.formatearDatos(datos), timeout: canceler.promise })
						.then(function(response){
							response.data.data = factory.retrievePayment(response.data.data, datos);
							callback(response.data);
						}, function(response){
							if (response.status != -5) callback(response.data);
						});
			},
			//No se debería poder cancelar
			setPrePayment: function(callback){
				var inserturl = APP_CONFIG.SERVER_URL + '/paying/prePayment';
				$http.post(inserturl, { terminal: loginService.getFiltro() })
						.then(function(response){
							callback(response.data);
						}, function(response){
							if (response.data == null){
								response.data = {
									status: 'ERROR'
								}
							}
							callback(response.data);
						});
			},
			getPrePayment: function(datos, callback){
				console.log('acá en get prePayment');
				console.log(datos);
				var inserturl = APP_CONFIG.SERVER_URL + '/paying/getPrePayment/' + loginService.getFiltro();
				var factory = this;
				$http.get(inserturl, { params: formatService.formatearDatos(datos)})
						.then(function(response){
							console.log(response);
							response.data.data = factory.setDescriptionTasas(response.data.data);
							callback(response.data);
						}, function(response){
							if (response.data == null){
								response.data = {
									status: 'ERROR'
								}
							}
							callback(response.data);
						});
			},
			setDescriptionTasas: function(detallesLiquidacion){
				var descripciones = cacheService.cache.get('descripciones' + loginService.getFiltro());
				var totalFinal = 0;
				var totalFinalAgp = 0;
				detallesLiquidacion.forEach(function(detalle){
					detalle.descripcion = descripciones[detalle._id.code];
					totalFinal += detalle.totalPeso;
					totalFinalAgp += detalle.totalPesoAgp;
				});
				detallesLiquidacion.totalFinal = totalFinal;
				detallesLiquidacion.totalFinalAgp = totalFinalAgp;
				return detallesLiquidacion;
			},
			cancelRequest: function(request){
				HTTPCanceler.cancel(this.namespace, request);
			}
		};

		return liquidacionesFactory;

	}]);