/**
 * Created by artiom on 13/07/15.
 */
myapp.controller('liquidacionesCtrl', ['$rootScope', '$scope', 'liquidacionesFactory', 'loginService', 'dialogs', 'generalFunctions', 'invoiceService',
	function($rootScope, $scope, liquidacionesFactory, loginService, dialogs, generalFunctions, invoiceService){

		$scope.tasaAgp = false;
		$scope.byContainer = false;

		$scope.fechaInicio = new Date();
		$scope.fechaFin = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);

		$scope.sinLiquidar = {
			ocultarFiltros: ['liquidacion'],
			panelMensaje: {
				titulo: 'Liquidaciones',
				mensaje: 'No se encontraron comprobantes pendientes a liquidar para los filtros seleccionados.',
				tipo: 'panel-info'
			},
			model: {
				'fechaInicio': $scope.fechaInicio,
				'fechaFin': $scope.fechaFin,
				'liquidacion': '',
				'itemsPerPage': 15,
				'razonSocial': '',
				'filtroOrden': 'fecha.emision',
				'filtroOrdenAnterior': '',
				'filtroOrdenReverse': false,
				'order': '',
				'modo': 'sinLiquidar',
				'byContainer': false
			},
			cargando: false,
			verDetalle: false,
			comprobantes: [],
			total: 0,
			currentPage: 1,
			invoiceSelected: {},
			itemsPerPage: 15,
			preLiquidacion: {
				detalle: {
					tons: 0,
					total: 0
				}
			},
			byContainer: false
		};

		$scope.preLiquidacion = {
			ocultarFiltros: ['nroComprobante', 'codTipoComprob', 'razonSocial', 'buque', 'byContainer'],
			panelMensaje: {
				titulo: 'Liquidaciones',
				mensaje: 'No se encontraron pre-liquidaciones realizadas para los filtros seleccionados.',
				tipo: 'panel-info'
			},
			model: {
				'fechaInicio': $scope.fechaInicio,
				'fechaFin': $scope.fechaFin,
				'liquidacion': '',
				'itemsPerPage': 15,
				'filtroOrden': 'fecha.emision',
				'filtroOrdenAnterior': '',
				'filtroOrdenReverse': false,
				'order': '',
				'modo': 'preLiquidaciones'
			},
			cargando: false,
			verDetalle: false,
			selected: {},
			detalle: {
				tons: 0,
				total: 0
			},
			total: 0,
			currentPage: 1,
			datos: [],
			tasaAgp: false,
            byContainer: false
		};

		$scope.comprobantesPreLiquidados = {
			ocultarFiltros: ['nroPtoVenta', 'nroComprobante', 'codTipoComprob', 'nroPtoVenta', 'documentoCliente', 'contenedor', 'codigo', 'razonSocial', 'estado', 'buque', 'viaje', 'btnBuscar', 'fechaInicio'],
			panelMensaje: {
				titulo: 'Liquidaciones',
				mensaje: 'No se encontraron comprobantes pendientes a liquidar para los filtros seleccionados.',
				tipo: 'panel-info'
			},
			model: {
				'fechaInicio': $scope.fechaInicio,
				'fechaFin': $scope.fechaFin,
				'liquidacion': '',
				'itemsPerPage': 15,
				'filtroOrden': 'fecha.emision',
				'filtroOrdenAnterior': '',
				'filtroOrdenReverse': false,
				'order': '',
				'modo': 'sinLiquidar',
				'byContainer': false
			},
			comprobantes: [],
			total: 0,
			currentPage: 1,
			cargando: false,
			invoiceSelected: {},
			verDetalle: false,
			itemsPerPage: 15,
			byContainer: false
		};

		$scope.liquidacion = {
			ocultarFiltros: ['nroComprobante', 'codTipoComprob', 'razonSocial'],
			panelMensaje: {
				titulo: 'Liquidaciones',
				mensaje: 'No se encontraron liquidaciones realizadas para los filtros seleccionados.',
				tipo: 'panel-info'
			},
			model: {
				'fechaInicio': $scope.fechaInicio,
				'fechaFin': $scope.fechaFin,
				'liquidacion': '',
				'itemsPerPage': 15,
				'filtroOrden': 'fecha.emision',
				'filtroOrdenAnterior': '',
				'filtroOrdenReverse': false,
				'order': '',
				'modo': 'liquidaciones'
			},
			cargando: false,
			verDetalle: false,
			selected: {},
			detalle: {
				tons: 0,
				total: 0
			},
			total: 0,
			currentPage: 1,
			datos: []
		};

		$scope.comprobantesLiquidados = {
			ocultarFiltros: ['nroPtoVenta', 'nroComprobante', 'codTipoComprob', 'nroPtoVenta', 'documentoCliente', 'contenedor', 'codigo', 'razonSocial', 'estado', 'buque', 'viaje', 'btnBuscar', 'fechaInicio'],
			model: {
				'fechaInicio': $scope.fechaInicio,
				'fechaFin': $scope.fechaFin,
				'liquidacion': '',
				'itemsPerPage': 15,
				'filtroOrden': 'fecha.emision',
				'filtroOrdenAnterior': '',
				'filtroOrdenReverse': false,
				'order': '',
				'modo': 'liquidaciones'
			},
			comprobantes: [],
			total: 0,
			currentPage: 1,
			cargando: false,
			invoiceSelected: {},
			verDetalle: false,
			itemsPerPage: 15
		};

		$scope.acceso = $rootScope.esUsuario;
		$scope.modo = 'sinLiquidar';

		$scope.comprobantesControlados = [];

		$scope.itemsPerPage = 15;

		$scope.page = {
			skip: 0,
			limit: $scope.itemsPerPage
		};

		$scope.comprobantesVistos = [];

		$scope.commentsInvoice = [];

		$scope.cambioPagina = function(){
			if ($scope.modo == 'sinLiquidar'){
				//$scope.comprobantesPreLiquidados.currentPage = data;
				$scope.cargarDetallePreLiquidacion();
			} else {
				//$scope.comprobantesLiquidados.currentPage = data;
				$scope.detalleLiquidacion();
			}
		};

		$scope.$on('iniciarBusqueda', function(ev, data){
			if (data.modo == 'sinLiquidar'){
				$scope.cargarSinLiquidar();
			} else if(data.modo == 'preLiquidaciones'){
				$scope.preLiquidacion.verDetalle = false;
				$scope.cargarPreLiquidaciones();
			} else {
				$scope.liquidacion.verDetalle = false;
				$scope.cargarLiquidaciones();
			}
		});

		$scope.cargarSinLiquidar = function(){
			$scope.page.skip = ($scope.sinLiquidar.currentPage - 1) * $scope.itemsPerPage;
			$scope.sinLiquidar.cargando = true;
			$scope.sinLiquidar.byContainer = $scope.sinLiquidar.model.byContainer;
			liquidacionesFactory.getComprobantesLiquidar($scope.page, $scope.sinLiquidar.model, function(data){
				if (data.status == 'OK'){
					$scope.sinLiquidar.comprobantes = data.data;
					$scope.sinLiquidar.total = data.totalCount;
					if ($scope.sinLiquidar.total == 0) {
						$scope.sinLiquidar.panelMensaje = {
							titulo: 'Liquidaciones',
							mensaje: 'No se encontraron comprobantes pendientes a liquidar para los filtros seleccionados.',
							tipo: 'panel-info'
						};
					}
				} else {
					$scope.sinLiquidar.comprobantes = [];
					$scope.sinLiquidar.total = 0;
					$scope.sinLiquidar.panelMensaje = {
						titulo: 'Liquidaciones',
						mensaje: 'Se ha producido un error al cargar los comprobantes sin liquidar.',
						tipo: 'panel-danger'
					};
				}
				$scope.sinLiquidar.cargando = false;
			});
			liquidacionesFactory.getPrePayment($scope.sinLiquidar.model, function(data){
				if (data.status == 'OK'){
					if (angular.isDefined(data.data)){
						$scope.sinLiquidar.preLiquidacion.detalle = data.data;
					} else {
						$scope.sinLiquidar.preLiquidacion.detalle = {
							tons: 0,
							total: 0
						};
					}
				} else {
					dialogs.error('Liquidaciones', 'Se ha producido un error al cargar los detalles de la pre-liquidación');
					$scope.sinLiquidar.preLiquidacion.detalle = {
						tons: 0,
						total: 0
					};
				}
			});
		};

		$scope.cargarPreLiquidaciones = function(){
			$scope.page.skip = ($scope.preLiquidacion.currentPage - 1) * $scope.itemsPerPage;
			$scope.preLiquidacion.cargando = true;
			liquidacionesFactory.getPrePayments($scope.page, $scope.preLiquidacion.model, function(data){
				if (data.status == 'OK'){
					$scope.preLiquidacion.datos = data.data;
					$scope.preLiquidacion.total = data.totalCount;
					if ($scope.preLiquidacion.total == 0){
						$scope.preLiquidacion.panelMensaje = {
							titulo: 'Liquidaciones',
							mensaje: 'No se encontraron pre-liquidaciones realizadas para los filtros seleccionados.',
							tipo: 'panel-info'
						};
					}
				} else {
					$scope.preLiquidacion.datos = [];
					$scope.preLiquidacion.total = 0;
					$scope.preLiquidacion.panelMensaje = {
						titulo: 'Liquidaciones',
						mensaje: 'Se ha producido un error al cargar las liquidaciones realizadas.',
						tipo: 'panel-danger'
					};
				}
				$scope.preLiquidacion.cargando = false;
			})
		};

		$scope.cargarLiquidaciones = function(){
			$scope.page.skip = ($scope.liquidacion.currentPage - 1) * $scope.itemsPerPage;
			$scope.liquidacion.cargando = true;
			liquidacionesFactory.getPayments($scope.page, $scope.liquidacion.model, function(data){
				if (data.status == 'OK'){
					$scope.liquidacion.datos = data.data;
					$scope.liquidacion.total = data.totalCount;
					if ($scope.liquidacion.total == 0){
						$scope.liquidacion.panelMensaje = {
							titulo: 'Liquidaciones',
							mensaje: 'No se encontraron liquidaciones realizadas para los filtros seleccionados.',
							tipo: 'panel-info'
						};
					}
				} else {
					$scope.liquidacion.datos = [];
					$scope.liquidacion.total = 0;
					$scope.liquidacion.panelMensaje = {
						titulo: 'Liquidaciones',
						mensaje: 'Se ha producido un error al cargar las liquidaciones realizadas.',
						tipo: 'panel-danger'
					};
				}
				$scope.liquidacion.cargando = false;
			})
		};

		$scope.filtrarOrden = function(filtro){
			if ($scope.modo == 'sinLiquidar'){
				$scope.comprobantesPreLiquidados.currentPage = 1;
				$scope.comprobantesPreLiquidados.model = generalFunctions.filtrarOrden($scope.comprobantesPreLiquidados.model, filtro);
				//$scope.$emit('cambioOrden', $scope.model);
				$scope.cargarDetallePreLiquidacion();
			} else {
				$scope.comprobantesLiquidados.currentPage = 1;
				$scope.comprobantesLiquidados.model = generalFunctions.filtrarOrden($scope.comprobantesPreLiquidados.model, filtro);
				//$scope.$emit('cambioOrden', $scope.model);
				$scope.detalleLiquidacion();
			}

		};

		$scope.filtrarSinLiquidar = function(filtro){
			$scope.sinLiquidar.model = generalFunctions.filtrarOrden($scope.sinLiquidar.model, filtro);
			$scope.cargarSinLiquidar();
		};

		$scope.filtrarPreLiquidados = function(filtro){
			if ($scope.modo == 'sinLiquidar'){
				$scope.comprobantesPreLiquidados.model = generalFunctions.filtrarOrden($scope.comprobantesPreLiquidados.model, filtro);
				var pagina = {
					skip: ($scope.comprobantesPreLiquidados.currentPage - 1) * $scope.itemsPerPage,
					limit: $scope.itemsPerPage
				};
				traerComprobantesPreLiquidacion(pagina);
			} else {
				$scope.comprobantesLiquidados.model = generalFunctions.filtrarOrden($scope.comprobantesPreLiquidados.model, filtro);
				$scope.detalleLiquidacion();
			}
		};

		var traerComprobantesPreLiquidacion = function(pagina){
			$scope.comprobantesPreLiquidados.model.byContainer = $scope.sinLiquidar.model.byContainer;
			$scope.comprobantesPreLiquidados.byContainer = $scope.sinLiquidar.model.byContainer;
			liquidacionesFactory.getComprobantesLiquidados(pagina, $scope.preLiquidacion.selected._id, $scope.comprobantesPreLiquidados.model, function(data){
				if (data.status == 'OK'){
					$scope.comprobantesPreLiquidados.total = data.totalCount;
					$scope.preLiquidacion.verDetalle = true;
					$scope.comprobantesPreLiquidados.comprobantes = data.data;
				} else {
					dialogs.error('Liquidaciones', 'Se ha producido un error al cargar los comprobantes liquidados de la pre-liquidación número ' + $scope.liquidacionSelected.preNumber);
					$scope.preLiquidacion.selected = {};
					$scope.preLiquidacion.verDetalle = false;
					$scope.comprobantesPreLiquidados.comprobantes = [];
					$scope.comprobantesPreLiquidados.total = 0;
				}
				$scope.comprobantesPreLiquidados.cargando = false;
			});
		};

		$scope.cargarDetallePreLiquidacion = function(liquidacion){
			if (liquidacion) $scope.preLiquidacion.selected = liquidacion;
			$scope.preLiquidacion.verDetalle = true;
			$scope.comprobantesPreLiquidados.cargando = true;
			var pagina = {
				skip: ($scope.comprobantesPreLiquidados.currentPage - 1) * $scope.itemsPerPage,
				limit: $scope.itemsPerPage
			};
			traerComprobantesPreLiquidacion(pagina);
			liquidacionesFactory.getPrePayment({ paymentId: $scope.preLiquidacion.selected._id }, function(data){
				if (data.status == 'OK'){
					if (angular.isDefined(data.data)){
						$scope.preLiquidacion.detalle = data.data;
					} else {
						$scope.preLiquidacion.detalle = {
							tons: 0,
							total: 0
						};
					}
				} else {
					dialogs.error('Liquidaciones', 'Se ha producido un error al cargar los detalles de la pre-liquidación');
					$scope.preLiquidacion.selected = {};
					$scope.preLiquidacion.verDetalle = false;
					$scope.comprobantesPreLiquidados.comprobantes = [];
					$scope.comprobantesPreLiquidados.total = 0;
				}
			});
		};

		$scope.detalleLiquidacion = function(liquidacion){
			if (liquidacion) $scope.liquidacion.selected = liquidacion;
			$scope.liquidacion.verDetalle = true;
			$scope.comprobantesLiquidados.cargando = true;
			var pagina = {
				skip: ($scope.comprobantesLiquidados.currentPage - 1) * $scope.itemsPerPage,
				limit: $scope.itemsPerPage
			};
			liquidacionesFactory.getComprobantesLiquidados(pagina, $scope.liquidacion.selected._id, $scope.comprobantesLiquidados.model, function(data){
				if (data.status == 'OK'){
					$scope.comprobantesLiquidados.total = data.totalCount;
					$scope.comprobantesLiquidados.comprobantes = data.data;
				} else {
					dialogs.error('Liquidaciones', 'Se ha producido un error al cargar los comprobantes liquidados de la liquidación número ' + $scope.liquidacion.selected.number);
					$scope.liquidacion.selected = {};
					$scope.liquidacion.verDetalle = false;
					$scope.comprobantesLiquidados.comprobantes = [];
					$scope.comprobantesLiquidados.total = 0;
				}
				$scope.comprobantesLiquidados.cargando = false;
			});
		};

		$scope.anexarComprobantes = function(){
			liquidacionesFactory.addToPrePayment($scope.preLiquidacion.selected._id, $scope.sinLiquidar.model, function(data){
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
			$scope.preLiquidacion.cargando = true;
			liquidacionesFactory.setPrePayment(function(data){
				if (data.status == 'OK'){
					dialogs.notify('Liquidaciones',  'Se ha generado la pre-liquidación número: ' + data.data.preNumber);
					$scope.cargarPreLiquidaciones();
				} else {
					dialogs.error('Liquidaciones', data.message);
				}
				$scope.preLiquidacion.cargando = false;
			})
		};

		$scope.mostrarDetalleSinLiquidar = function(comprobante){
			$scope.sinLiquidar.cargando = true;
			invoiceService.mostrarDetalle(comprobante._id, $scope.comprobantesVistos, $scope.sinLiquidar.comprobantes)
				.then(function(response){
					$scope.sinLiquidar.invoiceSelected = response.detalle;
					$scope.sinLiquidar.comprobantes = response.datosInvoices;
					$scope.commentsInvoice = response.commentsInvoice;
					$scope.sinLiquidar.verDetalle = true;
					$scope.sinLiquidar.cargando = false;
				});
		};

		$scope.mostrarDetallePreLiquidado = function(comprobante){
			if ($scope.modo == 'sinLiquidar'){
				$scope.comprobantesPreLiquidados.cargando = true;
				invoiceService.mostrarDetalle(comprobante._id, $scope.comprobantesVistos, $scope.comprobantesPreLiquidados.comprobantes)
					.then(function(response){
						$scope.comprobantesPreLiquidados.invoiceSelected = response.detalle;
						$scope.comprobantesPreLiquidados.comprobantes = response.datosInvoices;
						$scope.commentsInvoice = response.commentsInvoice;
						$scope.comprobantesPreLiquidados.verDetalle = true;
						$scope.comprobantesPreLiquidados.cargando = false;
					})
			} else {
				$scope.comprobantesLiquidados.cargando = true;
				invoiceService.mostrarDetalle(comprobante._id, $scope.comprobantesVistos, $scope.comprobantesLiquidados.comprobantes)
					.then(function(response){
						$scope.comprobantesLiquidados.invoiceSelected = response.detalle;
						$scope.comprobantesLiquidados.comprobantes = response.datosInvoices;
						$scope.commentsInvoice = response.commentsInvoice;
						$scope.comprobantesLiquidados.verDetalle = true;
						$scope.comprobantesLiquidados.cargando = false;
					})
			}

		};

		$scope.eliminarPreLiquidacion = function(){
			var dlg = dialogs.confirm('Liquidaciones', 'Se eliminará la pre-liquidación número ' + $scope.preLiquidacion.selected.preNumber +'. ¿Confirma la operación?');
			dlg.result.then(function(){
					$scope.preLiquidacion.cargando = true;
					liquidacionesFactory.deletePrePayment($scope.preLiquidacion.selected._id, function(data){
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
			var dlg = dialogs.confirm('Liquidaciones', 'Se procesará la pre-liquidación número ' + $scope.preLiquidacion.selected.preNumber +' de modo que pueda ser cobrada. ¿Confirma la operación?');
			dlg.result.then(function(){
				$scope.preLiquidacion.cargando = true;
				$scope.preLiquidacion.verDetalle = false;
				liquidacionesFactory.setPayment($scope.preLiquidacion.selected.preNumber, function(data){
					if (data.status == 'OK'){
						dialogs.notify('Liquidaciones', data.message);
						$scope.recargar();
					} else {
						dialogs.error('Liquidaciones', data.message);
						$scope.preLiquidacion.cargando = false;
						$scope.preLiquidacion.verDetalle = true;
					}
				})
			});
		};

		$scope.mostrarTope = function(pagina, totalItems){
			var max = pagina * $scope.itemsPerPage;
			return max > totalItems ? totalItems : max;
		};

		$scope.cambiarModo = function(modo){
			$scope.modo = modo;
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
			$scope.sinLiquidar.verDetalle = false;
			$scope.preLiquidacion.verDetalle = false;
			$scope.liquidacion.verDetalle = false;
			$scope.recargar();
		});

		$scope.recargar = function(){
			$scope.preLiquidacion.verDetalle = false;
			$scope.preLiquidacion.selected = {};
			$scope.liquidacion.verDetalle = false;
			$scope.liquidacion.selected = {};
			$scope.sinLiquidar.currentPage = 1;
			$scope.comprobantesPreLiquidados.currentPage = 1;
			$scope.preLiquidacion.currentPage = 1;
			$scope.liquidacion.currentPage = 1;
			$scope.comprobantesLiquidados.currentPage = 1;
			$scope.cargarSinLiquidar();
			$scope.cargarPreLiquidaciones();
			$scope.cargarLiquidaciones();
		};

		$scope.$on('$destroy', function(){
			liquidacionesFactory.cancelRequest();
		});

	}]);
