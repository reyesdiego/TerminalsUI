/**
 * Created by kolesnikov-a on 25/08/2016.
 */
myapp.factory('Container', ['$http', '$q', 'APP_CONFIG', 'invoiceFactory', 'controlPanelFactory', 'gatesFactory', 'turnosFactory', 'cacheService', 'loginService', 'formatService', '$state', '$window', function($http, $q, APP_CONFIG, invoiceFactory, controlPanelFactory, gatesFactory, turnosFactory, cacheService, loginService, formatService, $state, $window){

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
            this.manifestsImpo = [];
            this.manifestsExpo = [];
            this.afipData = [];
            this.giroBuques = [];
            this.shipList = [];
        }

        openDetailView(){
			const url = $state.href('container', {container: this.contenedor});
			$window.open(url,'_blank');
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

        getInvoicesByContainer(){
            const deferred = $q.defer();
			let params = {
				contenedor: this.contenedor,
				terminal: loginService.filterTerminal
			};
			if (this.ship) params.buqueNombre = this.ship;
			if (this.trip) params.viaje = this.trip;
			invoiceFactory.getInvoicesByContainer(params).then(invoices => {
                this.invoices.data = invoices.data;
                this.invoices.total = invoices.data.length;
                this.invoices.data.forEach(invoice => {
                    this.shipList.push(invoice.buque);
                });
                this.getGiroBuque();
                deferred.resolve();
			}).catch(error => {
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

        getGiroBuque(){
			const inserturl = `${APP_CONFIG.SERVER_URL}/ob2/dates/`;
			this.shipList.forEach((ship) => {
			    $http.get(`${inserturl}${ship}`).then(response => {
			        this.giroBuques.push(response.data.data);
                })
            });
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
            let llamadas = [];

            //ob2/dates/:buque;
            let queryString = {};
            if (stateName == 'buque') queryString = {
                buqueNombre: this.ship,
                viaje: this.trip
            };
            llamadas.push($http.get(inserturl, { params: formatService.formatearDatos(queryString)}));
            llamadas.push($http.get(`${APP_CONFIG.SERVER_URL}/manifests/impo/container/${this.contenedor}`));
            llamadas.push($http.get(`${APP_CONFIG.SERVER_URL}/manifests/expo/container/${this.contenedor}`));

            $q.all(llamadas).then((responses) => {
                this.rates = responses[0].data;
                //this.rates = this.putDescriptionRates(responses[0].data);
                this.manifestsImpo = responses[1].data.data;
                this.manifestsExpo = responses[2].data.data;
                deferred.resolve();
            }).catch((response) => {
                deferred.reject(response.data);
                console.log(this);
            });
            return deferred.promise;
        }
/** AHORA TRAE DEL SERVIDOR
        putDescriptionRates(data){
            const descripciones = cacheService.cache.get('descripciones' + loginService.filterTerminal);
            data.total = 0;
            data.data.forEach((detalle) => {
                detalle._id.descripcion = (descripciones[detalle._id.id]) ? descripciones[detalle._id.id] : 'No se halló la descripción, verifique que el código esté asociado';
                data.total += detalle.total;
            });
            return data
        }
*/
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