/**
 * Created by artiom on 13/07/15.
 */
myapp.controller('liquidacionesCtrl', ['$rootScope', '$scope', 'liquidacionesFactory', 'loginService', 'dialogs', 'generalFunctions', 'invoiceService',
	function($rootScope, $scope, liquidacionesFactory, loginService, dialogs, generalFunctions, invoiceService){

		$scope.ocultarFiltros = ['nroPtoVenta', 'nroComprobante', 'codTipoComprob', 'nroPtoVenta', 'documentoCliente', 'contenedor', 'codigo', 'razonSocial', 'estado', 'buque', 'viaje', 'btnBuscar', 'fechaInicio'];
		$scope.ocultarFiltrosSinLiquidar = ['liquidacion'];
		$scope.ocultarFiltrosLiquidaciones = ['nroComprobante', 'codTipoComprob', 'razonSocial'];

		$scope.panelMensajeSinLiquidar = {
			titulo: 'Liquidaciones',
			mensaje: 'No se encontraron comprobantes pendientes a liquidar para los filtros seleccionados.',
			tipo: 'panel-info'
		};

		$scope.panelMensajePreLiquidaciones = {
			titulo: 'Liquidaciones',
			mensaje: 'No se encontraron liquidaciones realizadas para los filtros seleccionados.',
			tipo: 'panel-info'
		};

		$scope.model = {
			'fechaInicio': $scope.fechaInicio,
			'fechaFin': $scope.fechaFin,
			'liquidacion': '',
			'itemsPerPage': 15,
			'filtroOrden': 'fecha.emision',
			'filtroOrdenAnterior': '',
			'filtroOrdenReverse': false,
			'order': '',
			'modo': 'sinLiquidar'
		};

		$scope.modelLiquidaciones = {
			'fechaInicio': $scope.fechaInicio,
			'fechaFin': $scope.fechaFin,
			'liquidacion': '',
			'itemsPerPage': 15,
			'filtroOrden': 'fecha.emision',
			'filtroOrdenAnterior': '',
			'filtroOrdenReverse': false,
			'order': '',
			'modo': 'liquidaciones'
		};

		$scope.acceso = $rootScope.esUsuario;

		$scope.ocultarLiquidacion = true;

		$scope.cargandoSinLiquidar = false;
		$scope.cargandoLiquidaciones = false;
		$scope.cargandoLiquidados = false;

		$scope.modo = 'sinLiquidar';

		$scope.comprobantesLiquidar = [];
		$scope.datosInvoices = [];
		$scope.auxDatos = [];
		$scope.comprobantesControlados = [];

		$scope.itemsPerPage = 15;
		$scope.totalSinLiquidar = 0;
		$scope.totalLiquidadas = 0;
		$scope.totalLiquidaciones = 0;

		$scope.currentPageSinLiquidar = 1;
		$scope.paginacion = {
			liquidadas: 1
		};
		$scope.currentPageLiquidaciones = 1;

		$scope.page = {
			skip: 0,
			limit: $scope.itemsPerPage
		};

		$scope.liquidadas = false;
		$scope.panelMensaje = $scope.panelMensajeSinLiquidar;

		$scope.comprobantesVistos = [];
		$scope.mostrarResultado = false;
		$scope.verDetalleLiquidacion = false;

		$scope.preliquidacionSelected = false;
		$scope.detallePreLiquidacion = {
			tons: 0,
			total: 0
		};
		$scope.detalleComprobante = '';

		$scope.$on('cambioPagina', function(ev, data){
			if ($scope.modo == 'sinLiquidar'){
				$scope.currentPageSinLiquidar = data;
			} else {
				$scope.currentPageLiquidaciones = data;
			}
			$scope.page.skip = (data - 1) * $scope.itemsPerPage;
			$scope.cargarDatos();
		});

		$scope.$on('cambioFiltro', function(ev, data){
			if (data.modo == 'sinLiquidar'){
				$scope.cargarSinLiquidar();
			} else {
				$scope.cargarLiquidaciones();
			}
		});

		$scope.cambiarModo = function(modo){
			if (modo != $scope.modo){
				if ($scope.mostrarResultado) $scope.ocultarResultado($scope.verDetalle);
				$scope.verDetalleLiquidacion = false;
				$scope.modo = modo;
				$scope.page.skip = (modo == 'sinLiquidar') ? ($scope.currentPageSinLiquidar - 1) * $scope.itemsPerPage : ($scope.currentPageLiquidaciones - 1) * $scope.itemsPerPage;
				$scope.cargarDatos();
			}
		};

		$scope.cargarSinLiquidar = function(){
			$scope.cargandoSinLiquidar = true;
			liquidacionesFactory.getComprobantesLiquidar($scope.page, $scope.model, function(data){
				if (data.status == 'OK'){
					$scope.comprobantesLiquidar = data.data;
					$scope.totalSinLiquidar = data.totalCount;
					if ($scope.totalSinLiquidar == 0) {
						$scope.panelMensajeSinLiquidar = {
							titulo: 'Liquidaciones',
							mensaje: 'No se encontraron comprobantes pendientes a liquidar para los filtros seleccionados.',
							tipo: 'panel-info'
						};
					}
				} else {
					$scope.comprobantesLiquidar = [];
					$scope.totalSinLiquidar = 0;
					$scope.panelMensajeSinLiquidar = {
						titulo: 'Liquidaciones',
						mensaje: 'Se ha producido un error al cargar los comprobantes sin liquidar.',
						tipo: 'panel-danger'
					};
				}
				$scope.cargandoSinLiquidar = false;
			})
		};

		$scope.cargarLiquidaciones = function(){
			$scope.cargandoLiquidaciones = true;
			liquidacionesFactory.getPayments($scope.page, $scope.modelLiquidaciones, function(data){
				if (data.status == 'OK'){
					$scope.datosLiquidaciones = data.data;
					$scope.totalLiquidaciones = data.totalCount;
					if ($scope.totalLiquidaciones == 0){
						$scope.panelMensajePreLiquidaciones = {
							titulo: 'Liquidaciones',
							mensaje: 'No se encontraron liquidaciones realizadas para los filtros seleccionados.',
							tipo: 'panel-info'
						};
					}
				} else {
					$scope.datosLiquidaciones = [];
					$scope.totalLiquidaciones = 0;
					$scope.panelMensajePreLiquidaciones = {
						titulo: 'Liquidaciones',
						mensaje: 'Se ha producido un error al cargar las liquidaciones realizadas.',
						tipo: 'panel-danger'
					};
				}
				$scope.cargandoLiquidaciones = false;
			})
		};

		$scope.filtrarOrden = function(filtro){
			$scope.paginacion.liquidadas = 1;
			$scope.model = generalFunctions.filtrarOrden($scope.model, filtro);
			//$scope.$emit('cambioOrden', $scope.model);
			$scope.detalleLiquidacion();
		};

		$scope.filtrarSinLiquidar = function(filtro){
			//$scope.currentPageSinLiquidar = 1;
			$scope.model = generalFunctions.filtrarOrden($scope.model, filtro);
			$scope.cargarSinLiquidar();
		};

		$scope.detalleLiquidacion = function(liquidacion){
			if (liquidacion) $scope.liquidacionSelected = liquidacion;
			$scope.preLiquidacionSelected = true;
			$scope.cargandoLiquidados = true;
			var pagina = {
				skip: ($scope.paginacion.liquidadas - 1) * $scope.itemsPerPage,
				limit: $scope.itemsPerPage
			};
			liquidacionesFactory.getComprobantesLiquidados(pagina, $scope.liquidacionSelected._id, $scope.model, function(data){
				if (data.status == 'OK'){
					$scope.totalPreLiquidadas = data.totalCount;
					$scope.verDetalleLiquidacion = true;
					$scope.datosInvoices = data.data;
				} else {
					$scope.datosInvoices = [];
					$scope.totalPreLiquidadas = 0;
					$scope.verDetalleLiquidacion = false;
					dialogs.error('Liquidaciones', 'Se ha producido un error al cargar los comprobantes liquidados de la liquidacion número ' + $scope.liquidacionSelected.preNumber);
				}
				$scope.cargandoLiquidados = false;
			});
			liquidacionesFactory.getPrePayment($scope.liquidacionSelected._id, function(data){
				if (data.status == 'OK'){
					if (data.data.length > 0){
						$scope.detallePreLiquidacion = data.data[0]
					} else {
						$scope.detallePreLiquidacion = {
							tons: 0,
							total: 0
						}
					}
				} else {
					dialogs.error('Liquidaciones', 'Se ha producido un error al cargar los detalles de la pre-liquidación');
				}
			});
		};

		$scope.anexarComprobantes = function(){
			liquidacionesFactory.addToPrePayment($scope.liquidacionSelected.preNumber, $scope.model, function(data){
				if (data.status == 'OK'){
					dialogs.notify('Liquidaciones', data.message);
					$scope.cargarSinLiquidar();
					$scope.detalleLiquidacion($scope.liquidacionSelected);
				} else {
					dialogs.error('Liquidaciones', 'Se produjo un error al intentar anexar los comprobantes a la pre-liquidación');
					//acá hay que ver que pasa
				}
			})
		};

		/*$scope.cargarDatos = function(){
			if ($scope.modo == 'sinLiquidar'){
				//$scope.liquidadas = false;
				//$scope.datosComprobantes = $scope.sinLiquidar;
				//$scope.panelMensaje = $scope.panelMensajeSinLiquidar;
				$scope.cargarSinLiquidar();
			} else {
				//$scope.liquidadas = true;
				//$scope.datosComprobantes = $scope.liquidaciones;
				//$scope.panelMensaje = $scope.panelMensajeLiquidaciones;
				$scope.cargarLiquidaciones();
			}
		};*/

		$scope.preLiquidar = function(){
			$scope.cargandoLiquidaciones = true;
			liquidacionesFactory.setPrePayment(function(data){
				if (data.status == 'OK'){
					dialogs.notify('Liquidaciones',  'Se ha generado la pre-liquidación número: ' + data.data.preNumber);
					$scope.cargarLiquidaciones();
				} else {
					dialogs.error('Liquidaciones', data.message);
				}
				$scope.cargandoLiquidaciones = false;
			})
		};

		$scope.checkComprobantes = function(comprobante){
			var response;
			if ($scope.detalleComprobante == 'sinLiquidar'){
				response = invoiceService.checkComprobantes(comprobante, $scope.comprobantesVistos, $scope.comprobantesLiquidar);
				$scope.comprobantesLiquidar = response.datosInvoices;
			} else {
				response = invoiceService.checkComprobantes(comprobante, $scope.comprobantesVistos, $scope.datosInvoices);
				$scope.datosInvoices = response.datosInvoices
			}
			$scope.comprobantesVistos = response.comprobantesVistos;
		};

		$scope.mostrarDetalleSinLiquidar = function(comprobante){
			if ($scope.detalleComprobante != ''){
				$scope.ocultarResultado($scope.verDetalle);
			}
			$scope.detalleComprobante = 'sinLiquidar';
			$scope.cargandoSinLiquidar = true;
			invoiceService.mostrarDetalle(comprobante._id, $scope.comprobantesVistos, $scope.comprobantesLiquidar)
				.then(function(response){
					$scope.verDetalle = response.detalle;
					$scope.comprobantesLiquidar = response.datosInvoices;
					$scope.comprobantesVistos = response.comprobantesVistos;
					$scope.noMatch = response.noMatch;
					//$scope.commentsInvoice = [];
					$rootScope.noMatch = $scope.noMatch;
					$scope.mostrarResultadoSinLiquidar = true;
					$scope.cargandoSinLiquidar = false;
				});
		};

		$scope.mostrarDetalle = function(comprobante){
			if ($scope.detalleComprobante != ''){
				$scope.ocultarResultado($scope.verDetalle);
			}
			$scope.detalleComprobante = 'Liquidado';
			$scope.cargandoLiquidados = true;
			invoiceService.mostrarDetalle(comprobante._id, $scope.comprobantesVistos, $scope.datosInvoices)
				.then(function(response){
					$scope.verDetalle = response.detalle;
					$scope.datosInvoices = response.datosInvoices;
					$scope.comprobantesVistos = response.comprobantesVistos;
					$scope.noMatch = response.noMatch;
					//$scope.commentsInvoice = [];
					$rootScope.noMatch = $scope.noMatch;
					$scope.mostrarResultado = true;
					$scope.cargandoLiquidados = false;
				});
		};

		$scope.mostrarTope = function(pagina, totalItems){
			var max = pagina * $scope.itemsPerPage;
			return max > totalItems ? totalItems : max;
		};

		$scope.existeDescripcion = function(itemId){
			return invoiceService.existeDescripcion(itemId);
		};

		$scope.trackInvoice = function(comprobante){
			invoiceService.trackInvoice(comprobante)
				.then(function(response){
					if (angular.isDefined(response)) comprobante = response;
				}, function(message){
					dialogs.error('Liquidaciones', message);
				})
		};

		$scope.ocultarResultado = function(comprobante){
			$scope.checkComprobantes(comprobante);
			if ($scope.detalleComprobante == 'sinLiquidar'){
				$scope.mostrarResultadoSinLiquidar = false;
			} else {
				$scope.mostrarResultado = false;
			}
			$scope.detalleComprobante = '';
		};

		$scope.chequearTarifas = function(comprobante){
			var resultado = invoiceService.chequearTarifas(comprobante, $scope.comprobantesControlados);
			$scope.comprobantesControlados = resultado.data;
			$scope.noMatch = resultado.noMatch;
			$rootScope.noMatch = $scope.noMatch;
			return resultado.retValue;
		};

		$scope.verPdf = function(){
			$scope.disablePdf = true;
			invoiceService.verPdf($scope.verDetalle)
				.then(function(){
					$scope.disablePdf = false;
				}, function(){
					dialogs.error('Comprobantes', 'Se ha producido un error al procesar el comprobante');
					$scope.disablePdf = false;
				});
		};

		if (loginService.getStatus()) {
			$scope.cargarSinLiquidar();
			$scope.cargarLiquidaciones();
		}

		$scope.$on('terminoLogin', function(){
			$scope.acceso = $rootScope.esUsuario;
			$scope.cargarSinLiquidar();
			$scope.cargarLiquidaciones();
		});

		$scope.$on('cambioTerminal', function(){
			$scope.cargarSinLiquidar();
			$scope.cargarLiquidaciones();
		});

		$scope.$on('$destroy', function(){
			liquidacionesFactory.cancelRequest();
		});

	}]);
