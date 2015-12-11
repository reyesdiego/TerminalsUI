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
	$scope.dataFacturado = {
		Enero: {
			facturado: {
				BACTSSA: 0,
				TERMINAL4: 0,
				TRP: 0
			},
			diferencia: {
				BACTSSA: 0,
				TERMINAL4: 0,
				TRP: 0
			}
		},
		Febrero: {
			facturado: {
				BACTSSA: 0,
				TERMINAL4: 0,
				TRP: 0
			},
			diferencia: {
				BACTSSA: 0,
				TERMINAL4: 0,
				TRP: 0
			}
		},
		Marzo: {
			facturado: {
				BACTSSA: 0,
				TERMINAL4: 0,
				TRP: 0
			},
			diferencia: {
				BACTSSA: 0,
				TERMINAL4: 0,
				TRP: 0
			}
		},
		Abril: {
			facturado: {
				BACTSSA: 0,
				TERMINAL4: 0,
				TRP: 0
			},
			diferencia: {
				BACTSSA: 0,
				TERMINAL4: 0,
				TRP: 0
			}
		},
		Mayo: {
			facturado: {
				BACTSSA: 0,
				TERMINAL4: 0,
				TRP: 0
			},
			diferencia: {
				BACTSSA: 0,
				TERMINAL4: 0,
				TRP: 0
			}
		},
		Junio: {
			facturado: {
				BACTSSA: 0,
				TERMINAL4: 0,
				TRP: 0
			},
			diferencia: {
				BACTSSA: 0,
				TERMINAL4: 0,
				TRP: 0
			}
		},
		Julio: {
			facturado: {
				BACTSSA: 0,
				TERMINAL4: 0,
				TRP: 0
			},
			diferencia: {
				BACTSSA: 0,
				TERMINAL4: 0,
				TRP: 0
			}
		},
		Agosto: {
			facturado: {
				BACTSSA: 0,
				TERMINAL4: 0,
				TRP: 0
			},
			diferencia: {
				BACTSSA: 0,
				TERMINAL4: 0,
				TRP: 0
			}
		},
		Septiembre: {
			facturado: {
				BACTSSA: 0,
				TERMINAL4: 0,
				TRP: 0
			},
			diferencia: {
				BACTSSA: 0,
				TERMINAL4: 0,
				TRP: 0
			}
		},
		Octubre: {
			facturado: {
				BACTSSA: 0,
				TERMINAL4: 0,
				TRP: 0
			},
			diferencia: {
				BACTSSA: 0,
				TERMINAL4: 0,
				TRP: 0
			}
		},
		Noviembre: {
			facturado: {
				BACTSSA: 0,
				TERMINAL4: 0,
				TRP: 0
			},
			diferencia: {
				BACTSSA: 0,
				TERMINAL4: 0,
				TRP: 0
			}
		},
		Diciembre: {
			facturado: {
				BACTSSA: 0,
				TERMINAL4: 0,
				TRP: 0
			},
			diferencia: {
				BACTSSA: 0,
				TERMINAL4: 0,
				TRP: 0
			}
		}
	};

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

	$scope.actualizarMAT = function(terminal){
		var data = {
			terminal: terminal,
			mat: $scope.model.valorMAT[terminal],
			year: $scope.model.year.getFullYear()
		};
		liquidacionesFactory.createMat(data, function(data){
			if (data.status == 'OK'){
				$scope.matData[terminal] = data.data[0].mat;
				$scope.model.valorMAT = angular.copy($scope.matData);
			}
		})
	};

	$scope.cargarDatos = function(){
		/*$scope.model = {
			year: new Date(),
			valorMAT: {
				BACTSSA: 0,
				TERMINAL4: 0,
				TRP: 0
			}
		};*/
		$scope.matData = {};
		liquidacionesFactory.getMAT($scope.model.year.getFullYear(), function(data){
			console.log(data);
			if (data.status == 'OK'){
				data.data.forEach(function(matData){
					$scope.matData[matData.terminal] = matData.mat;
					/*matData.months.forEach(function(mesFacturado){
					 $scope.dataFacturado[mesFacturado.month].
					 });*/
				});
				$scope.model.valorMAT = angular.copy($scope.matData);
			}
		})
	};

	$scope.cargarDatos();

}]);