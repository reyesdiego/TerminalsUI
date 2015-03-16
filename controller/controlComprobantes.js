/**
 * Created by kolesnikov-a on 21/02/14.
 */

myapp.controller('controlComprobantesCtrl', ['$scope', 'generalCache', function($scope, generalCache) {
	$scope.verDetalle = '';

	$scope.listaContenedores = generalCache.get('contenedores');

	$scope.$on('recargarDetalle', function(event, comprobante){
		$scope.verDetalle = comprobante;
	});
}]);
