/**
 * Created by gutierrez-g on 20/02/14.
 */
function invoicesModalCtrl($scope, $modalInstance, factura){
	'use strict';
	$scope.factura = factura;

	$scope.close = function(){
		$modalInstance.dismiss('canceled');
	}; // end cancel

}