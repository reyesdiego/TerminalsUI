/**
 * Created by kolesnikov-a on 21/02/14.
 */

function controlCtrl($scope, datosGrafico, datosGraficoFacturas, datosGraficoGates, datosGraficoTurnos, controlPanelFactory, socket){
	'use strict';
	var fecha = new Date();

	$scope.chartTitle = "Datos enviados";
	$scope.chartWidth = 360;
	$scope.chartHeight = 320;
	$scope.chartData = datosGrafico;

	$scope.chartTitleFacturas = "Facturas";
	$scope.chartWidthFacturas = 580;
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

	socket.on('message', function (message) {
		$scope.chartData[2][1]++;
		$scope.control.invoicesCount++;

	});

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