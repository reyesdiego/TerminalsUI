/**
 * Created by Diego Reyes on 2/3/14.
 */

function invoicesCtrl ($scope, invoiceFactory) {
	'use strict';
	$scope.filteredInvoices = []
	$scope.itemsPerPage = 10;
	$scope.currentPage = 1;
	$scope.maxSize = 5;

	var page = {skip:0, limit:50};
	invoiceFactory.getInvoice(page, function(data){
		$scope.invoices = data;

		$scope.totalItems = $scope.invoices.length;

		$scope.setPage = function (pageNo) {
			$scope.currentPage = pageNo;
		};

		$scope.numPages = function () {
			return Math.ceil($scope.filteredInvoices.length / $scope.itemsPerPage);
		};

		$scope.$watch('currentPage + itemsPerPage', function() {
			var begin = (($scope.currentPage - 1) * $scope.itemsPerPage)
				, end = begin + $scope.itemsPerPage;

			$scope.filteredInvoices = $scope.invoices.slice(begin, end);
			$scope.filtro = '';
		});

		// init the filtered items
		$scope.search = function () {
			$scope.filteredInvoices = $scope.invoices;
			$scope.maxSize = $scope.numPages();
			console.log($scope.maxSize);
			console.log($scope.filteredInvoices.length)
		};

	});

}
