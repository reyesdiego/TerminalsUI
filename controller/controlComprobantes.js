/**
 * Created by kolesnikov-a on 21/02/14.
 */

function controlComprobantesCtrl($scope){

	$scope.verDetalle = '';

	$scope.$on('recargarDetalle', function(event, comprobante){
		$scope.verDetalle = comprobante;
	});

}