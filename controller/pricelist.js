/**
 * Created by Diego Reyes on 1/29/14.
 */
function pricelistCtrl($scope, priceFactory){
	'use strict';

	priceFactory.getPrice(function (data) {
		$scope.pricelist = data;
	});

}
