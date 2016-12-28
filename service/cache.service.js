/**
 * Created by kolesnikov-a on 28/07/2016.
 */
/**
 * Created by leo on 12/03/15.
 */
myapp.service('cacheService', ['CacheFactory', '$http', 'APP_CONFIG', '$q', 'loginService',
    function (CacheFactory, $http, APP_CONFIG, $q, loginService) {

        //Se encarga de asegurarse de que antes de cargar cada vista, esta tenga los datos necesarios para funcionar, si no están hace las llamadas y los guarda en caché
        //No devuelve datos.
        //Siempre devuelve el resolve para no entorpecer la operatoria, ya que por lo general son datos accesorios, y errores en las cargas en definitiva significarían
        //algún problema con el servidor

        class cacheService {
            constructor(){
                //console.log('constructor!');
                if (!CacheFactory.get('generalCache')){
                    //console.log('no existe');
                    //console.log('la creamos');
                    this.probando = 'hola puto';
                    this.cache = CacheFactory.createCache('generalCache', {
                        maxAge: 7 *24 * 60 * 60 * 1000, // 1 week
                        deleteOnExpire: 'aggressive',
                        storageMode: 'localStorage',
                        onExpire: (key, value) => {
                            switch (key){
                                case `trenes${loginService.getFiltro()}`:
                                    this.cargaTrenes();
                                    break;
                                case `buques${loginService.getFiltro()}`:
                                    this.cargaBuques();
                                    break;
                                case `clientes${loginService.getFiltro()}`:
                                    this.cargaClientes();
                                    break;
                                case `descripciones${loginService.getFiltro()}`:
                                    this.cargaDescripciones();
                                    break;
                                case `vouchers${loginService.getFiltro()}`:
                                    this.cargaVouchers();
                                    break;
                                case `unitTypes`:
                                    this.cargaUnidades();
                                    break;
                                case `estados`:
                                    this.cargaEstados();
                                    break;
                            }
                        }
                    });
                    //console.log(this.cache);
                } else {
                    //console.log('ya estaba creada');
                    this.cache = CacheFactory.get('generalCache');
                }
                if (!CacheFactory.get('matchesCache')){
                    this.matchesCache = CacheFactory.createCache('matchesCache', {
                        maxAge: 2 * 60 * 60 * 1000, // 2 hour
                        deleteOnExpire: 'aggressive',
                        storageMode: 'localStorage',
                        onExpire: (key, value) => {
                            switch (key){
                                case `matches${loginService.getFiltro()}`:
                                    this.cargaMatchesArray();
                                    break;
                                case `ratesMatches${loginService.getFiltro()}`:
                                    this.cargaMatchesRates();
                                    break;
                                case `allRates`:
                                    this.cargaAllRates();
                                    break;
                            }
                        }
                    });
                } else {
                    this.matchesCache = CacheFactory.get('matchesCache');
                }
                if (!CacheFactory.get('afipCache')){
                    this.afipCache = CacheFactory.createCache('afipCache', {
                        maxAge: 30 * 24 * 60 * 60 * 1000, // 1 month
                        deleteOnExpire: 'aggressive',
                        storageMode: 'localStorage',
                        onExpire: (key, value) => {
                            switch (key){
                                case `SumImpoBuques`:
                                    this.cargaSumariaImpoBuques();
                                    break;
                                case `SumExpoBuques`:
                                    this.cargaSumariaExpoBuques();
                                    break;
                                case `AfectacionBuques`:
                                    this.cargaAfectacionBuques();
                                    break;
                                case `SolicitudBuques`:
                                    this.cargaSolicitudBuques();
                                    break;
                            }
                        }
                    });
                } else {
                    this.afipCache = CacheFactory.get('afipCache');
                }

                if (!CacheFactory.get('colorTerminalesCache')){
                    this.colorTerminalesCache = CacheFactory.createCache('colorTerminalesCache', { storageMode: 'localStorage' });
                } else {
                    this.colorTerminalesCache = CacheFactory.get('colorTerminalesCache')
                }

                var styles=document.styleSheets;
                for(var i=0,l=styles.length; i<l; ++i){
                    var sheet=styles[i];
                    var rules, rule, j, l2;
                    if(sheet.title === "TERMINALES"){
                        rules=sheet.cssRules;
                        for(j=0, l2=rules.length; j<l2; j++){
                            rule=rules[j];
                            if('.BACTSSA' === rule.selectorText){
                                this.colorTerminalesCache.put('Bactssa', rule.style['color']);
                            }
                            if('.TERMINAL4' === rule.selectorText){
                                this.colorTerminalesCache.put('Terminal4', rule.style['color']);
                            }
                            if('.TRP' === rule.selectorText){
                                this.colorTerminalesCache.put('Trp', rule.style['color']);
                            }
                        }
                    }
                }
                //console.log(this.cache);
                //console.log(this.probando);
            }

            cargaTrenes(){
                const deferred = $q.defer();
                if (this.cache.get(`trenes${loginService.getFiltro()}`)){
                    //console.log('hay trenes');
                    deferred.resolve(this.cache.get(`trenes${loginService.getFiltro()}`));
                } else {
                    //console.log('no hay trenes');
                    const inserturl = `${APP_CONFIG.SERVER_URL}/gates/${loginService.getFiltro()}/trains`;
                    $http.get(inserturl).then((response) => {
                        if (response.data.status == 'OK'){
                            //console.log('cargamos trenes');
                            var listaTransformada = [];
                            for (let tren of response.data.data){
                                if (tren != null){
                                    listaTransformada.push({ tren: tren });
                                }
                            }
                            this.cache.put(`trenes${loginService.getFiltro()}`, listaTransformada);
                            deferred.resolve(listaTransformada);
                        } else {
                            //console.log('error trenes');
                            this.cache.put(`trenes${loginService.getFiltro()}`, []);
                            deferred.resolve([])
                        }
                    }, (response) => {
                        this.cache.put(`trenes${loginService.getFiltro()}`, []);
                        deferred.resolve([])
                    });
                }
                return deferred.promise;
            }

            cargaBuques(){
                //console.log('buques');
                const deferred = $q.defer();
                if (this.cache.get(`buques${loginService.getFiltro()}`)){
                    //console.log('hay buques');
                    deferred.resolve(this.cache.get(`buques${loginService.getFiltro()}`));
                } else {
                    //console.log('no hay buques');
                    const inserturl = `${APP_CONFIG.SERVER_URL}/invoices/${loginService.getFiltro()}/ships`;
                    $http.get(inserturl).then((response) => {
                        console.log(response);
                        if (response.data.status == 'OK') {
                            //console.log('cargamos buques');
                            this.cache.put(`buques${loginService.getFiltro()}`, response.data.data);
                            deferred.resolve(response.data.data);
                        } else {
                            //console.log('error buques');
                            this.cache.put(`buques${loginService.getFiltro()}`, []);
                            deferred.resolve([]);
                        }
                    }, (response) => {
                        this.cache.put(`buques${loginService.getFiltro()}`, []);
                        deferred.resolve([]);
                    });
                }
                return deferred.promise;
            }

            cargaBuqueViajes(){
                //console.log('buques');
                const deferred = $q.defer();
                if (this.cache.get(`buquesviaje${loginService.getFiltro()}`)){
                    //console.log('hay buques');
                    deferred.resolve(this.cache.get(`buquesviaje${loginService.getFiltro()}`));
                } else {
                    //console.log('no hay buques');
                    const inserturl = `${APP_CONFIG.SERVER_URL}/invoices/${loginService.getFiltro()}/shipTrips`;
                    $http.get(inserturl).then((response) => {
                        if (response.data.status == 'OK') {
                            //console.log('cargamos buques');
                            this.cache.put(`buquesviaje${loginService.getFiltro()}`, response.data.data);
                            deferred.resolve(response.data.data);
                        } else {
                            //console.log('error buques');
                            this.cache.put(`buquesviaje${loginService.getFiltro()}`, []);
                            deferred.resolve([]);
                        }
                    }, (response) => {
                        this.cache.put(`buquesviaje${loginService.getFiltro()}`, []);
                        deferred.resolve([]);
                    });
                }
                return deferred.promise;
            }

            cargaClientes(){
                //console.log('clientes' + loginService.getFiltro());
                const deferred = $q.defer();
                if (this.cache.get(`clientes${loginService.getFiltro()}`)){
                    //console.log('hay clientes');
                    deferred.resolve(this.cache.get(`clientes${loginService.getFiltro()}`));
                } else {
                    //console.log('no hay clientes');
                    const inserturl = `${APP_CONFIG.SERVER_URL}/invoices/${loginService.getFiltro()}/clients`;
                    $http.get(inserturl).then((response) => {
                            if (response.data.status == 'OK') {
                                //console.log('cargamos clientes');
                                let clientes = [];
                                let i = 0;
                                for (let nombreCliente of response.data.data){
                                    clientes.push({id: i++, nombre: nombreCliente});
                                }
                                this.cache.put(`clientes${loginService.getFiltro()}`, clientes);
                                deferred.resolve(clientes);
                            } else {
                                //console.log('error clientes');
                                this.cache.put(`clientes${loginService.getFiltro()}`, []);
                                deferred.resolve([]);
                            }
                        }, (response) => {
                            this.cache.put(`clientes${loginService.getFiltro()}`, []);
                            deferred.resolve([]);
                        });
                }
                return deferred.promise;
            }

            cargaDescripciones(){
                //console.log('descripciones');
                const deferred = $q.defer();
                if (this.cache.get(`descripciones${loginService.getFiltro()}`)){
                    //console.log('hay descripciones');
                    deferred.resolve();
                } else {
                    //console.log('no hay descripciones');
                    var inserturl = `${APP_CONFIG.SERVER_URL}/matchPrices/matches/${loginService.getFiltro()}`;
                    $http.get(inserturl).then((response) => {
                        if (response.data.status == 'OK') {
                            //console.log('cargamos descripciones');
                            this.cache.put(`descripciones${loginService.getFiltro()}`, response.data.data);
                            deferred.resolve();
                        } else {
                            //console.log('error descripciones');
                            this.cache.put(`descripciones${loginService.getFiltro()}`, []);
                            deferred.resolve();
                        }
                    }, (response) => {
                        //console.log('error descripciones');
                        this.cache.put(`descripciones${loginService.getFiltro()}`, []);
                        deferred.resolve();
                    });
                }
                return deferred.promise;
            }

            cargaVouchers(){
                //console.log('vouchers');
                const deferred = $q.defer();
                if (this.cache.get(`vouchers${loginService.getFiltro()}`)){
                    //console.log('hay vouchers');
                    deferred.resolve();
                } else {
                    //console.log('no hay vouchers');
                    const inserturl = `${APP_CONFIG.SERVER_URL}/voucherTypes/${loginService.getFiltro()}`;
                    $http.get(inserturl).then((response) => {
                        if (response.data.status == 'OK') {
                            //console.log('cargamos vouchers');
                            this.cache.put(`vouchers${loginService.getFiltro()}`, response.data.data);
                            deferred.resolve();
                        } else {
                            //console.log('error vouchers');
                            this.cache.put(`vouchers${loginService.getFiltro()}`, []);
                            deferred.resolve();
                        }
                    }, (response) => {
                        //console.log('error vouchers');
                        this.cache.put(`vouchers${loginService.getFiltro()}`, []);
                        deferred.resolve();
                    });

                }
                return deferred.promise;
            }

            get vouchersArray(){
                let vouchersArray = [];
                for (let voucher of this.cache.get(`vouchers${loginService.getFiltro()}`)){
                    vouchersArray[voucher._id] = {desc: voucher.description, abrev: voucher.abbrev}
                }
                return vouchersArray;
            }

            cargaUnidades(){
                //console.log(this);
                //console.log(this.probando);
                //console.log('unidades');
                //console.log(this.cache);
                const deferred = $q.defer();
                if (this.cache.get('unitTypes')){
                    //console.log('hay unidades');
                    deferred.resolve();
                } else {
                    //console.log('no hay unidades');
                    const inserturl = `${APP_CONFIG.SERVER_URL}/unitTypes`;
                    $http.get(inserturl).then((response) => {
                        if (response.data.status == 'OK') {
                            //console.log('cargamos unidades');
                            this.cache.put('unitTypes', response.data.data);
                            let unitTypesArray = [];
                            for (let unitType of response.data.data){
                                unitTypesArray[unitType._id] = unitType.description;
                            }
                            this.cache.put('unitTypesArray', unitTypesArray);
                            deferred.resolve();
                        } else {
                            //console.log('error unidades');
                            this.cache.put('unitTypes', []);
                            deferred.resolve();
                        }
                    }, (response) => {
                        //console.log('error al carga unidades, pero deberia pasar igual');
                        this.cache.put('unitTypes', []);
                        deferred.resolve();
                    });
                }
                return deferred.promise;
            }

            cargaEstados(){
                //console.log('estados');
                const deferred = $q.defer();
                if (this.cache.get('estados')){
                    deferred.resolve();
                } else {
                    //console.log('no hay estados');
                    const inserturl = `${APP_CONFIG.SERVER_URL}/states`;
                    $http.get(inserturl).then((response) => {
                        if (response.data.status == 'OK') {
                            ////console.log('cargamos estados');
                            let estados = response.data.data;
                            //let estadosArray = {};
                            estados.forEach((estado) => {
                                //estadosArray[estado._id] = angular.copy(estado);
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
                            this.cache.put('estados', estados);
                            //this.cache.put('estadosArray', estadosArray);
                            deferred.resolve();
                        } else {
                            //console.log('error estados');
                            this.cache.put('estados', []);
                            deferred.resolve();
                        }
                    }, (response) => {
                        //console.log('error estados');
                        this.cache.put('estados', []);
                        deferred.resolve();
                    });
                }
                return deferred.promise;
            }

            get estadosArray(){
                let estadosArray = {};
                for (let estado of this.cache.get('estados')){
                    estadosArray[estado._id] = estado;
                }
                //console.log(estadosArray);
                return estadosArray;
            }

            actualizarMatchesArray(terminal){
                CacheFactory(`matches${terminal}`).destroy();
                const inserturl = `${APP_CONFIG.SERVER_URL}/matchPrices/price/${terminal}`;
                $http.get(inserturl).then((response) => {
                    if (response.data.status == 'OK'){
                        this.matchesCache.put(`matches${terminal}`, data.data);
                    }
                });
            }

            cargaMatchesArray(){
                //console.log('matches');
                const deferred = $q.defer();
                if (this.matchesCache.get(`matches${loginService.getFiltro()}`)){
                    ////console.log('hay matches');
                    deferred.resolve();
                } else {
                    //console.log('no hay matches');
                    const inserturl = `${APP_CONFIG.SERVER_URL}/matchPrices/price/${loginService.getFiltro()}`;
                    $http.get(inserturl).then((response) => {
                        if (response.data.status == 'OK'){
                            //console.log('cargamos matches');
                            this.matchesCache.put(`matches${loginService.getFiltro()}`, response.data.data);
                            deferred.resolve();
                        } else {
                            //console.log('error matches');
                            this.matchesCache.put(`matches${loginService.getFiltro()}`, []);
                            deferred.resolve();
                        }
                    }, response => {
                        //console.log('error matches');
                        this.matchesCache.put(`matches${loginService.getFiltro()}`, []);
                        deferred.resolve();
                    });
                }
                return deferred.promise;
            }

            get matchesArray(){
                let matchesArray = {};
                for (let match of this.matchesCache.get(`matches${loginService.getFiltro()}`)){
                    matchesArray[match.code] = match;
                }
                return matchesArray;
            }

            cargaMatchesRates(){
                //console.log('rates');
                const deferred = $q.defer();
                if (this.matchesCache.get(`ratesMatches${loginService.getFiltro()}`)){
                    //console.log('hay rates');
                    deferred.resolve();
                } else {
                    //console.log('no hay rates');
                    const inserturl = `${APP_CONFIG.SERVER_URL}/matchPrices/${loginService.getFiltro()}`;
                    const param = { onlyRates: true };
                    $http.get(inserturl, { params: param }).then((response) => {
                        if (response.data.status == 'OK') {
                            //console.log('cargamos rates');
                            let tasasCargasTerminal = [];
                            for (let tasaCargas of response.data.data){
                                if (tasaCargas.matches != null && tasaCargas.matches.length > 0) {
                                    tasasCargasTerminal.push(tasaCargas.matches[0].match[0])
                                }
                            }
                            this.matchesCache.put(`ratesMatches${loginService.getFiltro()}`, tasasCargasTerminal);
                            deferred.resolve();
                        } else {
                            //console.log('error rates');
                            this.matchesCache.put(`ratesMatches${loginService.getFiltro()}`, []);
                            deferred.resolve();
                        }
                    }, (response) => {
                        //console.log('error rates');
                        this.matchesCache.put(`ratesMatches${loginService.getFiltro()}`, []);
                        deferred.resolve();
                    });

                }
                return deferred.promise;
            }

            cargaAllRates(){
                ////console.log('allrates');
                const deferred = $q.defer();
                if (this.matchesCache.get('allRates')){
                    ////console.log('hay allrates');
                    deferred.resolve();
                } else {
                    ////console.log('no hay allrates');
                    const inserturl = `${APP_CONFIG.SERVER_URL}/prices/rates/1/all`;
                    $http.get(inserturl).then((response) => {
                        this.matchesCache.put('allRates', response.data);
                        deferred.resolve();
                    }, (response) => {
                        this.matchesCache.put('allRates', []);
                        deferred.resolve()
                    });
                }
                return deferred.promise;
            }

            cargaSumariaImpoBuques(){
                const deferred = $q.defer();
                if (this.afipCache.get('SumImpoBuques')){
                    deferred.resolve();
                } else {
                    const inserturl = `${APP_CONFIG.SERVER_URL}/afip/registro1_sumimpomani/buques`;
                    $http.get(inserturl).then((response) => {
                        this.afipCache.put('SumImpoBuques', response.data.data);
                        deferred.resolve();
                    }, (response) => {
                        this.afipCache.put('SumImpoBuques', []);
                        deferred.resolve();
                    });
                }
                return deferred.promise;
            }

            cargaSumariaExpoBuques(){
                const deferred = $q.defer();
                if (this.afipCache.get('SumExpoBuques')){
                    deferred.resolve();
                } else {
                    const inserturl = `${APP_CONFIG.SERVER_URL}/afip/registro1_sumexpomane/buques`;
                    $http.get(inserturl).then((response) => {
                        this.afipCache.put('SumExpoBuques', response.data.data);
                        deferred.resolve();
                    }, (response) => {
                        this.afipCache.put('SumExpoBuques', []);
                        deferred.resolve();
                    });
                }
                return deferred.promise;
            };

            cargaAfectacionBuques(){
                var deferred = $q.defer();
                if (this.afipCache.get('AfectacionBuques')){
                    deferred.resolve();
                } else {
                    const inserturl = `${APP_CONFIG.SERVER_URL}/afip/registro1_afectacion/buques`;
                    $http.get(inserturl).then((response) => {
                        this.afipCache.put('AfectacionBuques', response.data.data);
                        deferred.resolve();
                    }, (response) => {
                        this.afipCache.put('AfectacionBuques', []);
                        deferred.resolve();
                    });
                }
                return deferred.promise;
            };

            cargaSolicitudBuques(){
                const deferred = $q.defer();
                if (this.afipCache.get('SolicitudBuques')){
                    deferred.resolve();
                } else {
                    const inserturl = `${APP_CONFIG.SERVER_URL}/afip/registro1_solicitud/buques`;
                    $http.get(inserturl).then((response) => {
                        this.afipCache.put('SolicitudBuques', response.data.data);
                        deferred.resolve();
                    }, (response) => {
                        this.afipCache.put('SolicitudBuques', []);
                        deferred.resolve();
                    });
                }
                return deferred.promise;
            };
        }

        return new cacheService();
    }]);