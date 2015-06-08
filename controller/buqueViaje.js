/**
 * Created by artiom on 08/04/15.
 */

myapp.controller('buqueViajeCtrl', ['$rootScope', '$scope', 'invoiceFactory', 'controlPanelFactory', 'gatesFactory', 'turnosFactory', 'afipFactory', 'dialogs', 'generalCache', function($rootScope, $scope, invoiceFactory, controlPanelFactory, gatesFactory, turnosFactory, afipFactory, dialogs, generalCache){
	////// Para containers /////////////
	$scope.model = {
		'nroPtoVenta': '',
		'codTipoComprob': 0,
		'nroComprobante': '',
		'razonSocial': '',
		'documentoCliente': '',
		'fechaInicio': '',
		'fechaFin': '',
		'contenedor': '',
		'buqueNombre': '',
		'viaje': '',
		'estado': 'N',
		'code': '',
		'filtroOrden': 'gateTimestamp',
		'filtroOrdenAnterior': '',
		'filtroOrdenReverse': false,
		'order': '',
		'itemsPerPage': 15
	};
	//////////////////////////////////////

	$scope.pageComprobantes = {
		skip: 0,
		limit: $scope.model.itemsPerPage
	};

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
	$scope.volverAPrincipal = false;
	$scope.ocultarFiltros = ['nroPtoVenta', 'codTipoComprob', 'nroComprobante', 'razonSocial', 'documentoCliente', 'codigo', 'estado', 'itemsPerPage', 'fechaInicio', 'fechaFin', 'buque'];
	$scope.filtrosComprobantes = ['codTipoComprob', 'nroComprobante', 'razonSocial', 'fechaInicio', 'nroPtoVentaOrden', 'codTipoComprobOrden', 'nroComprobOrden', 'razonOrden', 'fechaOrden', 'importeOrden', 'codigo', 'contenedor', 'comprobantes', 'buque'];
	$scope.mensajeResultado = $rootScope.mensajeResultado;
	$scope.configPanelTasas = {
		tipo: 'panel-info',
		titulo: 'Tasas a las cargas',
		mensaje: 'No se encontraron tasas a las cargas para los filtros seleccionados.'
	};
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
	$scope.contenedorElegido = {
		contenedor: ''
	};
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

	$scope.buques = generalCache.get('buques');
	$scope.buqueElegido = {
		viajes:[]
	};
	$scope.datosContainers = [];
	$scope.loadingState = false;
	$scope.cargandoSumaria = false;
	$scope.moneda = $rootScope.moneda;
	$scope.search = '';
	$scope.filtrarDesde = 0;
	$scope.mostrarAnterior = false;

	$scope.mostrarMenosViajes = function(){
		$scope.filtrarDesde -= 5;
		if ($scope.filtrarDesde == 0){
			$scope.mostrarAnterior = false;
		}
	};

	$scope.mostrarMasViajes = function(){
		$scope.filtrarDesde += 5;
		$scope.mostrarAnterior = true;
	};

	$scope.$on('cambioPagina', function(event, data){
		$scope.currentPage = data;
		$scope.cargaComprobantes();
	});

	////// Para containers ////////////////////////////////////////////////////////////////////////////////
	$scope.$on('cambioFiltro', function(){
		$scope.volverAPrincipal = !$scope.volverAPrincipal;
		if ($scope.model.contenedor != ''){
			$scope.filtrar();
		} else {
			$scope.invoices = [];
			$scope.tasas = [];
			$scope.gates = [];
			$scope.turnos = [];
			$scope.sumariaConfigPanel = {
				tipo: 'panel-info',
				titulo: 'A.F.I.P. sumaria',
				mensaje: 'No se encontraron datos en los registros de A.F.I.P. para el contenedor seleccionado.'
			};
			$scope.configPanelTurnos = {
				tipo: 'panel-info',
				titulo: 'Turnos',
				mensaje: 'No se encontraron Turnos para los filtros seleccionados.'
			};
			$scope.configPanelGates = {
				tipo: 'panel-info',
				titulo: 'Gates',
				mensaje: 'No se encontraron gates para los filtros seleccionados.'
			};
			$scope.configPanelTasas = {
				tipo: 'panel-info',
				titulo: 'Tasas',
				mensaje: 'No se encontraron tasas para los filtros seleccionados.'
			};
			$scope.mensajeResultado = {
				titulo: 'Comprobantes',
				mensaje: 'No se encontraron comprobantes para los filtros seleccionados.',
				tipo: 'panel-info'
			};
		}
	});
	///////////////////////////////////////////////////////////////////////////////////////

	$scope.$on('errorInesperado', function(e, mensaje){
		$scope.loadingState = false;
		$scope.panelMensaje = mensaje;
		$scope.totalItems = 0;
		$scope.datosContainers = [];
		//// Para containers /////
		$scope.hayError = true;
		$scope.mensajeGeneral = mensaje;
		///////////////////////////////
	});

	$scope.$on('cambioOrden', function(event, data){
		$scope.cargaComprobantes();
	});

	$scope.buqueSelected = function(selected){
		$scope.buqueElegido.elegido = '';
		selected.elegido = 'bg-info';
		$scope.buqueElegido = selected;
		$scope.buqueElegido.viajes[0].active = true;
		$scope.model.buqueNombre = selected.buque;
		$scope.model.viaje = selected.viajes[0].viaje;
		$scope.traerResultados();
	};

	$scope.filtrado = function(filtro, contenido){
		$scope.loadingState = true;
		$scope.currentPageContainers = 1;
		$scope.model.contenedor = '';
		var cargar = true;
		switch (filtro){
			case 'buque':
				if (contenido == '') {
					$scope.model = {
						buqueNombre: '',
						viaje: ''
					};
					$scope.datosContainers = [];
					$scope.buqueElegido = {};
					$scope.loadingState = false;
					cargar = false;
				} else {
					$scope.model.buqueNombre = contenido;
				}
				break;
			case 'viaje':
				$scope.model.viaje = contenido;
				break;
		}
		if (cargar){
			$scope.traerResultados();
		}
	};

	$scope.traerResultados = function(){
		$scope.detalle = false;
		$scope.loadingState = true;
		$scope.datosContainers = [];
		invoiceFactory.getShipContainers($scope.model, function(data){
			if (data.status == 'OK'){
				$scope.datosContainers = data.data;
				$scope.totalItems = $scope.datosContainers.length;
			} else {
				$scope.panelMensaje = {
					titulo: 'Buque - Viaje',
					mensaje: 'Se ha producido un error al cargar los datos.',
					tipo: 'panel-danger'
				};
			}
			$scope.loadingState = false;
		});
	};

	$scope.filtrar = function(){
		$scope.hayError = false;
		$scope.cargaComprobantes();
		$scope.cargaTasasCargas();
		$scope.cargaGates();
		$scope.cargaTurnos();
		$scope.cargaSumaria();
	};

	$scope.verDetalles = function(contenedor){
		$scope.volverAPrincipal = !$scope.volverAPrincipal;
		$scope.invoices = [];
		$scope.gates = [];
		$scope.turnos = [];
		$scope.tasas = [];
		$scope.detalle = true;
		$scope.contenedorElegido = contenedor;
		$scope.model.contenedor = contenedor.contenedor;
		$scope.filtrar();
	};

	$scope.cargaComprobantes = function(){
		$scope.loadingInvoices = true;
		$scope.mensajeResultado = {
			titulo: 'Comprobantes',
			mensaje: 'No se encontraron comprobantes para los filtros seleccionados.',
			tipo: 'panel-info'
		};
		$scope.pageComprobantes.skip = (($scope.currentPage - 1) * $scope.model.itemsPerPage);
		$scope.pageComprobantes.limit = $scope.model.itemsPerPage;
		invoiceFactory.getInvoice($scope.model, $scope.pageComprobantes, function(data){
			if(data.status === 'OK'){
				$scope.invoices = data.data;
				$scope.invoicesTotalItems = data.totalCount;
			} else {
				$scope.mensajeResultado = {
					titulo: 'Comprobantes',
					mensaje: 'Se ha producido un error al cargar los datos de los comprobantes.',
					tipo: 'panel-danger'
				};
			}
			$scope.loadingInvoices = false;
		});
	};

	$scope.cargaTasasCargas = function(){
		if (angular.isDefined($scope.model.contenedor) && $scope.model.contenedor != ''){
			$scope.loadingTasas = true;
			$scope.configPanelTasas = {
				tipo: 'panel-info',
				titulo: 'Tasas',
				mensaje: 'No se encontraron tasas para los filtros seleccionados.'
			};
			var datos = { contenedor: $scope.model.contenedor, currency: $scope.moneda};
			controlPanelFactory.getTasasContenedor(datos, function(data){
				if (data.status === 'OK'){
					$scope.tasas = data.data;
					$scope.totalTasas = data.totalTasas;
				} else {
					$scope.configPanelTasas = {
						tipo: 'panel-danger',
						titulo: 'Tasas',
						mensaje: 'Se ha producido un error al cargar los datos de las tasas.'
					};
				}
				$scope.loadingTasas = false;
			});
		}
	};

	$scope.cargaGates = function(page){
		$scope.loadingGates = true;
		$scope.configPanelGates = {
			tipo: 'panel-info',
			titulo: 'Gates',
			mensaje: 'No se encontraron gates para los filtros seleccionados.'
		};
		page = page || { skip: 0, limit: $scope.itemsPerPage };
		if (page.skip == 0){ $scope.currentPage = 1}
		gatesFactory.getGate($scope.model, page, function (data) {
			if (data.status === "OK") {
				$scope.gates = data.data;
				$scope.gatesTotalItems = data.totalCount;
			} else {
				$scope.configPanelGates = {
					tipo: 'panel-danger',
					titulo: 'Gates',
					mensaje: 'Se ha producido un error al cargar los gates.'
				};
			}
			$scope.loadingGates = false;
		});
	};

	$scope.cargaTurnos = function(page){
		$scope.loadingTurnos = true;
		$scope.configPanelTurnos = {
			tipo: 'panel-info',
			titulo: 'Turnos',
			mensaje: 'No se encontraron Turnos para los filtros seleccionados.'
		};
		page = page || { skip:0, limit: $scope.itemsPerPage };
		turnosFactory.getTurnos($scope.model, page, function(data){
			if (data.status === "OK"){
				$scope.turnos = data.data;
				$scope.turnosTotalItems = data.totalCount;
			} else {
				$scope.configPanelTurnos = {
					tipo: 'panel-danger',
					titulo: 'Turnos',
					mensaje: 'Se ha producido un error al cargar los turnos.'
				};
			}
			$scope.loadingTurnos = false;
		});
	};

	$scope.cargaSumaria = function(){
		$scope.cargandoSumaria = true;
		$scope.sumariaConfigPanel = {
			tipo: 'panel-info',
			titulo: 'A.F.I.P. sumaria',
			mensaje: 'No se encontraron datos en los registros de A.F.I.P. para el contenedor seleccionado.'
		};
		afipFactory.getContainerSumaria($scope.model.contenedor, function(data){
			if (data.status == 'OK'){
				$scope.sumariaAfip = data.data;
			} else {
				$scope.sumariaConfigPanel = {
					tipo: 'panel-danger',
					titulo: 'A.F.I.P. sumaria',
					mensaje: 'Se ha producido un error al cargar los datos de la sumaria del contenedor.'
				};
			}
			$scope.cargandoSumaria = false;
		})
	};

	$rootScope.$watch('moneda', function(){
		$scope.moneda = $rootScope.moneda;
		if ($scope.detalle){
			$scope.cargaTasasCargas();
		}
	});

}]);
