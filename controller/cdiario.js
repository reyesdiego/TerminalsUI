/**
 * Created by gutierrez-g on 12/03/14.
 */

function cdiarioCtrl($scope, controlFactory){
	'use strict';
	$scope.maxSize = 5;
	$scope.onOff = false;
	$scope.onOffResult = true;

	$scope.today = function() {
		$scope.fecha = new Date();
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

		if (fecha === 'fecha'){
			$scope.openFecha = true;
		}else{
			$scope.openFecha = false;
		}
	};

	$scope.dateOptions = {
		'year-format': "'yy'",
		'starting-day': 1
	};

	$scope.formats = ['dd-MMMM-yyyy', 'yyyy-MM-dd', 'shortDate'];
	$scope.format = $scope.formats[1];

	$scope.cargar = function(){

		controlFactory.getByDay($scope.fecha, function(data){
			$scope.control = data[0];
		});

		$scope.onOff = true;
		$scope.onOffResult = false;

		$scope.volver = function(){
			$scope.onOff = false;
			$scope.onOffResult = true;
		};
	};
}