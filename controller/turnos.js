/**
 * Created by leo on 28/04/14.
 */
(function(){

	myapp.controller('turnosCtrl', function($scope, turnosFactory){
		$scope.currentPage = 1;
		$scope.itemsPerPage = 15;
		$scope.turnosGates = true;
		$scope.configPanel = {
			tipo: 'panel-info',
			titulo: 'Turnos',
			mensaje: 'No se han encontrado turnos para los filtros seleccionados.'
		};

		// Fecha (dia y hora)
		$scope.model = {
			'nroPtoVenta': '',
			'codTipoComprob': 0,
			'nroComprobante': '',
			'razonSocial': '',
			'documentoCliente': '',
			'fechaInicio': $scope.fechaInicio,
			'fechaFin': $scope.fechaFin,
			'contenedor': '',
			'buque': '',
			'viaje': '',
			'estado': 'N',
			'codigo': '',
			'filtroOrden': 'gateTimestamp',
			'filtroOrdenAnterior': '',
			'filtroOrdenReverse': false,
			'order': ''
		};

		$scope.model.fechaInicio.setHours(0,0);
		$scope.model.fechaFin.setMinutes(0);

		$scope.fechaAuxDesde = new Date();
		$scope.fechaAuxHasta = new Date();

		// Variable para almacenar la info principal que trae del factory
		$scope.turnos = {};

		$scope.$on('cambioPagina', function(event, data){
			$scope.currentPage = data;
			$scope.cargaTurnos();
		});

		$scope.$on('cambioFiltro', function(event, data){
			$scope.fechaAuxHasta = new Date($scope.model.fechaFin);
			$scope.fechaAuxDesde = new Date($scope.model.fechaInicio);
			$scope.model.fechaFin = $scope.fechaAuxDesde;
			$scope.model.fechaFin.setHours($scope.fechaAuxHasta.getHours(), $scope.fechaAuxHasta.getMinutes());
			$scope.currentPage = 1;
			$scope.cargaTurnos();
			if (angular.isDefined(data) && data.length > 0){
				$scope.$broadcast('tengoViajes', data);
			}
		});

		// Carga los turnos por fechas
		$scope.cargaPorFiltros = function(){
			$scope.status.open = !$scope.status.open;
			$scope.currentPage = 1;
			$scope.cargaTurnos();
		};

		$scope.cargaTurnos = function(){
			$scope.page.skip = (($scope.currentPage - 1) * $scope.itemsPerPage);
			$scope.configPanel = {
				tipo: 'panel-info',
				titulo: 'Turnos',
				mensaje: 'No se han encontrado turnos para los filtros seleccionados.'
			};
			turnosFactory.getTurnos($scope.model, $scope.page, function(data){
				if (data.status === "OK"){
					$scope.turnos = data.data;
					$scope.totalItems = data.totalCount;
				} else {
					$scope.configPanel = {
						tipo: 'panel-danger',
						titulo: 'Turnos',
						mensaje: 'Se ha producido un error al cargar los turnos.'
					};
				}
			});
		};

		// Carga los turnos del día hasta la hora del usuario
		$scope.cargaTurnos();

	});

})();