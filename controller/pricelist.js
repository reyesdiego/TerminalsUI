/**
 * Created by Diego Reyes on 1/29/14.
 */
function pricelistCtrl($scope, priceFactory, loginService){
	'use strict';
	// Variable para almacenar la info principal que trae del factory
	$scope.filteredPrices = [];

	priceFactory.getPrice(loginService.getFiltro(), function (data) {
		$scope.pricelist = data.data;
		$scope.totalItems = $scope.pricelist.length;
	});

	$scope.$watch('search', function(){
		if ($scope.search != "" && $scope.search != null){
			//Se supone que siempre que busca se limiten los resultados a una sola página, por eso seteo
			//el totalItems en 1
			$scope.totalItems = 1;
			if ($scope.search.length <= 1){
				//Una búsqueda con un solo caracter producía demasiados resultados, por lo que solo muestro los 10 primeros
				$scope.itemsPerPage = 10;
			} else {
				//Si los resultados estaban originalmente en una página distinta de la currentPage no se veían,
				//de este modo todos los resultados van hasta la única página
				$scope.itemsPerPage = $scope.pricelist.length;
			}
		} else {
			$scope.totalItems = $scope.pricelist.length;
			$scope.itemsPerPage = 10;
		}
	});
}
