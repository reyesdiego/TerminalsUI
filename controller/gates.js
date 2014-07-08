/**
 * Created by leo on 31/03/14.
 */
function gatesCtrl($scope, gatesFactory, invoiceFactory){
	'use strict';

	// Fecha (dia y hora)
	$scope.fecha = { desde: new Date(), hasta: new Date() };
	$scope.fecha.desde.setHours(0,0);
	$scope.fecha.hasta.setMinutes(0);

	// Variable para almacenar la info principal que trae del factory
	$scope.gates = {};

	// Pone estilo al horario de acuerdo si esta o no a tiempo
	$scope.colorHorario = function(gate){
		var horarioGate = new Date(gate.gateTimestamp);
		var horarioInicio = new Date(gate.turnoInicio);
		var horarioFin = new Date(gate.turnoFin);
		if (horarioGate >= horarioInicio && horarioGate <= horarioFin) { return 'green' } else { return 'red' }
	};

	$scope.cargaGatesPorFiltros = function(){
		$scope.isCollapsed = !$scope.isCollapsed;
		$scope.currentPage = 1;
		$scope.cargaGates();
	};

	$scope.cargaFacturasPorContenedor = function(container){
		var datos = { 'contenedor': container };
		$scope.container = container;
		invoiceFactory.getInvoice(datos, {skip:0, limit: $scope.itemsPerPage }, function(data){
			if(data.status === 'OK'){
				$scope.invoices = data.data;
			}
		});
	};

	$scope.cargaGates = function(page){
		page = page || { skip:0, limit: $scope.itemsPerPage };
		gatesFactory.getGate(cargaDatos(), page, function(data){
			if (data.status === "OK"){
				$scope.gates = data.data;
				$scope.totalItems = data.totalCount;
			}
		});
	};

	$scope.pageChanged = function(){
		$scope.page.skip = (($scope.currentPage - 1) * $scope.itemsPerPage);
		$scope.cargaGates($scope.page);
	};

	function cargaDatos(){
		return { contenedor : $scope.contenedor, fechaDesde : $scope.fecha.desde, fechaHasta : $scope.fecha.hasta }
	}

	// Carga los gates del día hasta la hora del usuario
	$scope.cargaGates();
}