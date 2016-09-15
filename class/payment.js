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
			angular.extend(this, paymentData);
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
			console.log('calss detail');
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
						console.log('el detalle');
						console.log(scope.detail);
						callback(true, null);
					}, function(err){
						callback(false, err);
					});
		},
		getInvoices: function(page, callback){
			console.log('get invoices');
			var llamadas = [];
			llamadas.push(this.getInvoicesGrouped(page));
			llamadas.push(this.getInvoicesNotGrouped(page));
			$q.all(llamadas)
					.then(function(){
						console.log('estan las invoices');
						callback(true);
					}, function(){
						callback(false)
					})
		},
		getInvoicesNotGrouped: function(page){
			console.log('sin agrupar');
			var deferred = $q.defer();
			var scope = this;
			invoiceFactory.getComprobantesLiquidar(page, this.searchParams, function(data){
				console.log('sin agrupar data ' + data);
				if (data.status == 'OK'){
					scope.invoices.data = data.data;
					scope.invoices.totalCount = data.totalCount;
					//deferred.resolve(data.totalCount);
					deferred.resolve();
				} else {
					//$scope.sinLiquidar.comprobantes = [];
					deferred.reject();
				}
			});
			return deferred.promise;
		},
		getInvoicesGrouped: function(page){
			console.log('agrupadas');
			var deferred = $q.defer();
			var alterModel = angular.copy(this.searchParams);
			var scope = this;
			alterModel.byContainer = true;
			invoiceFactory.getComprobantesLiquidar(page, alterModel, function(data){
				console.log('agrupadas data ' + data);
				if (data.status == 'OK'){
					scope.invoicesByContainer.data = data.data;
					scope.invoicesByContainer.totalCount = data.totalCount;
					//$scope.sinLiquidar.comprobantesByContainer = data.data;
					//deferred.resolve(data.totalCount);
					deferred.resolve();
				} else {
					//$scope.sinLiquidar.comprobantesByContainer = [];
					deferred.reject();
				}
			});
			return deferred.promise;
		}

	};

	return Payment;

}]);