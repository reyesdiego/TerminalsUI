/**
 * Created by Diego Reyes on 1/29/14.
 */
(function() {
	myapp.controller('pricelistCtrl', function($scope, priceFactory, loginService, dialogs) {
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
				if (data.status == 'OK'){
					$scope.pricelist = data.data;
					$scope.pricelist.forEach(function(tarifa){
						if (angular.isDefined($scope.arrayUnidades[tarifa.unit])){
							tarifa.unit = $scope.arrayUnidades[tarifa.unit];
						}
						if (!angular.isDefined(tarifa.topPrices[0].price || tarifa.topPrices[0].price == null)){
							tarifa.orderPrice = 0;
						} else {
							tarifa.orderPrice = tarifa.topPrices[0].price;
						}
					});
					$scope.totalItems = $scope.pricelist.length;
				} else {
					dialogs.error('Tarifario', 'Se ha producido un error al cargar los datos del tarifario.');
				}
			});
		};

		$scope.ordenarPor = function(filtro){
			if ($scope.predicate == filtro){
				$scope.reverse = !$scope.reverse;
			}
			$scope.predicate = filtro;
		};

		$scope.cargaPricelist();
	});
})();