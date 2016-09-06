/**
 * Created by kolesnikov-a on 29/08/2016.
 */
myapp.factory('Payment', ['$http', '$q', 'APP_CONFIG', 'loginService', 'formatService', function($http, $q, loginService, formatService){

	function Payment(paymentData){
		if (paymentData)
			this.setData(paymentData);
	}

	Payment.prototype = {
		setData: function(paymentData){
			angular.extend(this, paymentData);
			this.verDetalle = false;
		},
		getDetail: function(){
			var searchParams = {};
			if (this._id){ //Ya está generada la pre-liquidacion
				searchParams.paymentId = this._id;
			} else { //Todavía no está generada
				searchParams = {
					fechaInicio: this.fechaInicio,
					fechaFin: this.fechaFin
				}
			}
			//TODO hacer las respectivas llamadas al servidor
		}
	};

	return Payment;

}]);