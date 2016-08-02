/**
 * Created by Diego Reyes on 1/29/14.
 */

myapp.controller('pricelistCtrl', ['$rootScope', '$scope', 'priceFactory', 'loginService', 'unitTypesArrayCache', 'downloadFactory', 'dialogs', 'generalCache', 'generalFunctions', '$filter',
	function($rootScope, $scope, priceFactory, loginService, unitTypesArrayCache, downloadFactory, dialogs, generalCache, generalFunctions, $filter) {

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
		$scope.unidadesTarifas = generalCache.get('unitTypes');
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
			priceFactory.getPrice(loginService.getFiltro(), $scope.tasas, function(data){
				if (data.status == 'OK'){
					$scope.hayError = false;
					$scope.pricelist = data.data;
					$scope.pricelist.forEach(function(tarifa){
						if (tarifa.terminal == 'AGP') $scope.pricelistAgp.push(tarifa);
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
			//priceFactory.getPrice(loginService.getFiltro(), $scope.tasas, function (data) {
			priceFactory.getMatchPrices({onlyRates: $scope.tasas}, loginService.getFiltro(), function(data){
				if (data.status == 'OK'){
					$scope.hayError = false;
					$scope.pricelist = data.data;
					$scope.pricelist.forEach(function(tarifa){
						var tarifaPropia = false;
						if (!angular.isDefined(tarifa.topPrices[0].price || tarifa.topPrices[0].price == null)){
							tarifa.orderPrice = 0;
						} else {
							tarifa.orderPrice = tarifa.topPrices[0].price;
							tarifa.orderCurrency = tarifa.topPrices[0].currency;
						}
						tarifa.nuevoTopPrice = {
							currency: tarifa.topPrices[0].currency,
							price: tarifa.orderPrice,
							from: $scope.fechaVigencia
						};
						if (tarifa.terminal == 'AGP'){
							$scope.pricelistAgp.push(tarifa);
						} else {
							if (angular.isDefined(tarifa.matches) && tarifa.matches != null && tarifa.matches.length > 0 && tarifa.matches[0].match.length > 0){
								if (tarifa.matches[0].match.length >= 1){
									tarifa.matches[0].match.forEach(function(unMatch){
										if (unMatch == tarifa.code){
											tarifaPropia = true;
										}
									});
									tarifaPropia ? $scope.pricelistTerminal.push(tarifa) : $scope.servicios.push(tarifa);
								}
							} else {
								$scope.servicios.push(tarifa);
							}
						}
						if (angular.isDefined(tarifa.unit) && tarifa.unit != null && angular.isDefined(unitTypesArrayCache.get(tarifa.unit))){
							tarifa.idUnit = tarifa.unit;
							tarifa.unit = unitTypesArrayCache.get(tarifa.unit);
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


		$scope.showDetail = function(index){
			var realIndex = ($scope.currentPage - 1) * $scope.itemsPerPage + index;
			$scope.filteredPrices[realIndex].SHOW = !$scope.filteredPrices[realIndex].SHOW;
		};

		$scope.exportarAPdf = function(){
			$scope.procesando = true;
			var data = {
				terminal: loginService.getFiltro(),
				pricelist: $scope.filteredPrices
			};
			var nombreReporte = 'Tarifario' + $filter('date')(new Date(), 'ddMMyyyy', 'UTC');
			downloadFactory.convertToPdf(data, 'pricelistToPdf', function(data, status){
				$scope.procesando = false;
				if (status == 'OK'){
					var file = new Blob([data], {type: 'application/pdf'});
					var fileURL = URL.createObjectURL(file);

					var anchor = angular.element('<a/>');
					anchor.css({display: 'none'}); // Make sure it's not visible
					angular.element(document.body).append(anchor); // Attach to document

					anchor.attr({
						href: fileURL,
						target: '_blank',
						download: nombreReporte
					})[0].click();

					anchor.remove(); // Clean it up afterwards
					//window.open(fileURL);
				} else {
					dialogs.error('Tarifario', 'Se ha producido un error al intentar exportar el tarifario a PDF');
				}
			})
		};

		$scope.exportarAExcel = function(){
			$scope.procesando = true;
			var nombreReporte = 'Tarifario' + $filter('date')(new Date(), 'ddMMyyyy', 'UTC') + '.csv';

			var csvContent = "data:text/csv;charset=utf-8,";
			csvContent += "Código|Descripción|Unidad|Tope";

			$scope.pricelist.forEach(function(price){
				csvContent += "\n";
				csvContent += price.code + "|" + price.description + "|" + price.unit + "|" + price.topPrices[0].price;
			});

			var encodedUri = encodeURI(csvContent);

			var anchor = angular.element('<a/>');
			anchor.css({display: 'none'}); // Make sure it's not visible
			angular.element(document.body).append(anchor); // Attach to document

			anchor.attr({
				href: encodedUri,
				target: '_blank',
				download: nombreReporte
			})[0].click();

			anchor.remove(); // Clean it up afterwards
			$scope.procesando = false;

		};

		if (loginService.getStatus()) $scope.cargaPricelist();

		$scope.$on('terminoLogin', function(){
			$scope.cargaPricelist();
		});

		/*$scope.$on('cambioTerminal', function(){
			$scope.cargaPricelist();
		});*/

	}]);