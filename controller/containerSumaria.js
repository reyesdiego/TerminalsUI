/**
 * Created by kolesnikov-a on 23/03/2016.
 */

myapp.controller('containerSumariaCtrl', ['$scope', 'afipFactory', function($scope, afipFactory){

	$scope.verDetalleManifiesto = false;
	$scope.manifiestoElegido = '';
	$scope.manifiesto = {};

	$scope.detalleSumaria = function(sumaria){
		$scope.manifiestoElegido = sumaria;
		afipFactory.getManifiestoDetalle(sumaria, function(data){
			if (data.status == 'OK'){
				$scope.manifiesto = data.data[0];
				console.log($scope.manifiesto);
				$scope.verDetalleManifiesto = true;
			} else {
				$scope.verDetalleManifiesto = false;
			}
		})
	};

	$scope.ocultarDetalle = function(){
		$scope.verDetalleManifiesto = false;
	}

}]);
