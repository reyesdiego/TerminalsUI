/**
 * Created by kolesnikov-a on 23/08/2016.
 */
myapp.factory('Price', ['$http', 'unitTypesArrayCache', '$q', 'formatService', 'loginService', 'APP_CONFIG', function($http, unitTypesArrayCache, $q, formatService, loginService, APP_CONFIG){
    function Price(priceData){
        if (priceData){
            this.setData(priceData);
        } else {
            this.newPrice()
        }

    };

    Price.prototype = {
        newPrice: function(){
            this.code = '';
            this.unit = '';
            this.topPrices = [];
            this.terminal = loginService.getInfo().terminal;
            this.matches = [{
                terminal: loginService.getInfo().terminal,
                match: [],
                _idPrice: '',
                code: ''
            }]
        },
        setData: function(priceData){
            angular.extend(this, priceData);

            this.tarifaTerminal = false;
            this.tarifaAgp = false;
            this.servicio = false;

            if (!angular.isDefined(this.price || this.price == null)){
                this.orderPrice = 0;
            } else {
                this.orderPrice = this.price;
                this.orderCurrency = this.currency;
            }
            this.nuevoTopPrice = {
                currency: this.currency,
                price: this.orderPrice,
                from: new Date()
            };
            if (this.tieneMatch()){
                this.matches[0]._idPrice = this._id;
            } else {
                this.matches = [{
                    terminal: loginService.getInfo().terminal,
                    match: [],
                    _idPrice: this._id,
                    code: this.code
                }];
            }
            if (this.terminal == 'AGP'){
                this.tarifaAgp = true;
            } else {
                if (angular.isDefined(this.matches[0].match)  && this.matches[0].match != null && this.matches[0].match.length >= 1){
                    var tarifa = this;
                    var tarifaPropia = false;
                    this.matches[0].match.forEach(function(unMatch){
                        if (unMatch == tarifa.code){
                            tarifaPropia = true;
                        }
                    });
                    tarifaPropia ? this.tarifaTerminal = true : this.servicio = true;
                } else {
                    this.servicio = true;
                }
            }
            if (angular.isDefined(this.unit) && this.unit != null && angular.isDefined(unitTypesArrayCache.get(this.unit))){
                this.idUnit = this.unit;
                this.unit = unitTypesArrayCache.get(this.unit);
            }
            this.mostrarDetalle = false;
        },
        checkTopPricesDates: function(){
            if (this.topPrices.length > 0){
                this.topPrices[0].dateOptions = {};
                for (var i = 1; i < this.topPrices.length; i++){
                    this.topPrices[i-1].dateOptions.maxDate = new Date(this.topPrices[i-1].from);
                    this.topPrices[i].dateOptions = {
                        minDate: new Date(this.topPrices[i-1].from.getFullYear(), this.topPrices[i-1].from.getMonth(), this.topPrices[i-1].from.getDate()+1)
                    }
                }
            }
        },
        getTopPrices: function(){
            var deferred = $q.defer();
            var inserturl = APP_CONFIG.SERVER_URL + '/prices/' + this._id + '/' + loginService.getFiltro();
            var scope = this;
            $http.get(inserturl)
                .then(function(response){
                    scope.topPrices = response.data.data.topPrices;
                    for (var i = 0; i < scope.topPrices.length; i++){
                        scope.topPrices[i].from = new Date(scope.topPrices[i].from)
                    }
                    scope.checkTopPricesDates();
                    deferred.resolve();
                }, function(response){
                    deferred.reject(response.data);
                });
            return deferred.promise;
        },
        addTopPrice: function(){
            var newPrice = {
                from: new Date(),
                currency: 'DOL',
                price: '',
                dateOptions: ''
            };
            if (this.topPrices.length > 0){
                newPrice.from = new Date(this.topPrices[this.topPrices.length-1].from.getFullYear(), this.topPrices[this.topPrices.length-1].from.getMonth(), this.topPrices[this.topPrices.length-1].from.getDate()+1);
                newPrice.dateOptions = {
                    minDate: newPrice.from
                };
                this.topPrices[this.topPrices.length-1].dateOptions.maxDate = new Date(this.topPrices[this.topPrices.length-1].from)
            }
            this.topPrices.push(newPrice);
        },
        removeTopPrice: function(index){
            this.topPrices.splice(index, 1);
            this.checkTopPricesDates();
        },
        detalleOnOff: function(){
            this.mostrarDetalle = !this.mostrarDetalle;
        },
        getMatches: function(){
            if (this.tieneMatch()) {
                return this.matches[0].match;
            }
        },
        setMatches: function(matches){
            this.matches[0].match = matches;
        },
        tieneMatch: function(){
            return (angular.isDefined(this.matches) && this.matches != null && this.matches.length > 0
                        && this.matches[0].match != null && this.matches[0].match.length > 0 && this.matches[0].match[0] != null);
        },
        saveChanges: function(){
            if (loginService.getType() == 'terminal' && this.tarifaTerminal){
                var encontrado = false;
                var scope = this;
                this.matches[0].match.forEach(function(match){
                    if (match == scope.code) encontrado = true;
                });
                if (!encontrado){
                    this.matches[0].match.push(this.code)
                }
            }
            this.matches[0].code = this.code;
            if (this._id){
               return this.updatePriceChanges();
            } else {
                return this.addNewPrice();
            }
        },
        addNewPrice: function(){
            var deferred = $q.defer();
            //console.log(this);
            var inserturl = APP_CONFIG.SERVER_URL + '/prices/price';
            var scope = this;
            $http.post(inserturl, this)
                .then(function(response) {
                    if (response.data.status == 'OK'){
                        scope.matches[0]._idPrice = response.data.data._id;
                        /*if (loginService.getType() == 'terminal'){
                            var encontrado = false;
                            scope.matches[0].match.forEach(function(match){
                                if (match == scope.code) encontrado = true;
                            });
                            if (!encontrado){
                                scope.matches[0].match.push(scope.code)
                            }
                        }
                        scope.saveMatchPrices()
                            .then(function(response){
                                deferred.resolve(response);
                            }, function(error){
                                deferred.reject(error);
                            })*/
                        deferred.resolve(response);
                    } else {
                        deferred.reject(response.data)
                    }
                }, function(response) {
                    deferred.reject(response.data);
                });
            return deferred.promise;
        },
        updatePriceChanges: function(){
            var deferred = $q.defer();
            this.topPrices.forEach(function(unPrecio){
                unPrecio.from = formatService.formatearFechaISOString(unPrecio.from);
            });
            var inserturl = APP_CONFIG.SERVER_URL + '/prices/price/' + this._id;
            //var scope = this;
            $http.put(inserturl, this)
                .then(function(response) {
                    if (response.data.status == 'OK'){
                        /*if (loginService.getType() == 'terminal' && scope.tarifaTerminal){
                            var encontrado = false;
                            scope.matches[0].match.forEach(function(match){
                                if (match == scope.code) encontrado = true;
                            });
                            if (!encontrado){
                                scope.matches[0].match.push(scope.code)
                            }
                            scope.matches[0].code = scope.code;
                        }
                        scope.saveMatchPrices().then(function(response){
                            deferred.resolve(response);
                        }, function(error){
                            deferred.reject(error)
                        })*/
                        deferred.resolve(response);
                    } else {
                        deferred.reject(response.data);
                    }
                }, function(response) {
                    deferred.reject(response.data);
                });
            return deferred.promise;
        },
        saveMatchPrices: function(){
            var deferred = $q.defer();
            var inserturl = APP_CONFIG.SERVER_URL + '/matchPrices/matchprice';
            $http.post(inserturl, this.matches[0])
                .then(function (response) {
                    deferred.resolve(response.data);
                }, function(response) {
                    deferred.reject(response.data);
                });
            return deferred.promise;
        },
        removePrice: function(){
            var deferred = $q.defer();
            var inserturl = APP_CONFIG.SERVER_URL + '/prices/price/' + this._id;
            $http.delete(inserturl)
                .then(function(response) {
                    deferred.resolve(response.data);
                }, function(response) {
                    deferred.reject(response.data);
                });
            return deferred.promise;
        }
    };
    return Price;
}]);