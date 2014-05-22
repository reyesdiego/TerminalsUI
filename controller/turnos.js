/**
 * Created by leo on 28/04/14.
 */
function turnosCtrl($scope, dialogs, turnosFactory, loginService){
	'use strict';

	// Paginacion
	$scope.itemsPerPage = 10;
	$scope.currentPage = 1;
	var page = { skip:0, limit: $scope.itemsPerPage };

	// Fecha (dia y hora)
	$scope.fecha = {
		desde: new Date(),
		hasta: new Date()
	};
	$scope.horario = {
		desde: new Date(),
		hasta: new Date()
	};
	$scope.horario.desde.setMinutes(0);
	$scope.horario.hasta.setMinutes(0);
	$scope.dateOptions = { 'startingDay': 0, 'showWeeks': false };
	$scope.format = 'yyyy-MM-dd';
	$scope.open = function($event) {
		$event.preventDefault();
		$event.stopPropagation();
	};

	// Variable para almacenar la info principal que trae del factory
	$scope.turnos = {};

	$scope.dataUser = loginService.getInfo();

	// Carga los turnos por fechas
	$scope.cargar = function(){
		if ($scope.myForm.$valid){
			// Setea las fechas para las horas y minutos
			$scope.fecha.desde.setHours($scope.horario.desde.getHours(), $scope.horario.desde.getMinutes());
			$scope.fecha.hasta.setHours($scope.horario.hasta.getHours(), $scope.horario.hasta.getMinutes());
			cargaTurnos(cargaDatos());
		} else {
			dialogs.error('Error con las fechas','Ingrese fechas validas');
		}
	};

	$scope.$watch('currentPage + itemsPerPage', function(){
		page.skip = (($scope.currentPage - 1) * $scope.itemsPerPage);
		cargaTurnos(cargaDatos(), page);
	});

	function cargaDatos(){
		return { contenedor : $scope.contenedor, fechaDesde : $scope.fecha.desde, fechaHasta : $scope.fecha.hasta }
	}

	function cargaTurnos(datos, page){
		page = page || { skip:0, limit: $scope.itemsPerPage };
		turnosFactory.getTurnos(datos, page, function(data){
			if (data.status === "OK"){
				$scope.turnos = data.data;
				$scope.totalItems = data.totalCount;
			}
		});
	}
}