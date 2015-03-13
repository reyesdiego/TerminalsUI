/**
 * Created by artiom on 12/03/15.
 */


myapp.controller('ratesCtrl',['$rootScope', '$scope', 'invoiceFactory', function ($rootScope, $scope, invoiceFactory) {

	$rootScope.predicate = '_id.terminal';

	$scope.configPanel = {
		tipo: 'panel-info',
		titulo: 'Tasas a las cargas',
		mensaje: 'No se han encontrado datos para los filtros seleccionados.'
	};

	// Fecha (dia y hora)
	$scope.fechaInicio = new Date();

	// Variable para almacenar la info principal que trae del factory
	$scope.rates = {};

	$scope.model = {
		'fecha': $scope.fechaInicio
	};

	$scope.cargando = false;

	$scope.$on('errorInesperado', function(e, mensaje){
		$scope.cargando = false;
		$scope.rates = [];
		$scope.configPanel = mensaje;
	});

	$scope.cargaRates = function () {
		$scope.cargando = true;
		$scope.configPanel = {
			tipo: 'panel-info',
			titulo: 'Tasas a las cargas',
			mensaje: 'No se han encontrado datos para los filtros seleccionados.'
		};
		invoiceFactory.getRatesInvoices($scope.model, function (data) {
			if (data.status === "OK") {
				$scope.rates = data.data;
			} else {
				$scope.configPanel = {
					tipo: 'panel-danger',
					titulo: 'Tasas a las cargas',
					mensaje: 'Se ha producido un error al cargar los datos de tasas a las cargas.'
				};
			}
			$scope.cargando = false;
		});
	};

	$scope.cargaRates();
}]);
