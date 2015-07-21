/**
 * Created by artiom on 30/03/15.
 */
myapp.controller('vistaComprobantesCtrl', ['$rootScope', '$scope', '$filter', 'invoiceFactory', 'loginService', 'statesFactory', 'generalCache', 'generalFunctions', 'dialogs', 'invoiceService',
	function($rootScope, $scope, $filter, invoiceFactory, loginService, statesFactory, generalCache, generalFunctions, dialogs, invoiceService){
		$scope.status = {
			open: true
		};
		$scope.currentPage = 1;
		$scope.itemsPerPage = 15;
		//Variables para control de fechas
		$scope.maxDateD = new Date();
		$scope.maxDateH = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);
		//Tipos de comprobantes
		$scope.vouchers = generalCache.get('vouchers');
		//Listas para autocompletado
		$scope.listaViajes = [];
		$scope.itemsPerPage = [
			{ value: 10, description: '10 items por página', ticked: false},
			{ value: 15, description: '15 items por página', ticked: true},
			{ value: 20, description: '20 items por página', ticked: false},
			{ value: 50, description: '50 items por página', ticked: false}
		];
		$scope.estadosComprobantes = $filter('filter')(generalCache.get('estados'), $scope.filtroEstados);
		$scope.logoTerminal = $rootScope.logoTerminal;

		$scope.estadosComprobantes.forEach(function(unEstado){
			unEstado.ticked = false;
		});

		$scope.comprobantesVistos = [];

		$scope.acceso = $rootScope.esUsuario;

		// Puntos de Ventas
		$scope.todosLosPuntosDeVentas = [];

		$scope.mostrarResultado = false;
		$scope.verDetalle = {};

		//Control de tarifas
		$scope.controlTarifas = [];
		$scope.noMatch = false;

		$scope.commentsInvoice = [];

		$scope.comprobantesControlados = [];

		$scope.actualizarComprobante = null;

		$scope.disablePdf = false;

		$scope.$on('iniciarBusqueda', function(event, data){
			$scope.filtrado(data.filtro, data.contenido);
		});

		$scope.$on('borrarEstado', function(){
			$scope.filtrado('estado', 'N');
		});

		$scope.$on('mostrarComprobante', function(event, comprobante){
			$scope.mostrarDetalle(comprobante);
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

		$scope.cambioItemsPorPagina = function(data){
			$scope.filtrado('itemsPerPage', data.value);
		};

		$scope.$watch('model.rate', function(){
			if ($scope.model.rate != 1) $scope.model.payment = '';
		});

		$scope.$watch('model.payment', function(){
			if ($scope.model.payment != 1) $scope.model.payed = '';
		});

		$scope.estadoSeleccionado = function(data){
			var contenido = '';
			if (data.ticked){
				$scope.estadosComprobantes.forEach(function(unEstado){
					if (unEstado.ticked){
						if (contenido == ''){
							contenido += unEstado._id;
						} else {
							contenido += ',' + unEstado._id;
						}
					}
				});
			} else {
				contenido = $scope.model.estado.replace(',' + data._id, '');
				contenido = contenido.replace(data._id + ',', '');
				contenido = contenido.replace(data._id, '');
				if (contenido == ''){
					contenido = 'N';
				}
			}
			$scope.filtrado('estado', contenido);
		};

		$scope.hitEnter = function(evt){
			if(angular.equals(evt.keyCode,13))
				$scope.cargaPuntosDeVenta();
		};

		$scope.openDate = function(event){
			generalFunctions.openDate(event);
		};

		$scope.clientSelected = function(selected){
			if (angular.isDefined(selected) && selected.title != $scope.model.razonSocial){
				$scope.model.razonSocial = selected.title;
				$scope.filtrado('razonSocial', selected.title);
			}
		};

		$scope.buqueSelected = function(selected){
			if (angular.isDefined(selected) && selected.title != $scope.model.buqueNombre){
				$scope.model.buqueNombre = selected.originalObject.buque;
				var i = 0;
				selected.originalObject.viajes.forEach(function(viaje){
					var objetoViaje = {
						'id': i,
						'viaje': viaje.viaje
					};
					$scope.listaViajes.push(objetoViaje);
					i++;
				});
			}
		};

		$scope.viajeSelected = function(selected){
			if (angular.isDefined(selected) && selected.title != $scope.model.viaje){
				$scope.model.viaje = selected.title;
				$scope.filtrado('viaje', selected.title);
			}
		};

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
			$scope.$broadcast('checkAutoComplete');
			if (filtro == 'nroPtoVenta'){
				$scope.$emit('cambioFiltro', $scope.model);
			} else {
				$scope.cargaPuntosDeVenta();
			}
		};

		$scope.filtrarCaracteresInvalidos = function(palabra){
			if (angular.isDefined(palabra) && palabra.length > 0){
				var palabraFiltrada;
				var caracteresInvalidos = ['*', '(', ')', '+', ':', '?'];
				palabraFiltrada = palabra;
				for (var i = 0; i <= caracteresInvalidos.length - 1; i++){
					if (palabraFiltrada.indexOf(caracteresInvalidos[i], 0) > 0){
						palabraFiltrada = palabraFiltrada.substring(0, palabraFiltrada.indexOf(caracteresInvalidos[i], 0));
					}
				}
				return palabraFiltrada.toUpperCase();
			} else {
				return palabra;
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
			$scope.filtrado('nroPtoVenta', pto.punto);
		};

		// Funciones de Puntos de Venta
		$scope.cargaPuntosDeVenta = function(){
			invoiceFactory.getCashbox(cargaDatosSinPtoVenta(), function(data){
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
		};

		$scope.cargaTodosLosPuntosDeVentas = function(){
			invoiceFactory.getCashbox('', function(data){
				if (data.status == 'OK'){
					var dato = {'heading': 'Todos los Puntos de Ventas', 'punto': '', 'active': true, 'hide': false};
					$scope.todosLosPuntosDeVentas.push(dato);
					data.data.forEach(function(punto){
						dato = {'heading': punto, 'punto': punto, 'active': false, 'hide': true};
						$scope.todosLosPuntosDeVentas.push(dato);
					});
					$scope.cargaPuntosDeVenta();
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
					$scope.noMatch = response.noMatch;
					//$scope.commentsInvoice = [];
					$rootScope.noMatch = $scope.noMatch;
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
			}
		};

		$scope.chequearTarifas = function(comprobante){
			var resultado = invoiceService.chequearTarifas(comprobante, $scope.comprobantesControlados);
			$scope.comprobantesControlados = resultado.data;
			$scope.noMatch = resultado.noMatch;
			$rootScope.noMatch = $scope.noMatch;
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

		if (loginService.getStatus() && ($scope.mostrarPtosVenta || $scope.controlCodigos)) $scope.cargaTodosLosPuntosDeVentas();

		$scope.$on('terminoLogin', function(){
			$scope.acceso = $rootScope.esUsuario;
			if ($scope.mostrarPtosVenta || $scope.controlCodigos) $scope.cargaTodosLosPuntosDeVentas();
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
