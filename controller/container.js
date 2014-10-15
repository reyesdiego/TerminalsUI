/**
 * Created by leo on 29/09/14.
 */
(function(){
	myapp.controller('containerCtrl', function($scope, $stateParams, invoiceFactory, gatesFactory, turnosFactory, controlPanelFactory){
		var page = { skip:0, limit: $scope.itemsPerPage };
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
		$scope.ocultarFiltrosInvoices = ['codComprobante', 'nroComprobante', 'razonSocial', 'fechaDesde', 'nroPtoVentaOrden', 'codTipoComprobOrden', 'nroComprobOrden', 'razonOrden', 'fechaOrden', 'importeOrden'];
		$scope.ocultarFiltrosGates = ['fechaOrden'];
		$scope.cargando = false;
		$scope.invoices = [];

		$scope.filtrado = function(filtro, contenido){
			switch (filtro){
				case 'contenedor':
					$scope.model.contenedor = contenido;
					break;
			}
			$scope.filtrar();
		};

		$scope.filtrar = function(){
			$scope.cargaComprobantes();
			$scope.cargaTasasCargas();
			$scope.cargaGates();
			$scope.cargaTurnos();
		};

		$scope.cargaComprobantes = function(page){
			page = page || { skip:0, limit: $scope.itemsPerPage };
			if (page.skip == 0){ $scope.currentPage = 1}
			invoiceFactory.getInvoice(cargaDatos(), page, function(data){
				if(data.status === 'OK'){
					$scope.invoices = data.data;
					$scope.invoicesTotalItems = data.totalCount;
				}
			});
		};

		$scope.cargaTasasCargas = function(){
			datos = { contenedor: $scope.model.contenedor, currency: $scope.moneda};
			controlPanelFactory.getTasasContenedor(datos, function(data){
				if(data.status === 'OK'){
					$scope.tasas = data.data;
					console.log(data);
				}
			});
		};

		$scope.cargaGates = function(page){
			page = page || { skip: 0, limit: $scope.itemsPerPage };
			if (page.skip == 0){ $scope.currentPage = 1}
			gatesFactory.getGate(cargaDatos(), page, function (data) {
				if (data.status === "OK") {
					$scope.gates = data.data;
					$scope.gatesTotalItems = data.totalCount;
				}
			});

		};

		$scope.cargaTurnos = function(page){
			page = page || { skip:0, limit: $scope.itemsPerPage };
			turnosFactory.getTurnos(cargaDatos(), page, function(data){
				if (data.status === "OK"){
					$scope.turnos = data.data;
					$scope.turnosTotalItems = data.totalCount;
				}
			});
		};

		$scope.containerSelected = function(selected){
			if (angular.isDefined(selected)){
				$scope.model.contenedor = selected.title;
				$scope.filtrar();
			}
		};

		function cargaDatos() {
			return {
				'contenedor':			$scope.model.contenedor
			};
		}

	});
})();