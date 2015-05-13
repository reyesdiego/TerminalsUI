/**
 * Created by artiom on 13/05/15.
 */

myapp.controller('accessControlCtrl', ['$scope', 'ctrlUsersFactory', function($scope, ctrlUsersFactory){

	$scope.usuarios = [];
	$scope.rutas = [];
	$scope.cargaRutas = true;

	ctrlUsersFactory.getRoutes(function(data){
		if (data.status == 'OK'){
			$scope.rutas = data.data;
		} else {

		}
		$scope.cargaRutas = false;
	})

}]);
