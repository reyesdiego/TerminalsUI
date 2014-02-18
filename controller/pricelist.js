/**
 * Created by Diego Reyes on 1/29/14.
 */
function pricelistCtrl($scope, priceFactory){
	//'use strict';

	priceFactory.getPrice(function (data) {
		$scope.pricelist = data;
	});

	/*priceFactory.getPrice().success(function (data){
		console.log("Se cargo la lista PriceList");
		$scope.pricelist = data
	}).error(function(){
			console.log("Error al cargar la lista PriceList")
		})*/

	/*var inserturl = serverUrl + '/agp/pricelist';
	$http({
		method: 'GET',
		url: inserturl,
		cache: $templateCache
	}).success(function(data) {
			console.log("success");
			$scope.pricelist = data;
		}).error(function(response) {
			console.log("error");
		});*/

}
