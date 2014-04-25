/**
 * Created by Diego Reyes on 2/3/14.
 */

function invoicesCtrl ($scope, invoiceFactory) {
	'use strict';
	$scope.itemsPerPage = 10;
	$scope.currentPage = 1;
	$scope.maxSize = 5;

	$scope.fechaDesde = new Date();

	$scope.dateOptions = {
		'year-format': "'yy'",
		'starting-day': 1
	};

	$scope.formats = ['dd-MMMM-yyyy', 'yyyy-MM-dd', 'shortDate'];
	$scope.format = $scope.formats[1];

	$scope.showWeeks = false;

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
	};

	var page = {skip:0, limit: $scope.itemsPerPage};

	invoiceFactory.getInvoice(page, function(data){
		if(data.status === 'OK'){
			$scope.invoices = data.data;
			$scope.totalItems = data.totalCount;
		}
	});

	$scope.setPage = function (pageNo){
		$scope.currentPage = pageNo;
	};

	$scope.numPages = function (){
		return Math.ceil($scope.totalItems / $scope.itemsPerPage);
	};

	$scope.$watch('currentPage + itemsPerPage', function(){
		var skip = (($scope.currentPage - 1) * $scope.itemsPerPage);
		page.skip = skip;
		invoiceFactory.getInvoice(page, function(data){
			if(data.status === 'OK'){
				$scope.invoices = data.data;
			}
		});
	});

	$scope.search = function (){
		var datos = {
			'nroComprobante': $scope.nroComprobante,
			'razonSocial': $scope.razonSocial,
			'documentoCliente': $scope.documentoCliente,
			'fecha': $scope.fechaDesde
		}
		invoiceFactory.searchInvoice(datos, function(data){
			if(data.status === 'OK'){
				$scope.invoices = data.data;
			}
		})
	};
}