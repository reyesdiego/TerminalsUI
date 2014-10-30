/**
 * Created by leo on 28/04/14.
 */
(function(){
	myapp.controller('turnosCtrl', function($scope, turnosFactory){
		$scope.turnosGates = true;

		// Fecha (dia y hora)
		$scope.model = {
			'nroPtoVenta': '',
			'codTipoComprob': 0,
			'nroComprobante': '',
			'razonSocial': '',
			'documentoCliente': '',
			'fechaDesde': new Date(),
			'fechaHasta': new Date(),
			'contenedor': '',
			'buque': '',
			'estado': 'N',
			'codigo': '',
		};

		$scope.model.fechaDesde.setHours(0,0);
		$scope.model.fechaHasta.setMinutes(0);

		$scope.fechaAuxDesde = new Date();
		$scope.fechaAuxHasta = new Date();

		// Variable para almacenar la info principal que trae del factory
		$scope.turnos = {};

		$scope.$on('cambioPagina', function(event, data){
			$scope.currentPage = data;
			$scope.cargaTurnos();
		});

		$scope.$on('cambioFiltro', function(){
			$scope.fechaAuxHasta = new Date($scope.model.fechaHasta);
			$scope.fechaAuxDesde = new Date($scope.model.fechaDesde);
			$scope.model.fechaHasta = $scope.fechaAuxDesde;
			$scope.model.fechaHasta.setHours($scope.fechaAuxHasta.getHours(), $scope.fechaAuxHasta.getMinutes());
			$scope.currentPage = 1;
			$scope.cargaTurnos();
		});

		// Carga los turnos por fechas
		$scope.cargaPorFiltros = function(){
			$scope.status.open = !$scope.status.open;
			$scope.currentPage = 1;
			$scope.cargaTurnos();
		};

		$scope.cargaTurnos = function(){
			$scope.page.skip = (($scope.currentPage - 1) * $scope.itemsPerPage);
			turnosFactory.getTurnos($scope.model, $scope.page, function(data){
				if (data.status === "OK"){
					$scope.turnos = data.data;
					$scope.totalItems = data.totalCount;
				}
			});
		};

		// Carga los turnos del día hasta la hora del usuario
		$scope.cargaTurnos();

	});
})();