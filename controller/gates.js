/**
 * Created by leo on 31/03/14.
 */

function gatesCtrl($scope, controlPanelFactory){
	'use strict';
	$scope.maxSize = 5;
	$scope.onOff1 = false;
	$scope.control = {};
	$scope.fecha = {};

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
	};

	$scope.dateOptions = {
		'year-format': "'yy'",
		'starting-day': 1
	};

	$scope.formats = ['dd-MMMM-yyyy', 'yyyy-MM-dd', 'shortDate'];
	$scope.format = $scope.formats[1];

	$scope.cargar = function(fecha){

		controlPanelFactory.getGateByDay(fecha, function(data){
			$scope.gates = data;
			$scope.fecha = fecha;
		});

	};
}