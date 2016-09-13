/**
 * Created by kolesnikov-a on 17/08/2016.
 */
myapp.factory('Invoice', ['$http', '$q', 'formatService', 'generalCache', 'loginService', '$uibModal', 'estadosArrayCache', 'downloadFactory', 'APP_CONFIG', '$filter', function($http, $q, formatService, generalCache, loginService, $uibModal, estadosArrayCache, downloadFactory, APP_CONFIG, $filter){
    function Invoice(invoiceData){
        if (invoiceData){
            this.setData(invoiceData);
        }
    };

    Invoice.prototype = {
        setData: function(invoiceData){
            angular.extend(this, invoiceData);
            if (this.detalle){
                var descripciones = generalCache.get('descripciones' + loginService.getFiltro());
                /******************** ASQUEROSO ***********************/
                var cacheUnidades = generalCache.get('unitTypes');
                var unidadesTarifas = [];
                for (var i = 0, len = cacheUnidades.length; i < len; i++) {
                    unidadesTarifas[cacheUnidades[i]._id] = cacheUnidades[i].description;
                }
                /*********************************************************/
                this.detalle.forEach(function(contenedor){
                    contenedor.items.forEach(function(item){
                        item.descripcion = (descripciones[item.id]) ? descripciones[item.id] : 'No se halló la descripción, verifique que el código esté asociado';
                        if (angular.isDefined(unidadesTarifas[item.uniMed]))
                            item.uniMed = unidadesTarifas[item.uniMed];
                    });
                });
            }

            if (!this.controlTarifas) this.controlTarifas = [];
            if (!this.tarifasSinMatch) this.tarifasSinMatch = [];
            if (!this.interfazLiquidada) this.interfazLiquidada = '';
            if (!this.tieneTasa) this.tieneTasa = false;
            if (!this.noMatch) this.noMatch = false;

            this.setInterface();
            if (!this.resend || this.resend == null){
                this.resend = false;
            }

            this.transferencia = formatService.formatearFechaISOString(this.registrado_en);
        },
        setInterface: function(){
            var estadoDefault = {
                'grupo': loginService.getGroup(),
                'estado': 'Y',
                'user': 'agp'
            };
            if (this.estado){
                if (this.estado.grupo == loginService.getGroup() || this.estado.grupo === 'ALL'){
                    this.interfazEstado = (estadosArrayCache.get(this.estado.estado)) ? estadosArrayCache.get(this.estado.estado) : estadosArrayCache.get('Y');
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
        },
        existeDescripcion: function(item){
            return item.descripcion != 'No se halló la descripción, verifique que el código esté asociado';
        },
        loadById: function(){
            var deferred = $q.defer();
            if (!this.detalle){
                var inserturl = APP_CONFIG.SERVER_URL + '/invoices/invoice/' + this._id;
                var scope = this;
                $http.get(inserturl)
                    .then(function (response){
                        scope.setData(response.data.data);
                        deferred.resolve();
                    }, function(response){
                        console.log(response);
                        deferred.reject(response);
                        /*errorFactory.raiseError(response.data, inserturl, 'errorDatos', 'Error al cargar el comprobante ' + id);
                         callback({}, false);*/
                    });
            } else {
                deferred.resolve();
            }
            return deferred.promise;
        },
        getTrack: function(){
            var deferred = $q.defer();
            var inserturl = APP_CONFIG.SERVER_URL + '/comments/' + this._id;
            var scope = this;
            $http.get(inserturl)
                .then(function (response){
                    var comentariosFiltrados = [];
                    response.data.data.forEach(function(comentario){
                        if (comentario.group == loginService.getGroup() || comentario.group === 'ALL'){
                            comentario.fecha = formatService.formatearFechaISOString(comentario.registrado_en);
                            comentariosFiltrados.push(comentario);
                        }
                    });
                    if (comentariosFiltrados.length > 0){
                        scope.estado = {
                            estado: comentariosFiltrados[comentariosFiltrados.length-1].state,
                            grupo: comentariosFiltrados[comentariosFiltrados.length-1].group,
                            user: comentariosFiltrados[comentariosFiltrados.length-1].user
                        };
                        scope.setInterface();
                    }
                    scope.comments = comentariosFiltrados;
                    deferred.resolve();
                }, function(response){
                    deferred.reject(response.data);
                });
            return deferred.promise;

        },
        updateState: function(newState){
            var deferred = $q.defer();
            var inserturl = APP_CONFIG.SERVER_URL + '/invoices/setState/' + loginService.getFiltro() + '/' + this._id;
            var data = { estado: newState };
            $http.put(inserturl,  data).then(function (response){
                deferred.resolve(response.data);
            }, function(response){
                deferred.reject(response.data);
                //errorFactory.raiseError(errorText, inserturl, 'errorTrack', 'Error al cambiar el estado para el comprobante ' + invoiceId);
            });
            return deferred.promise;
        },
        addComment: function(dataComment, newComment){
            var deferred = $q.defer();
            var message;
            var inserturl = APP_CONFIG.SERVER_URL + '/comments/comment';
            var scope = this;
            $http.post(inserturl, newComment)
                .then(function (response){
                    if (response.data.status == 'OK'){
                        scope.interfazEstado = dataComment.newState;
                        switch (dataComment.newState.type){
                            case 'WARN':
                                scope.interfazEstado.btnEstado = 'text-warning';
                                break;
                            case 'OK':
                                scope.interfazEstado.btnEstado = 'text-success';
                                break;
                            case 'ERROR':
                                scope.interfazEstado.btnEstado = 'text-danger';
                                break;
                            case 'UNKNOWN':
                                scope.interfazEstado.btnEstado = 'text-info';
                                break;
                        }
                        scope.estado = {
                            _id: scope._id,
                            estado: dataComment.newState,
                            grupo: loginService.getGroup(),
                            user: loginService.getInfo().user
                        };
                        scope.setInterface();
                        deferred.resolve();
                    } else {
                        message = 'Se ha producido un error al agregar el comentario en el comprobante.';
                        deferred.reject(message);
                    }
                }, function(response){
                    //veremos que hacemos
                    deferred.reject(response);
                });
            return deferred.promise;
        },
        setResend: function(resendStatus){
            var deferred = $q.defer();
            var message;
            var data = {
                resend: resendStatus
            };
            var inserturl = APP_CONFIG.SERVER_URL + '/invoices/invoice/' + loginService.getFiltro() + '/' + this._id;
            $http.put(inserturl, data)
                .then(function(response){
                    if (response.data.status == 'OK'){
                        comprobante.resend = resendStatus;
                        deferred.resolve()
                    } else {
                        message = 'Se ha producido un error al establecer el estado del comprobante.';
                        deferred.reject(response.data);
                    }
                }, function(response){
                    deferred.reject(response.data);
                });
            return deferred.promise;
        },
        trackInvoice: function(){
            var estadosComprobantes = generalCache.get('estados');
            var scope = this;
            var deferred = $q.defer();
            this.getTrack().then(function(){
                var modalInstance = $uibModal.open({
                    templateUrl: 'view/trackingInvoice.html',
                    controller: 'trackingInvoiceCtrl',
                    backdrop: 'static',
                    resolve: {
                        estado: function () {
                            return scope.interfazEstado;
                        },
                        track: function() {
                            return scope.comments;
                        },
                        states : function() {
                            return angular.copy(estadosComprobantes);
                        },
                        resend: function() {
                            return scope.resend;
                        }
                    }
                });
                dataTrack = [];
                modalInstance.result.then(function (dataComment) {
                    var logInvoice = {
                        title: dataComment.title,
                        state: dataComment.newState._id,
                        comment: dataComment.comment,
                        invoice: scope._id
                    };
                    var llamadas = [];
                    if (dataComment.setState){
                        llamadas.push(scope.updateState(dataComment.newState._id));
                        llamadas.push(scope.addComment(dataComment, logInvoice));
                    }
                    if (dataComment.setResend){
                        llamadas.push(scope.setResend(dataComment.setResend()));
                    }
                    $q.all(llamadas)
                        .then(function(){
                            deferred.resolve(comprobante);
                        }, function(error){
                            //console.log(error);
                            deferred.reject(error);
                        });
                }, function(){
                    deferred.resolve();
                });
            });
            return deferred.promise;
        },
        mostrarDetalle: function(){
            var deferred = $q.defer();
            var scope = this;
            this.loadById().then(function(){
                scope.getTrack();
                deferred.resolve();
            }, function(error){
                deferred.reject(error);
            });
            return deferred.promise;
        },
        controlarTarifas: function(){
            /***************** ASQUEROSO ***********************************/
            var matchesTerminal = generalCache.get('matches' + loginService.getFiltro());
            var lookup = {};
            for (var i = 0, len = matchesTerminal.length; i < len; i++) {
                lookup[matchesTerminal[i].code] = matchesTerminal[i];
            }
            /*****************************************************************/
            var tasaCargasTerminal = generalCache.get('ratesMatches' + loginService.getFiltro());

            var valorTomado;
            var tarifaError;

            var precioALaFecha;
            var monedaALaFecha;

            var precioEncontrado = false;
            var scope = this;

            if (this.detalle){
                this.detalle.forEach(function(detalle){
                    detalle.items.forEach(function(item){
                        precioEncontrado = false;
                        if (angular.isDefined(lookup[item.id])){
                            valorTomado = item.impUnit.toFixed(2);
                            lookup[item.id].topPrices.forEach(function(precioMatch){
                                if (scope.fecha.emision >= precioMatch.from){
                                    precioEncontrado = true;
                                    precioALaFecha = precioMatch.price;
                                    monedaALaFecha = precioMatch.currency
                                }
                            });
                            if (monedaALaFecha != 'DOL'){
                                valorTomado = (item.impUnit * scope.cotiMoneda).toFixed(2);
                            }
                            if (tasaCargasTerminal.indexOf(item.id) >= 0){
                                scope.tieneTasa = true;
                                if (angular.isDefined(scope.payment) && scope.payment != null){
                                    if (angular.isDefined(scope.payment.number)){
                                        scope.interfazLiquidada = 'text-success';
                                    } else {
                                        scope.interfazLiquidada = 'text-warning';
                                    }
                                } else {
                                    scope.interfazLiquidada = 'text-danger';
                                }
                                if (precioEncontrado){
                                    if (valorTomado != precioALaFecha){
                                        tarifaError = {
                                            codigo: item.id,
                                            currency: monedaALaFecha,
                                            topPrice: precioALaFecha,
                                            current: item.impUnit,
                                            topPrices: lookup[item.id].topPrices,
                                            emision: scope.fecha.emision,
                                            container: detalle.contenedor
                                        };
                                        scope.controlTarifas.push(tarifaError);
                                    }
                                } else {
                                    tarifaError = {
                                        codigo: item.id,
                                        tieneMatch: true,
                                        topPrices: lookup[item.id].topPrices,
                                        emision: scope.fecha.emision,
                                        container: detalle.contenedor
                                    };
                                    scope.tarifasSinMatch.push(tarifaError);
                                    scope.noMatch = true;
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
                                            emision: scope.fecha.emision,
                                            container: detalle.contenedor
                                        };
                                        scope.controlTarifas.push(tarifaError);
                                    }
                                } else {
                                    tarifaError = {
                                        codigo: item.id,
                                        tieneMatch: true,
                                        topPrices: lookup[item.id].topPrices,
                                        emision: scope.fecha.emision,
                                        container: detalle.contenedor
                                    };
                                    scope.tarifasSinMatch.push(tarifaError);
                                    scope.noMatch = true;
                                }
                            }
                        } else {
                            tarifaError = {
                                codigo: item.id,
                                tieneMatch: false,
                                topPrices: [],
                                emision: scope.fecha.emision,
                                container: detalle.contenedor
                            };
                            scope.tarifasSinMatch.push(tarifaError);
                            scope.noMatch = true;
                        }
                    });
                });
            }
        },
        verPdf: function(){
            //$scope.disablePdf = true;
            var deferred = $q.defer();
            var imprimirComprobante = {};
            var nombreReporte = $filter('nombreComprobante')(this.codTipoComprob, true) + this.nroComprob + '_' + loginService.getFiltro() + '.pdf';
            angular.copy(this, imprimirComprobante);
            imprimirComprobante.codTipoComprob = $filter('nombreComprobante')(imprimirComprobante.codTipoComprob, false);
            imprimirComprobante.fecha.emision = $filter('date')(imprimirComprobante.fecha.emision, 'dd/MM/yyyy', 'UTC');
            imprimirComprobante.fecha.vcto = $filter('date')(imprimirComprobante.fecha.vcto, 'dd/MM/yyyy', 'UTC');
            imprimirComprobante.fecha.desde = $filter('date')(imprimirComprobante.fecha.desde, 'dd/MM/yyyy', 'UTC');
            imprimirComprobante.fecha.hasta = $filter('date')(imprimirComprobante.fecha.hasta, 'dd/MM/yyyy', 'UTC');
            imprimirComprobante.detalle.forEach(function(detalle){
                detalle.buque.fecha = $filter('date')(detalle.buque.fecha, 'dd/MM/yyyy', 'UTC');
            });
            downloadFactory.convertToPdf(imprimirComprobante, 'invoiceToPdf', function(data, status){
                if (status == 'OK'){
                    var file = new Blob([data], {type: 'application/pdf'});
                    var fileURL = URL.createObjectURL(file);

                    var anchor = angular.element('<a/>');
                    anchor.css({display: 'none'}); // Make sure it's not visible
                    angular.element(document.body).append(anchor); // Attach to document

                    anchor.attr({
                        href: fileURL,
                        target: '_blank',
                        download: nombreReporte
                    })[0].click();

                    anchor.remove(); // Clean it up afterwards
                    //window.open(fileURL);
                    deferred.resolve();
                } else {
                    deferred.reject();
                }
            });
            return deferred.promise;
        }
    };
    return Invoice;
}]);