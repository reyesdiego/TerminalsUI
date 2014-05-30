/**
 * Created by Diego Reyes on 2/3/14.
 */

function invoicesCtrl ($scope, invoiceFactory) {
	'use strict';

	// Fecha (dia y hora)
	$scope.fechaDesde = new Date();

	$scope.hitEnter = function(evt){
		if(angular.equals(evt.keyCode,13))
			$scope.cargaFacturas();
	};

	$scope.$watch('currentPage', function(){
		$scope.page.skip = (($scope.currentPage - 1) * $scope.itemsPerPage);
		$scope.cargaFacturas($scope.page);
	});

	$scope.cargaFacturas = function(page){
		page = page || { skip:0, limit: $scope.itemsPerPage };
		invoiceFactory.getInvoice(cargaDatos(), page, function(data){
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
	};

	function cargaDatos(){
		return {
			'nroComprobante': $scope.nroComprobante,
			'razonSocial': $scope.razonSocial,
			'documentoCliente': $scope.documentoCliente,
			'fecha': $scope.fechaDesde
		};
	}

}