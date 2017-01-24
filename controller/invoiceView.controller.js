/**
 * Created by artiom on 30/03/15.
 */
myapp.controller('vistaComprobantesCtrl', ['$rootScope', '$scope', 'loginService', 'generalFunctions', 'dialogs', '$state', '$window', 'invoiceFactory', 'Invoice',
	function($rootScope, $scope, loginService, generalFunctions, dialogs, $state, $window, invoiceFactory, Invoice){

		//console.log($scope.mostrarPtosVenta);
		$scope.dataTerminal = loginService;

		$scope.status = {
			open: true
		};
		$scope.currentPage = 1;
		$scope.itemsPerPage = 15;
		//Variables para control de fechas
		$scope.maxDateD = new Date();
		$scope.maxDateH = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);
		$scope.logoTerminal = loginService.logoTerminal;

		$scope.comprobantesVistos = [];

		$scope.acceso = loginService.type;

		// Puntos de Ventas
		$scope.todosLosPuntosDeVentas = [
			{'heading': 'Todos los Puntos de Ventas', 'punto': '', 'active': true}
		];
		$scope.indexActive = 0;

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
			var invoice = new Invoice(comprobante);
			$scope.mostrarDetalle(invoice);
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
			if (filtro == 'fechaInicio') {
				$scope.model[filtro] = new Date(contenido);
				$scope.model.fechaFin = new Date($scope.model.fechaInicio);
				$scope.model.fechaFin.setDate($scope.model.fechaFin.getDate() + 1);
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
				if ($scope.mostrarPtosVenta){
					$scope.model.nroPtoVenta = '';
					$scope.indexActive = 0;
					cargaPuntosDeVenta();
				} else {
					$scope.$emit('cambioFiltro', $scope.model);
				}

			}
		};

		$scope.filtrarOrden = function(filtro){
			$scope.currentPage = 1;
			$scope.model = generalFunctions.filtrarOrden($scope.model, filtro);
			$scope.$emit('cambioOrden', $scope.model);
		};

		$scope.ocultarResultado = function(){
			$scope.mostrarResultado = false;
		};

		$scope.cambiaPtoVenta = function (pto) {
			//$scope.todosLosPuntosDeVentas.forEach(function (ptos) { ptos.active = false; });
			$scope.indexActive = pto.index;
			$scope.model['nroPtoVenta'] = pto.punto;
			$scope.$emit('cambioFiltro', $scope.model);
		};

		// Funciones de Puntos de Venta
		var cargaPuntosDeVenta = function(){
			var i = 0;
			$scope.todosLosPuntosDeVentas = [
				{'heading': 'Todos los Puntos de Ventas', 'punto': '', 'index': 0}
			];
			invoiceFactory.getCashbox($scope.$id, cargaDatosSinPtoVenta(), function(data){
				if (data.status == 'OK'){
					data.data.forEach(function(punto){
						i++;
						var dato = {'heading': punto, 'punto': punto, 'index': i };
						/*if ($scope.model['nroPtoVenta'] == punto){
							$scope.indexActive = i;
						}*/
						$scope.todosLosPuntosDeVentas.push(dato);
					});
					$scope.currentPage = 1;
					$scope.$emit('cambioFiltro', $scope.model);
				} else {
					dialogs.error('Comprobantes', 'Se ha producido un error al cargar los puntos de venta');
				}
			});
		};

		$scope.mostrarDetalle = function(comprobante){
			$scope.loadingState = true;
			if (!comprobante.controlled){
				$scope.comprobantesVistos.push(comprobante);
				comprobante.controlled = true;
			}
			comprobante.mostrarDetalle().then(function(){
				comprobante.controlarTarifas();
				$scope.verDetalle = comprobante;
				$scope.mostrarResultado = true;
				$scope.loadingState = false;
			}, function(error){
				dialogs.error('Comprobantes', 'Se ha producido un error al cargar los datos del comprobante. ' + error.data.message);
				$scope.loadingState = false;
			})
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

		$scope.trackInvoice = function(invoice){
			invoice.trackInvoice().then(function(data){
				//cargaPuntosDeVenta();
			}, function(error){
				console.log('eeror en track invoice');
				console.log(error);
				dialogs.error('Error', error.message);
			});
		};

		$scope.trackContainer = function(contenedor){
			var url = $state.href('container', {container: contenedor});
			$window.open(url,'_blank');
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

		if (loginService.isLoggedIn){
			if ($scope.mostrarPtosVenta){
				cargaPuntosDeVenta()
			} else {
				$scope.$emit('cambioFiltro', $scope.model);
			}
		};

		$scope.verPdf = function(){
			$scope.disablePdf = true;
			$scope.verDetalle.verPdf()
					.then(function(){
						$scope.disablePdf = false;
					}, function(){
						dialogs.error('Comprobantes', 'Se ha producido un error al procesar el comprobante');
						$scope.disablePdf = false;
					});
		};

		$scope.$on('logout', function(){
			$scope.mostrarResultado = false;
		})

	}]);
