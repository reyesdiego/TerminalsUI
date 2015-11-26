/**
 * Created by artiom on 17/11/15.
 */
myapp.controller('matCtrl', ['$scope', 'liquidacionesFactory', 'generalFunctions', function($scope, liquidacionesFactory, generalFunctions){

	$scope.disableModify = true;

	$scope.model = {
		year: new Date(),
		valorMAT: {
			BACTSSA: 0,
			TERMINAL4: 0,
			TRP: 0
		}
	};

	$scope.matData = {};
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

	$scope.verCambios = function(){
		for (var terminal in $scope.model.valorMAT){
			if ($scope.model.valorMAT.hasOwnProperty(terminal)){
				if ($scope.model.valorMAT[terminal] == '') $scope.model.valorMAT[terminal] = 0;
				$scope.model.valorMAT[terminal] = parseFloat($scope.model.valorMAT[terminal]);
			}
		}
		$scope.disableModify = ($scope.model.valorMAT.BACTSSA == $scope.matData.BACTSSA && $scope.model.valorMAT.TERMINAL4 == $scope.matData.TERMINAL4 && $scope.model.valorMAT.TRP == $scope.matData.TRP);
	};

	$scope.actualizarMAT = function(){
		console.log($scope.model);
	};

	$scope.cargarDatos = function(){
		liquidacionesFactory.getMAT($scope.model.year.getFullYear(), function(data){
			if (data.status == 'OK'){
				$scope.matData = data.data[0];
				$scope.model.valorMAT = angular.copy($scope.matData);
				data.data.forEach(function(matData){
					$scope.matMonth = {
						BACTSSA: matData.BACTSSA / 12,
						TERMINAL4: matData.TERMINAL4 / 12,
						TRP: matData.TRP / 12
					};
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