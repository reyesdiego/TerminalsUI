/**
 * Created by Diego Reyes on 1/29/14.
 */
function pricelistCtrl($scope, priceFactory, loginService){
	'use strict';
	// Variable para almacenar la info principal que trae del factory
	$scope.filteredPrices = [];

	priceFactory.getPrice(loginService.getFiltro(), function (data) {
		$scope.pricelist = data.data;
		$scope.filteredPrices = $scope.pricelist.slice(($scope.currentPage - 1) * $scope.itemsPerPage, $scope.currentPage * $scope.itemsPerPage);
		$scope.totalItems = $scope.pricelist.length;
	});

	$scope.pageChanged = function(){
		$scope.filteredPrices = $scope.pricelist.slice(($scope.currentPage - 1) * $scope.itemsPerPage, $scope.currentPage * $scope.itemsPerPage);
	};
}
