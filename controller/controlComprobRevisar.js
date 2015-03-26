/**
 * Created by artiom on 24/09/14.
 */

myapp.controller('comprobantesRevisarCtrl', ['$scope', 'invoiceFactory', function($scope, invoiceFactory) {
	$scope.ocultarFiltros = ['nroPtoVenta', 'estado'];

	$scope.model = {
		'nroPtoVenta': '',
		'codTipoComprob': 0,
		'nroComprobante': '',
		'razonSocial': '',
		'documentoCliente': '',
		'fechaInicio': $scope.fechaInicio,
		'fechaFin': $scope.fechaFin,
		'contenedor': '',
		'buqueNombre': '',
		'viaje': '',
		'estado': 'N',
		'code': '',
		'filtroOrden': 'gateTimestamp',
		'filtroOrdenAnterior': '',
		'filtroOrdenReverse': false,
		'order': '',
		'itemsPerPage': 15
	};

	$scope.comprobantesRevisar = [];

	$scope.loadingRevisar = false;

	$scope.$on('cambioPagina', function(event, data){
		$scope.currentPage = data;
		$scope.model.estado = 'C';
		$scope.traerComprobantes();
	});

	$scope.$on('cambioFiltro', function(event, data){
		$scope.currentPage = 1;
		$scope.$broadcast('actualizarPagina', 1);
		$scope.model.estado = 'C';
		$scope.traerComprobantes();
	});

	$scope.$on('errorInesperado', function(e, mensaje){
		$scope.loadingRevisar = false;
		$scope.comprobantesRevisar = [];
		$scope.mensajeResultado = mensaje;
	});

	$scope.traerComprobantes = function(){
		$scope.loadingRevisar = true;
		$scope.page.skip = (($scope.currentPage - 1) * $scope.model.itemsPerPage);
		$scope.page.limit = $scope.model.itemsPerPage;
		$scope.comprobantesRevisar = [];
		invoiceFactory.getInvoice($scope.model, $scope.page, function(invoiceRevisar){
			if (invoiceRevisar.status == 'OK'){
				$scope.comprobantesRevisar = invoiceRevisar.data;
				$scope.totalItems = invoiceRevisar.totalCount;
			} else {
				$scope.mensajeResultado = {
					titulo: 'Error',
					mensaje: 'Se produjo un error al cargar los datos. Inténtelo nuevamente más tarde o comuníquese con el soporte técnico.',
					tipo: 'panel-danger'
				};
				$scope.comprobantesRevisar = [];
			}
			$scope.loadingRevisar = false;
		})
	};
}]);
