/**
 * Created by artiom on 17/11/15.
 */
myapp.controller('matCtrl', ['$scope', 'liquidacionesFactory', 'generalFunctions', function($scope, liquidacionesFactory, generalFunctions){

	$scope.model ={
		year: new Date()
	};

	$scope.matData = [];
	$scope.matMonth = {
		BACTSSA: 0,
		TERMINAL4: 0,
		TRP: 0
	};
	$scope.totales = {
		BACTSSA: 0,
		TERMINAL4: 0,
		TRP: 0
	};
	$scope.dataFacturado = [];

	$scope.openDate = function(event){
		generalFunctions.openDate(event);
	};

	$scope.cargarDatos = function(){
		liquidacionesFactory.getMAT($scope.model.year.getFullYear(), function(data){
			if (data.status == 'OK'){
				$scope.matData = data.data;
				data.data.forEach(function(matData){
					$scope.matMonth = {
						BACTSSA: matData.BACTSSA / 12,
						TERMINAL4: matData.TERMINAL4 / 12,
						TRP: matData.TRP / 12
					}
				});
				liquidacionesFactory.getMatFacturado($scope.model.year.getFullYear(), function(data){
					if (data.status == 'OK'){
						$scope.dataFacturado = data.data;
						$scope.dataFacturado.forEach(function(mesFacturado){
							mesFacturado.diferencia = {
								BACTSSA: mesFacturado.facturado.BACTSSA - $scope.matMonth.BACTSSA,
								TERMINAL4: mesFacturado.facturado.TERMINAL4 - $scope.matMonth.TERMINAL4,
								TRP: mesFacturado.facturado.TRP - $scope.matMonth.TRP
							};
							$scope.totales.BACTSSA += mesFacturado.diferencia.BACTSSA;
							$scope.totales.TERMINAL4 += mesFacturado.diferencia.TERMINAL4;
							$scope.totales.TRP += mesFacturado.diferencia.TRP;
						})
					}
				});
			}
		})
	};

	$scope.cargarDatos();

}]);