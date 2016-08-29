/**
 * Created by kolesnikov-a on 17/08/2016.
 */
myapp.factory('invoiceFactory', ['Invoice', '$http', '$q', 'HTTPCanceler', 'loginService', 'formatService', 'APP_CONFIG', function(Invoice, $http, $q, HTTPCanceler, loginService, formatService, APP_CONFIG){
    var invoiceFactory = {
        namespace: 'invoices',
        retrieveInvoices: function(invoicesData){
            var invoiceArray = [];
            invoicesData.forEach(function(invoiceData){
                var invoice = new Invoice(invoiceData);
                invoiceArray.push(invoice);
            });
            return invoiceArray;
        },
        getInvoices: function(idLlamada, datos, page, callback) {
            this.cancelRequest(idLlamada);
            var canceler = HTTPCanceler.get($q.defer(), this.namespace, idLlamada);
            var inserturl = APP_CONFIG.SERVER_URL + '/invoices/' + loginService.getFiltro() + '/' + page.skip + '/' + page.limit;
            var factory = this;
            $http.get(inserturl, { params: formatService.formatearDatos(datos), timeout: canceler.promise })
                .then(function(response){
                    response.data.data = factory.retrieveInvoices(response.data.data);
                    callback(response.data);
                }, function(response) {
                    if (response.status != -5) callback(response.data);
                });

        },
        getInvoicesNoMatches: function(datos, page, callback){
            this.cancelRequest('invoicesNoMatches');
            var canceler = HTTPCanceler.get($q.defer(), this.namespace, 'invoicesNoMatches');
            var inserturl = APP_CONFIG.SERVER_URL + '/invoices/noMatches/' + loginService.getFiltro() + '/' + page.skip + '/' + page.limit;
            var factory = this;
            $http.get(inserturl, { params: formatService.formatearDatos(datos), timeout: canceler.promise })
                .then(function (response) {
                    response.data.data = factory.retrieveInvoices(response.data.data);
                    callback(response.data);
                }, function(response) {
                    if (response.status != -5) callback(response.data);
                });
        },
        getComprobantesLiquidar: function(page, datos, callback){
            if (datos.byContainer){
                this.cancelRequest('comprobantesLiquidarContainer');
            } else {
                this.cancelRequest('comprobantesLiquidar');
            }
            var defer = $q.defer();
            var canceler;
            if (datos.byContainer){
                canceler = HTTPCanceler.get(defer, this.namespace, 'comprobantesLiquidarContainer');
            } else {
                canceler = HTTPCanceler.get(defer, this.namespace, 'comprobantesLiquidar');
            }
            var inserturl = APP_CONFIG.SERVER_URL + '/paying/notPayed/' + loginService.getFiltro() + '/' + page.skip + '/' + page.limit;
            var factory = this;
            $http.get(inserturl, { params: formatService.formatearDatos(datos), timeout: canceler.promise })
                .then(function(response){
                    response.data.data = factory.retrieveInvoices(response.data.data);
                    callback(response.data);
                }, function(response){
                    if (response.status != -5){
                        if (response.data == null){
                            response.data = {
                                status: 'ERROR'
                            }
                        }
                        callback(response.data);
                    }
                });
        },
        getComprobantesLiquidados: function(page, liquidacion, datos, callback){
            if (datos.byContainer){
                this.cancelRequest('comprobantesLiquidadosContainer');
            } else {
                this.cancelRequest('comprobantesLiquidados');
            }
            var defer = $q.defer();
            var canceler;
            if (datos.byContainer){
                canceler = HTTPCanceler.get(defer, this.namespace, 'comprobantesLiquidadosContainer');
            } else {
                canceler = HTTPCanceler.get(defer, this.namespace, 'comprobantesLiquidados');
            }
            var factory = this;
            var inserturl = APP_CONFIG.SERVER_URL + '/paying/payed/' + loginService.getFiltro() + '/' + liquidacion + '/' + page.skip + '/' + page.limit;
            $http.get(inserturl, { params: formatService.formatearDatos(datos), timeout: canceler.promise })
                .then(function(response){
                    response.data.data = factory.retrieveInvoices(response.data.data);
                    callback(response.data);
                }, function(response){
                    if (response.status != -5){
                        if (response.data == null){
                            response.data = {
                                status: 'ERROR',
                                message: 'Se ha producido un error al procesar la liquidación.'
                            }
                        }
                        callback(response.data);
                    }
                });
        },
        getCorrelative: function(datos, socketIoRegister, callback){
            this.cancelRequest('correlative');
            var defer = $q.defer();
            var canceler = HTTPCanceler.get(defer, this.namespace, 'correlative');
            var inserturl = APP_CONFIG.SERVER_URL + '/invoices/correlative/' + loginService.getFiltro();
            var param = formatService.formatearDatos(datos);
            param.x = socketIoRegister;
            $http.get(inserturl, { params: param, timeout: canceler.promise })
                .then(function (response) {
                    callback(response.data);
                }, function(response) {
                    if (response.status != -5) callback(response.data);
                });
        },
        getCashbox: function(idLlamada, datos, callback){
            this.cancelRequest(idLlamada);
            var defer = $q.defer();
            var canceler = HTTPCanceler.get(defer, this.namespace, idLlamada);
            var inserturl = APP_CONFIG.SERVER_URL + '/invoices/cashbox/' + loginService.getFiltro();
            $http.get(inserturl, { params: formatService.formatearDatos(datos), timeout: canceler.promise })
                .then(function(response){
                    if (response.data == null){
                        response.data = {
                            status: 'ERROR',
                            data: []
                        }
                    }
                    response.data.data.sort(function(a,b){
                        return a - b;
                    });
                    callback(response.data);
                }, function(response){
                    if (response.status != -5) callback(response.data);
                });
        },
        getRatesInvoices: function(datos, callback){
            this.cancelRequest('ratesInvoices');
            var defer = $q.defer();
            var canceler = HTTPCanceler.get(defer, this.namespace, 'ratesInvoices');
            var inserturl = APP_CONFIG.SERVER_URL + '/invoices/rates';
            $http.get(inserturl, { params: formatService.formatearDatos(datos), timeout: canceler.promise })
                .then(function(response){
                    callback(response.data);
                }, function(response){
                    if (response.status != -5) callback(response.data)
                });
        },
        getDetailRates: function(datos, callback){
            this.cancelRequest('ratesDetail');
            var defer = $q.defer();
            var canceler = HTTPCanceler.get(defer, this.namespace, 'ratesDetail');
            var inserturl = APP_CONFIG.SERVER_URL + '/invoices/rates/' + datos.tipo;
            $http.get(inserturl, { params: formatService.formatearDatos(datos), timeout: canceler.promise })
                .then(function(response){
                    callback(response.data);
                }, function(response){
                    if (response.status != -5) callback(response.data)
                });
        },
        getCSV: function(datos, callback){
            var inserturl = APP_CONFIG.SERVER_URL + '/invoices/' + loginService.getFiltro() + '/down';
            $http.get(inserturl, { params: formatService.formatearDatos(datos)})
                .then(function(response) {
                    var contentType = response.headers('Content-Type');
                    if (contentType.indexOf('text/csv') >= 0){
                        callback(response.data, 'OK');
                    } else {
                        callback(response.data, 'ERROR');
                    }
                }, function(response){
                    callback(response.data, 'ERROR');
                });
        },
        cancelRequest: function(request){
            HTTPCanceler.cancel(this.namespace, request);
        }
    };
    return invoiceFactory;
}]);