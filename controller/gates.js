/**
 * Created by leo on 31/03/14.
 */
(function(){
	myapp.controller('gatesCtrl', function ($scope, gatesFactory) {
		$scope.totalItems = 0;
		$scope.turnosGates = true;
		//$scope.currentPage = 1;
		$scope.configPanel = {
			tipo: 'panel-info',
			titulo: 'Gates',
			mensaje: 'No se han encontrado gates para los filtros seleccionados.'
		};

		// Fecha (dia y hora)
		$scope.fechaDesde = new Date();
		$scope.fechaHasta = new Date();
		$scope.fechaDesde.setHours(0, 0);
		$scope.fechaHasta.setMinutes(0);

		// Variable para almacenar la info principal que trae del factory
		$scope.gates = {};
		$scope.detalles = false;

		$scope.filtrosGates = ['codComprobante', 'nroComprobante', 'razonSocial', 'fechaDesde', 'nroPtoVentaOrden', 'codTipoComprobOrden', 'nroComprobOrden', 'razonOrden', 'fechaOrden', 'importeOrden'];

		$scope.filtrosComprobantes = ['codComprobante', 'nroComprobante', 'fechaDesde', 'codigo', 'razonSocial', 'contenedor', 'nroPtoVentaOrden', 'codTipoComprobOrden', 'nroComprobOrden', 'razonOrden', 'fechaOrden', 'importeOrden'];

		$scope.model = {
			'nroPtoVenta': '',
			'codTipoComprob': 0,
			'nroComprobante': '',
			'razonSocial': '',
			'documentoCliente': '',
			'fechaDesde': $scope.fechaDesde,
			'fechaHasta': $scope.fechaHasta,
			'contenedor': '',
			'buque': '',
			'viaje': '',
			'estado': 'N',
			'codigo': '',
			'filtroOrden': 'gateTimestamp',
			'filtroOrdenAnterior': '',
			'filtroOrdenReverse': true,
			'order': '"gateTimestamp": -1'
		};

		$scope.page = {
			limit: 10,
			skip:0
		};

		$scope.itemsPerPage = 10;

		$scope.$on('cambioPagina', function(event, data){
			$scope.currentPage = data;
			$scope.cargaGates();
		});

		$scope.$on('cambioFiltro', function(event, data){
			$scope.currentPage = 1;
			$scope.cargaGates();
			if (angular.isDefined(data) && data.length > 0){
				$scope.$broadcast('tengoViajes', data);
			}
		});

		$scope.cargaGates = function () {
			$scope.page.skip = (($scope.currentPage - 1) * $scope.itemsPerPage);
			$scope.configPanel = {
				tipo: 'panel-info',
				titulo: 'Gates',
				mensaje: 'No se han encontrado gates para los filtros seleccionados.'
			};
			gatesFactory.getGate($scope.model, $scope.page, function (data) {
				if (data.status === "OK") {
					$scope.gates = data.data;
					$scope.totalItems = data.totalCount;
				} else {
					$scope.configPanel = {
						tipo: 'panel-danger',
						titulo: 'Gates',
						mensaje: 'Se ha producido un error al cargar los gates.'
					};
				}
			});
		};

	});

})();