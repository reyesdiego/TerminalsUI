/**
 * Created by artiom on 23/09/14.
 */
(function() {
	myapp.controller('codigosCtrl', function($scope, invoiceFactory, priceFactory, dialogs, $q) {
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
			'filtroOrden': 'fecha.emision',
			'filtroOrdenAnterior': '',
			'filtroOrdenReverse': false,
			'order': '',
			'itemsPerPage': 15
		};

		$scope.currentPageCodigos = 1;
		$scope.totalItemsCodigos = 0;
		$scope.pageCodigos = {
			skip: 0,
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

		$scope.mostrarPtosVentas = true;

		$scope.$on('cambioPagina', function(event, data){
			$scope.currentPageCodigos = data;
			$scope.pageChangedCodigos();
		});

		$scope.$on('cambioFiltro', function(event, data){
			$scope.currentPageCodigos = 1;
			$scope.model = data;
			$scope.controlDeCodigos();
		});

		$scope.controlDeCodigos = function(){
			$scope.loadingControlCodigos = true;
			$scope.comprobantesRotos = [];
			$scope.pageCodigos.skip = (($scope.currentPageCodigos - 1) * $scope.model.itemsPerPage);
			$scope.pageCodigos.limit = $scope.model.itemsPerPage;
			priceFactory.noMatches($scope.model.fechaDesde, $scope.model.fechaHasta, function(dataNoMatches){
				if (dataNoMatches.status == 'OK'){
					$scope.codigosSinAsociar.total = dataNoMatches.totalCount;
					$scope.codigosSinAsociar.codigos = dataNoMatches.data;
				} else {
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

		$scope.pageChangedCodigos = function(){
			$scope.loadingControlCodigos = true;
			$scope.comprobantesRotos = [];
			$scope.pageCodigos.skip = (($scope.currentPageCodigos - 1) * $scope.model.itemsPerPage);
			$scope.pageCodigos.limit = $scope.model.itemsPerPage;
			invoiceFactory.getInvoicesNoMatches($scope.model, $scope.pageCodigos, function(data){
				if (data.status == 'OK'){
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

	});
})();