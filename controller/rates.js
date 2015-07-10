/**
 * Created by artiom on 12/03/15.
 */


myapp.controller('ratesCtrl',['$rootScope', '$scope', 'invoiceFactory', 'generalFunctions', 'generalCache', 'colorTerminalesCache', 'loginService', function ($rootScope, $scope, invoiceFactory, generalFunctions, generalCache, colorTerminalesCache, loginService) {

	$rootScope.predicate = 'terminal';
	$scope.monedaFija = 'DOL';
	$scope.tarifasElegidas = 1;
	$scope.total = 0;

	$scope.totalesPorTerminal = [
		['BACTSSA', 0],
		['TERMINAL 4', 0],
		['TRP', 0]
	];

	$scope.barColors = {
		"bactssa": colorTerminalesCache.get('Bactssa'),
		"terminal4": colorTerminalesCache.get('Terminal4'),
		"trp": colorTerminalesCache.get('Trp')
	};

	$scope.allRates = generalCache.get('allRates');

	$scope.configPanel = {
		tipo: 'panel-info',
		titulo: 'Tasas a las cargas',
		mensaje: 'No se han encontrado datos para los filtros seleccionados.'
	};

	// Fecha (dia y hora)
	$scope.fechaInicio = new Date();

	// Variable para almacenar la info principal que trae del factory
	$scope.rates = {};

	$scope.model = {
		'fecha': $scope.fechaInicio
	};

	$scope.cargando = false;
	$scope.mostrarGrafico = false;

	$scope.columnChart = 'column';
	$scope.pieChart = 'pie';

	$scope.chartTitleReporteTarifas = "Códigos de tarifas";
	$scope.chartWidthReporteTarifas = 600;
	$scope.chartHeightReporteTarifas = 500;
	$scope.chartDataReporteTarifas = [
		['Codigos', 'algo'],
		['hola', 0]
	];

	$scope.deleteRow = function (index) {
		$scope.chartData.splice(index, 1);
	};
	$scope.addRow = function () {
		$scope.chartData.push([]);
	};
	$scope.selectRow = function (index) {
		$scope.selected = index;
	};
	$scope.rowClass = function (index) {
		return ($scope.selected === index) ? "selected" : "";
	};

	$scope.armarGrafico = function(){
		$scope.tarifasElegidas = 2;
		var base =[
			['Códigos', 'Tasa importación', 'Tasa exportación', 'Tasa removido'],
			['BACTSSA', 0, 0, 0],
			['TERMINAL 4', 0, 0, 0],
			['TRP', 0, 0, 0]
		];
		var column, row;
		$scope.rates.forEach(function(tasa){
			switch (tasa.rate){
				case 'IMPO':
					column = 1;
					break;
				case 'EXPO':
					column = 2;
					break;
				case 'REMOVIDO':
					column = 3;
					break;
			}
			switch (tasa.terminal){
				case 'BACTSSA':
					row = 1;
					break;
				case 'TERMINAL4':
					row = 2;
					break;
				case 'TRP':
					row = 3;
					break;
			}
			base[row][column] = tasa.total;
			$scope.total += tasa.total;
			$scope.totalesPorTerminal[row - 1][1] += tasa.total;
		});
		$scope.chartDataReporteTarifas = base;
		$scope.mostrarGrafico = true;
	};

	$scope.openDate = function(event){
		generalFunctions.openDate(event);
	};
	$scope.hitEnter = function(evt){
		if(angular.equals(evt.keyCode,13))
			$scope.filtrar();
	};
	$scope.maxDate = new Date();

	$scope.$on('errorInesperado', function(e, mensaje){
		$scope.cargando = false;
		$scope.rates = [];
		$scope.configPanel = mensaje;
	});

	$scope.ponerDescripcion = function(codigo){
		return $scope.allRates[codigo];
	};

	$scope.cargaRates = function () {
		if (!angular.isDefined($scope.model['fecha'])) $scope.model.fecha = $scope.fechaInicio;
		$scope.total = 0;
		$scope.totalesPorTerminal = [
			['BACTSSA', 0],
			['TERMINAL 4', 0],
			['TRP', 0]
		];
		$scope.mostrarGrafico = false;
		$scope.cargando = true;
		$scope.configPanel = {
			tipo: 'panel-info',
			titulo: 'Tasas a las cargas',
			mensaje: 'No se han encontrado datos para los filtros seleccionados.'
		};
		invoiceFactory.getRatesInvoices($scope.model, function (data) {
			if (data.status === "OK") {
				$scope.rates = data.data;
				if (data.data.length > 0){
					$scope.armarGrafico();
				}
			} else {
				$scope.configPanel = {
					tipo: 'panel-danger',
					titulo: 'Tasas a las cargas',
					mensaje: 'Se ha producido un error al cargar los datos de tasas a las cargas.'
				};
			}
			$scope.cargando = false;
		});
	};

	if (loginService.getStatus()) $scope.cargaRates();

	$scope.$on('terminoLogin', function(){
		$scope.cargaRates();
	});

}]);
