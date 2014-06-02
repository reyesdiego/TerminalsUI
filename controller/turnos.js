/**
 * Created by leo on 28/04/14.
 */
function turnosCtrl($scope, dialogs, turnosFactory){
	'use strict';

	// Fecha (dia y hora)
	$scope.fecha = { desde: new Date(), hasta: new Date() };
	$scope.fecha.desde.setHours(0,0);
	$scope.fecha.hasta.setMinutes(0);

	// Variable para almacenar la info principal que trae del factory
	$scope.turnos = {};

	// Carga los turnos por fechas
	$scope.cargar = function(){
		$scope.currentPage = 1;
		$scope.cargaTurnos();
	};

	$scope.cargaTurnos = function(page){
		page = page || { skip:0, limit: $scope.itemsPerPage };
		turnosFactory.getTurnos(cargaDatos(), page, function(data){
			if (data.status === "OK"){
				$scope.turnos = data.data;
				$scope.totalItems = data.totalCount;
			}
		});
	};

	$scope.$watch('currentPage', function(){
		$scope.page.skip = (($scope.currentPage - 1) * $scope.itemsPerPage);
		$scope.cargaTurnos($scope.page);
	});

	function cargaDatos(){
		return {
			contenedor : $scope.contenedor,
			fechaDesde : $scope.fecha.desde,
			fechaHasta : $scope.fecha.hasta
		}
	}
}