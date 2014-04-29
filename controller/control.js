/**
 * Created by kolesnikov-a on 21/02/14.
 */

function controlCtrl($scope, datosGrafico, controlPanelFactory){
	'use strict';
	var fecha = new Date();

	console.log(datosGrafico);

	$scope.chartTitle = "Datos enviados";
	$scope.chartWidth = 500;
	$scope.chartHeight = 320;
	$scope.chartData = datosGrafico;

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