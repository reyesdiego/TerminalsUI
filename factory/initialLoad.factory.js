/**
 * Created by kolesnikov-a on 28/07/2016.
 */
/**
 * Created by leo on 12/03/15.
 */
myapp.factory('initialLoadFactory', ['CacheFactory', 'controlPanelFactory',  'containerFactory', 'invoiceFactory', 'priceFactory', 'gatesFactory', 'contenedoresCache', 'generalCache', 'vouchersArrayCache', 'unitTypesArrayCache', 'estadosArrayCache', 'afipFactory', 'afipCache', '$q', 'loginService',
    function (CacheFactory, controlPanelFactory, containerFactory, invoiceFactory, priceFactory, gatesFactory, contenedoresCache, generalCache, vouchersArrayCache, unitTypesArrayCache, estadosArrayCache, afipFactory, afipCache, $q, loginService) {

        //Se encarga de asegurarse de que antes de cargar cada vista, esta tenga los datos necesarios para funcionar, si no están hace las llamadas y los guarda en caché
        //No devuelve datos.
        //Siempre devuelve el resolve para no entorpecer la operatoria, ya que por lo general son datos accesorios, y errores en las cargas en definitiva significarían
        //algún problema con el servidor

        var factory = {};

        factory.cargaTrenes = function(){
            //console.log('trenes');
            var deferred = $q.defer();
            if (generalCache.get('trenes' + loginService.getFiltro())){
                //console.log('hay trenes');
                deferred.resolve(generalCache.get('trenes' + loginService.getFiltro()));
            } else {
                //console.log('no hay trenes');
                gatesFactory.getTrains(loginService.getFiltro(), function(data){
                    if (data.status == 'OK'){
                        //console.log('cargamos trenes');
                        generalCache.put('trenes' + loginService.getFiltro(), data.data);
                        deferred.resolve(data.data);
                    } else {
                        //console.log('error trenes');
                        generalCache.put('trenes' + loginService.getFiltro(), []);
                        deferred.resolve([])
                    }
                })
            }
            return deferred.promise;
        };

        factory.cargaBuques = function(){
            //console.log('buques');
            var deferred = $q.defer();
            if (generalCache.get('buques' + loginService.getFiltro())){
                //console.log('hay buques');
                deferred.resolve(generalCache.get('buques' + loginService.getFiltro()));
            } else {
                //console.log('no hay buques');
                containerFactory.getShipTrips(loginService.getFiltro(), function (data) {
                    if (data.status == 'OK') {
                        //console.log('cargamos buques');
                        generalCache.put('buques' + loginService.getFiltro(), data.data);
                        deferred.resolve(data.data);
                    } else {
                        //console.log('error buques');
                        generalCache.put('buques' + loginService.getFiltro(), []);
                        deferred.resolve([]);
                    }
                });
            }
            return deferred.promise;
        };

        factory.cargaClientes = function(){
            //console.log('clientes' + loginService.getFiltro());
            var deferred = $q.defer();
            if (generalCache.get('clientes' + loginService.getFiltro())){
                //console.log('hay clientes');
                deferred.resolve(generalCache.get('clientes' + loginService.getFiltro()));
            } else {
                //console.log('no hay clientes');
                controlPanelFactory.getClients(loginService.getFiltro(), function (data) {
                    //console.log(data);
                    if (data.status == 'OK') {
                        //console.log('cargamos clientes');
                        var clientes = [];
                        var i = 0;
                        data.data.forEach(function (dato) {
                            clientes.push({id: i++, nombre: dato})
                        });
                        generalCache.put('clientes' + loginService.getFiltro(), clientes);
                        deferred.resolve(clientes);
                    } else {
                        //console.log('error clientes');
                        generalCache.put('clientes' + loginService.getFiltro(), []);
                        deferred.resolve([]);
                    }
                });
            }
            return deferred.promise;
        };

        factory.cargaDescripciones = function(){
            //console.log('descripciones');
            var deferred = $q.defer();
            if (generalCache.get('descripciones' + loginService.getFiltro())){
                //console.log('hay descripciones');
                deferred.resolve();
            } else {
                //console.log('no hay descripciones');
                invoiceFactory.getDescriptionItem(loginService.getFiltro(), function (data) {
                    if (data.status == 'OK') {
                        //console.log('cargamos descripciones');
                        generalCache.put('descripciones' + loginService.getFiltro(), data.data);
                        deferred.resolve();
                    } else {
                        //console.log('error descripciones');
                        generalCache.put('descripciones' + loginService.getFiltro(), []);
                        deferred.resolve();
                    }
                });
            }
            return deferred.promise;
        };

        factory.cargaVouchers = function(){
            //console.log('vouchers');
            var deferred = $q.defer();
            if (generalCache.get('vouchers' + loginService.getFiltro())){
                //console.log('hay vouchers');
                deferred.resolve();
            } else {
                //console.log('no hay vouchers');
                invoiceFactory.getVouchersType(loginService.getFiltro(), function (data) {
                    if (data.status == 'OK') {
                        //console.log('cargamos vouchers');
                        generalCache.put('vouchers' + loginService.getFiltro(), data.data);
                        data.data.forEach(function (dato) {
                            vouchersArrayCache.put(dato._id, {desc: dato.description, abrev: dato.abbrev });
                        });
                        deferred.resolve();
                    } else {
                        //console.log('error vouchers');
                        generalCache.put('vouchers' + loginService.getFiltro(), []);
                        deferred.resolve();
                    }
                });
            }
            return deferred.promise;
        };

        factory.cargaUnidades = function(){
            //console.log('unidades');
            var deferred = $q.defer();
            if (generalCache.get('unitTypes')){
                //console.log('hay unidades');
                deferred.resolve();
            } else {
                //console.log('no hay unidades');
                priceFactory.getUnitTypes(function (data) {
                    if (data.status == 'OK') {
                        //console.log('cargamos unidades');
                        generalCache.put('unitTypes', data.data);
                        data.data.forEach(function (dato) {
                            unitTypesArrayCache.put(dato._id, dato.description);
                        });
                        deferred.resolve();
                    } else {
                        //console.log('error unidades');
                        generalCache.put('unitTypes', []);
                        deferred.resolve();
                    }
                });
            }
            return deferred.promise;
        };

        factory.cargaEstados = function(){
            //console.log('estados');
            var deferred = $q.defer();
            if (generalCache.get('estados')){
                //console.log('hay estados');
                deferred.resolve();
            } else {
                //console.log('no hay estados');
                invoiceFactory.getStatesType(function (data) {
                    if (data.status == 'OK') {
                        //console.log('cargamos estados');
                        var estados = data.data;
                        estados.forEach(function (estado) {
                            switch (estado.type) {
                                case 'WARN':
                                    estado.btnEstado = 'text-warning';
                                    estado.icon = '<img src="images/warn.png" />';
                                    estado.imagen = 'images/warn.png';
                                    break;
                                case 'ERROR':
                                    estado.btnEstado = 'text-danger';
                                    estado.icon = '<img src="images/error.png" />';
                                    estado.imagen = 'images/error.png';
                                    break;
                                case 'UNKNOWN':
                                    estado.btnEstado = 'text-info';
                                    estado.icon = '<img src="images/unknown.png" />';
                                    estado.imagen = 'images/unknown.png';
                                    break;
                                case 'OK':
                                    estado.btnEstado = 'text-success';
                                    estado.icon = '<img src="images/ok.png" />';
                                    estado.imagen = 'images/ok.png';
                                    break;
                            }
                        });
                        generalCache.put('estados', estados);
                        data.data.forEach(function (dato) {
                            estadosArrayCache.put(dato._id, dato);
                        });
                        deferred.resolve();
                    } else {
                        //console.log('error estados');
                        generalCache.put('estados', []);
                        deferred.resolve();
                    }
                });
            }
            return deferred.promise;
        };

        factory.actualizarMatchesArray = function(terminal){
            CacheFactory('matches' + terminal).destroy();
            priceFactory.getArrayMatches(terminal, function(data){
                if (data.status == 'OK'){
                    generalCache.put('matches' + terminal, data.data);
                }
            })
        };

        factory.cargaMatchesArray = function(){
            //console.log('matches');
            var deferred = $q.defer();
            if (generalCache.get('matches' + loginService.getFiltro())){
                //console.log('hay matches');
                deferred.resolve();
            } else {
                //console.log('no hay matches');
                priceFactory.getArrayMatches(loginService.getFiltro(), function(data){
                    if (data.status == 'OK'){
                        //console.log('cargamos matches');
                        generalCache.put('matches' + loginService.getFiltro(), data.data);
                        deferred.resolve();
                    } else {
                        //console.log('error matches');
                        generalCache.put('matches' + loginService.getFiltro(), []);
                        deferred.resolve();
                    }
                });
            }
            return deferred.promise;
        };

        factory.cargaMatchesRates = function(){
            //console.log('rates');
            var deferred = $q.defer();
            if (generalCache.get('ratesMatches' + loginService.getFiltro())){
                //console.log('hay rates');
                deferred.resolve();
            } else {
                //console.log('no hay rates');
                priceFactory.getMatchPrices({onlyRates: true}, loginService.getFiltro(), function (data) {
                    if (data.status == 'OK') {
                        //console.log('cargamos rates');
                        var tasasCargasTerminal = [];
                        data.data.forEach(function (tasaCargas) {
                            if (tasaCargas.matches != null && tasaCargas.matches.length > 0) {
                                tasasCargasTerminal.push(tasaCargas.matches[0].match[0])
                            }
                        });
                        generalCache.put('ratesMatches' + loginService.getFiltro(), tasasCargasTerminal);
                        deferred.resolve();
                    } else {
                        //console.log('error rates');
                        generalCache.put('ratesMatches' + loginService.getFiltro(), []);
                        deferred.resolve();
                    }
                });
            }
            return deferred.promise;
        };

        factory.cargaAllRates = function(){
            //console.log('allrates');
            var deferred = $q.defer();
            if (generalCache.get('allRates')){
                //console.log('hay allrates');
                deferred.resolve();
            } else {
                //console.log('no hay allrates');
                priceFactory.getAllRates(function(data, error){
                    if (!error){
                        //console.log('cargamos allrates');
                        generalCache.put('allRates', data);
                        deferred.resolve();
                    } else {
                        //console.log('error allrates');
                        generalCache.put('allRates', []);
                        deferred.resolve()
                    }
                });
            }
            return deferred.promise;
        };

        factory.cargaSumariaImpoBuques = function(){
            var deferred = $q.defer();
            if (afipCache.get('SumImpoBuques')){
                deferred.resolve();
            } else {
                afipFactory.getSumariaImpoBuques(function(data, error){
                    if (!error){
                        afipCache.put('SumImpoBuques', data.data);
                        deferred.resolve();
                    } else {
                        afipCache.put('SumImpoBuques', []);
                        deferred.resolve();
                    }
                })
            }
            return deferred.promise;
        };

        factory.cargaSumariaExpoBuques = function(){
            var deferred = $q.defer();
            if (afipCache.get('SumExpoBuques')){
                deferred.resolve();
            } else {
                afipFactory.getSumariaExpoBuques(function(data, error){
                    if (!error){
                        afipCache.put('SumExpoBuques', data.data);
                        deferred.resolve();
                    } else {
                        afipCache.put('SumExpoBuques', []);
                        deferred.resolve();
                    }
                })
            }
            return deferred.promise;
        };

        factory.cargaAfectacionBuques = function(){
            var deferred = $q.defer();
            if (afipCache.get('AfectacionBuques')){
                deferred.resolve();
            } else {
                afipFactory.getAfectacionBuques(function(data, error){
                    if (!error){
                        afipCache.put('AfectacionBuques', data.data);
                        deferred.resolve();
                    } else {
                        afipCache.put('AfectacionBuques', []);
                        deferred.resolve();
                    }
                })
            }
            return deferred.promise;
        };

        factory.cargaSolicitudBuques = function(){
            var deferred = $q.defer();
            if (afipCache.get('SolicitudBuques')){
                deferred.resolve();
            } else {
                afipFactory.getSolicitudBuques(function(data, error){
                    if (!error){
                        afipCache.put('SolicitudBuques', data.data);
                        deferred.resolve();
                    } else {
                        afipCache.put('SolicitudBuques', []);
                        deferred.resolve();
                    }
                })
            }
            return deferred.promise;
        };

        factory.limpiaCache = function () {
            CacheFactory.clearAll();
        };

        return factory;
    }]);