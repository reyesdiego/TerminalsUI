/**
 * Created by artiom on 08/04/15.
 */

myapp.controller('buqueViajeCtrl', ['$rootScope', '$scope', 'containerFactory', 'cacheService', '$state', 'loginService', 'Container', '$stateParams',
	function($rootScope, $scope, containerFactory, cacheService, $state, loginService, Container, $stateParams){
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
			'itemsPerPage': 15,
			'carga': '',
			'ontime': ''
		};
		//////////////////////////////////////

		$scope.pageComprobantes = {
			skip: 0,
			limit: $scope.model.itemsPerPage
		};

		$scope.loadingState = false;
		$scope.loadingInvoices = false;
		$scope.loadingGates = false;
		$scope.loadingTurnos = false;
		$scope.loadingTasas = false;
		$scope.detalleGates = false;
		$scope.volverAPrincipal = false;
		$scope.ocultarFiltros = ['nroPtoVenta', 'codTipoComprob', 'nroComprobante', 'razonSocial', 'documentoCliente', 'codigo', 'estado', 'itemsPerPage', 'fechaInicio', 'fechaFin', 'buque', 'carga', 'ontime', 'rates'];
		$scope.filtrosComprobantes = ['codTipoComprob', 'nroComprobante', 'razonSocial', 'fechaInicio', 'nroPtoVentaOrden', 'codTipoComprobOrden', 'nroComprobOrden', 'razonOrden', 'fechaOrden', 'importeOrden', 'codigo', 'contenedor', 'comprobantes', 'buque', 'rates'];
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
			contenedor: '',
			invoices: {
				data: [],
				total: 0
			}
		};
		$scope.currentPageContainers = 1;
		$scope.itemsPerPage = 10;
		$scope.totalItems = 0;
		$scope.panelMensaje = {
			titulo: 'Buque - Viaje',
			mensaje: 'Seleccione un buque para realizar la búsqueda.',
			tipo: 'panel-info'
		};
		$scope.totalSinRates = 0;
		$scope.panelContainerNoRates = {
			tipo: 'panel-info',
			titulo: 'Contenedores sin Tasa a las Cargas',
			mensaje: 'Seleccione un buque para realizar la búsqueda'
		};
		$scope.sumariaConfigPanel = {
			tipo: 'panel-info',
			titulo: 'A.F.I.P. sumaria',
			mensaje: 'No se encontraron datos de sumarias de A.F.I.P relacionados.'
		};

		$scope.buques = cacheService.cache.get('buquesviaje' + loginService.getFiltro());
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

		$scope.totalSinRates = 0;
		$scope.containersSinRates = [];
		$scope.hayError = false;

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
			cargaComprobantes();
		});

		////// Para containers ////////////////////////////////////////////////////////////////////////////////
		$scope.$on('detalleContenedor', function(event, container){
			$scope.model.contenedor = container.contenedor;
			$scope.contenedorElegido = container;
			$scope.volverAPrincipal = !$scope.volverAPrincipal;
			$scope.filtrar();
		});

		$scope.$on('iniciarBusqueda', function(){
			$scope.volverAPrincipal = !$scope.volverAPrincipal;
			if ($scope.model.contenedor != ''){
				$scope.contenedorElegido = new Container({contenedor: $scope.model.contenedor});
				$scope.filtrar();
			} else {
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
			$scope.buqueElegido.viajes[0][2] = true;
			$scope.model.buqueNombre = selected.buque;
			$scope.model.viaje = selected.viajes[0][0];
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
			$scope.loadingTasaCargas = true;
			$scope.datosContainers = [];
			$scope.containersSinRates = [];
			containerFactory.getShipContainers($scope.model, function(data){
				if (data.status == 'OK'){
					$scope.datosContainers = data.data;
					$scope.totalItems = $scope.datosContainers.length;
					if ($scope.totalItems == 0){
						$scope.panelMensaje.mensaje = 'No se encontraron contenedores para los filtros seleccionados';
					}
				} else {
					$scope.panelMensaje = {
						titulo: 'Buque - Viaje',
						mensaje: 'Se ha producido un error al cargar los datos.',
						tipo: 'panel-danger'
					};
				}
				$scope.loadingState = false;
			});
			containerFactory.getContainersSinTasaCargas($scope.model, function(data){
				if (data.status == "OK"){
					$scope.totalSinRates = data.totalCount;
					if ($scope.totalSinRates == 0){
						$scope.panelContainerNoRates.mensaje = 'No se encontraron contenedores sin tasa a las cargas para los filtros seleccionados';
					}
					$scope.containersSinRates = data.data;
				} else {
					$scope.totalSinRates = 0;
					$scope.hayError = true;
					$scope.panelContainerNoRates = {
						titulo: 'Error',
						mensaje: 'Se ha producido un error al cargar los datos.',
						tipo: 'panel-danger'
					};
				}
				$scope.loadingTasaCargas = false;
			});
		};

		$scope.filtrar = function(){
			$scope.hayError = false;
			cargaComprobantes();
			cargaTasasCargas();
			cargaGates();
			cargaTurnos();
			cargaSumaria();
		};

		$scope.verDetalles = function(contenedor){
			$scope.volverAPrincipal = !$scope.volverAPrincipal;
			$scope.detalle = true;
			$scope.contenedorElegido = contenedor;
			$scope.model.contenedor = contenedor.contenedor;
			$scope.filtrar();
		};

		var cargaComprobantes = function(){
			$scope.loadingInvoices = true;
			$scope.mensajeResultado = {
				titulo: 'Comprobantes',
				mensaje: 'No se encontraron comprobantes para los filtros seleccionados.',
				tipo: 'panel-info'
			};
			$scope.pageComprobantes.skip = (($scope.currentPage - 1) * $scope.model.itemsPerPage);
			$scope.pageComprobantes.limit = $scope.model.itemsPerPage;
			$scope.contenedorElegido.getInvoices($scope.$id, $scope.pageComprobantes).then(function(){
				$scope.loadingInvoices = false;
			}, function(){
				$scope.mensajeResultado = {
					titulo: 'Comprobantes',
					mensaje: 'Se ha producido un error al cargar los datos de los comprobantes.',
					tipo: 'panel-danger'
				};
				$scope.loadingInvoices = false;
			});
		};

		var cargaTasasCargas = function(){
			if (angular.isDefined($scope.model.contenedor) && $scope.model.contenedor != ''){
				$scope.loadingTasas = true;
				$scope.configPanelTasas = {
					tipo: 'panel-info',
					titulo: 'Tasas',
					mensaje: 'No se encontraron tasas para los filtros seleccionados.'
				};
				$scope.contenedorElegido.getRates($state.current.name, $scope.moneda).then(function(){
					$scope.loadingTasas = false;
				}, function(error){
					$scope.configPanelTasas = {
						tipo: 'panel-danger',
						titulo: 'Tasas',
						mensaje: 'Se ha producido un error al cargar los datos de las tasas.'
					};
					$scope.loadingTasas = false;
				});
			}
		};

		var cargaGates = function(page){
			$scope.loadingGates = true;
			$scope.configPanelGates = {
				tipo: 'panel-info',
				titulo: 'Gates',
				mensaje: 'No se encontraron gates para los filtros seleccionados.'
			};
			page = page || { skip: 0, limit: $scope.itemsPerPage };
			if (page.skip == 0){ $scope.currentPage = 1}
			$scope.contenedorElegido.getGates(page).then(function(){
				$scope.loadingGates = false;
			}, function(){
				$scope.configPanelGates = {
					tipo: 'panel-danger',
					titulo: 'Gates',
					mensaje: 'Se ha producido un error al cargar los gates.'
				};
				$scope.loadingGates = false;
			});
		};

		var cargaTurnos = function(page){
			$scope.loadingTurnos = true;
			$scope.configPanelTurnos = {
				tipo: 'panel-info',
				titulo: 'Turnos',
				mensaje: 'No se encontraron Turnos para los filtros seleccionados.'
			};
			page = page || { skip:0, limit: $scope.itemsPerPage };
			$scope.contenedorElegido.getAppointments(page).then(function(){
				$scope.loadingTurnos = false;
			}, function(){
				$scope.configPanelTurnos = {
					tipo: 'panel-danger',
					titulo: 'Turnos',
					mensaje: 'Se ha producido un error al cargar los turnos.'
				};
				$scope.loadingTurnos = false;
			});
		};

		var cargaSumaria = function(){
			$scope.sumariaAfip = [];
			$scope.cargandoSumaria = true;
			$scope.sumariaConfigPanel = {
				tipo: 'panel-info',
				titulo: 'A.F.I.P. sumaria',
				mensaje: 'No se encontraron datos en los registros de A.F.I.P. para el contenedor seleccionado.'
			};
			$scope.contenedorElegido.getAfipData()
				.then(function(){
					$scope.cargandoSumaria = false;
				}, function(error){
					console.log(error);
					$scope.cargandoSumaria = false;
				});
		};

		$rootScope.$watch('moneda', function(){
			$scope.moneda = $rootScope.moneda;
			if ($scope.detalle){
				cargaTasasCargas();
			}
		});

		$scope.$on('destroy', function(){
			containerFactory.cancelRequest();
			//Agregar las que falten
		});

		if ($stateParams.container){
			$scope.model.contenedor = $stateParams.container;
			$scope.contenedorElegido = new Container({contenedor: $scope.model.contenedor});
			$scope.filtrar();
		}

	}]);
