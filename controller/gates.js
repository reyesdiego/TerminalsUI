/**
 * Created by leo on 31/03/14.
 */
(function(){
	myapp.controller('gatesCtrl', function ($scope, gatesFactory) {
		$scope.turnosGates = true;
		//$scope.currentPage = 1;

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
			'estado': 'N',
			'codigo': '',
			'filtroOrden': 'gateTimestamp',
			'filtroOrdenAnterior': '',
			'filtroOrdenReverse': true,
			'order': '"gateTimestamp": -1'
		};

		$scope.$on('cambioPagina', function(event, data){
			$scope.currentPage = data;
			$scope.cargaGates();
		});

		$scope.$on('cambioFiltro', function(){
			$scope.currentPage = 1;
			$scope.cargaGates();
		});

		$scope.cargaGates = function () {
			$scope.page.skip = (($scope.currentPage - 1) * $scope.itemsPerPage);
			gatesFactory.getGate($scope.model, $scope.page, function (data) {
				if (data.status === "OK") {
					$scope.gates = data.data;
					$scope.totalItems = data.totalCount;
				}
			});
		};

	});

})();