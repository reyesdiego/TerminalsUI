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
		'fechaDesde': $scope.desde,
		'fechaHasta': $scope.hasta,
		'contenedor': '',
		'estado': 'Y',
		'codigo': '',
		'order': '',
		'buque': ''
	};

	$scope.comprobantesRevisar = [];

	$scope.loadingRevisar = false;

	$scope.$on('cambioPagina', function(event, data){
		$scope.currentPage = data;
		$scope.model.estado = 'R';
		$scope.traerComprobantes();
	});

	$scope.$on('cambioFiltro', function(event, data){
		$scope.currentPage = 1;
		$scope.model = data;
		$scope.model.estado = 'R';
		$scope.traerComprobantes();
	});

	$scope.traerComprobantes = function(){
		$scope.page.skip = (($scope.currentPage - 1) * $scope.itemsPerPage);
		$scope.loadingRevisar = true;
		invoiceFactory.getInvoice($scope.model, $scope.page, function(invoiceRevisar){
			console.log(invoiceRevisar);
			$scope.comprobantesRevisar = invoiceRevisar.data;
			$scope.totalItems = invoiceRevisar.totalCount;
			$scope.loadingRevisar = false;
		})
	};

}