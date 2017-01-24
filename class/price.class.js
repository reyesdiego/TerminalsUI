/**
 * Created by kolesnikov-a on 23/08/2016.
 */
myapp.factory('Price', ['$http', 'cacheService', '$q', 'formatService', 'loginService', 'APP_CONFIG', function($http, cacheService, $q, formatService, loginService, APP_CONFIG){

    class Price {
        constructor(priceData){
            if (priceData){
                this.setData(priceData);
            } else {
                this.newPrice()
            }
        }

        newPrice(){
            this.code = '';
            this.unit = '';
            this.topPrices = [];
            this.terminal = loginService.info.terminal;
            this.matches = [{
                terminal: loginService.info.terminal,
                match: [],
                _idPrice: '',
                code: ''
            }]
        }

        setData(priceData){
            angular.extend(this, priceData);

            this.code_old = this.code;

            this.tarifaTerminal = false;
            this.tarifaAgp = false;
            this.servicio = false;

            if (!angular.isDefined(this.price) || this.price == null){
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
                    terminal: loginService.info.terminal,
                    match: [],
                    _idPrice: this._id,
                    code: this.code
                }];
            }
            if (this.terminal == 'AGP'){
                this.tarifaAgp = true;
            } else {
                if (angular.isDefined(this.matches[0].match)  && this.matches[0].match != null && this.matches[0].match.length >= 1){
                    let tarifaPropia = false;
                    this.matches[0].match.forEach((unMatch) => {
                        if (unMatch == this.code){
                            tarifaPropia = true;
                        }
                    });
                    tarifaPropia ? this.tarifaTerminal = true : this.servicio = true;
                } else {
                    this.servicio = true;
                }
            }
            const unitTypesArray = cacheService.unitTypesArray;
            if (angular.isDefined(this.unit) && this.unit != null && angular.isDefined(unitTypesArray[this.unit])){
                this.idUnit = this.unit;
                this.unit = unitTypesArray[this.unit];
            }
            this.mostrarDetalle = false;
        }

        checkTopPricesDates(){
            if (this.topPrices.length > 0){
                this.topPrices[0].dateOptions = {};
                for (let i = 1; i < this.topPrices.length; i++){
                    this.topPrices[i-1].dateOptions.maxDate = new Date(this.topPrices[i-1].from);
                    this.topPrices[i].dateOptions = {
                        minDate: new Date(this.topPrices[i-1].from.getFullYear(), this.topPrices[i-1].from.getMonth(), this.topPrices[i-1].from.getDate()+1)
                    }
                }
            }
        }

        getTopPrices(){
            const deferred = $q.defer();
            const inserturl = `${APP_CONFIG.SERVER_URL}/prices/${this._id}/${loginService.filterTerminal}`;
            $http.get(inserturl).then((response) => {
                this.topPrices = response.data.data.topPrices;
                for (let i = 0; i < this.topPrices.length; i++){
                    this.topPrices[i].from = new Date(this.topPrices[i].from)
                }
                this.checkTopPricesDates();
                deferred.resolve();
            }).catch((response) => {
                deferred.reject(response.data);
            });
            return deferred.promise;
        }

        addTopPrice(){
            let newPrice = {
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
        }

        removeTopPrice(index){
            this.topPrices.splice(index, 1);
            this.checkTopPricesDates();
        }

        detalleOnOff(){
            this.mostrarDetalle = !this.mostrarDetalle;
        }

        getMatches(){
            if (this.tieneMatch()) {
                return this.matches[0].match;
            }
        }

        setMatches(matches){
            this.matches[0].match = matches;
        }

        tieneMatch(){
            return (angular.isDefined(this.matches) && this.matches != null && this.matches.length > 0
            && this.matches[0].match != null && this.matches[0].match.length > 0 && this.matches[0].match[0] != null);
        }

        saveChanges(){
            if (loginService.type == 'terminal' && this.tarifaTerminal){
                let encontrado = false;
                this.matches[0].match.forEach(match => {
                    if (match == this.code) encontrado = true;
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
        }

        addNewPrice(){
            const deferred = $q.defer();
            const inserturl = `${APP_CONFIG.SERVER_URL}/prices/price`;
            $http.post(inserturl, this).then((response) => {
                if (response.data.status == 'OK'){
                    this.matches[0]._idPrice = response.data.data._id;
                    deferred.resolve(response);
                } else {
                    deferred.reject(response.data)
                }
            }).catch((response) => {
                deferred.reject(response.data);
            });
            return deferred.promise;
        }

        updatePriceChanges(){
            const deferred = $q.defer();
            this.topPrices.forEach((unPrecio) => {
                unPrecio.from = formatService.formatearFechaISOString(unPrecio.from);
            });
            const inserturl = `${APP_CONFIG.SERVER_URL}/prices/price/${this._id}`;
            $http.put(inserturl, this).then((response) => {
                if (response.data.status == 'OK'){
                    deferred.resolve(response);
                } else {
                    deferred.reject(response.data);
                }
            }).catch((response) => {
                deferred.reject(response.data);
            });
            return deferred.promise;
        }

        saveMatchPrices(){
            const deferred = $q.defer();
            const inserturl = `${APP_CONFIG.SERVER_URL}/matchPrices/matchprice`;
            $http.post(inserturl, this.matches[0]).then((response) => {
                deferred.resolve(response.data);
            }).catch((response) => {
                deferred.reject(response.data);
            });
            return deferred.promise;
        }

        removePrice(){
            const deferred = $q.defer();
            const inserturl = `${APP_CONFIG.SERVER_URL}/prices/price/${this._id}`;
            $http.delete(inserturl).then((response) => {
                deferred.resolve(response.data);
            }).catch((response) => {
                deferred.reject(response.data);
            });
            return deferred.promise;
        }

        get tipoTarifa(){
            if (this.tarifaAgp) return 'A';
            if (this.servicio) return 'S';
            if (this.tarifaTerminal) return 'P';
        }

    }

    return Price;
}]);