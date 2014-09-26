/**
 * Created by Diego Reyes on 2/3/14.
*/
(function(){
	myapp.controller('invoicesCtrl', function($scope, invoiceFactory, loginService){

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
			'estado': 'N',
			'codigo': '',
			'filtroOrden': 'gateTimestamp',
			'filtroOrdenAnterior': '',
			'filtroOrdenReverse': false,
			'order': ''
		};

		$scope.invoices = [];

		$scope.nombre = loginService.getFiltro();

		$scope.cargando = true;

		$scope.$on('cambioPagina', function(event, data){
			$scope.currentPage = data;
			$scope.cargaFacturas();
		});

		$scope.$on('cambioFiltro', function(event, data){
			$scope.currentPage = 1;
			$scope.model = data;
			$scope.cargaFacturas();
		});

		$scope.cargaFacturas = function(){
			$scope.page.skip = (($scope.currentPage - 1) * $scope.itemsPerPage);
			$scope.cargando = true;
			invoiceFactory.getInvoice($scope.model, $scope.page, function(data){
				if(data.status === 'OK'){
					$scope.invoices = data.data;
					$scope.totalItems = data.totalCount;
					$scope.cargando = false;
				}
			});
		};

	});

	myapp.controller('invoicesResultCtrl', function ($rootScope, $scope, $stateParams, invoiceFactory) {


		$scope.consultaComprobantePorId = function(){
			invoiceFactory.invoiceById($stateParams.idComprobante, function(callback){
				$scope.verDetalle = callback;
			});
		};

		if(angular.isDefined($rootScope.itemsDescriptionInvoices)){
			$scope.consultaComprobantePorId()
		}

		$rootScope.$on('itemsDescriptionLoad', function(){
			$scope.consultaComprobantePorId();
		});

	});
})();