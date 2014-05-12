/**
 * Created by Diego Reyes on 1/29/14.
 */
function pricelistCtrl($scope, priceFactory){
	'use strict';

	// Paginacion
	$scope.maxSize = 5;
	$scope.itemsPerPage = 10;
	$scope.currentPage = 1;
	$scope.setPage = function (pageNo){ $scope.currentPage = pageNo; };
	$scope.numPages = function (){ return Math.ceil($scope.totalItems / $scope.itemsPerPage); };

	// Variable para almacenar la info principal que trae del factory
	$scope.filteredPrices = [];

	priceFactory.getPrice(function (data) {
		$scope.pricelist = data.data;
		$scope.filteredPrices = $scope.pricelist.slice(($scope.currentPage - 1) * $scope.itemsPerPage, $scope.currentPage * $scope.itemsPerPage - 1);
		$scope.totalItems = $scope.pricelist.length;

		$scope.$watch('currentPage + itemsPerPage', function() {
			$scope.filteredPrices = $scope.pricelist.slice(($scope.currentPage - 1) * $scope.itemsPerPage, $scope.currentPage * $scope.itemsPerPage - 1);
			$scope.filtro = '';
		});
	});

}
