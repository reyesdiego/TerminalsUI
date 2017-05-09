/**
 * Created by Diego Reyes on 1/29/14.
 */

myapp.controller('pricelistCtrl', ['$scope', 'priceFactory', 'loginService', 'downloadFactory', 'dialogs', '$filter', 'downloadService',
	function($scope, priceFactory, loginService, downloadFactory, dialogs, $filter, downloadService) {

		'use strict';
		function setPricelist(){
			let lista = 'AGP';
			$scope.tiposTarifas.forEach((tipoTarifa) => {
				if (tipoTarifa.active) lista = tipoTarifa.nombre;
			});
			if (lista == 'AGP'){
				$scope.listaElegida = angular.copy(pricelistAgp);
			} else if (lista == 'Servicios'){
				$scope.listaElegida = angular.copy(servicios);
			} else {
				$scope.listaElegida = angular.copy(pricelistTerminal);
			}
			$scope.totalItems = $scope.listaElegida.length
		}

		//Array con los tipos de tarifas para establecer filtros
		$scope.tiposTarifas = [
			{nombre: 'AGP', active: true},
			{nombre: 'Servicios', active: false},
			{nombre: 'Propios', active: false}
		];

		// Variable para almacenar la info principal que trae del factory
		$scope.pricelist = [];

		//Lista que finalmente se muestra en la tabla
		$scope.filteredPrices = [];

		let pricelistAgp = [];
		let servicios = [];
		let pricelistTerminal = [];

		//Lista que contiene todos los datos
		$scope.listaElegida = [];
		$scope.tasas = false;
		$scope.medida = false;
		$scope.norma = false;
		$scope.itemsPerPage = 10;
		$scope.hayError = false;
		$scope.disableSave = false;

		$scope.procesando = false;

		//$scope.fechaVigencia = new Date();
		$scope.search = '';

		$scope.searchPrice = function(value, index, array){
			return value.code.toUpperCase().search($scope.search) > -1 || value.description.toUpperCase().search($scope.search) > -1 || value.largo == $scope.search || value.price.toString().search($scope.search) > -1
		};

		$scope.cambiarTarifas = function(tipoTarifa){
			$scope.tiposTarifas.forEach(function(unaTarifa){
				unaTarifa.active = (unaTarifa.nombre == tipoTarifa.nombre);
			});
			if (tipoTarifa.nombre == 'AGP'){
				$scope.listaElegida = angular.copy(pricelistAgp);
			} else if (tipoTarifa.nombre == 'Servicios'){
				$scope.listaElegida = angular.copy(servicios);
			} else {
				$scope.listaElegida = angular.copy(pricelistTerminal);
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

		$scope.cargaPricelist = function(){
			pricelistAgp = [];
			pricelistTerminal = [];
			servicios = [];

			$scope.listaElegida = [];
			priceFactory.getMatchPrices($scope.tasas, $scope.medida, $scope.norma).then((data) => {
				$scope.hayError = false;
				$scope.pricelist = data.data;
				$scope.pricelist.forEach((tarifa) => {
					if (tarifa.tarifaAgp) pricelistAgp.push(tarifa);
					if (tarifa.tarifaTerminal) pricelistTerminal.push(tarifa);
					if (tarifa.servicio) servicios.push(tarifa);
				});
				//$scope.listaElegida = angular.copy(pricelistAgp);
				//$scope.totalItems = $scope.listaElegida.length;
				setPricelist();
			}).catch((error) => {
				$scope.hayError = true;
				$scope.mensajeResultado = {
					titulo: 'Tarifario',
					mensaje: 'Se ha producido un error al cargar los datos del tarifario.',
					tipo: 'panel-danger'
				};
			});
		};

		$scope.exportarAPdf = function(){
			$scope.procesando = true;
			let pricesData = angular.copy($scope.pricelist);
			pricesData.forEach((aPrice) => {
				aPrice.tipo = aPrice.tipoTarifa;
			});
			const data = {
				terminal: loginService.filterTerminal,
				pricelist: pricesData
			};
			const nombreReporte = 'Tarifario' + $filter('date')(new Date(), 'ddMMyyyy', 'UTC') + '.pdf';
			downloadFactory.convertToPdf(data, 'pricelistToPdf', nombreReporte).then().catch(() => {
				dialogs.error('Tarifario', 'Se ha producido un error al intentar exportar el tarifario a PDF');
			}).finally(() => {
				$scope.procesando = false;
			});
		};

		$scope.exportarAExcel = function(){
			$scope.procesando = true;
			const nombreReporte = 'Tarifario' + $filter('date')(new Date(), 'ddMMyyyy', 'UTC') + '.csv';
			const csvContent = armarCsv();
			downloadService.setDownloadCsv(nombreReporte, csvContent);
			$scope.procesando = false;
		};

		function armarCsv (){
			let csvContent = "Tipo|Código|Descripción|Unidad|Tope";

			$scope.pricelist.forEach((price) => {
				csvContent += "\n";
				csvContent += price.tipoTarifa + "|" + price.code + "|" + price.description + "|" + price.unit + "|" + price.price;
			});

			return csvContent;
		}

		if (loginService.isLoggedIn) $scope.cargaPricelist();

	}]);