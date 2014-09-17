/**
 * Created by leo on 31/03/14.
 */
function gatesCtrl($scope, gatesFactory, invoiceFactory){
	'use strict';

	// Fecha (dia y hora)
	$scope.fechaDesde = new Date();
	$scope.fechaHasta = new Date();
	$scope.fechaDesde.setHours(0,0);
	$scope.fechaHasta.setMinutes(0);
	$scope.maxDate = new Date();

	// Variable para almacenar la info principal que trae del factory
	$scope.gates = {};
	$scope.comprobantesVistos = [];

	$scope.model = {
		'fechaDesde': $scope.fechaDesde,
		'fechaHasta': $scope.fechaHasta,
		'contenedor': '',
		'buque': '',
		'order': ''
	};

	$scope.filtrar = function(filtro, contenido){
		switch (filtro){
			case 'contenedor':
				$scope.model.contenedor = contenido;
				break;
			case 'buque':
				$scope.model.buque = contenido;
				break;
		}
		$scope.cargaGates();
	};

	$scope.filtrarOrden = function(filtro){
		console.log(filtro);
		var filtroModo;
		$scope.filtroOrden = filtro;
		if ($scope.filtroOrden == $scope.filtroAnterior){
			$scope.filtroOrdenReverse = !$scope.filtroOrdenReverse;
		} else {
			$scope.filtroOrdenReverse = false;
		}
		if ($scope.filtroOrdenReverse){
			filtroModo = -1;
		} else {
			filtroModo = 1;
		}
		$scope.model.order = '"' + filtro + '":' + filtroModo;
		$scope.filtroAnterior = filtro;
		$scope.cargaGates();
	};

	// Pone estilo al horario de acuerdo si esta o no a tiempo
	$scope.colorHorario = function(gate){
		var horarioGate = new Date(gate.gateTimestamp);
		var horarioInicio = new Date(gate.turnoInicio);
		var horarioFin = new Date(gate.turnoFin);
		if (horarioGate >= horarioInicio && horarioGate <= horarioFin) { return 'green' } else { return 'red' }
	};

	$scope.cargaPorFiltros = function(){
		$scope.status.open = !$scope.status.open;
		$scope.currentPage = 1;
		$scope.cargaGates();
	};

	$scope.cargaFacturasPorContenedor = function(container){
		var datos = { 'contenedor': container };
		$scope.container = container;
		invoiceFactory.getInvoice(datos, { skip:0, limit: $scope.itemsPerPage }, function(data){
			if(data.status === 'OK'){
				$scope.invoices = data.data;
				$scope.paginationHide = true
			}
		});
	};

	$scope.cargaGates = function(page){
		console.log(cargaDatos());
		page = page || { skip:0, limit: $scope.itemsPerPage };
		gatesFactory.getGate(cargaDatos(), page, function(data){
			if (data.status === "OK"){
				$scope.gates = data.data;
				$scope.totalItems = data.totalCount;
			}
		});
	};

	$scope.cargaFacturas = function(page){
		page = page || { skip:0, limit: $scope.itemsPerPage };
		if (page.skip == 0){ $scope.currentPage = 1}
		invoiceFactory.getInvoice(cargaDatos(), page, function(data){
			if(data.status === 'OK'){
				$scope.invoices = data.data;
				$scope.totalItems = data.totalCount;
			}
		});
	};

	$scope.mostrarDetalle = function(comprobante){
		var encontrado = false;
		$scope.comprobantesVistos.forEach(function(unComprobante){
			if (unComprobante._id == comprobante._id){
				encontrado = true;
			}
		});
		if (!encontrado){
			$scope.comprobantesVistos.push(comprobante);
		}
		$scope.verDetalle = comprobante;
	};

	$scope.quitarVista = function(comprobante){
		var pos = $scope.comprobantesVistos.indexOf(comprobante);
		$scope.comprobantesVistos.splice(pos, 1);
	};

	$scope.pageChanged = function(){
		$scope.page.skip = (($scope.currentPage - 1) * $scope.itemsPerPage);
		$scope.cargaGates($scope.page);
	};

	$scope.buqueSelected = function(selected){
		if (angular.isDefined(selected)){
			$scope.model.buque = selected.title;
			$scope.filtrar('buque', selected.title);
		}
	};

	$scope.containerSelected = function(selected){
		if (angular.isDefined(selected)){
			$scope.model.contenedor = selected.title;
			$scope.filtrar('contenedor', selected.title);
		}
	};

	$scope.filtrado = function(filtro, contenido){
		$scope.filtrar(filtro, contenido);
	};

	function cargaDatos(){
		return {
			'fechaDesde': $scope.model.fechaDesde,
			'fechaHasta': $scope.model.fechaHasta,
			'contenedor': $scope.model.contenedor,
			'buque': $scope.model.buque,
			'order': $scope.model.order
		};
	}

}