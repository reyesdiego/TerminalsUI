/**
 * Created by artiom on 13/07/15.
 */
myapp.factory('liquidacionesFactory', ['$http', 'loginService', 'formatService', 'invoiceFactory', '$q', 'HTTPCanceler', 'cacheService', 'APP_CONFIG', 'Payment', 'downloadService',
	function($http, loginService, formatService, invoiceFactory, $q, HTTPCanceler, cacheService, APP_CONFIG, Payment, downloadService){

		class liquidacionesFactory {
			constructor(){
				this.namespace = 'liquidaciones';
			}

			cancelRequest(request){
				HTTPCanceler.cancel(this.namespace, request);
			}

			retrievePayment(paymentsData, searchParams){
				let paymentsArray = [];
				paymentsData.forEach((paymentData) => {
					paymentsArray.push(new Payment(searchParams, paymentData));
				});
				return paymentsArray;
			}

			getNotPayedCsv(datos, callback){
				const inserturl = `${APP_CONFIG.SERVER_URL}/paying/notPayed/${loginService.filterTerminal}/download`;
				$http.get(inserturl, { params: formatService.formatearDatos(datos)}).then((response) => {
					const contentType = response.headers('Content-Type');
					if (contentType.indexOf('text/csv') >= 0){
						downloadService.setDownloadCsv('SinLiquidar.csv', response.data);
						callback('OK');
					} else {
						callback('ERROR');
					}
				}).catch((response) => {
					callback('ERROR');
				});
			}

			getPriceDollar(callback){
				const inserturl = `${APP_CONFIG.SERVER_URL}/afip/dollars`;
				$http.get(inserturl).then((response) => {
					callback(response.data);
				}).catch((response) => {
					callback(response.data);
				});
			}

			saveMat(data, update, callback){
				const inserturl = `${APP_CONFIG.SERVER_URL}/mats/mat`;
				let promise;
				if (update){
					promise = $http.put(inserturl, data)
				} else {
					promise = $http.post(inserturl, data)
				}
				promise.then((response) => {
					callback(response.data);
				}).catch((response) => {
					callback(response.data);
				});
			}

			getMAT(year, callback){
				const inserturl = `${APP_CONFIG.SERVER_URL}/mats`;
				//var inserturl = 'mocks/mat.json'; //mocked route
				$http.get(inserturl).then((response) => {
					callback(response.data);
				}).catch((response) => {
					callback(response.data);
				});
			}

			getMatFacturado(year, callback){
				// var inserturl = APP_CONFIG.SERVER_URL + '/alguna ruta en donde se use el year;
				const inserturl = 'mocks/matFacturado.json'; //mocked route
				$http.get(inserturl).then((response) => {
					callback(response.data);
				}).catch((response) => {
					callback(response.data);
				});
			}

			getPrePayments(page, datos, callback){
				this.cancelRequest('preliquidaciones');
				const defer = $q.defer();
				const canceler = HTTPCanceler.get(defer, this.namespace, 'preliquidaciones');
				const inserturl = `${APP_CONFIG.SERVER_URL}/paying/prePayments/${loginService.filterTerminal}/${page.skip}/${page.limit}`;
				$http.get(inserturl, { params: formatService.formatearDatos(datos), timeout: canceler.promise }).then((response) => {
					response.data.data = this.retrievePayment(response.data.data, datos);
					callback(response.data);
				}).catch((response) => {
					if (response.status != -5) callback(response.data);
				});
			}

			getPayments(page, datos, callback){
				this.cancelRequest('liquidaciones');
				const defer = $q.defer();
				const canceler = HTTPCanceler.get(defer, this.namespace, 'liquidaciones');
				const inserturl = `${APP_CONFIG.SERVER_URL}/paying/payments/${loginService.filterTerminal}/${page.skip}/${page.limit}`;
				$http.get(inserturl, { params: formatService.formatearDatos(datos), timeout: canceler.promise }).then((response) => {
					response.data.data = this.retrievePayment(response.data.data, datos);
					callback(response.data);
				}).catch((response) => {
					if (response.status != -5) callback(response.data);
				});
			}

			setPrePayment(callback){
				const inserturl = `${APP_CONFIG.SERVER_URL}/paying/prePayment`;
				$http.post(inserturl, { terminal: loginService.filterTerminal }).then((response) => {
					callback(response.data);
				}).catch((response) => {
					if (response.data == null){
						response.data = {
							status: 'ERROR'
						}
					}
					callback(response.data);
				});
			}

		}

		return new liquidacionesFactory();

	}]);