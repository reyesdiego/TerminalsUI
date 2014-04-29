/**
 * Created by gutierrez-g on 18/02/14.
 */
myapp.factory('priceFactory', function($http, loginService){
	var factory = {};

	factory.getPrice = function(callback) {
		var inserturl = serverUrl + '/agp/prices';
		$http({
			method: 'GET',
			url: inserturl,
			headers: {
				token: loginService.getToken()
			}
		}).success(function (data){
			callback(data);
		}).error(function(){
			console.log("Error al cargar la lista PriceList")
		});
	};

	factory.getMatchPrices = function(terminal, callback) {
		var inserturl = serverUrl + '/agp/matchprices/' + terminal;
		$http.get(inserturl)
			.success(function (data){
				callback(data);
			}).error(function(){
				console.log("Error al cargar la lista PriceList")
			});
		};

	factory.addMatchPrice = function (data, callback) {
		var inserturl = serverUrl + '/agp/matchprice';
		$http({
			method: "POST",
			url: inserturl,
			data: JSON.stringify(data),
			headers:{"Content-Type":"application/json", token: loginService.getToken()}
		}).success(function (response) {
				console.log("success");
				callback(response);
			}).error(function () {
				console.log("error");
			});
	};

	factory.addPrice = function (data, callback) {
		var inserturl = serverUrl + '/agp/price';
		$http({
			method: 'POST',
			url: inserturl,
			data: data,
			headers:{
				token: loginService.getToken()
			}
		}).
			success(function(response) {
				console.log("success");
				callback(response);
			}).
			error(function() {
				console.log("error");
			});
	};

	/*factory.getPriceWithMatch = function(terminal){
		this.getPrice(function(price){
			var priceList = price;
			console.log(priceList);
		});
		this.getMatchPrices(terminal, function(match){
			var matchList = match;
			console.log(matchList);
		})
	}*/

	return factory;

});


