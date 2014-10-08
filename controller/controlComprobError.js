/**
 * Created by artiom on 24/09/14.
 */

function comprobantesErrorCtrl($scope, invoiceFactory){

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
		'estado': 'R',
		'codigo': '',
		'order': '',
		'buque': ''
	};

	$scope.comprobantesError = [];

	$scope.loadingError = false;

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

	$scope.$on('errorDatos', function(){
		$scope.mensajeResultado = {
			titulo: 'Error',
			mensaje: 'Se produjo un error al cargar los datos. Inténtelo nuevamente más tarde o comuníquese con el soporte técnico.',
			tipo: 'panel-danger'
		};
		$scope.loadingError = false;
	});

	$scope.traerComprobantes = function(){
		$scope.page.skip = (($scope.currentPage - 1) * $scope.itemsPerPage);
		$scope.loadingError = true;
		invoiceFactory.getInvoice($scope.model, $scope.page, function(invoiceError){
			$scope.comprobantesError = invoiceError.data;
			$scope.totalItems = invoiceError.totalCount;
			$scope.loadingError = false;
		})
	};

}