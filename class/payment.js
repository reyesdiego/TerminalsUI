/**
 * Created by kolesnikov-a on 29/08/2016.
 */
myapp.factory('Payment', ['$http', '$q', 'APP_CONFIG', 'loginService', 'formatService', 'invoiceFactory', 'generalCache', function($http, $q, APP_CONFIG, loginService, formatService, invoiceFactory, generalCache){

	function Payment(searchParams, paymentData){
		this.invoices = {
			data: [],
			totalCount: 0
		};
		this.invoicesByContainer = {
			data: [],
			totalCount: 0
		};
		this.detail = [];
		if (searchParams)
			this.searchParams = searchParams;
		if (paymentData)
			this.setData(paymentData);

	}

	Payment.prototype = {
		setData: function(paymentData){
			var descripciones = generalCache.get('descripciones' + loginService.getFiltro());
			angular.extend(this, paymentData);
			this.detail.forEach(function(detail){
				detail.desc = descripciones[detail._id];
			});
			this.verDetalle = false;
		},
		setRatesDescription: function(detallesLiquidacion){
			var descripciones = generalCache.get('descripciones' + loginService.getFiltro());
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
		getPrePaymentDetail: function(callback){
			var inserturl = APP_CONFIG.SERVER_URL + '/paying/getPrePayment/' + loginService.getFiltro();
			var params = {};
			var scope = this;

			if (this._id){
				params = { paymentId: this._id }
			} else {
				params = formatService.formatearDatos(this.searchParams)
			}
			$http.get(inserturl, { params: params})
					.then(function(response){
						scope.detail = scope.setRatesDescription(response.data.data);
						callback(true, null);
					}, function(err){
						callback(false, err);
					});
		},
		getInvoices: function(page, callback){
			var llamadas = [];
			llamadas.push(this.getInvoicesGrouped(page));
			llamadas.push(this.getInvoicesNotGrouped(page));
			$q.all(llamadas)
					.then(function(){
						callback(true);
					}, function(){
						callback(false)
					})
		},
		getInvoicesNotGrouped: function(page){
			var deferred = $q.defer();
			var scope = this;
			if (this._id){
				invoiceFactory.getComprobantesLiquidados(page, this._id, this.searchParams, function(data){
					if (data.status == 'OK'){
						scope.invoices.data = data.data;
						scope.invoices.totalCount = data.totalCount;
						deferred.resolve();
					} else {
						deferred.reject();
					}
				});
			} else {
				invoiceFactory.getComprobantesLiquidar(page, this.searchParams, function(data){
					if (data.status == 'OK'){
						scope.invoices.data = data.data;
						scope.invoices.totalCount = data.totalCount;
						deferred.resolve();
					} else {
						deferred.reject();
					}
				});
			}
			return deferred.promise;
		},
		getInvoicesGrouped: function(page){
			var deferred = $q.defer();
			var alterModel = angular.copy(this.searchParams);
			var scope = this;
			alterModel.byContainer = true;
			if (this._id){
				invoiceFactory.getComprobantesLiquidados(page, this._id, alterModel, function(data){
					if (data.status == 'OK'){
						scope.invoicesByContainer.data = data.data;
						scope.invoicesByContainer.totalCount = data.totalCount;
						deferred.resolve();
					} else {
						deferred.reject();
					}
				});
			} else {
				invoiceFactory.getComprobantesLiquidar(page, alterModel, function(data){
					if (data.status == 'OK'){
						scope.invoicesByContainer.data = data.data;
						scope.invoicesByContainer.totalCount = data.totalCount;
						deferred.resolve();
					} else {
						deferred.reject();
					}
				});
			}
			return deferred.promise;
		},
		addToPrePayment: function(prePayment){
			var inserturl = APP_CONFIG.SERVER_URL + '/paying/addToPrePayment/' + loginService.getFiltro();
			var liquidacion = {
				paymentId: prePayment
			};
			return $http.put(inserturl, liquidacion,{ params: formatService.formatearDatos(this.searchParams) })
		},
		deletePayment: function(){
			var inserturl = APP_CONFIG.SERVER_URL + '/paying/prePayment/' + this._id;
			return $http.delete(inserturl)
		},
		setPayment: function(){
			var inserturl = APP_CONFIG.SERVER_URL + '/paying/payment';
			return $http.put(inserturl, {terminal: loginService.getFiltro(), preNumber: this.preNumber})
		}
	};

	return Payment;

}]);