/**
 * Created by leo on 16/05/14.
 */
(function(){
	myapp.filter('formatCurrency', function(){
		return function(text){
			if (text == 'DOL' || text == 'DOLARES'){ return 'US$'; }
			else if (text == 'PES' || text == 'PESOS') { return 'AR$'; }
			else return null;
		}
	});

	myapp.filter("maxLength", function(){
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
	});

	myapp.filter('startFrom', function() {
		return function(input, start) {
			start = +start; //parse to int
			return input.slice(start);
		}
	});

	myapp.filter('conversionMoneda', function($rootScope){
		return function(importe, codMoneda, cotiMoneda){
			var importeDevuelto = importe;
			if ($rootScope.moneda == 'PES' && codMoneda == 'DOL'){ importeDevuelto = (importe * cotiMoneda); }
			else if ($rootScope.moneda == 'DOL' && codMoneda == 'PES'){ importeDevuelto = (importe / cotiMoneda); }
			return importeDevuelto;
		}
	});
})();
