/**
 * Created by artiom on 23/09/14.
 */
(function() {
	myapp.controller('tasaCargasCtrl', function($scope, invoiceFactory, gatesFactory, turnosFactory, afipFactory, loginService) {
		$scope.ocultarFiltros = ['nroPtoVenta', 'nroComprobante', 'codComprobante', 'documentoCliente', 'codigo', 'estado', 'buque', 'itemsPerPage'];

		$scope.ocultaTasas = true;
		$scope.loadingState = false;
		$scope.invoices = [];
		$scope.loadingInvoices = false;
		$scope.gates = [];
		$scope.loadingGates = false;
		$scope.turnos = [];
		$scope.loadingTurnos = false;
		$scope.tasas = [];
		$scope.loadingTasas = false;
		$scope.detalleGates = false;

		$scope.configPanelGates = {
			tipo: 'panel-info',
			titulo: 'Gates',
			mensaje: 'No se encontraron gates para los filtros seleccionados.'
		};
		$scope.configPanelTurnos = {
			tipo: 'panel-info',
			titulo: 'Turnos',
			mensaje: 'No se encontraron turnos para los filtros seleccionados.'
		};
		$scope.detalle = false;
		$scope.contenedorElegido = {};
		$scope.currentPageContainers = 1;
		$scope.itemsPerPage = 10;
		$scope.totalItems = 0;
		$scope.panelMensaje = {
			titulo: 'Buque - Viaje',
			mensaje: 'No se encontraron contenedores para los filtros seleccionados.',
			tipo: 'panel-info'
		};
		$scope.sumariaConfigPanel = {
			tipo: 'panel-info',
			titulo: 'A.F.I.P. sumaria',
			mensaje: 'No se encontraron datos de sumarias de A.F.I.P relacionados.'
		};

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

		$scope.tasaCargas = {
			"titulo":"Éxito",
			"cartel": "panel-success",
			"mensaje": "No se hallaron comprobantes sin tasa a las cargas.",
			"resultado": [],
			"mostrarResultado": 0
		};

		$scope.comprobantesVistosTasas = [];

		$scope.loadingTasaCargas = true;

		$scope.$on('cambioPagina', function(event, data){
			$scope.currentPage = data;
			$scope.controlTasaCargas();
		});

		$scope.$on('cambioFiltro', function(event, data){
			$scope.currentPage = 1;
			$scope.controlTasaCargas()
		});

		$scope.$on('errorSinTasaCargas', function(event, error){
			$scope.mensajeResultado = {
				titulo: 'Error',
				mensaje: 'Se produjo un error al cargar los datos. Inténtelo nuevamente más tarde o comuníquese con el soporte técnico.',
				tipo: 'panel-danger'
			};
			$scope.loadingTasaCargas = false;
		});

		$scope.filtrado = function(filtro, contenido){
			$scope.model[filtro] = contenido;
			if ($scope.model.contenedor != '') {
				$scope.contenedorElegido.contenedor = $scope.model.contenedor;
				$scope.loadingInvoices = true;
				$scope.invoices = [];
				$scope.loadingGates = true;
				$scope.gates = [];
				$scope.loadingTurnos = true;
				$scope.turnos = [];
				$scope.detalle = true;
				$scope.currentPageContainers = 1;
				$scope.cargaComprobantes();
				$scope.cargaGates();
				$scope.cargaTurnos();
				$scope.cargaSumaria();
			} else {
				$scope.loadingInvoices = false;
				$scope.loadingGates = false;
				$scope.loadingTurnos = false;
				$scope.detalle = false;
			}
		};

		$scope.containerSelected = function(selected){
			if (angular.isDefined(selected) && selected.title != $scope.model.contenedor){
				$scope.model.contenedor = selected.title;
				$scope.filtrado('contenedor', selected.title);
			}
		};

		$scope.cargaComprobantes = function(page){
			page = page || { skip:0, limit: $scope.itemsPerPage };
			if (page.skip == 0){ $scope.currentPage = 1}
			invoiceFactory.getInvoice($scope.model, page, function(data){
				if(data.status === 'OK'){
					$scope.invoices = data.data;
					$scope.invoicesTotalItems = data.totalCount;
				} else {
					//dialogs.error('Comprobantes', 'Se ha producido un error al cargar los datos de los comprobantes.');
					$scope.mensajeResultado = {
						titulo: 'Comprobantes',
						mensaje: 'Se ha producido un error al cargar los datos de los comprobantes.',
						tipo: 'panel-danger'
					}
				}
				$scope.loadingInvoices = false;
			});
		};

		$scope.cargaGates = function(page){
			page = page || { skip: 0, limit: $scope.itemsPerPage };
			if (page.skip == 0){ $scope.currentPage = 1}
			gatesFactory.getGate($scope.model, page, function (data) {
				if (data.status === "OK") {
					$scope.gates = data.data;
					$scope.gatesTotalItems = data.totalCount;
				} else  {
					//dialogs.error('Gates', 'Se ha producido un error al cargar los datos de los gates.')
					$scope.configPanelGates = {
						tipo: 'panel-danger',
						titulo: 'Gates',
						mensaje: 'Se ha producido un error al cargar los datos de los gates.'
					}
				}
				$scope.loadingGates = false;
			});
		};

		$scope.cargaTurnos = function(page){
			page = page || { skip:0, limit: $scope.itemsPerPage };
			turnosFactory.getTurnos($scope.model, page, function(data){
				if (data.status === "OK"){
					$scope.turnos = data.data;
					$scope.turnosTotalItems = data.totalCount;
				} else {
					//dialogs.error('Turnos', 'Se ha producido un error al cargar los datos de los turnos.');
					$scope.configPanelTurnos = {
						tipo: 'panel-danger',
						titulo: 'Turnos',
						mensaje: 'Se ha producido un error al cargar los datos de los turnos.'
					}
				}
				$scope.loadingTurnos = false;
			});
		};

		$scope.cargaSumaria = function(){
			$scope.cargandoSumaria = true;
			afipFactory.getContainerSumaria($scope.model.contenedor, function(data){
				if (data.status == 'OK'){
					$scope.sumariaAfip = data.data;
				} else {
					//dialogs.error('Sumaria', 'Se ha producido un error al cargar los datos de la sumaria del contenedor.');
					$scope.sumariaConfigPanel = {
						tipo: 'panel-danger',
						titulo: 'A.F.I.P. sumaria',
						mensaje: 'Se ha producido un error al cargar los datos de la sumaria de A.F.I.P.'
					}
				}
				$scope.cargandoSumaria = false;
			})
		};

		$scope.controlTasaCargas = function(){
			/*Acá control de tasa a las cargas*/
			$scope.loadingTasaCargas = true;
			$scope.page.skip = (($scope.currentPage - 1) * $scope.model.itemsPerPage);
			$scope.page.limit = $scope.model.itemsPerPage;
			invoiceFactory.getContainersSinTasaCargas($scope.model, loginService.getFiltro(), $scope.page, function(data){
				if (data.status == "ERROR"){
					$scope.tasaCargas.titulo = "Error";
					$scope.tasaCargas.cartel = "panel-danger";
					$scope.tasaCargas.mensaje = "La terminal seleccionada no tiene códigos asociados.";
					$scope.tasaCargas.mostrarResultado = 0;
				} else {
					$scope.tasaCargas.resultado = data.data;
					if ($scope.tasaCargas.resultado.length > 0){
						$scope.totalItems = data.totalCount;
						$scope.tasaCargas.titulo = "Error";
						$scope.tasaCargas.cartel = "panel-danger";
						$scope.tasaCargas.mensaje = "Se hallaron comprobantes sin tasa a las cargas.";
						$scope.tasaCargas.mostrarResultado = 1;
					} else {
						$scope.tasaCargas = {
							"titulo":"Éxito",
							"cartel": "panel-success",
							"mensaje": "No se hallaron comprobantes sin tasa a las cargas.",
							"resultado": [],
							"mostrarResultado": 0
						};
					}
				}
				$scope.loadingTasaCargas = false;
			});
		};
	});
})();