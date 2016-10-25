/**
 * Created by kolesnikov-a on 25/08/2016.
 */
myapp.factory('Container', ['$http', '$q', 'APP_CONFIG', 'invoiceFactory', 'controlPanelFactory', 'gatesFactory', 'turnosFactory', 'generalCache', 'loginService', 'formatService', function($http, $q, APP_CONFIG, invoiceFactory, controlPanelFactory, gatesFactory, turnosFactory, generalCache, loginService, formatService){

    function Container(containerData){
        if (containerData)
            this.setData(containerData);
    }

    Container.prototype = {
        setData: function(containerData){
            angular.extend(this, containerData);
            if (!this.ship) this.ship = '';
            if (!this.trip) this.trip = '';
            if (!this.gates)
                this.gates = {
                    data: [],
                    total: 0
                };
            this.invoices = {
                data: [],
                total: 0
            };

            this.appointments = {
                data:[],
                total: 0
            };
            this.rates = {
                data: [],
                total: 0
            };
            this.afipData = [];
        },
        getDetail: function(){

        },
        getInvoices: function(scopeId, page){
            var deferred = $q.defer();
            var searchParams = {
                buqueNombre: this.ship,
                viaje: this.trip,
                contenedor: this.contenedor
            };
            var scope = this;
            invoiceFactory.getInvoices(scopeId, searchParams, page, function(invoices){
                if (invoices.status == 'OK'){
                    scope.invoices.data = invoices.data;
                    scope.invoices.total = invoices.totalCount;
                    deferred.resolve();
                } else {
                    deferred.reject();
                }
            });
            return deferred.promise;
        },
        getAppointments: function(page){
            var deferred = $q.defer();
            var searchParams = {
                buqueNombre: this.ship,
                viaje: this.trip,
                contenedor: this.contenedor
            };
            var scope = this;
            turnosFactory.getTurnos(searchParams, page, function(appointments){
                if (appointments.status === "OK"){
                    scope.appointments.data = appointments.data;
                    scope.appointments.total = appointments.totalCount;
                    deferred.resolve();
                } else {
                    deferred.reject();
                }
            });
            return deferred.promise;
        },
        getGates: function(page){
            var deferred = $q.defer();
            var searchParams = {
                buqueNombre: this.ship,
                viaje: this.trip,
                contenedor: this.contenedor
            };
            var scope = this;
            gatesFactory.getGate(searchParams, page, function (gates) {
                if (gates.status === "OK") {
                    scope.gates.data = gates.data;
                    scope.gates.total = gates.totalCount;
                    //$scope.gatesTiempoConsulta = (data.time / 1000).toFixed(2);
                    deferred.resolve();
                } else {
                    deferred.reject();
                }
            });
            return deferred.promise;
        },
        getRates: function(stateName, currency){
            var deferred = $q.defer();
            var scope = this;
            var inserturl = APP_CONFIG.SERVER_URL + '/invoices/rates/' + loginService.getFiltro() + '/' + this.contenedor + '/' + currency;
            var queryString = {};
            if (stateName == 'buque') queryString = {
                buqueNombre: this.ship,
                viaje: this.trip
            };
            $http.get(inserturl, { params: formatService.formatearDatos(queryString)})
                .then(function (response){
                        scope.rates = scope.putDescriptionRates(response.data);
                        deferred.resolve();
                    }, function(response){
                        deferred.reject(response.data);
                    });
            return deferred.promise;
        },
        putDescriptionRates: function(data){
            var descripciones = generalCache.get('descripciones' + loginService.getFiltro());
            data.total = 0;
            data.data.forEach(function(detalle){
                detalle._id.descripcion = (descripciones[detalle._id.id]) ? descripciones[detalle._id.id] : 'No se halló la descripción, verifique que el código esté asociado';
                data.total += detalle.total;
            });
            return data
        },
        getAfipData: function(){
            this.afipData = [];
            var deferred = $q.defer();
            var llamadas = [];
            var scope = this;
            llamadas.push(this.getSumariaImpo());
            llamadas.push(this.getSumariaExpo());
            $q.all(llamadas).then(function(response){
                response.forEach(function(result){
                    result.data.data.forEach(function(registro){
                        scope.afipData.push(registro)
                    });
                });
                deferred.resolve();
            }, function(response){
                deferred.reject(response);
            });
            return deferred.promise;
        },
        getSumariaImpo: function(){
            var inserturl = APP_CONFIG.SERVER_URL + '/afip/sumariaImpo/' + this.contenedor;
            return $http.get(inserturl);
        },
        getSumariaExpo: function(){
            var inserturl = APP_CONFIG.SERVER_URL + '/afip/sumariaExpo/' + this.contenedor;
            return $http.get(inserturl)
        }
    };

    return Container;

}]);