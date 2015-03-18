/**
 * Created by leo on 29/09/14.
 */

myapp.controller('containerCtrl', ['$scope', '$stateParams', 'invoiceFactory', 'gatesFactory', 'turnosFactory', 'controlPanelFactory', 'afipFactory', 'generalCache', function($scope, $stateParams, invoiceFactory, gatesFactory, turnosFactory, controlPanelFactory, afipFactory, generalCache){
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
		'order': ''
	};
	$scope.ocultarFiltros = ['nroPtoVenta', 'codTipoComprob', 'nroComprobante', 'razonSocial', 'documentoCliente', 'codigo', 'estado', 'itemsPerPage', 'fechaInicio', 'fechaFin', 'buque'];
	$scope.filtrosComprobantes = ['codTipoComprob', 'nroComprobante', 'razonSocial', 'fechaInicio', 'nroPtoVentaOrden', 'codTipoComprobOrden', 'nroComprobOrden', 'razonOrden', 'fechaOrden', 'importeOrden', 'codigo', 'contenedor', 'comprobantes', 'buque'];
	$scope.cargando = false;
	$scope.invoices = [];
	$scope.mensajeResultado = {
		titulo: 'Comprobantes',
		mensaje: 'No se encontraron comprobantes para los filtros seleccionados.',
		tipo: 'panel-info'
	};
	$scope.tasasConfigPanel = {
		tipo: 'panel-info',
		titulo: 'Tasas',
		mensaje: 'No se encontraron tasas para los filtros seleccionados.'
	};
	$scope.gatesConfigPanel = {
		tipo: 'panel-info',
		titulo: 'Gates',
		mensaje: 'No se encontraron gates para los filtros seleccionados.'
	};
	$scope.turnosConfigPanel = {
		tipo: 'panel-info',
		titulo: 'Turnos',
		mensaje: 'No se encontraron Turnos para los filtros seleccionados.'
	};
	$scope.sumariaConfigPanel = {
		tipo: 'panel-info',
		titulo: 'A.F.I.P. sumaria',
		mensaje: 'No se encontraron datos en los registros de A.F.I.P. para el contenedor seleccionado.'
	};

	$scope.volverAPrincipal = false;
	$scope.cargandoTasas = false;
	$scope.cargandoSumaria = false;
	$scope.hayError = false;

	$scope.$on('cambioFiltro', function(){
		$scope.volverAPrincipal = !$scope.volverAPrincipal;
		if ($scope.model.contenedor != ''){
			$scope.filtrar();
		} else {
			$scope.cargandoSumaria = false;
			$scope.invoices = [];
			$scope.tasas = [];
			$scope.gates = [];
			$scope.turnos = [];
			$scope.sumariaConfigPanel = {
				tipo: 'panel-info',
				titulo: 'A.F.I.P. sumaria',
				mensaje: 'No se encontraron datos en los registros de A.F.I.P. para el contenedor seleccionado.'
			};
			$scope.turnosConfigPanel = {
				tipo: 'panel-info',
				titulo: 'Turnos',
				mensaje: 'No se encontraron Turnos para los filtros seleccionados.'
			};
			$scope.gatesConfigPanel = {
				tipo: 'panel-info',
				titulo: 'Gates',
				mensaje: 'No se encontraron gates para los filtros seleccionados.'
			};
			$scope.tasasConfigPanel = {
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

	$scope.$on('errorInesperado', function(e, mensaje){
		$scope.hayError = true;
		$scope.mensajeGeneral = mensaje;
	});

	$scope.filtrar = function(){
		$scope.hayError = false;
		$scope.cargaComprobantes();
		$scope.cargaTasasCargas();
		$scope.cargaGates();
		$scope.cargaTurnos();
		$scope.cargaSumaria();
	};

	$scope.cargaComprobantes = function(page){
		$scope.cargando = true;
		$scope.mensajeResultado = {
			titulo: 'Comprobantes',
			mensaje: 'No se encontraron comprobantes para los filtros seleccionados.',
			tipo: 'panel-info'
		};
		page = page || { skip:0, limit: $scope.itemsPerPage };
		if (page.skip == 0){ $scope.currentPage = 1}
		invoiceFactory.getInvoice($scope.model, page, function(data){
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
			$scope.cargando = false;
		});
	};

	$scope.cargaTasasCargas = function(){
		if (angular.isDefined($scope.model.contenedor) && $scope.model.contenedor != ''){
			$scope.cargandoTasas = true;
			$scope.tasasConfigPanel = {
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
					$scope.tasasConfigPanel = {
						tipo: 'panel-danger',
						titulo: 'Tasas',
						mensaje: 'Se ha producido un error al cargar los datos de las tasas.'
					};
				}
				$scope.cargandoTasas = false;
			});
		}
	};

	$scope.cargaGates = function(page){
		$scope.cargandoGates = true;
		$scope.gatesConfigPanel = {
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
				$scope.gatesConfigPanel = {
					tipo: 'panel-danger',
					titulo: 'Gates',
					mensaje: 'Se ha producido un error al cargar los gates.'
				};
			}
			$scope.cargandoGates = false;
		});
	};

	$scope.cargaTurnos = function(page){
		$scope.cargandoTurnos = true;
		$scope.turnosConfigPanel = {
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
				$scope.turnosConfigPanel = {
					tipo: 'panel-danger',
					titulo: 'Turnos',
					mensaje: 'Se ha producido un error al cargar los turnos.'
				};
			}
			$scope.cargandoTurnos = false;
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

	$scope.$watch('moneda', function(){
		$scope.cargaTasasCargas();
	});

}]);
