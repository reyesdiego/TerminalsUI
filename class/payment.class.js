    /**
    * Created by kolesnikov-a on 29/08/2016.
    */
myapp.factory('Payment', ['$http', '$q', 'APP_CONFIG', 'loginService', 'formatService', 'invoiceFactory', 'cacheService', function($http, $q, APP_CONFIG, loginService, formatService, invoiceFactory, cacheService){

    class Payment {
        constructor(searchParams, paymentData){
            this.invoices = {
                data: [],
                totalCount: 0
            };
            this.invoicesByContainer = {
                data: [],
                totalCount: 0
            };
            this.detail = [];
            this.reload = false;
            this.byContainer = false;
            if (searchParams)
                this.searchParams = searchParams;
            if (paymentData)
                this.setData(paymentData);
        }

        setData(paymentData){
            const descripciones = cacheService.cache.get('descripciones' + loginService.filterTerminal);
            angular.extend(this, paymentData);
            this.detail.forEach((detail) => {
                detail.desc = descripciones[detail._id];
            });
            this.verDetalle = false;
        }

        setRatesDescription(detallesLiquidacion){
            const descripciones = cacheService.cache.get('descripciones' + loginService.filterTerminal);
            let totalFinal = 0;
            let totalFinalAgp = 0;
            detallesLiquidacion.forEach((detalle) => {
                detalle.descripcion = descripciones[detalle._id.code];
                totalFinal += detalle.totalPeso;
                totalFinalAgp += detalle.totalPesoAgp;
            });
            detallesLiquidacion.totalFinal = totalFinal;
            detallesLiquidacion.totalFinalAgp = totalFinalAgp;
            return detallesLiquidacion;
        }

        getPrePaymentDetail(callback){
            const inserturl = `${APP_CONFIG.SERVER_URL}/paying/getPrePayment/${loginService.filterTerminal}`;
            let params = {};

            if (this._id){
                params = { paymentId: this._id }
            } else {
                params = formatService.formatearDatos(this.searchParams)
            }
            $http.get(inserturl, { params: params}).then((response) => {
                this.detail = this.setRatesDescription(response.data.data);
                callback(true, null);
            }).catch((err) => {
                callback(false, err);
            });
        }

        getInvoices(page){
            const deferred = $q.defer();
            let llamadas = [];
            llamadas.push(this.getInvoicesGrouped(page));
            llamadas.push(this.getInvoicesNotGrouped(page));
            $q.all(llamadas).then(() => {
                deferred.resolve();
            }).catch(() => {
                deferred.reject();
            });
            return deferred.promise;
        }

        getInvoicesNotGrouped(page){
            const deferred = $q.defer();
            if (this._id){
                invoiceFactory.getComprobantesLiquidados(page, this._id, this.searchParams, (data) => {
                    if (data.status == 'OK'){
                        this.invoices.data = data.data;
                        this.invoices.totalCount = data.totalCount;
                        deferred.resolve();
                    } else {
                        deferred.reject();
                    }
                });
            } else {
                invoiceFactory.getComprobantesLiquidar(page, this.searchParams, (data) => {
                    if (data.status == 'OK'){
                        this.invoices.data = data.data;
                        this.invoices.totalCount = data.totalCount;
                        deferred.resolve();
                    } else {
                        deferred.reject();
                    }
                });
            }
            return deferred.promise;
        }

        getInvoicesGrouped(page){
            const deferred = $q.defer();
            let alterModel = angular.copy(this.searchParams);
            alterModel.byContainer = true;
            if (this._id){
                invoiceFactory.getComprobantesLiquidados(page, this._id, alterModel, (data) => {
                    if (data.status == 'OK'){
                        this.invoicesByContainer.data = data.data;
                        this.invoicesByContainer.totalCount = data.totalCount;
                        deferred.resolve();
                    } else {
                        deferred.reject();
                    }
                });
            } else {
                invoiceFactory.getComprobantesLiquidar(page, alterModel, (data) => {
                    if (data.status == 'OK'){
                        this.invoicesByContainer.data = data.data;
                        this.invoicesByContainer.totalCount = data.totalCount;
                        deferred.resolve();
                    } else {
                        deferred.reject();
                    }
                });
            }
            return deferred.promise;
        }

        addToPrePayment(prePayment){
            const inserturl = `${APP_CONFIG.SERVER_URL}/paying/addToPrePayment/${loginService.filterTerminal}`;
            const liquidacion = {
                paymentId: prePayment
            };
            return $http.put(inserturl, liquidacion,{ params: formatService.formatearDatos(this.searchParams) })
        }

        deletePayment(){
            const inserturl = `${APP_CONFIG.SERVER_URL}/paying/prePayment/${this._id}`;

            return $http({
                method: 'POST',
                url: inserturl
            });
            //return $http.delete(inserturl)
        }


        setPayment(){
            const inserturl = `${APP_CONFIG.SERVER_URL}/paying/payment`;
            return $http.put(inserturl, {terminal: loginService.filterTerminal, preNumber: this.preNumber})
        }

    }

    return Payment;

}]);