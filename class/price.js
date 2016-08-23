/**
 * Created by kolesnikov-a on 23/08/2016.
 */
myapp.factory('Price', ['$http', 'unitTypesArrayCache', function($http, unitTypesArrayCache){
    function Price(priceData){
        if (priceData)
            this.setData(priceData);
    };

    Price.prototype = {
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
            if (this.terminal == 'AGP'){
                this.tarifaAgp = true;
            } else {
                if (angular.isDefined(this.matches) && this.matches != null && this.matches.length > 0 && this.matches[0].match.length > 0){
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
        detalleOnOff: function(){
            this.mostrarDetalle = !this.mostrarDetalle;
        }
    };
    return Price;
}]);