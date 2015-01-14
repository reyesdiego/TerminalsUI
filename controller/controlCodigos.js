/**
 * Created by artiom on 23/09/14.
 */

function codigosCtrl($scope, invoiceFactory, priceFactory){

	$scope.ocultarFiltros = ['nroPtoVenta', 'nroComprobante', 'codComprobante', 'nroPtoVenta', 'documentoCliente', 'contenedor', 'codigo', 'razonSocial', 'estado', 'buque'];

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

	$scope.controlFiltros = 'codigos';
	$scope.hayFiltros = false;

	$scope.currentPageCodigos = 1;
	$scope.totalItemsCodigos = 0;
	$scope.pageCodigos = {
		skip: 0,
		limit: $scope.model.itemsPerPage
	};

	$scope.currentPageFiltros = 1;
	$scope.totalItemsFiltros = 0;
	$scope.pageFiltros = {
		skip:0,
		limit: $scope.model.itemsPerPage
	};

	$scope.codigosSinAsociar = [];
	$scope.comprobantesRotos = [];

	$scope.loadingControlCodigos = false;
	$scope.anteriorCargaCodigos = [];
	$scope.totalItemsSinFiltrar = 0;

	$scope.mostrarPtosVentas = false;

	$scope.$on('cambioPagina', function(event, data){
		if ($scope.controlFiltros == 'codigos'){
			$scope.currentPageCodigos = data;
			$scope.pageChangedCodigos();
		} else {
			$scope.currentPageFiltros = data;
			$scope.controlCodigosFiltrados();
		}
	});

	$scope.$on('cambioFiltro', function(event, data){
		$scope.currentPageCodigos = 1;
		$scope.currentPageFiltros = 1;
		$scope.model = data;
		if ($scope.controlFiltros == 'codigos'){
			if ($scope.model.codigo != ''){
				$scope.controlFiltros = 'filtros';
				$scope.ocultarFiltros = ['nroPtoVenta'];
				$scope.anteriorCargaCodigos = $scope.comprobantesRotos;
				$scope.totalItemsSinFiltrar = $scope.totalItems;
				$scope.mostrarPtosVentas = true;
				$scope.controlCodigosFiltrados();
			} else {
				$scope.controlDeCodigos();
			}
		} else {
			if ($scope.model.codigo == ''){
				$scope.ocultarFiltros = ['nroPtoVenta', 'nroComprobante', 'codComprobante', 'nroPtoVenta', 'documentoCliente', 'contenedor', 'codigo', 'razonSocial', 'estado', 'buque'];
				$scope.controlFiltros = 'codigos';
				$scope.mostrarPtosVentas = false;
				$scope.controlDeCodigos()
			} else {
				$scope.controlCodigosFiltrados();
			}
		}
	});

	$scope.$on('errorDatos', function(){
		$scope.mensajeResultado = {
			titulo: 'Error',
			mensaje: 'Se produjo un error al cargar los datos. Inténtelo nuevamente más tarde o comuníquese con el soporte técnico.',
			tipo: 'panel-danger'
		};
		$scope.loadingControlCodigos = false;
	});

	$scope.controlDeCodigos = function(){
		$scope.controlFiltros = 'codigos';
		$scope.loadingControlCodigos = true;
		$scope.hayFiltros = false;
		$scope.model.codigo = '';
		$scope.comprobantesRotos = [];
		$scope.pageCodigos.skip = (($scope.currentPageCodigos - 1) * $scope.model.itemsPerPage);
		$scope.pageCodigos.limit = $scope.model.itemsPerPage;
		priceFactory.noMatches($scope.model.fechaDesde, $scope.model.fechaHasta, function(dataNoMatches){
			$scope.codigosSinAsociar = dataNoMatches.data;
			if ($scope.codigosSinAsociar.length > 0){
				invoiceFactory.getInvoicesNoMatches($scope.model, $scope.pageCodigos, function(invoicesNoMatches){
					if (invoicesNoMatches.data != null){
						invoicesNoMatches.data.forEach(function(unComprobante){
							invoiceFactory.invoiceById(unComprobante._id._id, function(realData){
								$scope.comprobantesRotos.push(realData);
							});
						});
						$scope.totalItems = invoicesNoMatches.totalCount;
						$scope.loadingControlCodigos = false;
					}
				});
			} else {
				$scope.totalItems = 0;
				$scope.loadingControlCodigos = false;
			}
		});
	};

	$scope.controlCodigosFiltrados = function(){
		$scope.loadingControlCodigos = true;
		$scope.pageFiltros.skip = (($scope.currentPageFiltros - 1) * $scope.model.itemsPerPage);
		$scope.pageFiltros.limit = $scope.model.itemsPerPage;
		invoiceFactory.getInvoice($scope.model, $scope.pageFiltros, function(data){
			$scope.totalItems = data.totalCount;
			$scope.comprobantesRotos = data.data;
			$scope.loadingControlCodigos = false;
		});
	};

	$scope.pageChangedCodigos = function(){
		$scope.loadingControlCodigos = true;
		$scope.comprobantesRotos = [];
		$scope.pageCodigos.skip = (($scope.currentPageCodigos - 1) * $scope.model.itemsPerPage);
		$scope.pageCodigos.limit = $scope.model.itemsPerPage;
		invoiceFactory.getInvoicesNoMatches($scope.model, $scope.pageCodigos, function(data){
			data.data.forEach(function(unComprobante){
				invoiceFactory.invoiceById(unComprobante._id._id, function(realData){
					$scope.comprobantesRotos.push(realData);
				});
				$scope.loadingControlCodigos = false;
			});
		});
	};

}
