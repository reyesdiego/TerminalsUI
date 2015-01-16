/**
 * Created by artiom on 24/09/14.
 */
(function() {
	myapp.controller('comprobantesErrorCtrl', function($scope, invoiceFactory) {
		$scope.ocultarFiltros = ['nroPtoVenta'];

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
			'filtroOrdenReverse': false,
			'order': '',
			'itemsPerPage': 15
		};

		$scope.comprobantesError = [];

		$scope.loadingError = false;

		$scope.$on('cambioPagina', function(event, data){
			$scope.currentPage = data;
			if ($scope.model.estado == 'N'){
				$scope.model.estado = 'R,T';
			}
			$scope.traerComprobantes();
		});

		$scope.$on('cambioFiltro', function(event, data){
			$scope.currentPage = 1;
			if ($scope.model.estado == 'N'){
				$scope.model.estado = 'R,T';
			}
			$scope.traerComprobantes();
		});

		$scope.$on('errorDatos', function(){
			$scope.mensajeResultado = {
				titulo: 'Error',
				mensaje: 'Se produjo un error al cargar los datos. Inténtelo nuevamente más tarde o comuníquese con el soporte técnico.',
				tipo: 'panel-danger'
			};
			$scope.loadingError = false;
		});

		$scope.traerComprobantes = function(){
			$scope.page.skip = (($scope.currentPage - 1) * $scope.model.itemsPerPage);
			$scope.page.limit = $scope.model.itemsPerPage;
			$scope.loadingError = true;
			invoiceFactory.getInvoice($scope.model, $scope.page, function(invoiceError){
				$scope.comprobantesError = invoiceError.data;
				$scope.totalItems = invoiceError.totalCount;
				$scope.loadingError = false;
			})
		};
	});
})();