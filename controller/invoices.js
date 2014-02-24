/**
 * Created by Diego Reyes on 2/3/14.
 */

function invoicesCtrl ($scope, $modal, invoiceFactory) {
	'use strict';

	invoiceFactory.getInvoice(function(data){
		$scope.invoices = data;
	});

	$scope.open = function (factura){
		$modal.open({
			templateUrl: 'view/invoices.detail.html',
			controller: 'invoicesModalCtrl',
			resolve: {
				factura: function(){
					return factura;
				}
			}
		})};

}
