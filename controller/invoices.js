/**
 * Created by Diego Reyes on 2/3/14.
 */

function invoicesCtrl ($scope, invoiceFactory) {
	'use strict';
	$scope.filteredInvoices = []
	$scope.itemsPerPage = 10;
	$scope.currentPage = 1;
	$scope.maxSize = 5;

	var page = {skip:0, limit: $scope.itemsPerPage};
	invoiceFactory.getInvoice(page, function(data){
		$scope.invoices = data;

		$scope.totalItems = $scope.invoices.length;

		$scope.setPage = function (pageNo) {
			$scope.currentPage = pageNo;
		};

		//esta funcion debe ser reemplazada por una llamada al servidor que devuelva el total de facturas
		$scope.numPages = function () {
			//return Math.ceil($scope.invoices.length / $scope.itemsPerPage);
			return 3;
		};

		$scope.$watch('currentPage + itemsPerPage', function() {
			var skip = (($scope.currentPage - 1) * $scope.itemsPerPage);
			page.skip = skip;
			console.log(page);
			invoiceFactory.getInvoice(page, function(data) {
				$scope.invoices = data;
			})
			$scope.filtro = '';
		});

		// init the filtered items
		$scope.search = function () {
			//$scope.filteredInvoices = $scope.invoices;
		};

	});

}
