/**
 * Created by leo on 14/04/14.
 */

myapp.factory('gatesFactory', ['$http', 'formatService', 'loginService', '$q', 'HTTPCanceler', 'APP_CONFIG',
	function($http, formatService, loginService, $q, HTTPCanceler, APP_CONFIG){

		class gatesFactory {
			constructor(){
				this.namespace = 'gates';
			}

			cancelRequest(request){
				HTTPCanceler.cancel(namespace, request);
			}

			getGate(datos, page, callback){
				this.cancelRequest('getGates');
				const defer = $q.defer();
				const canceler = HTTPCanceler.get(defer, namespace, 'getGates');
				const inserturl = `${APP_CONFIG.SERVER_URL}/gates/${loginService.filterTerminal}/${page.skip}/${page.limit}`;
				$http.get(inserturl, { params: formatService.formatearDatos(datos), timeout: canceler.promise }).then((response) => {
					callback(response.data);
				}).catch((response) => {
					if (response.status != -5) callback(response.data);
				});
			}

			getMissingInvoices(datos, page, callback){
				const defer = $q.defer();
				const canceler = HTTPCanceler.get(defer, namespace, 'getMissingInvoices');
				//var inserturl = APP_CONFIG.SERVER_URL + '/gates/' + loginService.getFiltro() + '/missingInvoices/' + page.skip + '/' + page.limit;
				const inserturl = `${APP_CONFIG.SERVER_URL}/gates/${loginService.filterTerminal}/missingInvoices`;
				$http.get(inserturl, { params: formatService.formatearDatos(datos), timeout: canceler.promise }).then((response) => {
					callback(response.data);
				}).catch((response) => {
					if (response.status != -5) callback(response.data);
				});
			}
		}

		return new gatesFactory();
	}]);