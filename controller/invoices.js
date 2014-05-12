/**
 * Created by Diego Reyes on 2/3/14.
 */

function invoicesCtrl ($scope, invoiceFactory) {
	'use strict';

	// Paginacion
	$scope.maxSize = 5;
	$scope.itemsPerPage = 10;
	$scope.currentPage = 1;
	var page0 = {
		skip:0,
		limit: $scope.itemsPerPage
	};
	var page = page0;
	$scope.setPage = function (pageNo){ $scope.currentPage = pageNo; };
	$scope.numPages = function (){ return Math.ceil($scope.totalItems / $scope.itemsPerPage); };

	// Fecha (dia y hora)
	$scope.fechaDesde = new Date();
	$scope.dateOptions = { 'year-format': "'yy'", 'starting-day': 1 };
	$scope.formats = ['dd-MMMM-yyyy', 'yyyy-MM-dd', 'shortDate'];
	$scope.format = $scope.formats[1];
	$scope.open = function($event) {
		$event.preventDefault();
		$event.stopPropagation();
	};

	// Trae las facturas disponibles
	invoiceFactory.getInvoice('', page0, function(data){
		if(data.status === 'OK'){
			$scope.invoices = data.data;
			$scope.totalItems = data.totalCount;
		}
	});

	// Busca las facturas por cualquiera de los datos ingresados
	$scope.search = function (){
		var datos = {
			'nroComprobante': $scope.nroComprobante,
			'razonSocial': $scope.razonSocial,
			'documentoCliente': $scope.documentoCliente,
			'fecha': $scope.fechaDesde
		};
		invoiceFactory.getInvoice(datos, page0, function(data){
			if(data.status === 'OK'){
				$scope.invoices = data.data;
			}
		})
	};

	$scope.$watch('currentPage + itemsPerPage', function(){
		page.skip = (($scope.currentPage - 1) * $scope.itemsPerPage);
		invoiceFactory.getInvoice('', page, function(data){
			if(data.status === 'OK'){
				$scope.invoices = data.data;
			}
		});
	});

}