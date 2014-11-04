/**
 * Created by leo on 29/09/14.
 */
(function(){
	myapp.controller('containerCtrl', function($rootScope, $scope, $stateParams, invoiceFactory, gatesFactory, turnosFactory, controlPanelFactory){
		$scope.model = {
			'nroPtoVenta': '',
			'codTipoComprob': 0,
			'nroComprobante': '',
			'razonSocial': '',
			'documentoCliente': '',
			'fechaDesde': '',
			'fechaHasta': '',
			'contenedor': '',
			'buque': '',
			'estado': 'N',
			'codigo': '',
			'filtroOrden': 'gateTimestamp',
			'filtroOrdenAnterior': '',
			'filtroOrdenReverse': false,
			'order': ''
		};
		$scope.ocultarFiltros = ['fechaDesde', 'fechaHasta', 'buque'];
		$scope.filtrosComprobantes = ['codComprobante', 'nroComprobante', 'razonSocial', 'fechaDesde', 'nroPtoVentaOrden', 'codTipoComprobOrden', 'nroComprobOrden', 'razonOrden', 'fechaOrden', 'importeOrden', 'codigo', 'contenedor', 'comprobantes', 'buque'];
		$scope.cargando = false;
		$scope.invoices = [];
		$scope.turnosConfigPanel = {
			tipo: 'panel-info',
			titulo: 'Turnos'
		};

		$scope.$on('cambioFiltro', function(){
			if ($scope.model.contenedor != ''){
				$scope.filtrar();
			} else {
				$scope.invoices = [];
				$scope.tasas = [];
				$scope.gates = [];
				$scope.turnos = [];
			}
		});

		$scope.filtrar = function(){
			$scope.cargaComprobantes();
			$scope.cargaTasasCargas();
			$scope.cargaGates();
			$scope.cargaTurnos();
		};

		$scope.cargaComprobantes = function(page){
			page = page || { skip:0, limit: $scope.itemsPerPage };
			if (page.skip == 0){ $scope.currentPage = 1}
			invoiceFactory.getInvoice($scope.model, page, function(data){
				if(data.status === 'OK'){
					$scope.invoices = data.data;
					$scope.invoicesTotalItems = data.totalCount;
				}
			});
		};

		$scope.cargaTasasCargas = function(){
			var datos = { contenedor: $scope.model.contenedor, currency: $scope.moneda};
			controlPanelFactory.getTasasContenedor(datos, function(data){
				if (data.status === 'OK'){
					$scope.tasas = data.data;
					$scope.totalTasas = data.totalTasas;
				}
			});
		};

		$scope.cargaGates = function(page){
			page = page || { skip: 0, limit: $scope.itemsPerPage };
			if (page.skip == 0){ $scope.currentPage = 1}
			gatesFactory.getGate($scope.model, page, function (data) {
				if (data.status === "OK") {
					$scope.gates = data.data;
					$scope.gatesTotalItems = data.totalCount;
				}
			});
		};

		$scope.cargaTurnos = function(page){
			page = page || { skip:0, limit: $scope.itemsPerPage };
			turnosFactory.getTurnos($scope.model, page, function(data){
				if (data.status === "OK"){
					$scope.turnos = data.data;
					$scope.turnosTotalItems = data.totalCount;
				}
			});
		};

		$rootScope.$watch('moneda', function(){
			$scope.cargaTasasCargas();
		});

	});
})();