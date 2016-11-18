/**
 * Created by Diego Reyes on 1/29/14.
 */

myapp.controller('pricelistCtrl', ['$rootScope', '$scope', 'priceFactory', 'loginService', 'unitTypesArrayCache', 'downloadFactory', 'dialogs', 'generalCache', 'generalFunctions', '$filter', 'downloadService',
	function($rootScope, $scope, priceFactory, loginService, unitTypesArrayCache, downloadFactory, dialogs, generalCache, generalFunctions, $filter, downloadService) {

		'use strict';
		//Array con los tipos de tarifas para establecer filtros
		$scope.tiposTarifas = [
			{nombre: 'AGP', active: true},
			{nombre: 'Servicios', active: false},
			{nombre: 'Propios', active: false}
		];

		$scope.datePopUp = {
			opened: false,
			format: 'dd/MM/yyyy',
			options: {
				formatYear: 'yyyy',
				startingDay: 1
			}
		};

		$scope.newPrice = {
			code: '',
			description: '',
			idUnit: '',
			topPrices: [{
				currency: '',
				from: new Date(),
				price: 0
			}]
		};

		// Variable para almacenar la info principal que trae del factory
		//$scope.unidadesTarifas = generalCache.get('unitTypes');
		$scope.pricelist = [];
		$scope.filteredPrices = [];
		$scope.userPricelist = [];
		$scope.pricelistAgp = [];
		$scope.servicios = [];
		$scope.pricelistTerminal = [];
		$scope.listaElegida = [];
		$scope.tasas = false;
		$scope.itemsPerPage = 10;
		$scope.hayError = false;
		$scope.disableSave = false;

		$scope.procesando = false;

		$scope.fechaVigencia = new Date();

		$scope.openDate = function(e){
			generalFunctions.openDate(e);
		};

		$scope.cambiarTarifas = function(tipoTarifa){
			$scope.tiposTarifas.forEach(function(unaTarifa){
				unaTarifa.active = (unaTarifa.nombre == tipoTarifa.nombre);
			});
			if (tipoTarifa.nombre == 'AGP'){
				$scope.listaElegida = angular.copy($scope.pricelistAgp);
			} else if (tipoTarifa.nombre == 'Servicios'){
				$scope.listaElegida = angular.copy($scope.servicios);
			} else {
				$scope.listaElegida = angular.copy($scope.pricelistTerminal);
			}
			$scope.totalItems = $scope.listaElegida.length
		};

		$scope.$on('cambioPagina', function(event, data){
			$scope.currentPage = data;
		});

		$scope.$on('errorInesperado', function(e, mensaje){
			$scope.hayError = true;
			$scope.mensajeResultado = mensaje;
		});

		$scope.actualizarPricelist = function(){
			$scope.pricelistAgp = [];
			priceFactory.getMatchPrices(loginService.getFiltro(), $scope.tasas, function(data){
				if (data.status == 'OK'){
					$scope.hayError = false;
					$scope.pricelist = data.data;
					$scope.pricelist.forEach(function(tarifa){
						if (tarifa.tarifaAgp) $scope.pricelistAgp.push(tarifa);
					});
					$scope.listaElegida = angular.copy($scope.pricelistAgp);
					$scope.totalItems = $scope.listaElegida.length;
					$scope.userPricelist = angular.copy($scope.pricelistAgp);

				} else {
					$scope.hayError = true;
					$scope.mensajeResultado = {
						titulo: 'Tarifario',
						mensaje: 'Se ha producido un error al cargar los datos del tarifario.',
						tipo: 'panel-danger'
					};
				}
			})
		};

		$scope.cargaPricelist = function(){
			$scope.pricelistAgp = [];
			$scope.pricelistTerminal = [];
			$scope.servicios = [];
			$scope.listaElegida = [];
			priceFactory.getMatchPrices(loginService.getFiltro(), $scope.tasas, function(data){
				if (data.status == 'OK'){
					$scope.hayError = false;
					$scope.pricelist = data.data;
					$scope.pricelist.forEach(function(tarifa){
						if (tarifa.tarifaAgp){
							$scope.pricelistAgp.push(tarifa);
						}
						if (tarifa.tarifaTerminal){
							$scope.pricelistTerminal.push(tarifa)
						}
						if (tarifa.servicio){
							$scope.servicios.push(tarifa)
						}
					});
					$scope.listaElegida = angular.copy($scope.pricelistAgp);
					$scope.totalItems = $scope.listaElegida.length;
					$scope.userPricelist = angular.copy($scope.pricelistAgp);
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
			$scope.procesando = true;
			var data = {
				terminal: loginService.getFiltro(),
				pricelist: $scope.filteredPrices
			};
			var nombreReporte = 'Tarifario' + $filter('date')(new Date(), 'ddMMyyyy', 'UTC') + '.pdf';
			downloadFactory.convertToPdf(data, 'pricelistToPdf', nombreReporte).then(function(){
				$scope.procesando = false;
			}, function(){
				$scope.procesando = false;
				dialogs.error('Tarifario', 'Se ha producido un error al intentar exportar el tarifario a PDF');
			});
		};

		$scope.exportarAExcel = function(){
			$scope.procesando = true;
			var nombreReporte = 'Tarifario' + $filter('date')(new Date(), 'ddMMyyyy', 'UTC') + '.csv';

			var csvContent = armarCsv();

			downloadService.setDownloadCsv(nombreReporte, csvContent);

			$scope.procesando = false;

		};

		function armarCsv (){
			var csvContent = "Código|Descripción|Unidad|Tope";

			$scope.pricelist.forEach(function(price){
				csvContent += "\n";
				csvContent += price.code + "|" + price.description + "|" + price.unit + "|" + price.topPrices[0].price;
			});

			return csvContent;
		}

		if (loginService.getStatus()) $scope.cargaPricelist();

		$scope.$on('terminoLogin', function(){
			$scope.cargaPricelist();
		});

	}]);