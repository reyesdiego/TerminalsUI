/**
 * Created by Diego Reyes on 2/3/14.
*/

function invoicesCtrl ($scope, invoiceFactory) {
	'use strict';

	// Fecha (dia y hora)
	$scope.fechaDesde = new Date();

	// Se carga el array de la descripcion de los items de las facturas
	invoiceFactory.getDescriptionItem(function(data){
		$scope.itemsDescriptionInvoices = data.data;
	});

	$scope.hitEnter = function(evt){
		if(angular.equals(evt.keyCode,13))
			$scope.cargaFacturas();
	};

	$scope.$watch('currentPage', function(){
		$scope.page.skip = (($scope.currentPage - 1) * $scope.itemsPerPage);
		$scope.cargaFacturas($scope.page);
	});

	// Para mostrar el icono del alert en la desc
	$scope.isDefinedAngular = function(itemId){
		return angular.isDefined($scope.itemsDescriptionInvoices[itemId]);
	};

	$scope.cargaFacturas = function(page){
		page = page || { skip:0, limit: $scope.itemsPerPage };
		invoiceFactory.getInvoice(cargaDatos(), page, function(data){
			if(data.status === 'OK'){
				$scope.invoices = data.data;
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