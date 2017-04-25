/**
 * Created by kolesnikov-a on 25/08/2016.
 */
myapp.factory('Container', ['$http', '$q', 'APP_CONFIG', 'invoiceFactory', 'controlPanelFactory', 'gatesFactory', 'turnosFactory', 'cacheService', 'loginService', 'formatService', function($http, $q, APP_CONFIG, invoiceFactory, controlPanelFactory, gatesFactory, turnosFactory, cacheService, loginService, formatService){

    class Container{
        constructor(containerData){
            if (containerData)
                this.setData(containerData);
        }

        setData(containerData){
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
        }

        getInvoices(scopeId, page){
            const deferred = $q.defer();
            const searchParams = {
                buqueNombre: this.ship,
                viaje: this.trip,
                contenedor: this.contenedor
            };
            invoiceFactory.getInvoices(scopeId, searchParams, page).then((invoices) => {
				this.invoices.data = invoices.data;
				this.invoices.total = invoices.totalCount;
				deferred.resolve();
			}).catch((error) => {
				deferred.reject();
            });
            return deferred.promise;
        }

        getAppointments(page){
            const deferred = $q.defer();
            const searchParams = {
                buqueNombre: this.ship,
                viaje: this.trip,
                contenedor: this.contenedor
            };
            turnosFactory.getTurnos(searchParams, page).then((appointments) => {
				this.appointments.data = appointments.data;
				this.appointments.total = appointments.totalCount;
				deferred.resolve();
			}).catch(() => {
				deferred.reject();
            });
            return deferred.promise;
        }

        getGates(page){
            const deferred = $q.defer();
            const searchParams = {
                buqueNombre: this.ship,
                viaje: this.trip,
                contenedor: this.contenedor
            };
            gatesFactory.getGate(searchParams, page).then((gates) => {
				this.gates.data = gates.data;
				this.gates.total = gates.totalCount;
				//$scope.gatesTiempoConsulta = (data.time / 1000).toFixed(2);
				deferred.resolve();
			}).catch(() => deferred.reject());
            return deferred.promise;
        }

        getRates(stateName, currency){
            const deferred = $q.defer();
            const inserturl = `${APP_CONFIG.SERVER_URL}/invoices/rates/${loginService.filterTerminal}/${this.contenedor}/${currency}`;
            let queryString = {};
            if (stateName == 'buque') queryString = {
                buqueNombre: this.ship,
                viaje: this.trip
            };
            $http.get(inserturl, { params: formatService.formatearDatos(queryString)}).then((response) => {
                this.rates = this.putDescriptionRates(response.data);
                deferred.resolve();
            }).catch((response) => {
                deferred.reject(response.data);
            });
            return deferred.promise;
        }

        putDescriptionRates(data){
            const descripciones = cacheService.cache.get('descripciones' + loginService.filterTerminal);
            data.total = 0;
            data.data.forEach((detalle) => {
                detalle._id.descripcion = (descripciones[detalle._id.id]) ? descripciones[detalle._id.id] : 'No se halló la descripción, verifique que el código esté asociado';
                data.total += detalle.total;
            });
            return data
        }

        getAfipData(){
            this.afipData = [];
            const deferred = $q.defer();
            let llamadas = [];
            llamadas.push(this.getSumariaImpo());
            llamadas.push(this.getSumariaExpo());
            $q.all(llamadas).then((response) => {
                response.forEach((result) => {
                    result.data.data.forEach((registro) => {
                        this.afipData.push(registro)
                    });
                });
                deferred.resolve();
            }).catch((response) => {
                deferred.reject(response);
            });
            return deferred.promise;
        }

        getSumariaImpo(){
            const inserturl = `${APP_CONFIG.SERVER_URL}/afip/sumariaImpo/${this.contenedor}`;
            return $http.get(inserturl);
        }

        getSumariaExpo(){
            const inserturl = `${APP_CONFIG.SERVER_URL}/afip/sumariaExpo/${this.contenedor}`;
            return $http.get(inserturl)
        }
    }

    return Container;

}]);