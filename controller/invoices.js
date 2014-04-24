/**
 * Created by Diego Reyes on 2/3/14.
 */

function invoicesCtrl ($scope, invoiceFactory) {
	'use strict';
	$scope.itemsPerPage = 10;
	$scope.currentPage = 1;
	$scope.maxSize = 5;

	var page = {skip:0, limit: $scope.itemsPerPage};

	invoiceFactory.getInvoice(page, function(data){
		console.log(data);
		$scope.invoices = data;
		$scope.totalItems = $scope.invoices.totalCount;
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
			$scope.invoices = data;
		});
		$scope.filtro = '';
	});

	$scope.search = function (invoice){
		invoiceFactory.searchInvoice(invoice, function(data){
			$scope.invoices = data;
		})
	};
}