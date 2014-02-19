/**
 * Created by gutierrez-g on 18/02/14.
 */
myapp.factory('priceFactory', function($http){
	var inserturl = serverUrl + '/agp/prices';
	var factory = {};

	factory.getPrice = function(callback) {
		$http.get('price.json')
			.success(function (data){
				callback(data);
			}).error(function(){
				console.log("Error al cargar la lista PriceList")
			});
	};

	factory.getMatchPrices = function(terminal, callback) {
		$http.get('match.json')
			.success(function (data){
				callback(data);
			}).error(function(){
				console.log("Error al cargar la lista PriceList")
			});
		};

	factory.addMatchPrice = function (data){
		var inserturl = serverUrl + '/agp/matchprice';
		$http({
			method: "POST",
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