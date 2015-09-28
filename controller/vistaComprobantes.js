/**
 * Created by artiom on 30/03/15.
 */
myapp.controller('vistaComprobantesCtrl', ['$rootScope', '$scope', 'invoiceFactory', 'loginService', 'generalFunctions', 'dialogs', 'invoiceService',
	function($rootScope, $scope, invoiceFactory, loginService, generalFunctions, dialogs, invoiceService){
		$scope.status = {
			open: true
		};
		$scope.currentPage = 1;
		$scope.itemsPerPage = 15;
		//Variables para control de fechas
		$scope.maxDateD = new Date();
		$scope.maxDateH = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);
		$scope.logoTerminal = $rootScope.logoTerminal;

		$scope.comprobantesVistos = [];

		$scope.acceso = $rootScope.esUsuario;

		// Puntos de Ventas
		$scope.todosLosPuntosDeVentas = [];

		$scope.mostrarResultado = false;
		$scope.verDetalle = {};

		//Control de tarifas
		$scope.controlTarifas = [];

		$scope.commentsInvoice = [];

		$scope.comprobantesControlados = [];

		$scope.actualizarComprobante = null;

		$scope.disablePdf = false;

		$scope.$on('borrarEstado', function(){
			$scope.filtrado('estado', 'N');
		});

		$scope.$on('mostrarComprobante', function(event, comprobante){
			$scope.mostrarDetalle(comprobante);
		});

		$scope.$on('iniciarBusqueda', function(event, model){
			$scope.filtrado();
		});

		$rootScope.$watch('moneda', function(){
			$scope.moneda = $rootScope.moneda;
		});

		$scope.$watch('ocultarFiltros', function() {
			$scope.currentPage = 1;
		});

		$scope.$watch('panelMensaje', function(){
			if (!angular.isDefined($scope.panelMensaje) || $scope.panelMensaje == {}){
				$scope.panelMensaje = {
					titulo: 'Comprobantes',
					mensaje: 'No se encontraron comprobantes para los filtros seleccionados.',
					tipo: 'panel-info'
				};
			}
		});
		$scope.$watch('volverAPrincipal', function() {
			$scope.mostrarResultado = false;
		});

		$scope.$watch('model.rates', function(){
			if ($scope.model.rates != 1) $scope.model.payment = '';
		});

		$scope.$watch('model.payment', function(){
			if ($scope.model.payment != 1) $scope.model.payed = '';
		});

		$scope.filtrado = function(filtro, contenido){
			$scope.loadingState = true;
			$scope.mostrarResultado = false;
			$scope.currentPage = 1;
			$scope.model[filtro] = contenido;
			if (filtro == 'razonSocial') {
				$scope.model[filtro] = $scope.filtrarCaracteresInvalidos(contenido);
			}
			if ($scope.model.fechaInicio > $scope.model.fechaFin && $scope.model.fechaFin != ''){
				$scope.model.fechaFin = new Date($scope.model.fechaInicio);
				$scope.model.fechaFin.setDate($scope.model.fechaFin.getDate() + 1);
			}
			for (var elemento in $scope.model){
				if (!angular.isDefined($scope.model[elemento])) $scope.model[elemento] = '';
			}
			if (filtro == 'nroPtoVenta'){
				$scope.$emit('cambioFiltro', $scope.model);
			} else {
				cargaPuntosDeVenta();
			}
		};

		$scope.filtrarOrden = function(filtro){
			$scope.currentPage = 1;
			$scope.model = generalFunctions.filtrarOrden($scope.model, filtro);
			$scope.$emit('cambioOrden', $scope.model);
		};

		$scope.trackInvoice = function(comprobante){
			invoiceService.trackInvoice(comprobante)
				.then(function(response){
					if (angular.isDefined(response)) comprobante = response;
				}, function(message){
					dialogs.error('Liquidaciones', message);
				})
		};

		$scope.checkComprobantes = function(comprobante){
			var response;
			response = invoiceService.checkComprobantes(comprobante, $scope.comprobantesVistos, $scope.datosInvoices);
			$scope.datosInvoices = response.datosInvoices;
			$scope.comprobantesVistos = response.comprobantesVistos;
		};


		$scope.ocultarResultado = function(comprobante){
			$scope.checkComprobantes(comprobante);
			$scope.mostrarResultado = false;
		};

		$scope.cambiaPtoVenta = function (pto) {
			$scope.todosLosPuntosDeVentas.forEach(function (ptos) { ptos.active = false; });
			pto.active = true;
			$scope.model['nroPtoVenta'] = pto.punto;
			$scope.$emit('cambioFiltro', $scope.model);
			//$scope.filtrado('nroPtoVenta', pto.punto);
		};

		// Funciones de Puntos de Venta
		var cargaPuntosDeVenta = function(){
			if ($scope.todosLosPuntosDeVentas.length > 0){
				invoiceFactory.getCashbox($scope.$id, cargaDatosSinPtoVenta(), function(data){
					if (data.status == 'OK'){
						$scope.todosLosPuntosDeVentas.forEach(function(puntosVenta){
							puntosVenta.hide = data.data.indexOf(puntosVenta.punto, 0) < 0;
							if ($scope.model != undefined && puntosVenta.punto == $scope.model.nroPtoVenta && puntosVenta.hide){
								$scope.model.nroPtoVenta = '';
								$scope.todosLosPuntosDeVentas[0].active = true;
							}
						});
						$scope.todosLosPuntosDeVentas[0].hide = false;
						$scope.currentPage = 1;
						$scope.$emit('cambioFiltro', $scope.model);
					} else {
						dialogs.error('Comprobantes', 'Se ha producido un error al cargar los puntos de venta');
					}
				});
			} else {
				cargaTodosLosPuntosDeVentas();
			}
		};

		var cargaTodosLosPuntosDeVentas = function(){
			invoiceFactory.getCashbox($scope.$id, '', function(data){
				if (data.status == 'OK'){
					var dato = {'heading': 'Todos los Puntos de Ventas', 'punto': '', 'active': true, 'hide': false};
					$scope.todosLosPuntosDeVentas.push(dato);
					data.data.forEach(function(punto){
						dato = {'heading': punto, 'punto': punto, 'active': false, 'hide': true};
						$scope.todosLosPuntosDeVentas.push(dato);
					});
					cargaPuntosDeVenta();
				} else {
					dialogs.error('Comprobantes', 'Se ha producido un error al cargar los puntos de venta');
				}
			})
		};

		$scope.mostrarDetalle = function(comprobante){
			$scope.loadingState = true;
			invoiceService.mostrarDetalle(comprobante._id, $scope.comprobantesVistos, $scope.datosInvoices)
				.then(function(response){
					$scope.verDetalle = response.detalle;
					$scope.datosInvoices = response.datosInvoices;
					$scope.comprobantesVistos = response.comprobantesVistos;
					$scope.commentsInvoice = response.commentsInvoice;
					$scope.mostrarResultado = true;
					$scope.loadingState = false;
				});
		};

		$scope.devolverEstado = function(estado){
			switch (estado){
				case 'G':
					return 'Controlado';
					break;
				case 'Y':
					return 'Sin revisar';
					break;
				case 'R':
					return 'Error';
					break;
				case 'E':
					return 'Reenviar';
					break;
				case 'T':
					return 'Error en resultado';
					break;
			}
		};

		$scope.chequearTarifas = function(comprobante){
			var resultado = invoiceService.chequearTarifas(comprobante, $scope.comprobantesControlados);
			$scope.comprobantesControlados = resultado.data;
			return resultado.retValue;
		};

		$scope.existeDescripcion = function(itemId){
			return invoiceService.existeDescripcion(itemId);
		};

		$scope.mostrarTope = function(){
			var max = $scope.currentPage * 10;
			return max > $scope.totalItems ? $scope.totalItems : max;
		};

		function cargaDatosSinPtoVenta(){
			var datos = {};
			angular.copy($scope.model, datos); //|| { nroPtoVenta : '' };
			datos.nroPtoVenta = '';
			return datos;
		}

		if (loginService.getStatus() && ($scope.mostrarPtosVenta || $scope.controlCodigos)) cargaTodosLosPuntosDeVentas();

		$scope.$on('terminoLogin', function(){
			$scope.acceso = $rootScope.esUsuario;
			if ($scope.mostrarPtosVenta || $scope.controlCodigos) cargaTodosLosPuntosDeVentas();
		});

		$scope.$on('cambioTerminal', function(){
			$scope.mostrarResultado = false;
			$scope.logoTerminal = $rootScope.logoTerminal;
			$scope.comprobantesVistos = [];
			if ($scope.mostrarPtosVenta || $scope.controlCodigos) cargaTodosLosPuntosDeVentas();
		});

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

	}]);
