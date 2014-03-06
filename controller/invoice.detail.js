/**
 * Created by Artiom on 27/02/14.
 */

function invoiceDetailCtrl ($stateParams, $scope, invoiceFactory, utils){

	invoiceFactory.getInvoice(function(data){
		$scope.invoices = data;
		$scope.factura = utils.findById($scope.invoices.data, $stateParams.facId);
	})
}