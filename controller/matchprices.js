/**
 * Created by Diego Reyes on 1/29/14.
 */
function matchPricesCtrl($scope, $http, $templateCache){
	'use strict';

	var inserturl = serverUrl + '/agp/pricelist';
	$http({
		method: 'GET',
		url: inserturl,
		cache: $templateCache
	}).success(function(data) {
			console.log("success");
			$scope.pricelist = data;
		}).error(function(response) {
			console.log("error");
		});

}
