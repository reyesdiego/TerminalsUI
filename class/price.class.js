/**
 * Created by kolesnikov-a on 23/08/2016.
 */

myapp.factory('Price', ['$http', 'cacheService', '$q', 'formatService', 'loginService', 'APP_CONFIG', 'dialogs', function($http, cacheService, $q, formatService, loginService, APP_CONFIG, dialogs){

    class Price {
        constructor(priceData){
            //Propiedad para reporte de tarifas;
            this.graficar = false;
            //*******************************
			this.arrayMatches = [];
            if (priceData){
                this.setData(priceData);
            } else {
                this.newPrice()
            }
        }

        newPrice(){
            this.code = '';
            this.unit = '';
            this.idUnit = '';
            this.largo = '';
            this.topPrices = [];
            this.terminal = loginService.info.terminal;
            this.matches = {
                terminal: loginService.info.terminal,
                match: [],
                _idPrice: '',
                code: ''
            };
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
                this.matches._idPrice = this._id;
                this.matches.terminal = loginService.filterTerminal;
            } else {
                this.matches = {
                    terminal: loginService.filterTerminal,
                    match: [],
                    _idPrice: this._id,
                    code: this.code
                };
            }
            this.matches.match.forEach((matchCode) => {
                matchCode.loggedRole = loginService.type;
                this.arrayMatches.push(matchCode);
            });
            if (this.terminal == 'AGP'){
                this.tarifaAgp = true;
            } else {
                if (angular.isDefined(this.matches.match)  && this.matches.match != null && this.matches.match.length >= 1){
                    let tarifaPropia = false;
                    this.matches.match.forEach((unMatch) => {
                        if (unMatch.code == this.code){
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
                if (this.topPrices && this.topPrices.length > 0) {
                    for (let i = 0; i < this.topPrices.length; i++){
                        this.topPrices[i].from = new Date(this.topPrices[i].from);
                        this.topPrices[i].price = this.topPrices[i].price.toFixed(2);
                    }
                    this.checkTopPricesDates();
                }
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
            let codes = [];
            if (this.tieneMatch()) {
                this.matches.match.forEach((matchCode) => {
                    codes.push(matchCode.code);
                });
                return codes;
            }
        }

        matchAdded(match){
            let found = false;
            this.matches.match.forEach((matchCode) => {
               if (matchCode.code == match.code){
                   found = true;
                   matchCode.delete = false;
			   }
            });
            if (!found) this.matches.match.push({code: match.code});
        }

        matchRemoved(match){
            let index = 0;
            let count = 0;
            let erase = false;
            this.matches.match.forEach((matchCode) => {
                if (matchCode.code == match.code){
                    index = count;
                    matchCode.delete = true;
                    if (!matchCode.id) erase = true;
				}
				count++;
            });
            if (erase){
                this.matches.match.splice(index, 1);
            }
        }

        setMatches(matches){
            this.matches.match = matches;
        }

        tieneMatch(){
            return (angular.isDefined(this.matches) && this.matches != null
            && this.matches.match != null && this.matches.match.length > 0 && this.matches.match[0] != null);
        }

        saveChanges(){
            this.matches.match.forEach((matchCode) => {
                let matchCopy = this.arrayMatches.find((element) => {
                    return element.code == matchCode.code;
                });
                if (matchCopy){
                    matchCode.status = matchCopy.status;
                    if (matchCode.status) matchCode.approvedBy = loginService.info.user;
				}
            });
            if (loginService.type == 'terminal' && this.tarifaTerminal){
                let encontrado = false;
                this.matches.match.forEach(match => {
                    if (match.code == this.code) encontrado = true;
                });
                if (!encontrado){
                    this.matches.match.push({code: this.code})
                }
            }
            this.matches.code = this.code;
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
                    this.matches._idPrice = response.data.data._id;
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
            }).finally(() => {
				this.topPrices.forEach((unPrecio) => {
					unPrecio.from = new Date(unPrecio.from);
				});
            });
            return deferred.promise;
        }

        saveMatchPrices(){
            const deferred = $q.defer();
            const inserturl = `${APP_CONFIG.SERVER_URL}/matchPrices/matchprice`;
            $http.post(inserturl, this.matches).then((response) => {
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

        getDetailMatch(matchCode){
            const deferred = $q.defer();
            const body = angular.element(document).find('body');
            body.addClass('async-loading');
            const inserturl =  `${APP_CONFIG.SERVER_URL}/invoices/byCode/`;
            const params = {
                code: matchCode,
                terminal: loginService.filterTerminal
            };
            $http.get(inserturl, { params: params }).then((response) => {
                const result = {
                    codigo: matchCode,
                    tarifasData: response.data.data,
                    tipoMoneda: this.currency,
                    valorTarifa: this.price
                };
                deferred.resolve(result);
            }).catch((response) => {
                dialogs.error('Error', `Se produjo un error al cargar los usos del código seleccionado.\n${response.data.message}`);
                deferred.reject();
            }).finally(() => {
                body.removeClass('async-loading');
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