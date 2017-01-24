/**
 * Created by kolesnikov-a on 17/08/2016.
 */
myapp.factory('Invoice', ['$http', '$q', 'formatService', 'cacheService', 'loginService', '$uibModal', 'downloadFactory', 'APP_CONFIG', '$filter', '$window', function($http, $q, formatService, cacheService, loginService, $uibModal, downloadFactory, APP_CONFIG, $filter, $window){
    class Invoice {
        constructor(invoiceData){
            if (invoiceData)
                this.setData(invoiceData);
        }

        /**
         * Para MongoDB no va a devolver la "description" por ahora.
         * */
        setData(invoiceData){
            angular.extend(this, invoiceData);
            if (this.detalle){
                //const descripciones = cacheService.cache.get('descripciones' + loginService.filterTerminal);
                const unidadesTarifas = cacheService.unitTypesArray;
                this.detalle.forEach((contenedor) => {
                    contenedor.items.forEach((item) => {
                        //item.descripcion = (descripciones[item.id]) ? descripciones[item.id] : 'No se halló la descripción, verifique que el código esté asociado';
                        item.description = (item.description) ? item.description : 'No se halló la descripción, verifique que el código esté asociado';
                        if (angular.isDefined(unidadesTarifas[item.uniMed]))
                            item.uniMed = unidadesTarifas[item.uniMed];
                    });
                });
            }

            if (!this.controlTarifas) this.controlTarifas = [];
            if (!this.tarifasSinMatch) this.tarifasSinMatch = [];
            if (!this.interfazLiquidada) this.interfazLiquidada = '';
            if (!this.title) this.title = '';
            if (!this.tienePayment) this.tienePayment = false;
            if (!this.noMatch) this.noMatch = false;

            if (angular.isDefined(this.payment) && this.payment != null){
                if (angular.isDefined(this.payment.number) && this.payment.number !== null) {
                    this.tienePayment = true;
                    this.interfazLiquidada = 'text-success';
                    this.title = 'Liquidación #' + this.payment.number;
                } else if (angular.isDefined(this.payment.preNumber) && this.payment.preNumber !== null) {
                    this.tienePayment = true;
                    this.interfazLiquidada = 'text-warning';
                    this.title = 'Pre Liquidación #' + this.payment.preNumber;
                } else {
                    this.interfazLiquidada = 'text-danger';
                }
            } else {
                this.interfazLiquidada = 'text-danger';
            }

            this.setInterface();
            if (!this.resend || this.resend == null){
                this.resend = false;
            }

            this.transferencia = formatService.formatearFechaISOString(this.registrado_en);
        }

        setInterface(){
            const estadoDefault = {
                'group': loginService.group,
                'state': 'Y',
                'user': 'agp'
            };
            if (this.estado){
                const estadosArray = cacheService.estadosArray;
                if (this.estado.group == loginService.group || this.estado.group === 'ALL'){
                    this.interfazEstado = (estadosArray[this.estado.state]) ? estadosArray[this.estado.state] : estadosArray['Y'];
                } else {
                    this.estado = estadoDefault;
                    this.interfazEstado = {
                        'name': 'Sin ver',
                        'description': 'Sin ver',
                        'btnEstado': 'text-info',
                        'imagen': 'images/unknown.png',
                        '_id': 'Y',
                        'type': 'UNKNOWN'
                    };
                }
            } else {
                this.estado = estadoDefault;
                this.interfazEstado = {
                    'name': 'Sin ver',
                    'description': 'Sin ver',
                    'btnEstado': 'text-info',
                    'imagen': 'images/unknown.png',
                    '_id': 'Y',
                    'type': 'UNKNOWN'
                };
            }
        }

        existeDescripcion(item){
            return item.description != 'No se halló la descripción, verifique que el código esté asociado';
        }

        loadById(){
            const deferred = $q.defer();
            if (!this.detalle){
                const inserturl = `${APP_CONFIG.SERVER_URL}/invoices/invoice/${this._id}`;
                $http.get(inserturl).then((response) => {
                    this.setData(response.data.data);
                    deferred.resolve();
                }).catch((response) => {
                    deferred.reject(response);
                });
            } else {
                deferred.resolve();
            }
            return deferred.promise;
        }

        getTrack(){
            const deferred = $q.defer();
            const inserturl = `${APP_CONFIG.SERVER_URL}/comments/${this._id}`;
            $http.get(inserturl).then((response) => {
                let comentariosFiltrados = [];
                let lastComment = null;
                response.data.data.forEach((comentario) => {
                    if (comentario.group == loginService.group || comentario.group === 'ALL'){
                        comentario.fecha = formatService.formatearFechaISOString(comentario.registrado_en);
                        if (lastComment == null){
                            lastComment = comentario;
                        } else if(comentario.fecha > lastComment.fecha){
                            lastComment = comentario;
                        }
                        comentariosFiltrados.push(comentario);
                    }
                });
                comentariosFiltrados.sort((a, b) => {
                    return (a.fecha > b.fecha);
                });
                if (comentariosFiltrados.length > 0){
                    this.estado = {
                        state: lastComment.state,
                        group: lastComment.group,
                        user: lastComment.user
                    };
                    this.setInterface();
                }
                this.comments = comentariosFiltrados;
                deferred.resolve();
            }).catch((response) => {
                deferred.reject(response.data);
            });
            return deferred.promise;
        }

        updateState(dataComment){
            const deferred = $q.defer();
            const inserturl = `${APP_CONFIG.SERVER_URL}/invoices/setState/${loginService.filterTerminal}/${this._id}`;
            const data = { estado: dataComment.newState._id };
            $http.put(inserturl,  data).then((response) => {
                this.interfazEstado = dataComment.newState;
                switch (dataComment.newState.type){
                    case 'WARN':
                        this.interfazEstado.btnEstado = 'text-warning';
                        break;
                    case 'OK':
                        this.interfazEstado.btnEstado = 'text-success';
                        break;
                    case 'ERROR':
                        this.interfazEstado.btnEstado = 'text-danger';
                        break;
                    case 'UNKNOWN':
                        this.interfazEstado.btnEstado = 'text-info';
                        break;
                }
                this.estado = {
                    _id: this._id,
                    state: dataComment.newState._id,
                    group: loginService.group,
                    user: loginService.info.user
                };
                this.setInterface();
                deferred.resolve(response.data);
            }).catch((response) => {
                deferred.reject(response.data);
            });
            return deferred.promise;
        }

        addComment(newComment){
            const deferred = $q.defer();
            const inserturl = `${APP_CONFIG.SERVER_URL}/comments/comment`;
            $http.post(inserturl, newComment).then((response) => {
                if (response.data.status == 'OK'){
                    deferred.resolve();
                } else {
                    const message = 'Se ha producido un error al agregar el comentario en el comprobante.';
                    deferred.reject(message);
                }
            }).catch((response) => {
                //veremos que hacemos
                deferred.reject(response);
            });
            return deferred.promise;
        }

        setResend(resendStatus){
            const deferred = $q.defer();
            const data = {
                resend: resendStatus
            };
            const inserturl = `${APP_CONFIG.SERVER_URL}/invoices/setResend/${this._id}`;
            $http.put(inserturl, data, { params: data }).then((response) => {
                if (response.data.status == 'OK'){
                    this.resend = resendStatus;
                    deferred.resolve()
                } else {
                    //const message = 'Se ha producido un error al establecer el estado del comprobante.';
                    deferred.reject(response.data);
                }
            }).catch((response) => {
                deferred.reject(response.data);
            });
            return deferred.promise;
        }

        trackInvoice(){
            const estadosComprobantes = cacheService.cache.get('estados');
            const deferred = $q.defer();
            this.getTrack().then(() => {
                let modalInstance = $uibModal.open({
                    templateUrl: 'view/trackingInvoice.html',
                    controller: 'trackingInvoiceCtrl',
                    backdrop: 'static',
                    resolve: {
                        estado: () => {
                            return this.interfazEstado;
                        },
                        track: () => {
                            return this.comments;
                        },
                        states : () => {
                            return angular.copy(estadosComprobantes);
                        },
                        resend: () => {
                            return this.resend;
                        }
                    }
                });
                modalInstance.result.then((dataComment) => {
                    const logInvoice = {
                        title: dataComment.title,
                        state: dataComment.newState._id,
                        comment: dataComment.comment,
                        invoice: this._id
                    };
                    let llamadas = [];
                    if (dataComment.setState){
                        llamadas.push(this.updateState(dataComment));
                        llamadas.push(this.addComment(logInvoice));
                    }
                    if (dataComment.setResend){
                        llamadas.push(this.setResend(dataComment.resend ? '1' : '0'));
                    }
                    $q.all(llamadas).then(() => {
                        deferred.resolve(this);
                    }).catch((error) => {
                        //console.log(error);
                        deferred.reject(error);
                    });
                }).catch(() => {
                    deferred.resolve();
                });
            });
            return deferred.promise;
        }

        mostrarDetalle(){
            const deferred = $q.defer();
            this.loadById().then(() => {
                this.getTrack();
                deferred.resolve();
            }).catch((error) => {
                deferred.reject(error);
            });
            return deferred.promise;
        }

        controlarTarifas(){
            const lookup = cacheService.matchesArray;
            const tasaCargasTerminal = cacheService.matchesCache.get('ratesMatches' + loginService.filterTerminal);

            let valorTomado;
            let tarifaError;

            let precioALaFecha;
            let monedaALaFecha;

            let precioEncontrado = false;

            this.controlTarifas = [];

            if (this.detalle){
                this.detalle.forEach((detalle) => {
                    detalle.items.forEach((item) => {
                        precioEncontrado = false;
                        if (angular.isDefined(lookup[item.id])){
                            valorTomado = item.impUnit.toFixed(2);
                            lookup[item.id].topPrices.forEach((precioMatch) => {
                                if (this.fecha.emision >= precioMatch.from){
                                    precioEncontrado = true;
                                    precioALaFecha = precioMatch.price;
                                    monedaALaFecha = precioMatch.currency
                                }
                            });
                            if (monedaALaFecha != 'DOL'){
                                valorTomado = (item.impUnit * this.cotiMoneda).toFixed(2);
                            }
                            if (tasaCargasTerminal.indexOf(item.id) >= 0){
                                if (precioEncontrado){
                                    if (valorTomado != precioALaFecha){
                                        tarifaError = {
                                            codigo: item.id,
                                            currency: monedaALaFecha,
                                            topPrice: precioALaFecha,
                                            current: item.impUnit,
                                            topPrices: lookup[item.id].topPrices,
                                            emision: this.fecha.emision,
                                            container: detalle.contenedor
                                        };
                                        this.controlTarifas.push(tarifaError);
                                    }
                                } else {
                                    tarifaError = {
                                        codigo: item.id,
                                        tieneMatch: true,
                                        topPrices: lookup[item.id].topPrices,
                                        emision: this.fecha.emision,
                                        container: detalle.contenedor
                                    };
                                    this.tarifasSinMatch.push(tarifaError);
                                    this.noMatch = true;
                                }
                            } else {
                                if (precioEncontrado){
                                    if (valorTomado > precioALaFecha){
                                        tarifaError = {
                                            codigo: item.id,
                                            currency: monedaALaFecha,
                                            topPrice: precioALaFecha,
                                            current: item.impUnit,
                                            topPrices: lookup[item.id].topPrices,
                                            emision: this.fecha.emision,
                                            container: detalle.contenedor
                                        };
                                        this.controlTarifas.push(tarifaError);
                                    }
                                } else {
                                    tarifaError = {
                                        codigo: item.id,
                                        tieneMatch: true,
                                        topPrices: lookup[item.id].topPrices,
                                        emision: this.fecha.emision,
                                        container: detalle.contenedor
                                    };
                                    this.tarifasSinMatch.push(tarifaError);
                                    this.noMatch = true;
                                }
                            }
                        } else {
                            tarifaError = {
                                codigo: item.id,
                                tieneMatch: false,
                                topPrices: [],
                                emision: this.fecha.emision,
                                container: detalle.contenedor
                            };
                            this.tarifasSinMatch.push(tarifaError);
                            this.noMatch = true;
                        }
                    });
                });
            }
        }

        verPdf(){
            //$scope.disablePdf = true;
            const deferred = $q.defer();
            const imprimirComprobante = {};
            const nombreReporte = `${$filter('nombreComprobante')(this.codTipoComprob, true)}${this.nroComprob}_${loginService.filterTerminal}.pdf`;
            angular.copy(this, imprimirComprobante);
            imprimirComprobante.codTipoComprob = $filter('nombreComprobante')(imprimirComprobante.codTipoComprob, false);
            imprimirComprobante.fecha.emision = $filter('date')(imprimirComprobante.fecha.emision, 'dd/MM/yyyy', 'UTC');
            imprimirComprobante.fecha.vcto = $filter('date')(imprimirComprobante.fecha.vcto, 'dd/MM/yyyy', 'UTC');
            imprimirComprobante.fecha.desde = $filter('date')(imprimirComprobante.fecha.desde, 'dd/MM/yyyy', 'UTC');
            imprimirComprobante.fecha.hasta = $filter('date')(imprimirComprobante.fecha.hasta, 'dd/MM/yyyy', 'UTC');
            imprimirComprobante.detalle.forEach((detalle) => {
                detalle.buque.fecha = $filter('date')(detalle.buque.fecha, 'dd/MM/yyyy', 'UTC');
            });
            downloadFactory.convertToPdf(imprimirComprobante, 'invoiceToPdf', nombreReporte).then(() => {
                deferred.resolve();
            }).catch(() => {
                deferred.reject();
            });
            return deferred.promise;
        }

    }

    return Invoice;
}]);