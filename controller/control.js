/**
 * Created by kolesnikov-a on 21/02/14.
 */

function controlCtrl($scope, datosGrafico, datosGraficoFacturas, datosGraficoGates, datosGraficoTurnos, datosFacturadoPorDia, controlPanelFactory, socket){
	'use strict';
	var fecha = new Date();

	$scope.chartTitle = "Datos enviados";
	$scope.chartWidth = 300;
	$scope.chartHeight = 380;
	$scope.chartData = datosGrafico;

	$scope.chartTitleFacturas = "Facturado por mes";
	$scope.chartWidthFacturas = 410;
	$scope.chartHeightFacturas = 320;
	$scope.chartDataFacturas = datosGraficoFacturas;

	$scope.chartTitleGates = "Gates";
	$scope.chartWidthGates = 580;
	$scope.chartHeightGates = 320;
	$scope.chartDataGates = datosGraficoGates;

	$scope.chartTitleTurnos = "Turnos";
	$scope.chartWidthTurnos = 580;
	$scope.chartHeightTurnos = 320;
	$scope.chartDataTurnos = datosGraficoTurnos;

	$scope.chartTitleFacturado = "Facturado por día";
	$scope.chartWidthFacturado = 410;
	$scope.chartHeightFacturado = 320;
	$scope.chartDataFacturado = datosFacturadoPorDia;

	// Fecha (dia y hora)
	$scope.desde = new Date();
	$scope.mesDesde = new Date();
	$scope.terminoCarga = false;
	$scope.dateOptions = { 'year-format': "'yy'", 'starting-day': 1 };
	$scope.dateOptionsMes = { 'datepickerMode':"'month'" };
	$scope.formats = ['dd-MMMM-yyyy', 'yyyy-MM-dd', 'shortDate', 'yyyy-MM'];
	$scope.format = $scope.formats['yyyy-MM-dd'];
	$scope.formatSoloMes = $scope.formats[3];

	$scope.open = function($event, fecha) {
		$event.preventDefault();
		$event.stopPropagation();
		$scope.openFechaDesde = (fecha === 'desde');
		$scope.openMesDesde = (fecha === 'mesDesde');
	};

	socket.on('invoice', function (message) {
		$scope.chartData[2][1]++;
		$scope.control.invoicesCount++;
	});

	$scope.cambiarDatos = function(){
		$scope.chartData[2][1] += 1000;
		$scope.chartDataFacturas = datosGraficoTurnos;
		$scope.control.invoicesCount++;
	};

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

	controlPanelFactory.getByDay(fecha, function(data){
		$scope.control = data[0];
		$scope.fecha = fecha;
	});

}