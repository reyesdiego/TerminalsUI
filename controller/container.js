/**
 * Created by leo on 29/09/14.
 */
myapp.controller('containerCtrl', function($rootScope, $scope, $stateParams, invoiceFactory, gatesFactory, turnosFactory, controlPanelFactory, afipFactory, dialogs){
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
		'viaje': '',
		'estado': 'N',
		'codigo': '',
		'filtroOrden': 'gateTimestamp',
		'filtroOrdenAnterior': '',
		'filtroOrdenReverse': false,
		'order': ''
	};
	$scope.ocultarFiltros = ['nroPtoVenta', 'codComprobante', 'nroComprobante', 'razonSocial', 'documentoCliente', 'codigo', 'estado', 'itemsPerPage', 'fechaDesde', 'fechaHasta', 'buque'];
	$scope.filtrosComprobantes = ['codComprobante', 'nroComprobante', 'razonSocial', 'fechaDesde', 'nroPtoVentaOrden', 'codTipoComprobOrden', 'nroComprobOrden', 'razonOrden', 'fechaOrden', 'importeOrden', 'codigo', 'contenedor', 'comprobantes', 'buque'];
	$scope.cargando = false;
	$scope.invoices = [];
	$scope.turnosConfigPanel = {
		tipo: 'panel-info',
		titulo: 'Turnos'
	};
	$scope.sumariaConfigPanel = {
		tipo: 'panel-info',
		titulo: 'A.F.I.P. sumaria'
	};

	$scope.cargandoTasas = false;
	$scope.cargandoSumaria = false;

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
		$scope.cargaSumaria();
	};

	$scope.cargaComprobantes = function(page){
		$scope.cargando = true;
		page = page || { skip:0, limit: $scope.itemsPerPage };
		if (page.skip == 0){ $scope.currentPage = 1}
		invoiceFactory.getInvoice($scope.model, page, function(data){
			if(data.status === 'OK'){
				$scope.invoices = data.data;
				$scope.invoicesTotalItems = data.totalCount;
			} else {
				dialogs.error('Comprobantes', 'Se ha producido un error al cargar los datos de los comprobantes.');
			}
			$scope.cargando = false;
		});
	};

	$scope.cargaTasasCargas = function(){
		if (angular.isDefined($scope.model.contenedor) && $scope.model.contenedor != ''){
			$scope.cargandoTasas = true;
			var datos = { contenedor: $scope.model.contenedor, currency: $scope.moneda};
			controlPanelFactory.getTasasContenedor(datos, function(data){
				if (data.status === 'OK'){
					$scope.tasas = data.data;
					$scope.totalTasas = data.totalTasas;
				} else {
					dialogs.error('Tasas', 'Se ha producido un error al cargar las tasas de los contenedores.');
				}
				$scope.cargandoTasas = false;
			});
		}
	};

	$scope.cargaGates = function(page){
		$scope.cargandoGates = true;
		page = page || { skip: 0, limit: $scope.itemsPerPage };
		if (page.skip == 0){ $scope.currentPage = 1}
		gatesFactory.getGate($scope.model, page, function (data) {
			if (data.status === "OK") {
				$scope.gates = data.data;
				$scope.gatesTotalItems = data.totalCount;
			} else {
				dialogs.error('Gates', 'Se ha producido un error al cargar los datos de los gates');
			}
			$scope.cargandoGates = false;
		});
	};

	$scope.cargaTurnos = function(page){
		$scope.cargandoTurnos = true;
		page = page || { skip:0, limit: $scope.itemsPerPage };
		turnosFactory.getTurnos($scope.model, page, function(data){
			if (data.status === "OK"){
				$scope.turnos = data.data;
				$scope.turnosTotalItems = data.totalCount;
			} else {
				dialogs.error('Turnos', 'Se ha producido un error al cargar los datos de los turnos.');
			}
			$scope.cargandoTurnos = false;
		});
	};

	$scope.cargaSumaria = function(){
		$scope.cargandoSumaria = true;
		afipFactory.getContainerSumaria($scope.model.contenedor, function(data){
			if (data.status == 'OK'){
				$scope.sumariaAfip = data.data;
			} else {
				dialogs.error('Sumaria', 'Se ha producido un error al cargar los datos de la sumaria del contenedor.');
			}
			$scope.cargandoSumaria = false;
		})
	};

	$rootScope.$watch('moneda', function(){
		$scope.cargaTasasCargas();
	});

});