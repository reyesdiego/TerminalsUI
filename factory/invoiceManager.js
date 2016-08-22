/**
 * Created by kolesnikov-a on 17/08/2016.
 */
myapp.factory('invoiceManager', ['Invoice', '$http', '$q', 'HTTPCanceler', 'loginService', 'formatService', function(Invoice, $http, $q, HTTPCanceler, loginService, formatService){
    var invoiceManager = {
        namespace: 'invoices',
        getInvoices: function(idLlamada, datos, page, callback) {
            this.cancelRequest(idLlamada);
            var canceler = HTTPCanceler.get($q.defer(), this.namespace, idLlamada);
            var inserturl = serverUrl + '/invoices/' + loginService.getFiltro() + '/' + page.skip + '/' + page.limit;
            $http.get(inserturl, { params: formatService.formatearDatos(datos), timeout: canceler.promise })
                .then(function(response){
                    var invoiceArray = [];
                    response.data.data.forEach(function(invoiceData){
                        var invoice = new Invoice(invoiceData);
                        invoiceArray.push(invoice);
                    });
                    response.data.data = invoiceArray;
                    callback(response.data);
                    /*if (response.statusText == 'OK'){

                        var data = ponerDescripcionComprobantes(response.data);
                        callback(factory.setearInterfaz(data));
                    }*/
                }, function(response) {
                    if (response.status != -5) callback(response.data);
                });

        },
        getInvoicesNoMatches: function(datos, page, callback){
            this.cancelRequest('invoicesNoMatches');
            var canceler = HTTPCanceler.get($q.defer(), this.namespace, 'invoicesNoMatches');
            var inserturl = serverUrl + '/invoices/noMatches/' + loginService.getFiltro() + '/' + page.skip + '/' + page.limit;
            $http.get(inserturl, { params: formatService.formatearDatos(datos), timeout: canceler.promise })
                .then(function (response) {
                    var invoiceArray = [];
                    response.data.data.forEach(function(invoiceData){
                        var invoice = new Invoice(invoiceData);
                        invoiceArray.push(invoice);
                    });
                    response.data.data = invoiceArray;
                    callback(response.data);
                    /*if (response.data == null) {
                     response.data = {
                     status: 'ERROR',
                     data: []
                     }
                     }
                     if (response.data.data == null) response.data.data = [];

                     response.data = ponerDescripcionComprobantes(response.data);
                     callback(factory.setearInterfaz(response.data));*/

                }, function(response) {
                    if (response.status != -5) callback(response.data);
                });
        },
        getCorrelative: function(datos, socketIoRegister, callback){
            this.cancelRequest('correlative');
            var defer = $q.defer();
            var canceler = HTTPCanceler.get(defer, this.namespace, 'correlative');
            var inserturl = serverUrl + '/invoices/correlative/' + loginService.getFiltro();
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
            var inserturl = serverUrl + '/invoices/cashbox/' + loginService.getFiltro();
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
        getCSV: function(datos, callback){
            var inserturl = serverUrl + '/invoices/' + loginService.getFiltro() + '/down';
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
    return invoiceManager;
}]);