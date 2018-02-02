/**
 * Created by kolesnikov-a on 17/08/2016.
 */
myapp.factory('invoiceFactory', ['Invoice', '$http', '$q', 'HTTPCanceler', 'loginService', 'formatService', 'APP_CONFIG', 'downloadService', function (Invoice, $http, $q, HTTPCanceler, loginService, formatService, APP_CONFIG, downloadService) {

    class invoiceFactory {
        constructor() {
            this.namespace = 'invoices';
        }

        cancelRequest(request) {
            HTTPCanceler.cancel(this.namespace, request);
        }

        retrieveInvoices(invoicesData) {
            let invoicesArray = [];
            invoicesData.forEach((invoice) => {
                invoicesArray.push(new Invoice(invoice));
            });
            return invoicesArray;
        }

        getInvoices(idLlamada, datos, page) {
            const deferred = $q.defer();
            this.cancelRequest(idLlamada);
            const canceler = HTTPCanceler.get($q.defer(), this.namespace, idLlamada);
            const inserturl = `${APP_CONFIG.SERVER_URL}/invoices/${loginService.filterTerminal}/${page.skip}/${page.limit}`;
            $http.get(inserturl, { params: formatService.formatearDatos(datos), timeout: canceler.promise }).then((response) => {
                response.data.data = this.retrieveInvoices(response.data.data);
                deferred.resolve(response.data);
            }).catch((response) => {
                if (response.status != -5) deferred.reject(response.data);
            });
            return deferred.promise;
        }

        getInvoicesNoMatches(datos, page) {
            const deferred = $q.defer();
            this.cancelRequest('invoicesNoMatches');
            const canceler = HTTPCanceler.get($q.defer(), this.namespace, 'invoicesNoMatches');
            const inserturl = `${APP_CONFIG.SERVER_URL}/invoices/noMatches/${loginService.filterTerminal}/${page.skip}/${page.limit}`;
            $http.get(inserturl, { params: formatService.formatearDatos(datos), timeout: canceler.promise }).then((response) => {
                if (response.data.data == null) response.data.data = [];
                response.data.data = this.retrieveInvoices(response.data.data);
                deferred.resolve(response.data);
            }).catch((response) => {
                if (response.status != -5) deferred.reject(response.data);
            });
            return deferred.promise;
        }

        getInvoicesByContainer(datos) {
            const deferred = $q.defer();
            const inserturl = `${APP_CONFIG.SERVER_URL}/invoices/byContainer`;
            $http.get(inserturl, { params: datos }).then(response => {
                console.log(response.data.data)
                response.data.data = this.retrieveInvoices(response.data.data);
                deferred.resolve(response.data);
            }).catch(response => {
                deferred.reject(response.data);
            });
            return deferred.promise;
        }

        getComprobantesLiquidar(page, datos, callback) {
            if (datos.byContainer) {
                this.cancelRequest('comprobantesLiquidarContainer');
            } else {
                this.cancelRequest('comprobantesLiquidar');
            }
            const defer = $q.defer();
            let canceler;
            if (datos.byContainer) {
                canceler = HTTPCanceler.get(defer, this.namespace, 'comprobantesLiquidarContainer');
            } else {
                canceler = HTTPCanceler.get(defer, this.namespace, 'comprobantesLiquidar');
            }
            const inserturl = `${APP_CONFIG.SERVER_URL}/paying/notPayed/${loginService.filterTerminal}/${page.skip}/${page.limit}`;
            $http.get(inserturl, { params: formatService.formatearDatos(datos), timeout: canceler.promise }).then((response) => {
                response.data.data = this.retrieveInvoices(response.data.data);
                callback(response.data);
            }).catch((response) => {
                if (response.status != -5) {
                    if (response.data == null) {
                        response.data = {
                            status: 'ERROR'
                        }
                    }
                    callback(response.data);
                }
            });
        }

        getComprobantesLiquidados(page, liquidacion, datos, callback) {
            if (datos.byContainer) {
                this.cancelRequest('comprobantesLiquidadosContainer');
            } else {
                this.cancelRequest('comprobantesLiquidados');
            }
            const defer = $q.defer();
            let canceler;
            if (datos.byContainer) {
                canceler = HTTPCanceler.get(defer, this.namespace, 'comprobantesLiquidadosContainer');
            } else {
                canceler = HTTPCanceler.get(defer, this.namespace, 'comprobantesLiquidados');
            }
            const inserturl = `${APP_CONFIG.SERVER_URL}/paying/payed/${loginService.filterTerminal}/${liquidacion}/${page.skip}/${page.limit}`;
            $http.get(inserturl, { params: formatService.formatearDatos(datos), timeout: canceler.promise }).then((response) => {
                response.data.data = this.retrieveInvoices(response.data.data);
                callback(response.data);
            }).catch((response) => {
                if (response.status != -5) {
                    if (response.data == null) {
                        response.data = {
                            status: 'ERROR',
                            message: 'Se ha producido un error al procesar la liquidación.'
                        }
                    }
                    callback(response.data);
                }
            });
        }

        getCorrelative(datos, socketIoRegister, callback) {
            this.cancelRequest('correlative');
            const defer = $q.defer();
            const canceler = HTTPCanceler.get(defer, this.namespace, 'correlative');
            const inserturl = `${APP_CONFIG.SERVER_URL}/invoices/correlative/${loginService.filterTerminal}`;
            let param = formatService.formatearDatos(datos);
            param.x = socketIoRegister;
            $http.get(inserturl, { params: param, timeout: canceler.promise }).then((response) => {
                callback(response.data);
            }).catch((response) => {
                if (response.status != -5) callback(response.data);
            });
        }

        getCashbox(idLlamada, datos, callback) {
            this.cancelRequest(idLlamada);
            const defer = $q.defer();
            const canceler = HTTPCanceler.get(defer, this.namespace, idLlamada);
            const inserturl = `${APP_CONFIG.SERVER_URL}/invoices/cashbox/${loginService.filterTerminal}`;
            $http.get(inserturl, { params: formatService.formatearDatos(datos), timeout: canceler.promise }).then((response) => {
                if (response.data == null) {
                    response.data = {
                        status: 'ERROR',
                        data: []
                    }
                }
                response.data.data.sort((a, b) => {
                    return a - b;
                });
                callback(response.data);
            }).catch((response) => {
                if (response.status != -5) callback(response.data);
            });
        }

        getRatesInvoices(params) {
            return new Promise((resolve, reject) => {
                this.cancelRequest('ratesInvoices');
                const defer = $q.defer();
                const canceler = HTTPCanceler.get(defer, this.namespace, 'ratesInvoices');
                const inserturl = `${APP_CONFIG.SERVER_URL}/invoices/rates`;
                $http.get(inserturl, { params: formatService.formatearDatos(params), timeout: canceler.promise })
                    .then(response => {
                        //$http.get(inserturl, { params: formatService.formatearDatos(datos)}).then(response => {
                        resolve(response.data);
                    }).catch(response => {
                        if (response.status != -5) reject(response.data)
                    });
            });
        }

        getDetailRates(datos, callback) {
            this.cancelRequest('ratesDetail');
            const defer = $q.defer();
            const canceler = HTTPCanceler.get(defer, this.namespace, 'ratesDetail');
            const inserturl = `${APP_CONFIG.SERVER_URL}/invoices/rates/${datos.period}`;
            let params = {
                fechaInicio: datos.fechaInicio,
                fechaFin: datos.fechaFin
            };
            $http.get(inserturl, { params: formatService.formatearDatos(params), timeout: canceler.promise }).then((response) => {
                callback(response.data);
            }).catch((response) => {
                if (response.status != -5) callback(response.data)
            });
        }

        getTotales(params) {
            return new Promise((resolve, reject) => {
                this.cancelRequest('getTotales');
                const canceler = HTTPCanceler.get($q.defer(), this.namespace, 'getTotales');
                const inserturl = `${APP_CONFIG.SERVER_URL}/invoices/totales`;
                $http.get(inserturl, { params: formatService.formatearDatos(params), timeout: canceler.promise }).then((response) => {
                    //$http.get(inserturl, {params: formatService.formatearDatos(params)}).then(response => {
                    //response.data.data = this.retrieveInvoices(response.data.data);
                    resolve(response.data);
                }).catch((response) => {
                    if (response.status != -5) reject(response.data);
                });
            });
        }

        getCSV(datos, reportName, callback) {
            const inserturl = `${APP_CONFIG.SERVER_URL}/invoices/${loginService.filterTerminal}/down`;
            $http.get(inserturl, { params: formatService.formatearDatos(datos) }).then((response) => {
                const contentType = response.headers('Content-Type');
                if (contentType.indexOf('text/csv') >= 0) {
                    downloadService.setDownloadCsv(reportName, response.data);
                    callback('OK');
                } else {
                    callback('ERROR');
                }
            }).catch((response) => {
                callback('ERROR');
            });
        }

    }

    return new invoiceFactory();
}]);