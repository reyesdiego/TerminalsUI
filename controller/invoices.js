/**
 * Created by Diego Reyes on 2/3/14.
 */

function invoicesCtrl ($scope, invoiceFactory, loginService) {
	'use strict';

	// Paginacion
	$scope.itemsPerPage = 10;
	$scope.currentPage = 1;
	var page = {
		skip:0,
		limit: $scope.itemsPerPage
	};

	// Fecha (dia y hora)
	$scope.fechaDesde = new Date();
	$scope.dateOptions = { 'startingDay': 0, 'showWeeks': false };
	$scope.format = 'yyyy-MM-dd';
	$scope.open = function($event) {
		$event.preventDefault();
		$event.stopPropagation();
	};

	$scope.dataUser = loginService.getInfo();

	// Trae las facturas disponibles
	cargaFacturas(cargaDatos());

	// Busca las facturas por cualquiera de los datos ingresados
	$scope.search = function (){
		cargaFacturas(cargaDatos());
	};

	$scope.$watch('currentPage', function(){
		page.skip = (($scope.currentPage - 1) * $scope.itemsPerPage);
		cargaFacturas(cargaDatos(), page);
	});

	function cargaDatos(){
		return {
			'nroComprobante': $scope.nroComprobante,
			'razonSocial': $scope.razonSocial,
			'documentoCliente': $scope.documentoCliente,
			'fecha': $scope.fechaDesde
		};
	}

	function cargaFacturas(datos,page){
		page = page || { skip:0, limit: $scope.itemsPerPage };
		invoiceFactory.getInvoice(datos, page, function(data){
			if(data.status === 'OK'){
				$scope.invoices = data.data;
				// ***** TO DO Agregar la descripcion desde la base
				data.data.forEach(function(factura){
					factura.detalle.forEach(function(detalles){
						detalles.items.forEach(function(item){
							item.descripcion = "Consolidacion de contenedores FCL de 40 pies por conveniencia del cargador. Incluye la recepcion del camion, el llenado del contenedor, estiba, trincado con los materiales necesarios para ello y apuntaje. Los gastos de manupuleo del contenedor en sí rigen por las tarifas T9C y T9F";
						})
					})
				});
				// *****
				$scope.totalItems = data.totalCount;
			}
		});
	}

	$scope.hitEnter = function(evt, price){
		if(angular.equals(evt.keyCode,13))
			$scope.search();
	}; // end hitEnter
}