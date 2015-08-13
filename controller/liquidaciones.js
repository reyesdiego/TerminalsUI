/**
 * Created by artiom on 13/07/15.
 */
myapp.controller('liquidacionesCtrl', ['$rootScope', '$scope', 'liquidacionesFactory', 'loginService', 'dialogs', 'generalFunctions', 'invoiceService',
	function($rootScope, $scope, liquidacionesFactory, loginService, dialogs, generalFunctions, invoiceService){

		$scope.ocultarFiltros = ['nroPtoVenta', 'nroComprobante', 'codTipoComprob', 'nroPtoVenta', 'documentoCliente', 'contenedor', 'codigo', 'razonSocial', 'estado', 'buque', 'viaje', 'btnBuscar', 'fechaInicio'];
		$scope.ocultarFiltrosSinLiquidar = ['liquidacion'];
		$scope.ocultarFiltrosPreLiquidaciones = ['nroComprobante', 'codTipoComprob', 'razonSocial'];

		$scope.panelMensajeSinLiquidar = {
			titulo: 'Liquidaciones',
			mensaje: 'No se encontraron comprobantes pendientes a liquidar para los filtros seleccionados.',
			tipo: 'panel-info'
		};

		$scope.panelMensajePreLiquidaciones = {
			titulo: 'Liquidaciones',
			mensaje: 'No se encontraron pre-liquidaciones realizadas para los filtros seleccionados.',
			tipo: 'panel-info'
		};

		$scope.panelMensajeLiquidaciones = {
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

		$scope.modelPreLiquidaciones = {
			'fechaInicio': $scope.fechaInicio,
			'fechaFin': $scope.fechaFin,
			'liquidacion': '',
			'itemsPerPage': 15,
			'filtroOrden': 'fecha.emision',
			'filtroOrdenAnterior': '',
			'filtroOrdenReverse': false,
			'order': '',
			'modo': 'preLiquidaciones'
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
		$scope.cargandoPreLiquidaciones = false;
		$scope.cargandoLiquidados = false;

		$scope.modo = 'sinLiquidar';

		$scope.comprobantesLiquidar = [];
		$scope.datosInvoices = [];
		$scope.auxDatos = [];
		$scope.comprobantesControlados = [];

		$scope.itemsPerPage = 15;
		$scope.totalSinLiquidar = 0;
		$scope.totalLiquidadas = 0;
		$scope.totalPreLiquidaciones = 0;
		$scope.totalLiquidaciones = 0;

		$scope.currentPage = 1;
		$scope.paginacion = {
			sinLiquidar: 1,
			preLiquidaciones: 1,
			liquidaciones: 1
		};

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

		$scope.mostrarDetalleLiquidacion = false;
		$scope.liquidacion = {};

		$scope.currentPageSinLiquidar = 1;
		$scope.currentPageLiquidados = 1;

		$scope.$on('cambioPagina', function(ev, data){
			if ($scope.modo == 'sinLiquidar'){
				$scope.currentPageSinLiquidar = data;
				$scope.cargarDetallePreLiquidacion();
			} else {
				$scope.currentPageLiquidados = data;
				$scope.detalleLiquidacion();
			}
		});

		$scope.$on('cambioFiltro', function(ev, data){
			if (data.modo == 'sinLiquidar'){
				$scope.cargarSinLiquidar();
			} else if(data.modo == 'preLiquidaciones'){
				$scope.cargarPreLiquidaciones();
			} else {
				$scope.cargarLiquidaciones();
			}
		});

		$scope.cargarSinLiquidar = function(){
			$scope.page.skip = ($scope.paginacion.sinLiquidar - 1) * $scope.itemsPerPage;
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

		$scope.cargarPreLiquidaciones = function(){
			$scope.page.skip = ($scope.paginacion.preLiquidaciones - 1) * $scope.itemsPerPage;
			$scope.cargandoPreLiquidaciones = true;
			liquidacionesFactory.getPrePayments($scope.page, $scope.modelPreLiquidaciones, function(data){
				if (data.status == 'OK'){
					$scope.datosPreLiquidaciones = data.data;
					$scope.totalPreLiquidaciones = data.totalCount;
					if ($scope.totalPreLiquidaciones == 0){
						$scope.panelMensajePreLiquidaciones = {
							titulo: 'Liquidaciones',
							mensaje: 'No se encontraron pre-liquidaciones realizadas para los filtros seleccionados.',
							tipo: 'panel-info'
						};
					}
				} else {
					$scope.datosPreLiquidaciones = [];
					$scope.totalPreLiquidaciones = 0;
					$scope.panelMensajePreLiquidaciones = {
						titulo: 'Liquidaciones',
						mensaje: 'Se ha producido un error al cargar las liquidaciones realizadas.',
						tipo: 'panel-danger'
					};
				}
				$scope.cargandoPreLiquidaciones = false;
			})
		};

		$scope.cargarLiquidaciones = function(){
			$scope.page.skip = ($scope.paginacion.liquidaciones - 1) * $scope.itemsPerPage;
			$scope.cargandoLiquidaciones = true;
			liquidacionesFactory.getPayments($scope.page, $scope.modelLiquidaciones, function(data){
				console.log(data);
				if (data.status == 'OK'){
					$scope.datosLiquidaciones = data.data;
					$scope.totalLiquidaciones = data.totalCount;
					if ($scope.totalLiquidaciones == 0){
						$scope.panelMensajeLiquidaciones = {
							titulo: 'Liquidaciones',
							mensaje: 'No se encontraron liquidaciones realizadas para los filtros seleccionados.',
							tipo: 'panel-info'
						};
					}
				} else {
					$scope.datosLiquidaciones = [];
					$scope.totalLiquidaciones = 0;
					$scope.panelMensajeLiquidaciones = {
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
			$scope.cargarDetallePreLiquidacion();
		};

		$scope.filtrarSinLiquidar = function(filtro){
			//$scope.currentPageSinLiquidar = 1;
			$scope.model = generalFunctions.filtrarOrden($scope.model, filtro);
			$scope.cargarSinLiquidar();
		};

		$scope.cargarDetallePreLiquidacion = function(liquidacion){
			if (liquidacion) $scope.liquidacionSelected = liquidacion;
			$scope.preLiquidacionSelected = true;
			$scope.cargandoLiquidados = true;
			var pagina = {
				skip: ($scope.currentPageSinLiquidar - 1) * $scope.itemsPerPage,
				limit: $scope.itemsPerPage
			};
			liquidacionesFactory.getComprobantesLiquidados(pagina, $scope.liquidacionSelected._id, $scope.model, function(data){
				if (data.status == 'OK'){
					$scope.totalPreLiquidadas = data.totalCount;
					$scope.verDetalleLiquidacion = true;
					$scope.datosInvoices = data.data;
				} else {
					dialogs.error('Liquidaciones', 'Se ha producido un error al cargar los comprobantes liquidados de la pre-liquidación número ' + $scope.liquidacionSelected.preNumber);
					$scope.liquidacionSelected = {};
					$scope.preLiquidacionSelected = false;
					$scope.datosInvoices = [];
					$scope.totalPreLiquidadas = 0;
					$scope.verDetalleLiquidacion = false;
				}
				$scope.cargandoLiquidados = false;
			});
			liquidacionesFactory.getPrePayment($scope.liquidacionSelected._id, function(data){
				if (data.status == 'OK'){
					if (angular.isDefined(data.data)){
						$scope.detallePreLiquidacion = data.data;
					} else {
						$scope.detallePreLiquidacion = {
							tons: 0,
							total: 0
						};
					}
				} else {
					dialogs.error('Liquidaciones', 'Se ha producido un error al cargar los detalles de la pre-liquidación');
					$scope.liquidacionSelected = {};
					$scope.preLiquidacionSelected = false;
					$scope.datosInvoices = [];
					$scope.totalPreLiquidadas = 0;
					$scope.verDetalleLiquidacion = false;
				}
			});
		};

		$scope.detalleLiquidacion = function(liquidacion){
			if (liquidacion) $scope.liquidacion = liquidacion;
			$scope.mostrarDetalleLiquidacion = true;
			$scope.cargandoDetalleLiquidacion = true;
			var pagina = {
				skip: ($scope.currentPageLiquidados - 1) * $scope.itemsPerPage,
				limit: $scope.itemsPerPage
			};
			liquidacionesFactory.getComprobantesLiquidados(pagina, $scope.liquidacion._id, $scope.model, function(data){
				if (data.status == 'OK'){
					$scope.totalLiquidadas = data.totalCount;
					$scope.datosLiquidados = data.data;
				} else {
					dialogs.error('Liquidaciones', 'Se ha producido un error al cargar los comprobantes liquidados de la pre-liquidación número ' + $scope.liquidacionSelected.preNumber);
					$scope.liquidacion = {};
					$scope.mostrarDetalleLiquidacion = false;
					$scope.datosLiquidados = [];
					$scope.totalLiquidadas = 0;
				}
				$scope.cargandoDetalleLiquidacion = false;
			});
		};

		$scope.anexarComprobantes = function(){
			liquidacionesFactory.addToPrePayment($scope.liquidacionSelected._id, $scope.model, function(data){
				if (data.status == 'OK'){
					dialogs.notify('Liquidaciones', data.message);
					$scope.cargarSinLiquidar();
					$scope.cargarDetallePreLiquidacion($scope.liquidacionSelected);
				} else {
					dialogs.error('Liquidaciones', 'Se produjo un error al intentar anexar los comprobantes a la pre-liquidación');
					//acá hay que ver que pasa
				}
			})
		};

		$scope.preLiquidar = function(){
			$scope.cargandoPreLiquidaciones = true;
			liquidacionesFactory.setPrePayment(function(data){
				if (data.status == 'OK'){
					dialogs.notify('Liquidaciones',  'Se ha generado la pre-liquidación número: ' + data.data.preNumber);
					$scope.cargarPreLiquidaciones();
				} else {
					dialogs.error('Liquidaciones', data.message);
				}
				$scope.cargandoPreLiquidaciones = false;
			})
		};

		$scope.checkComprobantes = function(comprobante){
			var response;
			response = invoiceService.checkComprobantes(comprobante, $scope.comprobantesVistos, $scope.comprobantesLiquidar);
			$scope.comprobantesLiquidar = response.datosInvoices;
		};

		$scope.mostrarDetalleSinLiquidar = function(comprobante){
			$scope.detalleComprobante = 'sinLiquidar';
			$scope.cargandoSinLiquidar = true;
			invoiceService.mostrarDetalle(comprobante._id, $scope.comprobantesVistos, $scope.comprobantesLiquidar)
				.then(function(response){
					$scope.verDetalle = response.detalle;
					$scope.comprobantesLiquidar = response.datosInvoices;
					$scope.noMatch = response.noMatch;
					$rootScope.noMatch = $scope.noMatch;
					$scope.mostrarResultadoSinLiquidar = true;
					$scope.cargandoSinLiquidar = false;
				});
		};

		$scope.eliminarPreLiquidacion = function(){
			var dlg = dialogs.confirm('Liquidaciones', 'Se eliminará la pre-liquidación número ' + $scope.liquidacionSelected.preNumber +'. ¿Confirma la operación?');
			dlg.result.then(function(){
					$scope.cargandoPreLiquidaciones = true;
					liquidacionesFactory.deletePrePayment($scope.liquidacionSelected._id, function(data){
						if (data.status == 'OK'){
							dialogs.notify('Liquidaciones', data.message);
							$scope.recargar();
						} else {
							dialogs.error('Liquidaciones', 'Se ha producido un error al intentar borrar la pre-liquidación.');
						}
					})
				});
		};

		$scope.liquidar = function(){
			var dlg = dialogs.confirm('Liquidaciones', 'Se procesará la pre-liquidación número ' + $scope.liquidacionSelected.preNumber +' de modo que pueda ser cobrada. ¿Confirma la operación?');
			dlg.result.then(function(){
				$scope.cargandoPreLiquidaciones = true;
				$scope.preLiquidacionSelected = false;
				liquidacionesFactory.setPayment($scope.liquidacionSelected.preNumber, function(data){
					console.log(data);
					if (data.status == 'OK'){
						dialogs.notify('Liquidaciones', data.message);
						$scope.recargar();
					} else {
						dialogs.error('Liquidaciones', data.message);
						$scope.cargandoPreLiquidaciones = false;
						$scope.preLiquidacionSelected = true;
					}
				})
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

		$scope.cambiarModo = function(modo){
			$scope.modo = modo;
		};

		$scope.ocultarResultado = function(comprobante){
			$scope.checkComprobantes(comprobante);
			$scope.mostrarResultadoSinLiquidar = false;
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
			$scope.cargarPreLiquidaciones();
			$scope.cargarLiquidaciones();
		}

		$scope.$on('terminoLogin', function(){
			$scope.acceso = $rootScope.esUsuario;
			$scope.cargarSinLiquidar();
			$scope.cargarPreLiquidaciones();
			$scope.cargarLiquidaciones();
		});

		$scope.$on('cambioTerminal', function(){
			$scope.recargar();
		});

		$scope.recargar = function(){
			$scope.preLiquidacionSelected = false;
			$scope.liquidacionSelected = {};
			$scope.currentPage = 1;
			$scope.paginacion = {
				sinLiquidar: 1,
				liquidaciones: 1
			};
			$scope.cargarSinLiquidar();
			$scope.cargarPreLiquidaciones();
			$scope.cargarLiquidaciones();
		};

		$scope.$on('$destroy', function(){
			liquidacionesFactory.cancelRequest();
		});

	}]);
