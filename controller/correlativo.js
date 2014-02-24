/**
 * Created by kolesnikov-a on 21/02/14.
 */

function correlativoCtrl($scope){
	'use strict';

	$scope.today = function() {
		$scope.desde = new Date();
		$scope.hasta = new Date();
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

		if (fecha === 'desde'){
			$scope.openDesde = true;
			$scope.openHasta = false;
		}else{
			$scope.openHasta = true;
			$scope.openDesde = false;
		}
	};

	$scope.dateOptions = {
		'year-format': "'yy'",
		'starting-day': 1
	};

	$scope.formats = ['dd-MMMM-yyyy', 'yyyy-MM-dd', 'shortDate'];
	$scope.format = $scope.formats[1];
}