/**
 * Created by leo on 28/04/14.
 */
function turnosCtrl($scope, turnosFactory){
	'use strict';

	// Paginacion
	$scope.maxSize = 5;
	$scope.itemsPerPage = 10;
	$scope.currentPage = 1;
	var page = {skip:0, limit: $scope.itemsPerPage};
	$scope.setPage = function (pageNo){
		$scope.currentPage = pageNo;
	};
	$scope.numPages = function (){
		return Math.ceil($scope.totalItems / $scope.itemsPerPage);
	};

	// Fecha (dia y hora)
	$scope.fechaDesde = new Date();
	$scope.fechaHasta = new Date();
	$scope.horarioDesde = new Date();
	$scope.horarioHasta = new Date();
	$scope.hstep = 1;
	$scope.mstep = 1;
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
		if (fecha === 'fechaDesde'){
			$scope.openFechaDesde = true;
		}else{
			$scope.openFechaDesde = false;
		}
		if (fecha === 'fechaHasta'){
			$scope.openFechaHasta = true;
		}else{
			$scope.openFechaHasta = false;
		}
	};
	$scope.dateOptions = {
		'year-format': "'yy'",
		'starting-day': 1
	};
	$scope.formats = ['dd-MMMM-yyyy', 'yyyy-MM-dd', 'shortDate'];
	$scope.format = $scope.formats[1];

	// Variable para almacenar la info principal que trae del factory
	$scope.turnos = {};

	$scope.cargar = function(){
		// Setea las fechas para las horas y minutos
		$scope.fechaDesde.setHours($scope.horarioDesde.getHours());
		$scope.fechaDesde.setMinutes($scope.horarioDesde.getMinutes());
		$scope.fechaHasta.setHours($scope.horarioHasta.getHours());
		$scope.fechaHasta.setMinutes($scope.horarioHasta.getMinutes());
		var datos = {contenedor : $scope.contenedor, fechaDesde : $scope.fechaDesde, fechaHasta : $scope.fechaHasta};
		turnosFactory.getTurnosByDates(datos, page, function(data){
			if (data.status === "OK"){
				$scope.gates = data.data.data;
				console.log(data.data);
				$scope.totalItems = data.totalCount;
			}
		});
	};

	$scope.$watch('currentPage + itemsPerPage', function(){
		var skip = (($scope.currentPage - 1) * $scope.itemsPerPage);
		page.skip = skip;
		var datos = {contenedor : $scope.contenedor, fechaDesde : $scope.fechaDesde, fechaHasta : $scope.fechaHasta};
		turnosFactory.getTurnosByDates(datos, page, function(data){
			if(data.status === 'OK'){
				$scope.gates = data.data.data;
			}
		});
	});

}