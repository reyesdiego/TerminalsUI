/**
 * Created by gutierrez-g on 12/03/14.
 */

function cdiarioCtrl($scope, controlPanelFactory){
	'use strict';
	$scope.maxSize = 5;
	$scope.onOff1 = false;
	$scope.control = {};
	$scope.fecha = {};
	//$scope.onOff2 = false;

	$scope.today = function() {
		$scope.fecha1 = new Date();
		$scope.fecha2 = new Date();
	};

	$scope.today();

	$scope.showWeeks = true;
	$scope.toggleWeeks = function () {
		$scope.showWeeks = ! $scope.showWeeks;
	};

	$scope.clear = function () {
		$scope.dt = null;
	};

	$scope.toggleMin = function() {
		$scope.minDate = ( $scope.minDate ) ? null : new Date();
	};

	$scope.toggleMin();

	$scope.open = function($event, fecha) {
		$event.preventDefault();
		$event.stopPropagation();

		if (fecha === 'fecha1'){
			$scope.openFecha1 = true;
		}else{
			$scope.openFecha1 = false;
		}
		if (fecha === 'fecha2'){
			$scope.openFecha2 = true;
		}else{
			$scope.openFecha2 = false;
		}
	};

	$scope.dateOptions = {
		'year-format': "'yy'",
		'starting-day': 1
	};

	$scope.formats = ['dd-MMMM-yyyy', 'yyyy-MM-dd', 'shortDate'];
	$scope.format = $scope.formats[1];

	$scope.cargar = function(fecha,nroControl){

		controlPanelFactory.getByDay(fecha, function(data){
			$scope.control[nroControl] = data[0];
			$scope.fecha[nroControl] = fecha;
		});

	};
	/*$scope.cargar2 = function(){

		controlFactory.getByDay($scope.fecha, function(data){
			$scope.control = data[0];
		});

		$scope.onOff2 = true;

		$scope.volver = function(){
			$scope.onOff2 = false;
		};
	};*/
}