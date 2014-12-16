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
			'viaje': '',
			'estado': 'N',
			'codigo': '',
			'filtroOrden': 'gateTimestamp',
			'filtroOrdenAnterior': '',
			'filtroOrdenReverse': false,
			'order': '',
			'itemsPerPage': 15
		};

		$scope.invoices = [];

		$scope.nombre = loginService.getFiltro();

		$scope.cargando = true;

		$scope.$on('cambioPagina', function(event, data){
			$scope.currentPage = data;
			$scope.cargaDatos();
		});

		$scope.$on('cambioFiltro', function(event, data){
			$scope.currentPage = 1;
			$scope.cargaDatos();
		});

		$scope.$on('errorInesperado', function(){
			$scope.cargando = false;
			$scope.invoices = [];
		});

		$scope.$on('errorDatos', function(){
			$scope.mensajeResultado = {
				titulo: 'Error',
				mensaje: 'Se produjo un error al cargar los datos. Inténtelo nuevamente más tarde o comuníquese con el soporte técnico.',
				tipo: 'panel-danger'
			};
			$scope.invoices = [];
			$scope.cargando = false;
		});

		$scope.cargaDatos = function(){
			$scope.cargando = true;
			$scope.page.skip = (($scope.currentPage - 1) * $scope.model.itemsPerPage);
			$scope.page.limit = $scope.model.itemsPerPage;
			$scope.invoices = [];
			invoiceFactory.getInvoice($scope.model, $scope.page, function(data){
				if(data.status === 'OK'){
					$scope.invoices = data.data;
					$scope.totalItems = data.totalCount;
					$scope.cargando = false;
				}
			});
		};

	});

})();