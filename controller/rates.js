/**
 * Created by artiom on 12/03/15.
 */


myapp.controller('ratesCtrl',['$rootScope', '$scope', 'invoiceFactory', 'generalFunctions', function ($rootScope, $scope, invoiceFactory, generalFunctions) {

	$rootScope.predicate = '_id.terminal';
	$scope.monedaFija = 'DOL';
	$scope.tarifasElegidas = 1;

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

	$scope.chartTitleReporteTarifas = "Códigos de tarifas";
	$scope.chartWidthReporteTarifas = 1200;
	$scope.chartHeightReporteTarifas = 500;
	$scope.chartDataReporteTarifas = [
		['Codigos', 'algo'],
		['hola', 2526]
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
			['Códigos', 'Tasa importación', 'Tasa exportación'],
			['BACTSSA', 0, 0],
			['TERMINAL 4', 0, 0],
			['TRP', 0, 0]
		];
		var column, row;
		$scope.rates.forEach(function(tasa){
			switch (tasa._id.terminal){
				case 'BACTSSA':
					row = 1;
					if (tasa._id.code == '1465'){
						column = 1;
					} else {
						column = 2;
					}
					break;
				case 'TERMINAL4':
					row = 2;
					if (tasa._id.code == 'NAGPI'){
						column = 1;
					} else {
						column = 2;
					}
					break;
				case 'TRP':
					row = 3;
					if (tasa._id.code == 'TASAI'){
						column = 1;
					} else {
						column = 2;
					}
					break;
			}
			base[row][column] = tasa.total;
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

	$scope.$on('errorInesperado', function(e, mensaje){
		$scope.cargando = false;
		$scope.rates = [];
		$scope.configPanel = mensaje;
	});

	$scope.cargaRates = function () {
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

	$scope.cargaRates();
}]);
