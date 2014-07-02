/**
 * Created by Diego Reyes on 1/29/14.
 */
function pricelistCtrl($scope, priceFactory, loginService){
	'use strict';

	$scope.acceso = loginService.getType();
	// Variable para almacenar la info principal que trae del factory
	$scope.filteredPrices = [];

	$scope.traerTarifario = function(){
		console.log($scope.acceso);
		if ($scope.acceso == 'terminal'){
			priceFactory.getPrice(loginService.getInfo().terminal, function (data) {
				$scope.pricelist = data.data;
				$scope.filteredPrices = $scope.pricelist.slice(($scope.currentPage - 1) * $scope.itemsPerPage, $scope.currentPage * $scope.itemsPerPage - 1);
				$scope.totalItems = $scope.pricelist.length;
			});
		} else {
			priceFactory.getPrice($scope.terminalTarifario, function (data) {
				$scope.pricelist = data.data;
				$scope.filteredPrices = $scope.pricelist.slice(($scope.currentPage - 1) * $scope.itemsPerPage, $scope.currentPage * $scope.itemsPerPage - 1);
				$scope.totalItems = $scope.pricelist.length;
			});
		}
	};

	$scope.traerTarifario();

	$scope.pageChanged = function(){
		$scope.filteredPrices = $scope.pricelist.slice(($scope.currentPage - 1) * $scope.itemsPerPage, $scope.currentPage * $scope.itemsPerPage - 1);
	};
}
