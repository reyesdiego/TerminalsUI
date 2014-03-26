/**
 * Created by Diego Reyes on 1/29/14.
 */
function pricelistCtrl($scope, priceFactory, loginService){
	'use strict';

	priceFactory.getPrice(loginService.getToken(), function (data) {
		$scope.pricelist = data;
	});

}
