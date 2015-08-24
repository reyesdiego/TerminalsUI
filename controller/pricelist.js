/**
 * Created by Diego Reyes on 1/29/14.
 */

myapp.controller('pricelistCtrl', ['$rootScope', '$scope', 'priceFactory', 'loginService', 'unitTypesArrayCache', 'downloadFactory', 'dialogs',
	function($rootScope, $scope, priceFactory, loginService, unitTypesArrayCache, downloadFactory, dialogs) {

		'use strict';
		// Variable para almacenar la info principal que trae del factory
		$scope.pricelist = [];
		$scope.filteredPrices = [];
		$scope.tasas = false;
		$scope.itemsPerPage = 10;
		$scope.hayError = false;

		$scope.$on('cambioPagina', function(event, data){
			$scope.currentPage = data;
		});

		$scope.$on('errorInesperado', function(e, mensaje){
			$scope.hayError = true;
			$scope.mensajeResultado = mensaje;
		});

		$scope.cargaPricelist = function(){
			priceFactory.getPrice(loginService.getFiltro(), $scope.tasas, function (data) {
				if (data.status == 'OK'){
					$scope.hayError = false;
					$scope.pricelist = data.data;
					$scope.pricelist.forEach(function(tarifa){
						if (angular.isDefined(tarifa.unit) && tarifa.unit != null && angular.isDefined(unitTypesArrayCache.get(tarifa.unit))){
							tarifa.unit = unitTypesArrayCache.get(tarifa.unit);
						}
						if (!angular.isDefined(tarifa.topPrices[0].price || tarifa.topPrices[0].price == null)){
							tarifa.orderPrice = 0;
						} else {
							tarifa.orderPrice = tarifa.topPrices[0].price;
						}
					});
					$scope.totalItems = $scope.pricelist.length;
				} else {
					$scope.hayError = true;
					$scope.mensajeResultado = {
						titulo: 'Tarifario',
						mensaje: 'Se ha producido un error al cargar los datos del tarifario.',
						tipo: 'panel-danger'
					};
				}
			});
		};

		$scope.exportarAPdf = function(){
			var data = {
				terminal: loginService.getFiltro(),
				pricelist: $scope.filteredPrices
			};
			downloadFactory.convertToPdf(data, 'pricelistToPdf', function(data, status){
				if (status == 'OK'){
					var file = new Blob([data], {type: 'application/pdf'});
					var fileURL = URL.createObjectURL(file);
					window.open(fileURL);
				} else {
					dialogs.error('Tarifario', 'Se ha producido un error al intentar exportar el tarifario a PDF');
				}
			})
		};

		if (loginService.getStatus()) $scope.cargaPricelist();

		$scope.$on('terminoLogin', function(){
			$scope.cargaPricelist();
		});

		$scope.$on('cambioTerminal', function(){
			$scope.cargaPricelist();
		});

	}]);