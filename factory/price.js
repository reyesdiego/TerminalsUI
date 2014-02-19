/**
 * Created by gutierrez-g on 18/02/14.
 */
myapp.factory('priceFactory', function($http){
	var inserturl = serverUrl + '/agp/prices';
	var factory = {};
	factory.getPrice = function(cn) {
		$http.get('price.json')
			.success(function (data){
				cn(data);
			}).error(function(){
				console.log("Error al cargar la lista PriceList")
			});
	};
	factory.getMatchPrices = function(terminal, codigo, callback) {
		/*$http.get('price.json')
			.success(function (data){
				cn(data);
			}).error(function(){
				console.log("Error al cargar la lista PriceList")
			});*/
		callback ({ terminal: terminal,
				codes: { codeAgp: codigo,
				codeNew: [ "PROBANDO1", "PROBANDO2", "PROBANDO3"]
			}
		});

	}
	factory.addMatchPrice = function (method, data){
		var inserturl = serverUrl + '/agp/matchprice';
		$http({
			method: method,
			url: inserturl,
			data: data
		}).success(function(response) {
				console.log("success");
			}).error(function(response) {
				console.log("error");
			});
	}

	return factory;


});