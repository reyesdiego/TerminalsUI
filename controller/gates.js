/**
 * Created by leo on 31/03/14.
 */

function gatesCtrl($scope, gatesFactory, invoiceFactory){
	'use strict';
	$scope.maxSize = 5;
	$scope.gates = {};
	$scope.itemsPerPage = 10;
	$scope.currentPage = 1;
	var page = {skip:0, limit: $scope.itemsPerPage};

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
		var datos = {contenedor : $scope.contenedor, fechaDesde : $scope.fechaDesde, fechaHasta : $scope.fechaHasta};
		gatesFactory.getGateByDayOrContainer(datos, page, function(data){
			$scope.gates = data;
			$scope.totalItems = $scope.gates.totalCount;
			/*if(data.length > 1){
				$scope.gates = $scope.gates.sort(function(a,b){ // Ordena el array
					return a['gateTimestamp'] > b['gateTimestamp'];
				});
			} else{
				console.log(data.length);
			}*/
		});

	};

	$scope.$watch('currentPage + itemsPerPage', function(){
		var skip = (($scope.currentPage - 1) * $scope.itemsPerPage);
		page.skip = skip;
		var datos = {contenedor : $scope.contenedor, fechaDesde : $scope.fechaDesde, fechaHasta : $scope.fechaHasta};
		gatesFactory.getGateByDayOrContainer(datos, page, function(data){
			$scope.gates = data;
		});
	});

	$scope.ver = function(container){
		$scope.containerHide = !$scope.containerHide;

		invoiceFactory.getInvoiceByContainer(container, page, function(data){
			$scope.invoices = data;
			$scope.totalItems = $scope.invoices.totalCount;

			$scope.$watch('currentPage + itemsPerPage', function(){
				var skip = (($scope.currentPage - 1) * $scope.itemsPerPage);
				page.skip = skip;
				invoiceFactory.getInvoiceByContainer(container,page, function(data){
					$scope.invoices = data;
				})
				$scope.filtro = '';
			});

			console.log($scope.invoices);
		});
	};

	$scope.setPage = function (pageNo){
		$scope.currentPage = pageNo;
	};

	$scope.numPages = function (){
		return Math.ceil($scope.totalItems / $scope.itemsPerPage);
	};
}