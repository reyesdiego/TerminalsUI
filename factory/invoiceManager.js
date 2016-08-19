/**
 * Created by kolesnikov-a on 17/08/2016.
 */
myapp.factory('invoiceManager', ['Invoice', '$http', '$q', 'HTTPCanceler', 'loginService', 'formatService', function(Invoice, $http, $q, HTTPCanceler, loginService, formatService){
    var invoiceManager = {
        namespace: 'invoices',
        getInvoices: function(idLlamada, datos, page, callback) {
            this.cancelRequest(idLlamada);
            var canceler = HTTPCanceler.get($q.defer(), namespace, idLlamada);
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
            var canceler = HTTPCanceler.get($q.defer(), namespace, 'invoicesNoMatches');
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
        cancelRequest: function(request){
            HTTPCanceler.cancel(this.namespace, request);
        }
    }
}]);