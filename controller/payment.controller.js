/**
 * Created by artiom on 13/07/15.
 */
myapp.controller('liquidacionesCtrl', ['$rootScope', '$scope', 'liquidacionesFactory', 'loginService', 'dialogs', 'generalFunctions', '$q', 'invoiceFactory', 'Payment', '$window',
	function($rootScope, $scope, liquidacionesFactory, loginService, dialogs, generalFunctions, $q, invoiceFactory, Payment, $window){

		$scope.tasaAgp = false;
		$scope.byContainer = false;

		$scope.fechaInicio = new Date();
		$scope.fechaFin = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);

		$scope.ocultarCotizacion = true;

		/*liquidacionesFactory.getPriceDollar(function(data){
			if (data.status == 'OK'){
				$scope.datosDolar = data.data;
			}
		});*/

		$scope.sinLiquidar = {
			ocultarFiltros: ['liquidacion'],
			model: {
				'fechaInicio': $scope.fechaInicio,
				'fechaFin': $scope.fechaFin,
				'liquidacion': '',
				'contenedor': '',
				'itemsPerPage': 15,
				'razonSocial': '',
				'filtroOrden': 'fecha.emision',
				'filtroOrdenAnterior': '',
				'filtroOrdenReverse': false,
				'order': '',
				'modo': 'sinLiquidar'
			},
			cargando: false
		};

		$scope.sinLiquidarPayment = new Payment($scope.sinLiquidar.model);

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
			total: 0,
			currentPage: 1,
			datos: [],
			tasaAgp: false,
            byContainer: false
		};

		$scope.ocultarFiltrosComprobantes = ['nroPtoVenta', 'nroComprobante', 'codTipoComprob', 'nroPtoVenta', 'documentoCliente', 'contenedor', 'codigo', 'razonSocial', 'estado', 'buque', 'viaje', 'btnBuscar', 'fechaInicio']

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
			total: 0,
			currentPage: 1,
			datos: []
		};

		$scope.acceso = $rootScope.esUsuario;

		//$scope.comprobantesControlados = [];

		$scope.itemsPerPage = 15;

		$scope.page = {
			skip: 0,
			limit: $scope.itemsPerPage
		};

		//$scope.comprobantesVistos = [];

		//$scope.commentsInvoice = [];

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

			$scope.sinLiquidar.cargando = true;

			$scope.sinLiquidarPayment.getPrePaymentDetail(function(success){
				$scope.sinLiquidar.cargando = false;
				if (!success)
					dialogs.error('Liquidaciones', 'Se ha producido un error al cargar los detalles de la pre-liquidación');
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

		$scope.cargarDetallePreLiquidacion = function(liquidacion){

			$scope.preLiquidacion.selected = liquidacion;
			$scope.preLiquidacion.verDetalle = false;

			$scope.preLiquidacion.selected.getPrePaymentDetail(function(success){
				$scope.preLiquidacion.verDetalle = true;
				if (!success)
					dialogs.error('Liquidaciones', 'Se ha producido un error al cargar los detalles de la pre-liquidación');

			});

		};

		$scope.detalleLiquidacion = function(event, liquidacion){
			event.stopPropagation();
			$scope.liquidacion.selected = liquidacion;
			$scope.liquidacion.verDetalle = true;

		};

		$scope.anexarComprobantes = function(){
			$scope.sinLiquidarPayment.addToPrePayment($scope.preLiquidacion.selected._id)
					.then(function(response){
						dialogs.notify('Liquidaciones', response.data.message);
						$scope.cargarSinLiquidar();
						$scope.cargarDetallePreLiquidacion($scope.preLiquidacion.selected);
					}, function(){
						dialogs.error('Liquidaciones', 'Se produjo un error al intentar anexar los comprobantes a la pre-liquidación');
						//acá hay que ver que pasa
					});
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

		$scope.eliminarPreLiquidacion = function(){
			var dlg = dialogs.confirm('Liquidaciones', 'Se eliminará la pre-liquidación número ' + $scope.preLiquidacion.selected.preNumber +'. ¿Confirma la operación?');
			dlg.result.then(function(){
				$scope.preLiquidacion.cargando = true;
				$scope.preLiquidacion.selected.deletePayment()
						.then(function(response){
							dialogs.notify('Liquidaciones', response.data.message);
							$scope.recargar();
							$scope.preLiquidacion.cargando = false;
						}, function(response){
							//console.log(response);
							dialogs.error('Liquidaciones', 'Se ha producido un error al intentar borrar la pre-liquidación.');
							$scope.preLiquidacion.cargando = false;
						});
			});
		};

		$scope.liquidar = function(){
			var dlg = dialogs.confirm('Liquidaciones', 'Se procesará la pre-liquidación número ' + $scope.preLiquidacion.selected.preNumber +' de modo que pueda ser cobrada. ¿Confirma la operación?');
			dlg.result.then(function(){
				$scope.preLiquidacion.cargando = true;
				$scope.preLiquidacion.verDetalle = false;
				$scope.preLiquidacion.selected.setPayment()
						.then(function(response){
							dialogs.notify('Liquidaciones', response.data.message);
							$scope.recargar();
							$scope.preLiquidacion.cargando = false;
						}, function(response){
							dialogs.error('Liquidaciones', response.data.message);
							$scope.preLiquidacion.cargando = false;
						});
			});
		};

		$scope.mostrarTope = function(pagina, totalItems){
			var max = pagina * $scope.itemsPerPage;
			return max > totalItems ? totalItems : max;
		};

		$scope.descargarCSV = function(){
			var alterModel = angular.copy($scope.sinLiquidar.model);
			if ($scope.sinLiquidarPayment.byContainer) {
				alterModel.byContainer = true;
			}
			liquidacionesFactory.getNotPayedCsv(alterModel, function(status){
				if (status != 'OK'){
					dialogs.error('Liquidaciones', 'Se ha producido un error al descargar el listado de comprobantes sin liquidar.');
				}
			})
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

		$scope.recargar = function(){
			$scope.preLiquidacion.verDetalle = false;
			$scope.preLiquidacion.selected = {};
			$scope.liquidacion.verDetalle = false;
			$scope.liquidacion.selected = {};
			$scope.sinLiquidar.currentPage = 1;

			$scope.preLiquidacion.currentPage = 1;
			$scope.liquidacion.currentPage = 1;

			$scope.cargarSinLiquidar();
			$scope.cargarPreLiquidaciones();
			$scope.cargarLiquidaciones();
		};

		$scope.$on('$destroy', function(){
			liquidacionesFactory.cancelRequest();
		});

	}]);
