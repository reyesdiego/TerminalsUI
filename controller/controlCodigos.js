/**
 * Created by artiom on 23/09/14.
 */
(function() {

	myapp.controller('codigosCtrl', function($scope, invoiceFactory, priceFactory, dialogs, $q) {
		$scope.ocultarFiltros = ['nroPtoVenta', 'nroComprobante', 'codTipoComprob', 'nroPtoVenta', 'documentoCliente', 'contenedor', 'codigo', 'razonSocial', 'estado', 'buque'];

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
			'filtroOrden': 'fecha.emision',
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

		$scope.codigosSinAsociar = {
			total: 0,
			codigos: []
		};
		$scope.comprobantesRotos = [];

		$scope.loadingControlCodigos = false;
		$scope.anteriorCargaCodigos = [];
		$scope.totalItemsSinFiltrar = 0;

		$scope.mostrarPtosVentas = false;

		$scope.$on('errorInesperado', function(){
			$scope.loadingControlCodigos = false;
			$scope.comprobantesRotos = [];
		});

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
				if ($scope.model.code != ''){
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
				if ($scope.model.code == ''){
					$scope.ocultarFiltros = ['nroPtoVenta', 'nroComprobante', 'codTipoComprob', 'nroPtoVenta', 'documentoCliente', 'contenedor', 'codigo', 'razonSocial', 'estado', 'buque'];
					$scope.controlFiltros = 'codigos';
					$scope.mostrarPtosVentas = false;
					$scope.controlDeCodigos();
				} else {
					$scope.controlCodigosFiltrados();
				}
			}
		});

		$scope.controlDeCodigos = function(){
			$scope.controlFiltros = 'codigos';
			$scope.loadingControlCodigos = true;
			$scope.hayFiltros = false;
			$scope.model.code = '';
			$scope.comprobantesRotos = [];
			$scope.pageCodigos.skip = (($scope.currentPageCodigos - 1) * $scope.model.itemsPerPage);
			$scope.pageCodigos.limit = $scope.model.itemsPerPage;
			priceFactory.noMatches($scope.model.fechaInicio, $scope.model.fechaFin, function(dataNoMatches){
				if (dataNoMatches.status == 'OK'){
					$scope.codigosSinAsociar.total = dataNoMatches.totalCount;
					$scope.codigosSinAsociar.codigos = dataNoMatches.data;
				} else {
					//dialogs.error('Control de códigos', 'Se ha producido un error al cargar los datos.');
					$scope.mensajeResultado = {
						titulo: 'Error',
						mensaje: 'Se produjo un error al cargar los datos. Inténtelo nuevamente más tarde o comuníquese con el soporte técnico.',
						tipo: 'panel-danger'
					};
					$scope.loadingControlCodigos = false;
				}
			});
			invoiceFactory.getInvoicesNoMatches($scope.model, $scope.pageCodigos, function(invoicesNoMatches){
				if (invoicesNoMatches.status == 'OK'){
					$scope.comprobantesRotos = invoicesNoMatches.data;
					$scope.totalItems = invoicesNoMatches.totalCount;
				} else {
					$scope.mensajeResultado = {
						titulo: 'Error',
						mensaje: 'Se produjo un error al cargar los datos. Inténtelo nuevamente más tarde o comuníquese con el soporte técnico.',
						tipo: 'panel-danger'
					};
				}
				$scope.loadingControlCodigos = false;
			});
		};

		$scope.controlCodigosFiltrados = function(){
			$scope.loadingControlCodigos = true;
			$scope.pageFiltros.skip = (($scope.currentPageFiltros - 1) * $scope.model.itemsPerPage);
			$scope.pageFiltros.limit = $scope.model.itemsPerPage;
			invoiceFactory.getInvoice($scope.model, $scope.pageFiltros, function(data){
				if (data.status == 'OK'){
					$scope.totalItems = data.totalCount;
					$scope.comprobantesRotos = data.data;
				} else {
					$scope.mensajeResultado = {
						titulo: 'Error',
						mensaje: 'Se produjo un error al cargar los datos. Inténtelo nuevamente más tarde o comuníquese con el soporte técnico.',
						tipo: 'panel-danger'
					};
				}
				$scope.loadingControlCodigos = false;
			});
		};

		$scope.pageChangedCodigos = function(){
			$scope.loadingControlCodigos = true;
			$scope.comprobantesRotos = [];
			$scope.pageCodigos.skip = (($scope.currentPageCodigos - 1) * $scope.model.itemsPerPage);
			$scope.pageCodigos.limit = $scope.model.itemsPerPage;
			invoiceFactory.getInvoicesNoMatches($scope.model, $scope.pageCodigos, function(data){
				if (data.status == 'OK'){
					$scope.comprobantesRotos = data.data;
					$scope.totalItems = data.totalCount;
				} else {
					$scope.mensajeResultado = {
						titulo: 'Error',
						mensaje: 'Se produjo un error al cargar los datos. Inténtelo nuevamente más tarde o comuníquese con el soporte técnico.',
						tipo: 'panel-danger'
					};
				}
				$scope.loadingControlCodigos = false;
			});
		};

	});

})();