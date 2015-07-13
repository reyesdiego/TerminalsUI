/**
 * Created by artiom on 13/07/15.
 */
myapp.controller('liquidacionesCtrl', ['$rootScope', '$scope', 'liquidacionesFactory', function($rootScope, $scope, liquidacionesFactory){

	$scope.sinLiquidar = [];
	$scope.liquidaciones = [];

	$scope.itemsPerPage = 15;
	$scope.totalSinLiquidar = 0;
	$scope.totalLiquidadas = 0;

	$scope.cargarSinLiquidar = function(){

	};

	$scope.cargarLiquidaciones = function(){

	};

}]);
