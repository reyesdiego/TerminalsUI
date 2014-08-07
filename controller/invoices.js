/**
 * Created by Diego Reyes on 2/3/14.
*/

function invoicesCtrl($scope, invoiceFactory) {
	'use strict';

	// Fecha (dia y hora)
	$scope.fechaDesde = new Date();

	$scope.filtrar = {
		codComprobante : function(filtro){
			$scope.codTipoComprob = filtro;
			$scope.cargaFacturas();
		},
		nroComprobante : function(filtro){
			$scope.nroComprobante = filtro;
			$scope.cargaFacturas();
		},
		razonSocial : function(filtro){
			$scope.razonSocial = filtro;
			$scope.cargaFacturas();
		},
		documentoCliente : function(filtro){
			$scope.documentoCliente = filtro;
			$scope.cargaFacturas();
		},
		fechaDesde : function(filtro){
			$scope.fechaDesde = filtro;
			$scope.cargaFacturas();
		}
	};

	$scope.hitEnter = function(evt){
		if(angular.equals(evt.keyCode,13))
			$scope.cargaFacturas();
	};

	$scope.pageChanged = function(){
		$scope.page.skip = (($scope.currentPage - 1) * $scope.itemsPerPage);
		$scope.cargaFacturas($scope.page);
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

	function cargaDatos(){
		return {
			'codTipoComprob': $scope.codTipoComprob,
			'nroComprobante': $scope.nroComprobante,
			'razonSocial': $scope.razonSocial,
			'documentoCliente': $scope.documentoCliente,
			'fecha': $scope.fechaDesde
		};
	}

	$scope.cargaFacturas();

}