/**
 * Created by kolesnikov-a on 23/08/2016.
 */
myapp.factory('Price', ['$http', 'unitTypesArrayCache', '$q', 'formatService', 'loginService', function($http, unitTypesArrayCache, $q, formatService, loginService){
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

            if (!angular.isDefined(this.topPrices[0].price || this.topPrices[0].price == null)){
                this.orderPrice = 0;
            } else {
                this.orderPrice = this.topPrices[0].price;
                this.orderCurrency = this.topPrices[0].currency;
            }
            this.nuevoTopPrice = {
                currency: this.topPrices[0].currency,
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
                if (this.matches[0].match.length >= 1){
                    var tarifa = this;
                    var tarifaPropia = false;
                    this.matches[0].match.forEach(function(unMatch){
                        if (unMatch == tarifa.code){
                            tarifaPropia = true;
                        }
                    });
                    tarifaPropia ? this.tarifaTerminal = true : this.servicio = true;
                }
            }
            if (angular.isDefined(this.unit) && this.unit != null && angular.isDefined(unitTypesArrayCache.get(this.unit))){
                this.idUnit = this.unit;
                this.unit = unitTypesArrayCache.get(this.unit);
            }
            this.mostrarDetalle = false;
        },
        addTopPrice: function(topPrice){
            topPrice.price = parseFloat(topPrice.price);
            if (topPrice.from != '' && topPrice.currency != '' && topPrice.price > 0){
                this.topPrices.push(topPrice);
            }
        },
        removeTopPrice: function(index){
            this.topPrices.splice(index, 1);
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
            return (angular.isDefined(this.matches) && this.matches != null && this.matches.length > 0 && this.matches[0].match.length > 0)
        },
        saveChanges: function(){
            if (this._id){
               return this.updatePriceChanges();
            } else {
                return this.addNewPrice();
            }
        },
        addNewPrice: function(){
            var deferred = $q.defer();
            var inserturl = serverUrl + '/prices/price';
            var scope = this;
            $http.post(inserturl, this)
                .then(function(response) {
                    if (response.data.status == 'OK'){
                        if (loginService.getType() == 'terminal'){
                            var encontrado = false;
                            scope.matches[0].match.forEach(function(match){
                                encontrado = (match.text == scope.code);
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
                            })
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
            var inserturl = serverUrl + '/prices/price/' + this._id;
            var scope = this;
            $http.put(inserturl, this)
                .then(function(response) {
                    if (response.data.status == 'OK'){
                        scope.saveMatchPrices().then(function(response){
                            deferred.resolve(response);
                        }, function(error){
                            deferred.reject(error)
                        })
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
            var inserturl = serverUrl + '/matchPrices/matchprice';
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
            var inserturl = serverUrl + '/prices/price/' + this._id;
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