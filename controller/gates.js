/**
 * Created by leo on 31/03/14.
 */

function gatesCtrl($scope, gatesFactory, invoiceFactory){
	'use strict';

	// Paginacion
	$scope.maxSize = 5;
	$scope.itemsPerPage = 10;
	$scope.currentPage = 1;
	var page = {skip:0, limit: $scope.itemsPerPage};
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
	$scope.open = function($event) {
		$event.preventDefault();
		$event.stopPropagation();
	};

	// Variable para almacenar la info principal que trae del factory
	$scope.gates = {};

	$scope.colorHorario = function(gate){
		var horarioGate = new Date(gate.gateTimestamp);
		var horarioInicio = new Date(gate.turnoInicio);
		var horarioFin = new Date(gate.turnoFin);
		if (horarioGate >= horarioInicio && horarioGate <= horarioFin) { return 'green' } else { return 'red' }
	};

	$scope.cargar = function(){
		// Setea las fechas para las horas y minutos
		$scope.fecha.dia.desde.setHours($scope.fecha.horario.desde.getHours());
		$scope.fecha.dia.desde.setMinutes($scope.fecha.horario.desde.getMinutes());
		$scope.fecha.dia.hasta.setHours($scope.fecha.horario.hasta.getHours());
		$scope.fecha.dia.hasta.setMinutes($scope.fecha.horario.hasta.getMinutes());
		var datos = {contenedor : $scope.contenedor, fechaDesde : $scope.fecha.dia.desde, fechaHasta : $scope.fecha.dia.hasta};
		gatesFactory.getGateByDayOrContainer(datos, page, function(data){
			if (data.status === "OK"){
				$scope.gates = data.data.data;
				$scope.totalItems = data.totalCount;
			}
		});
	};

	$scope.$watch('currentPage + itemsPerPage', function(){
		var skip = (($scope.currentPage - 1) * $scope.itemsPerPage);
		var page = {
			skip: skip
		};
		var datos = {contenedor : $scope.contenedor, fechaDesde : $scope.fecha.dia.desde, fechaHasta : $scope.fecha.dia.hasta};
		gatesFactory.getGateByDayOrContainer(datos, page, function(data){
			if(data.status === 'OK'){
				$scope.gates = data.data.data;
			}
		});
	});

	$scope.ver = function(container){
		$scope.containerHide = !$scope.containerHide;
		invoiceFactory.getInvoiceByContainer(container, page, function(data){
			if(data.status === 'OK'){
				$scope.invoices = data.data.data;
				$scope.totalItems = data.totalCount;
			}
			$scope.$watch('currentPage + itemsPerPage', function(){
				var skip = (($scope.currentPage - 1) * $scope.itemsPerPage);
				page.skip = skip;
				invoiceFactory.getInvoiceByContainer(container,page, function(data){
					if(data.status === 'OK'){
						$scope.invoices = data.data.data;
					}
				})
			});

			console.log($scope.invoices);
		});
	};

}