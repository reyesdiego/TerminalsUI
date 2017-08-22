/**
 * Created by artiom on 08/04/15.
 */
class BuqueViajeCtrl {

	constructor(cacheService, containerFactory, loginService){
		this.buscarBuque = '';
		this.buques = cacheService.cache.get('buquesviaje' + loginService.filterTerminal);

		this.filtrarDesde = 0;
		this.mostrarAnterior = false;

		this.factory = containerFactory;

		this.model = {
			buqueNombre: '',
			viaje: ''
		};

		this.buqueElegido = {
			viajes: []
		};
		this.viajeElegido = null;
		
		this.detalle = false;
		this.loadingState = false;
		this.loadingTasaCargas = false;

		this.datosContainers = [];
		this.filteredContainers = [];
		this.totalItems = 0;
		this.currentPageContainers = 1;
		this.itemsPerPage = 10;

		this.totalSinRates = 0;
		this.containersSinRates = [];
		this.hayError = false;

		this.panelMensaje = {
			titulo: 'Buque-Viaje',
			mensaje: 'Seleccione un buque y un viaje para iniciar la búsqueda.',
			tipo: 'panel-info'
		};

		this.panelContainerNoRates = {
			titulo: 'Sin Tasa a las cargas',
			mensaje: 'Seleccione un buque y un viaje para iniciar la búsqueda.',
			tipo: 'panel-info'
		};

	}

	mostrarMenosViajes(){
		this.filtrarDesde -= 5;
		if (this.filtrarDesde == 0){
			this.mostrarAnterior = false;
		}
	}

	mostrarMasViajes(){
		this.filtrarDesde += 5;
		this.mostrarAnterior = true;
	}

	buqueSelected(selected){
		console.log(selected);
		this.buqueElegido.elegido = '';
		selected.elegido = 'bg-info';
		this.buqueElegido = selected;
		this.buqueElegido.viajes[0][2] = true;
		this.model.buqueNombre = selected.buque;
		this.model.viaje = selected.viajes[0][0];
		this.traerResultados();
	}

	viajeSelected(viaje){
		console.log(viaje);
		this.model.viaje = viaje[0];
		this.viajeElegido = viaje;
		this.traerResultados();
	}

	traerResultados(){
		this.detalle = false;
		this.loadingState = true;
		this.loadingTasaCargas = true;
		this.datosContainers = [];
		this.containersSinRates = [];
		this.factory.getShipContainers(this.model).then((data) => {
			this.datosContainers = data.data;
			this.totalItems = this.datosContainers.length;
			if (this.totalItems == 0){
				this.panelMensaje = {
					titulo: 'Buque-Viaje',
					mensaje: 'No se encontraron contenedores para los filtros seleccionados',
					tipo: 'panel-info'
				};
			}
		}).catch(error => {
			this.panelMensaje = {
				titulo: 'Buque - Viaje',
				mensaje: 'Se ha producido un error al cargar los datos.',
				tipo: 'panel-danger'
			};
		}).finally(this.loadingState = false);
		
		this.factory.getContainersSinTasaCargas(this.model).then((data) => {
			this.totalSinRates = data.totalCount;
			if (this.totalSinRates == 0){
				this.panelContainerNoRates = {
					titulo: 'Sin Tasa a las cargas',
					mensaje: 'No se encontraron contenedores sin tasa a las cargas para los filtros seleccionados',
					tipo: 'panel-info'
				};
			}
			this.containersSinRates = data.data;
		}).catch(error => {
			this.totalSinRates = 0;
			this.hayError = true;
			this.panelContainerNoRates = {
				titulo: 'Error',
				mensaje: 'Se ha producido un error al cargar los datos.',
				tipo: 'panel-danger'
			};
		}).finally(this.loadingTasaCargas = false);
	}

	verDetalles(contenedor){
		//$scope.volverAPrincipal = !$scope.volverAPrincipal;
		this.detalle = true;
		this.contenedorElegido = contenedor;
		//this.model.contenedor = contenedor.contenedor;
		//$scope.filtrar();
	};

}

BuqueViajeCtrl.$inject = ['cacheService', 'containerFactory', 'loginService'];

myapp.controller('buqueViajeCtrl', BuqueViajeCtrl);

/*myapp.controller('buqueViajeCtrl', ['$rootScope', '$scope', 'containerFactory', 'cacheService', '$state', 'loginService', 'Container', '$stateParams',
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
			titulo: 'Sin Tasa a las Cargas',
			mensaje: 'Seleccione un buque para realizar la búsqueda'
		};
		$scope.sumariaConfigPanel = {
			tipo: 'panel-info',
			titulo: 'A.F.I.P. sumaria',
			mensaje: 'No se encontraron datos de sumarias de A.F.I.P relacionados.'
		};

		$scope.buques = cacheService.cache.get('buquesviaje' + loginService.filterTerminal);
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

		$scope.$on('cambioPagina', (event, data) => {
			$scope.currentPage = data;
			cargaComprobantes();
		});

		////// Para containers ////////////////////////////////////////////////////////////////////////////////
		$scope.$on('detalleContenedor', (event, container) => {
			$scope.model.contenedor = container.contenedor;
			$scope.contenedorElegido = container;
			$scope.volverAPrincipal = !$scope.volverAPrincipal;
			$scope.filtrar();
		});

		$scope.$on('iniciarBusqueda', () => {
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

		$scope.$on('errorInesperado', (e, mensaje) => {
			$scope.loadingState = false;
			$scope.panelMensaje = mensaje;
			$scope.totalItems = 0;
			$scope.datosContainers = [];
			//// Para containers /////
			$scope.hayError = true;
			$scope.mensajeGeneral = mensaje;
			///////////////////////////////
		});

		$scope.$on('cambioOrden', (event, data) => {
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
			let cargar = true;
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
						$scope.panelMensaje = {
							titulo: 'Buque-Viaje',
							mensaje: 'No se encontraron contenedores para los filtros seleccionados',
							tipo: 'panel-info'
						};
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
						$scope.panelContainerNoRates = {
							titulo: 'Sin Tasa a las cargas',
							mensaje: 'No se encontraron contenedores sin tasa a las cargas para los filtros seleccionados',
							tipo: 'panel-info'
						};
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

		function cargaComprobantes(){
			$scope.loadingInvoices = true;
			$scope.mensajeResultado = {
				titulo: 'Comprobantes',
				mensaje: 'No se encontraron comprobantes para los filtros seleccionados.',
				tipo: 'panel-info'
			};
			$scope.pageComprobantes.skip = (($scope.currentPage - 1) * $scope.model.itemsPerPage);
			$scope.pageComprobantes.limit = $scope.model.itemsPerPage;
			$scope.contenedorElegido.getInvoicesByContainer().then().catch(() => {
				$scope.mensajeResultado = {
					titulo: 'Comprobantes',
					mensaje: 'Se ha producido un error al cargar los datos de los comprobantes.',
					tipo: 'panel-danger'
				};
			}).finally(() => $scope.loadingInvoices = false);
		}

		function cargaTasasCargas(){
			if (angular.isDefined($scope.model.contenedor) && $scope.model.contenedor != ''){
				$scope.loadingTasas = true;
				$scope.configPanelTasas = {
					tipo: 'panel-info',
					titulo: 'Tasas',
					mensaje: 'No se encontraron tasas para los filtros seleccionados.'
				};
				$scope.contenedorElegido.getRates($state.current.name, $scope.moneda).then().catch((error) => {
					$scope.configPanelTasas = {
						tipo: 'panel-danger',
						titulo: 'Tasas',
						mensaje: 'Se ha producido un error al cargar los datos de las tasas.'
					};
				}).finally(() => {
					$scope.loadingTasas = false;
				});
			}
		}

		function cargaGates(page){
			$scope.loadingGates = true;
			$scope.configPanelGates = {
				tipo: 'panel-info',
				titulo: 'Gates',
				mensaje: 'No se encontraron gates para los filtros seleccionados.'
			};
			page = page || { skip: 0, limit: $scope.itemsPerPage };
			if (page.skip == 0){ $scope.currentPage = 1}
			$scope.contenedorElegido.getGates(page).then().catch(() => {
				$scope.configPanelGates = {
					tipo: 'panel-danger',
					titulo: 'Gates',
					mensaje: 'Se ha producido un error al cargar los gates.'
				};
			}).finally(() => {
				$scope.loadingGates = false;
			});
		}

		function cargaTurnos(page){
			$scope.loadingTurnos = true;
			$scope.configPanelTurnos = {
				tipo: 'panel-info',
				titulo: 'Turnos',
				mensaje: 'No se encontraron Turnos para los filtros seleccionados.'
			};
			page = page || { skip:0, limit: $scope.itemsPerPage };
			$scope.contenedorElegido.getAppointments(page).then().catch(() => {
				$scope.configPanelTurnos = {
					tipo: 'panel-danger',
					titulo: 'Turnos',
					mensaje: 'Se ha producido un error al cargar los turnos.'
				};
			}).finally(() => {
				$scope.loadingTurnos = false;
			});
		}

		function cargaSumaria(){
			$scope.sumariaAfip = [];
			$scope.cargandoSumaria = true;
			$scope.sumariaConfigPanel = {
				tipo: 'panel-info',
				titulo: 'A.F.I.P. sumaria',
				mensaje: 'No se encontraron datos en los registros de A.F.I.P. para el contenedor seleccionado.'
			};
			$scope.contenedorElegido.getAfipData().then().catch((error) => {
				$scope.sumariaConfigPanel = {
					tipo: 'panel-danger',
					titulo: 'A.F.I.P. sumaria',
					mensaje: 'Se produjo un error al cargar los datos de AFIP.'
				};
			}).finally(() => {
				$scope.cargandoSumaria = false;
			});
		}

		$rootScope.$watch('moneda', () => {
			$scope.moneda = $rootScope.moneda;
			if ($scope.detalle){
				cargaTasasCargas();
			}
		});

		$scope.$on('destroy', () => {
			containerFactory.cancelRequest();
			//Agregar las que falten
		});

		if ($stateParams.container){
			$scope.model.contenedor = $stateParams.container;
			$scope.contenedorElegido = new Container({contenedor: $scope.model.contenedor});
			$scope.filtrar();
		}

	}]);*/
