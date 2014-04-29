/**
 * Created by leo on 31/03/14.
 */

function gatesCtrl($scope, gatesFactory, invoiceFactory){
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
		desde: new Date(),
		hasta: new Date()
	};
	$scope.horario = {
		desde: new Date(),
		hasta: new Date()
	};
	$scope.horario.desde.setMinutes(0);
	$scope.horario.hasta.setMinutes(0);
	$scope.dateOptions = { 'year-format': "'yy'", 'starting-day': 1 };
	$scope.formats = ['dd-MMMM-yyyy', 'yyyy-MM-dd', 'shortDate'];
	$scope.format = $scope.formats[1];
	$scope.open = function($event) {
		$event.preventDefault();
		$event.stopPropagation();
	};

	// Variable para almacenar la info principal que trae del factory
	$scope.gates = {};

	// Funciones propias del controlador
	$scope.colorHorario = function(gate){
		var horarioGate = new Date(gate.gateTimestamp);
		var horarioInicio = new Date(gate.turnoInicio);
		var horarioFin = new Date(gate.turnoFin);
		if (horarioGate >= horarioInicio && horarioGate <= horarioFin) { return 'green' } else { return 'red' }
	};

	// Carga los gates por fechas
	$scope.cargar = function(){
		// Setea las fechas para las horas y minutos
		$scope.fecha.desde.setHours($scope.horario.desde.getHours(), $scope.horario.desde.getMinutes());
		$scope.fecha.hasta.setHours($scope.horario.hasta.getHours(), $scope.horario.hasta.getMinutes());
		var datos = {contenedor : $scope.contenedor, fechaDesde : $scope.fecha.desde, fechaHasta : $scope.fecha.hasta};
		gatesFactory.getGateByDayOrContainer(datos, page, function(data){
			if (data.status === "OK"){
				$scope.gates = data.data;
				$scope.totalItems = data.totalCount;
			}
		});
	};

	// Carga las facturas de un gate
	$scope.ver = function(container){
		$scope.containerHide = !$scope.containerHide;
		invoiceFactory.getInvoiceByContainer(container, page0, function(data){
			if(data.status === 'OK'){
				$scope.gates = data.data;
				$scope.totalItems = data.totalCount;
			}
		});
	};

	$scope.$watch('currentPage + itemsPerPage', function(){
		page.skip = (($scope.currentPage - 1) * $scope.itemsPerPage);
		var datos = {contenedor : $scope.contenedor, fechaDesde : $scope.fecha.desde, fechaHasta : $scope.fecha.hasta};
		gatesFactory.getGateByDayOrContainer(datos, page, function(data){
			if(data.status === 'OK'){
				$scope.gates = data.data;
			}
		});
	});

}