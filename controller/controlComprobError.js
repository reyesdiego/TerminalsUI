/**
 * Created by artiom on 24/09/14.
 */

function comprobantesErrorCtrl($scope, invoiceFactory){

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
		'order': ''
	};

	$scope.comprobantesError = [];

	$scope.loadingError = false;

	$scope.$on('cambioPagina', function(event, data){
		$scope.currentPage = data;
		//$scope.model.estado = 'R,T';
		$scope.traerComprobantes();
	});

	$scope.$on('cambioFiltro', function(event, data){
		$scope.currentPage = 1;
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
		invoiceFactory.getInvoice($scope.procesarModel(), $scope.page, function(invoiceError){
			$scope.comprobantesError = invoiceError.data;
			$scope.totalItems = invoiceError.totalCount;
			$scope.loadingError = false;
		})
	};

	$scope.procesarModel = function(){
		var data = angular.copy($scope.model);
		if (data.estado != 'R' && data.estado != 'T')
			data.estado = 'R,T';
		return data;
	};

}