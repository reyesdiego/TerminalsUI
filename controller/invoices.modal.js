/**
 * Created by gutierrez-g on 20/02/14.
 */
function invoicesModalCtrl($scope, $modalInstance, data){
	'use strict';
	$scope.factura = data.factura;

	$scope.close = function(){
		$modalInstance.dismiss('canceled');
	}; // end cancel

}