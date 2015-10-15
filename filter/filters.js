/**
 * Created by leo on 16/05/14.
 */

myapp.filter('formatCurrency', [function(){
	return function(text){
		if (text == 'DOL' || text == 'DOLARES'){ return 'U$S'; }
		else if (text == 'PES' || text == 'PESOS') { return 'AR$'; }
		else return null;
	}
}]);

myapp.filter('numberEx', ['numberFilter', '$locale',
	function(number, $locale) {

		var formats = $locale.NUMBER_FORMATS;
		return function(input, fractionSize) {
			//Get formatted value
			if (angular.isDefined(input) && input != null){
				var formattedValue = number(input, fractionSize);
				formattedValue = formattedValue.replace('.', '');
				return Number(formattedValue.replace(',', '.'));
			} else {
				return 0;
			}
		};
	}
]);

myapp.filter("maxLength", [function(){
	return function(text,max){
		if(text != null){
			if(text.length > max){
				return text.substring(0,max);
			}
			else
				return text;
		}
		else
			return null;
	}
}]);

myapp.filter('startFrom', [function() {
	return function(input, start) {
		start = +start; //parse to int
		return input.slice(start);
	}
}]);

myapp.filter("emptyToEnd", [function () {
	return function (array, key) {
		if(!angular.isArray(array)) return;
		var present = array.filter(function (item) {
			return item[key];
		});
		var empty = array.filter(function (item) {
			return !item[key]
		});
		return present.concat(empty);
	};
}]);

myapp.filter('conversionMoneda', ['$rootScope', function($rootScope){
	return function(importe, moneda){
		if (angular.isDefined(importe) && angular.isDefined(moneda)) {
			var importeDevuelto = importe;
			if ($rootScope.moneda == 'PES' && moneda.codMoneda == 'DOL'){ importeDevuelto = (importe * moneda.cotiMoneda); }
			else if ($rootScope.moneda == 'DOL' && moneda.codMoneda == 'PES'){ importeDevuelto = (importe / moneda.cotiMoneda); }
			return importeDevuelto;
		} else {
			return null;
		}
	}
}]);

myapp.filter("dateRange", [function() {
	return function(items, from, to) {
		var desde = from;
		var hasta = to;
		if (hasta == ''){
			hasta = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);
		}
		var result = [];
		for (var i=0; i<items.length; i++){
			var fecha = new Date(items[i].fecha);
			if (fecha >= desde && fecha <= hasta)  {
				result.push(items[i]);
			}
		}
		return result;
	};
}]);

myapp.filter('numero', [function() {
	return function(numero) {
		if (angular.isDefined(numero) && angular.isNumber(numero)) {
			return numero
		} else {
			return 0;
		}
	}
}]);

myapp.filter('nombreComprobante', ['vouchersArrayCache', function(vouchersArrayCache) {
	return (function(numero, abrev) {
		if (angular.isDefined(numero) && angular.isDefined(vouchersArrayCache.get(numero))) {
			if (abrev){
				return vouchersArrayCache.get(numero).abrev;
			} else {
				return vouchersArrayCache.get(numero).desc;
			}
		} else {
			return 'Error de comprobante';
		}
	})
}]);
