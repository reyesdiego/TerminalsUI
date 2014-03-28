/**
 * Created by Diego Reyes on 1/29/14.
 */
function pricelistCtrl($scope, priceFactory, loginService){
	'use strict';
	$scope.filteredPrices = []
	$scope.itemsPerPage = 10;
	$scope.currentPage = 1;
	$scope.maxSize = 5;

	priceFactory.getPrice(loginService.getToken(), function (data) {
		$scope.pricelist = data;
		$scope.filteredPrices = $scope.pricelist.slice(($scope.currentPage - 1) * $scope.itemsPerPage, $scope.currentPage * $scope.itemsPerPage - 1);

		$scope.totalItems = $scope.pricelist.length;

		$scope.setPage = function (pageNo) {
			$scope.currentPage = pageNo;
		};

		$scope.numPages = function () {
			return Math.ceil($scope.totalItems / $scope.itemsPerPage);
		};

		$scope.$watch('currentPage + itemsPerPage', function() {
			$scope.filteredPrices = $scope.pricelist.slice(($scope.currentPage - 1) * $scope.itemsPerPage, $scope.currentPage * $scope.itemsPerPage - 1);
			$scope.filtro = '';
		});
	});

}
