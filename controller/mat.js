/**
 * Created by artiom on 17/11/15.
 */
myapp.controller('matCtrl', ['$scope', 'liquidacionesFactory', function($scope, liquidacionesFactory){

	$scope.year = new Date().getFullYear();
	$scope.matData = [];
	$scope.matMonth = {
		BACTSSA: 0,
		TERMINAL4: 0,
		TRP: 0
	};
	$scope.dataFacturado = [];

	$scope.cargarDatos = function(){
		liquidacionesFactory.getMAT($scope.year, function(data){
			if (data.status == 'OK'){
				$scope.matData = data.data;
				data.data.forEach(function(matData){
					$scope.matMonth = {
						BACTSSA: matData.BACTSSA / 12,
						TERMINAL4: matData.TERMINAL4 / 12,
						TRP: matData.TRP / 12
					}
				});
				liquidacionesFactory.getMatFacturado($scope.year, function(data){
					if (data.status == 'OK'){
						$scope.dataFacturado = data.data;
						$scope.dataFacturado.forEach(function(mesFacturado){
							mesFacturado.diferencia = {
								BACTSSA: mesFacturado.facturado.BACTSSA - $scope.matMonth.BACTSSA,
								TERMINAL4: mesFacturado.facturado.TERMINAL4 - $scope.matMonth.TERMINAL4,
								TRP: mesFacturado.facturado.TRP - $scope.matMonth.TRP
							}
						})
					}
				});
			}
		})
	};

	$scope.cargarDatos();

}]);