/**
 * Created by leo on 31/03/14.
 */
function gatesCtrl($scope, dialogs, gatesFactory, invoiceFactory, loginService){
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
	$scope.gates = {};

	$scope.dataUser = loginService.getInfo();

	// Funciones propias del controlador
	$scope.colorHorario = function(gate){
		var horarioGate = new Date(gate.gateTimestamp);
		var horarioInicio = new Date(gate.turnoInicio);
		var horarioFin = new Date(gate.turnoFin);
		if (horarioGate >= horarioInicio && horarioGate <= horarioFin) { return 'green' } else { return 'red' }
	};

	// Carga los gates por fechas
	$scope.cargar = function(){
		if ($scope.myForm.$valid){
			// Setea las fechas para las horas y minutos
			$scope.fecha.desde.setHours($scope.horario.desde.getHours(), $scope.horario.desde.getMinutes());
			$scope.fecha.hasta.setHours($scope.horario.hasta.getHours(), $scope.horario.hasta.getMinutes());
			cargaGates(cargaDatos());
		} else {
			dialogs.error('Error con las fechas','Ingrese fechas validas');
		}
	};

	// Carga las facturas de un gate
	$scope.ver = function(container){
		$scope.containerHide = !$scope.containerHide;
		var datos = { 'contenedor': container };
		$scope.container = container;
		invoiceFactory.getInvoice(datos, {skip:0, limit: $scope.itemsPerPage }, function(data){
			if(data.status === 'OK'){
				$scope.invoices = data.data;
				$scope.busquedaContenedor = true;
			}
		});
	};

	$scope.$watch('currentPage', function(){
		page.skip = (($scope.currentPage - 1) * $scope.itemsPerPage);
		cargaGates(cargaDatos(), page);
	});

	function cargaDatos(){
		return { contenedor : $scope.contenedor, fechaDesde : $scope.fecha.desde, fechaHasta : $scope.fecha.hasta }
	}

	function cargaGates(datos, page){
		page = page || { skip:0, limit: $scope.itemsPerPage };
		gatesFactory.getGateByDayOrContainer(datos, page, function(data){
			if (data.status === "OK"){
				$scope.gates = data.data;
				$scope.totalItems = data.totalCount;
			}
		});
	}
}