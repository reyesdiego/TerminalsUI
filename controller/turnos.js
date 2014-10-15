/**
 * Created by leo on 28/04/14.
 */
(function(){
	myapp.controller('turnosCtrl', function($scope, turnosFactory){
		// Fecha (dia y hora)
		$scope.model = {
			'fechaDesde':	new Date(),
			'fechaHasta':	new Date()
		};
		$scope.model.fechaDesde.setHours(0,0);
		$scope.model.fechaHasta.setMinutes(0);

		// Variable para almacenar la info principal que trae del factory
		$scope.turnos = {};

		$scope.$on('cambioPagina', function(event, data){
			$scope.currentPage = data;
			$scope.pageChanged();
		});

		$scope.$on('cambioFiltro', function(){
			$scope.cargaTurnos();
		});

		// Carga los turnos por fechas
		$scope.cargaPorFiltros = function(){
			$scope.status.open = !$scope.status.open;
			$scope.currentPage = 1;
			$scope.cargaTurnos();
		};

		$scope.cargaTurnos = function(page){
			page = page || { skip:0, limit: $scope.itemsPerPage };
			turnosFactory.getTurnos($scope.model, page, function(data){
				if (data.status === "OK"){
					$scope.turnos = data.data;
					$scope.totalItems = data.totalCount;
				}
			});
		};

		$scope.pageChanged = function(){
			$scope.page.skip = (($scope.currentPage - 1) * $scope.itemsPerPage);
			$scope.cargaTurnos($scope.page);
		};

		// Carga los turnos del día hasta la hora del usuario
		$scope.cargaTurnos();

	});
})();