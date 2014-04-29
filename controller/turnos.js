/**
 * Created by leo on 28/04/14.
 */
function turnosCtrl($scope, turnosFactory){
	'use strict';

	// Paginacion
	$scope.maxSize = 5;
	$scope.itemsPerPage = 10;
	$scope.currentPage = 1;
	var page0 = {
		skip:0,
		limit: $scope.itemsPerPage
	};
	var page = page0;
	$scope.setPage = function (pageNo){ $scope.currentPage = pageNo; };
	$scope.numPages = function (){ return Math.ceil($scope.totalItems / $scope.itemsPerPage); };

	// Fecha (dia y hora)
	$scope.fecha = {
		dia: {
			desde: new Date(),
			hasta: new Date()
		},
		horario: {
			desde: new Date(),
			hasta: new Date()
		}
	};
	$scope.hstep = 1;
	$scope.mstep = 1;
	$scope.dateOptions = { 'year-format': "'yy'", 'starting-day': 1 };
	$scope.formats = ['dd-MMMM-yyyy', 'yyyy-MM-dd', 'shortDate'];
	$scope.format = $scope.formats[1];
	$scope.open = function($event, fecha) {
		$event.preventDefault();
		$event.stopPropagation();
		$scope.openFechaDesde = (fecha === 'fechaDesde');
		$scope.openFechaHasta = (fecha === 'fechaHasta');
	};

	// Variable para almacenar la info principal que trae del factory
	$scope.turnos = {};

	// Carga los turnos por fechas
	$scope.cargar = function(){
		// Setea las fechas para las horas y minutos
		$scope.fecha.dia.desde.setHours($scope.fecha.horario.desde.getHours());
		$scope.fecha.dia.desde.setMinutes($scope.fecha.horario.desde.getMinutes());
		$scope.fecha.dia.hasta.setHours($scope.fecha.horario.hasta.getHours());
		$scope.fecha.dia.hasta.setMinutes($scope.fecha.horario.hasta.getMinutes());
		var datos = {contenedor : $scope.contenedor, fechaDesde : $scope.fecha.dia.desde, fechaHasta : $scope.fecha.dia.hasta};
		turnosFactory.getTurnosByDatesOrContainer(datos, page0, function(data){
			if (data.status === "OK"){
				$scope.turnos = data.data;
				$scope.totalItems = data.totalCount;
			}
		});
	};

	$scope.$watch('currentPage + itemsPerPage', function(){
		page.skip = (($scope.currentPage - 1) * $scope.itemsPerPage);
		var datos = {contenedor : $scope.contenedor, fechaDesde : $scope.fecha.dia.desde, fechaHasta : $scope.fecha.dia.hasta};
		turnosFactory.getTurnosByDatesOrContainer(datos, page, function(data){
			if(data.status === 'OK'){
				$scope.turnos = data.data;
			}
		});
	});

}