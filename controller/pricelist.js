/**
 * Created by Diego Reyes on 1/29/14.
 */
function pricelistCtrl($scope, priceFactory){
	'use strict';

	// Variable para almacenar la info principal que trae del factory
	$scope.filteredPrices = [];

	priceFactory.getPrice(function (data) {
		$scope.pricelist = data.data;
		$scope.filteredPrices = $scope.pricelist.slice(($scope.currentPage - 1) * $scope.itemsPerPage, $scope.currentPage * $scope.itemsPerPage - 1);
		$scope.totalItems = $scope.pricelist.length;
	});

	$scope.pageChanged = function(){
		$scope.filteredPrices = $scope.pricelist.slice(($scope.currentPage - 1) * $scope.itemsPerPage, $scope.currentPage * $scope.itemsPerPage - 1);
	};
}
