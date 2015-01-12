/**
 * Created by Diego Reyes on 1/29/14.
 */
function pricelistCtrl($scope, priceFactory, loginService){
	'use strict';
	// Variable para almacenar la info principal que trae del factory
	$scope.pricelist = [];
	$scope.filteredPrices = [];
	$scope.tasas = false;
	$scope.reverse = true;
	$scope.predicate = '';
	$scope.itemsPerPage = 10;

	$scope.$on('cambioPagina', function(event, data){
		$scope.currentPage = data;
	});

	$scope.cargaPricelist = function(){
		priceFactory.getPrice(loginService.getFiltro(), $scope.tasas, function (data) {
			$scope.pricelist = data.data;
			$scope.pricelist.forEach(function(tarifa){
				if (angular.isDefined($scope.arrayUnidades[tarifa.unit])){
					tarifa.unit = $scope.arrayUnidades[tarifa.unit];
				}
			});
			$scope.totalItems = $scope.pricelist.length;
		});
	};

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

	$scope.ordenarPor = function(filtro){
		if ($scope.predicate == filtro){
			$scope.reverse = !$scope.reverse;
		}
		$scope.predicate = filtro;
	};

	$scope.cargaPricelist();
}
