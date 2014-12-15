/**
 * Created by artiom on 24/09/14.
 */

function comprobantesRevisarCtrl($scope, invoiceFactory){

	$scope.ocultarFiltros = ['nroPtoVenta', 'estado'];

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
		'order': ''
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
		$scope.model.estado = 'C';
		$scope.traerComprobantes();
	});

	$scope.$on('errorDatos', function(){
		$scope.mensajeResultado = {
			titulo: 'Error',
			mensaje: 'Se produjo un error al cargar los datos. Inténtelo nuevamente más tarde o comuníquese con el soporte técnico.',
			tipo: 'panel-danger'
		};
		$scope.comprobantesRevisar = [];
		$scope.loadingRevisar = false;
	});

	$scope.traerComprobantes = function(){
		$scope.loadingRevisar = true;
		$scope.page.skip = (($scope.currentPage - 1) * $scope.itemsPerPage);
		$scope.comprobantesRevisar = [];
		invoiceFactory.getInvoice($scope.model, $scope.page, function(invoiceRevisar){
			$scope.comprobantesRevisar = invoiceRevisar.data;
			$scope.totalItems = invoiceRevisar.totalCount;
			$scope.loadingRevisar = false;
		})
	};

}