/**
 * Created by leo on 31/03/14.
 */

function gatesCtrl($scope, controlPanelFactory, invoiceFactory){
	'use strict';
	$scope.maxSize = 5;
	$scope.control = {};
	$scope.gates = {};
	//$scope.fecha = {};

	$scope.today = function() {
		$scope.fechaDesde = new Date();
		$scope.fechaHasta = new Date();
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

	$scope.colorHorario = function(gate){
		var horarioGate = new Date(gate.gateTimestamp);
		var horarioInicio = new Date(gate.turnoInicio);
		var horarioFin = new Date(gate.turnoFin);
		if (horarioGate >= horarioInicio && horarioGate <= horarioFin)
			{return 'green'}
		else
			{return 'red'}
	};

	$scope.cargar = function(){
		var fecha = {desde:$scope.fechaDesde, hasta: $scope.fechaHasta};
		controlPanelFactory.getGateByDay(fecha, function(data){
			$scope.gatesAux = data;
			$scope.gatesAux = $scope.gatesAux.sort(function(a,b){ // Ordena el array
				return a['gateTimestamp'] > b['gateTimestamp'];
			});
			var i = 0;
			var fechaAux = new Date($scope.gatesAux[i]['gateTimestamp']);
			$scope.gates[i] = new Array();
			$scope.gatesAux.forEach(function(datos){
				var fechaDatos = new Date(datos['gateTimestamp']);
				if(fechaAux.getFullYear() != fechaDatos.getFullYear() || fechaAux.getMonth() != fechaDatos.getMonth() || fechaAux.getDate() != fechaDatos.getDate()){
					i++;
					$scope.gates[i] = new Array();
				}
				$scope.gates[i].push(datos);
				fechaAux = new Date(datos['gateTimestamp']);
			});
			$scope.fecha = fecha.desde;
		});

	};

	$scope.ver = function(container){
		$scope.containerHide = !$scope.containerHide;
		invoiceFactory.getInvoiceByContainer(container, function(data){
			$scope.invoices = data;
		})
	}
}