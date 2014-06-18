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

	// Se carga el array de la descripcion de los items de las facturas
	invoiceFactory.getDescriptionItem(function(data){
		$scope.itemsDescriptionInvoices = data.data;
	});

	// Para mostrar el icono del alert en la desc
	$scope.isDefinedAngular = function(itemId){
		return angular.isDefined($scope.itemsDescriptionInvoices[itemId]);
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
				data.data.forEach(function(factura){
					factura.detalle.forEach(function(detalles){
						detalles.items.forEach(function(item){
							if (angular.isDefined($scope.itemsDescriptionInvoices[item.id])){
								item.descripcion = $scope.itemsDescriptionInvoices[item.id];
							}
							else{
								item.descripcion = "No se halló la descripción, verifique que el código esté asociado";
							}
						})
					})
				});
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

	$scope.$watch('currentPage', function(){
		$scope.page.skip = (($scope.currentPage - 1) * $scope.itemsPerPage);
		$scope.cargaGates($scope.page);
	});

	function cargaDatos(){
		return { contenedor : $scope.contenedor, fechaDesde : $scope.fecha.desde, fechaHasta : $scope.fecha.hasta }
	}

}