/**
 * Created by kolesnikov-a on 21/02/14.
 */
(function() {
	myapp.controller('controlComprobantesCtrl', function($scope) {
		$scope.verDetalle = '';

		$scope.$on('recargarDetalle', function(event, comprobante){
			$scope.verDetalle = comprobante;
		});
	});
})();