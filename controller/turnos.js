/**
 * Created by leo on 28/04/14.
 */
function turnosCtrl($scope, dialogs, turnosFactory){
	'use strict';

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

	// Variable para almacenar la info principal que trae del factory
	$scope.turnos = {};

	// Carga los turnos por fechas
	$scope.cargar = function(){
		if ($scope.myForm.$valid){
			// Setea las fechas para las horas y minutos
			$scope.fecha.desde.setHours($scope.horario.desde.getHours(), $scope.horario.desde.getMinutes());
			$scope.fecha.hasta.setHours($scope.horario.hasta.getHours(), $scope.horario.hasta.getMinutes());
			$scope.currentPage = 1;
			cargaTurnos();
		} else {
			dialogs.error('Error con las fechas','Ingrese fechas válidas');
		}
	};

	$scope.$watch('currentPage', function(){
		$scope.page.skip = (($scope.currentPage - 1) * $scope.itemsPerPage);
		cargaTurnos($scope.page);
	});

	function cargaDatos(){
		return {
			contenedor : $scope.contenedor,
			fechaDesde : $scope.fecha.desde,
			fechaHasta : $scope.fecha.hasta
		}
	}

	function cargaTurnos(page){
		page = page || { skip:0, limit: $scope.itemsPerPage };
		turnosFactory.getTurnos(cargaDatos(), page, function(data){
			if (data.status === "OK"){
				$scope.turnos = data.data;
				$scope.totalItems = data.totalCount;
			}
		});
	}
}