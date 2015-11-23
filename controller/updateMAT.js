/**
 * Created by artiom on 23/11/15.
 */

myapp.controller('updateMATCtrl', ['$scope', '$modalInstance', 'generalFunctions', function($scope, $modalInstance, generalFunctions){

	$scope.model = {
		year: new Date(),
		valorMAT: {
			BACTSSA: undefined,
			TERMINAL4: undefined,
			TRP: undefined
		}
	};

	$scope.openDate = function(event){
		generalFunctions.openDate(event);
	};

	$scope.guardar = function(){
		$modalInstance.close($scope.model);
	};

	$scope.cancelar = function(){
		$modalInstance.dismiss('cancel');
	};

}]);
