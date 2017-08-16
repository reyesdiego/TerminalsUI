/**
 * Created by kolesnikov-a on 21/02/14.
 */

myapp.controller('controlComprobantesCtrl', ['$scope', function($scope){

	$scope.active = 0;

	$scope.tabs = [
		{name: 'Control de correlatividad', ref: 'cfacturas.correlatividad'},
		{name: 'Control de códigos', ref: 'cfacturas.codigos'},
		{name: 'Sin Tasa a las cargas', ref: 'cfacturas.tasas'},
		{name: 'Revisar', ref: 'cfacturas.revisar'},
		{name: 'Erróneos', ref: 'cfacturas.erroneos'},
		{name: 'A reenviar', ref: 'cfacturas.reenviar'}
	];

	$scope.viewsStates = {
		tasas: {
			used: false,
			model:{},
			resultado: []
		},
		codigos: {
			used: false,
			model: {},
			codigosSinAsociar: [],
			comprobantesRotos: [],
			totalItems: 0
		}
	};

	$scope.$on('updateView', (ev, view, model, data1, data2, data3) => {
		switch (view){
			case 'tasas':
				$scope.viewsStates[view].model = model;
				$scope.viewsStates[view].resultado = data1;
				$scope.viewsStates[view].used = true;
				break;
			case 'codigos':
				$scope.viewsStates[view].model = model;
				$scope.viewsStates[view].codigosSinAsociar = data1;
				$scope.viewsStates[view].comprobantesRotos = data2;
				$scope.viewsStates[view].totalItems = data3;
				$scope.viewsStates[view].used = true;
				break;
		}
	});

	$scope.$on('$stateChangeSuccess', (ev, to) => {
		for (let i = 0; i < $scope.tabs.length; i++){
			if (to.name == $scope.tabs[i].ref) $scope.active = i;
		}
	});

}]);

myapp.controller('tasaCargasCtrl', ['$scope', 'containerFactory', 'gatesFactory', 'afipFactory', 'generalFunctions', 'loginService', function($scope, containerFactory, gatesFactory, afipFactory, generalFunctions, loginService) {

	$scope.ocultarFiltros = ['nroPtoVenta', 'nroComprobante', 'codTipoComprob', 'documentoCliente', 'codigo', 'estado', 'buque', 'itemsPerPage', 'contenedor', 'comprobantes', 'rates'];
	//$scope.filtrosComprobantes = ['codTipoComprob', 'nroComprobante', 'razonSocial', 'fechaInicio', 'nroPtoVentaOrden', 'codTipoComprobOrden', 'nroComprobOrden', 'razonOrden', 'fechaOrden', 'importeOrden', 'codigo', 'contenedor', 'comprobantes', 'buque', 'rates'];

	$scope.fechaInicio = new Date();
	$scope.fechaFin = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);

	$scope.ocultaTasas = true;
	$scope.loadingState = false;

	$scope.detalleGates = false;

	$scope.openDate = function(event){
		generalFunctions.openDate(event);
	};

	$scope.mostrarDetalle = false;

	//$scope.totalItems = 0;
	$scope.panelMensaje = {
		titulo: 'Buque - Viaje',
		mensaje: 'No se encontraron contenedores para los filtros seleccionados.',
		tipo: 'panel-info'
	};

	$scope.model = {
		'razonSocial': '',
		'fechaInicio': $scope.fechaInicio,
		'fechaFin': $scope.fechaFin,
		'contenedor': '',
		'buqueNombre': ''
	};

	$scope.resultado = [];

	$scope.comprobantesVistosTasas = [];

	$scope.loadingTasaCargas = true;
	$scope.hayError = false;

	$scope.$on('iniciarBusqueda', (event, data) =>{
		controlTasaCargas()
	});

	$scope.$on('errorSinTasaCargas', (event, error) => {
		$scope.mensajeResultado = {
			titulo: 'Error',
			mensaje: 'Se produjo un error al cargar los datos. Inténtelo nuevamente más tarde o comuníquese con el soporte técnico.',
			tipo: 'panel-danger'
		};
		$scope.loadingTasaCargas = false;
	});

	$scope.$on('errorInesperado', (e, mensaje) => {
		$scope.hayError = true;
		$scope.loadingTasaCargas = false;
		$scope.totalContenedores = 0;
		$scope.resultado = [];
		$scope.mensajeResultado = mensaje;
	});

	$scope.clientSelected = function(selected){
		if (angular.isDefined(selected) && selected.title != $scope.model.razonSocial){
			$scope.model.razonSocial = selected.title;
			$scope.filtrado('razonSocial', selected.title);
		}
	};

	$scope.filtrado = function(filtro, contenido){
		$scope.model[filtro] = contenido;
		controlTasaCargas();
	};

	$scope.verContenedor = function(contenedor) {
		$scope.mostrarDetalle = true;
		$scope.$broadcast('detalleContenedor', contenedor);
	};

	function controlTasaCargas(){
		/*Acá control de tasa a las cargas*/
		$scope.hayError = false;
		$scope.loadingTasaCargas = true;
		$scope.mostrarDetalle = false;
		$scope.model.contenedor = '';
		$scope.resultado = [];
		for (let elemento in $scope.model){
			if (!angular.isDefined($scope.model[elemento])) $scope.model[elemento] = '';
		}
		$scope.$broadcast('checkAutoComplete');
		containerFactory.getContainersSinTasaCargas($scope.model).then((data) => {
			$scope.totalContenedores = data.totalCount;
			$scope.resultado = data.data;
			$scope.$emit('updateView', 'tasas', $scope.model, $scope.resultado);
		}).catch(error => {
			$scope.hayError = true;
			$scope.mensajeResultado = {
				titulo: 'Error',
				mensaje: 'Se ha producido un error al cargar los datos.',
				tipo: 'panel-danger'
			};
		}).finally($scope.loadingTasaCargas = false);
	};

	if (loginService.isLoggedIn){
		if ($scope.viewsStates.tasas.used){
			$scope.model = $scope.viewsStates.tasas.model;
			$scope.resultado = $scope.viewsStates.tasas.resultado;
			$scope.totalContenedores = $scope.resultado.length;
			$scope.loadingTasaCargas = false;
			$scope.hayError = false;
		} else {
			controlTasaCargas();
		}
	}

}]);

myapp.controller('correlatividadCtrl', ['$rootScope', '$scope', 'invoiceFactory', 'cacheService', 'correlativeSocket', 'loginService', 'downloadFactory', 'dialogs', 'generalFunctions',
	function($rootScope, $scope, invoiceFactory, cacheService, correlativeSocket, loginService, downloadFactory, dialogs, generalFunctions) {

		let socketIoRegister = '';

		correlativeSocket.emit('newUser', (sess) => {
			socketIoRegister = sess;
			correlativeSocket.forward('correlative_' + sess, $scope);
		});

		$scope.ocultarFiltros = ['razonSocial', 'nroPtoVenta', 'nroComprobante', 'documentoCliente', 'codigo', 'estado', 'buque', 'contenedor', 'viaje', 'itemsPerPage', 'rates'];

		$scope.hasta = new Date();
		$scope.desde = new Date($scope.hasta.getFullYear(), $scope.hasta.getMonth());
		$scope.deshabilitarBuscar = false;
		$scope.totalPuntos = 0;
		$scope.leerData = true;
		$scope.arrayCargados = [];
		$scope.terminalSellPoints = [];

		$scope.loadingCorrelatividad = false;

		$scope.model = {
			'nroPtoVenta': '',
			'codTipoComprob': '1',
			'fechaInicio': $scope.desde,
			'fechaFin': $scope.hasta
		};

		function traerPuntosDeVenta(){
			invoiceFactory.getCashbox($scope.$id, {}, function(data){
				if (data.status == 'OK'){
					let i;
					$scope.terminalSellPoints = data.data;
					//$scope.model.codTipoComprob = '1';
					$scope.model.nroPtoVenta = $scope.terminalSellPoints[0];
					for (i = 1; i<$scope.terminalSellPoints.length; i++){
						$scope.model.nroPtoVenta = $scope.model.nroPtoVenta + ',' + $scope.terminalSellPoints[i];
					}
					controlCorrelatividad();
				}
			})
		};

		$scope.tipoComprob = '';
		$scope.puntosDeVenta = [];
		$scope.totalFaltantes = 0;

		$scope.pantalla = {
			titulo:  "Correlatividad",
			tipo: "panel-info",
			mensajeCorrelativo : 'Seleccione tipo de comprobante y presione el botón "Buscar" para realizar el control.'
		};

		$scope.mostrarBotonImprimir = false;
		$scope.puntosDeVenta = [];

		$scope.$on('iniciarBusqueda', (event, data) => {
			if ($scope.model.codTipoComprob == 0){
				$scope.mostrarBotonImprimir = false;
				$scope.totalFaltantes = 0;
				$scope.puntosDeVenta = [];
				$scope.pantalla = {
					titulo:  "Correlatividad",
					tipo: "panel-info",
					mensajeCorrelativo : 'Seleccione tipo de comprobante y presione el botón "Buscar" para realizar el control.'
				};
			} else {
				controlCorrelatividad();
			}
		});

		$scope.$on('errorInesperado', (e, mensaje) => {
			$scope.loadingCorrelatividad = false;
			$scope.pantalla.titulo = mensaje.titulo;
			$scope.pantalla.tipo = mensaje.tipo;
			$scope.pantalla.mensajeCorrelativo = mensaje.mensaje;
			$scope.pantalla.puntosDeVenta = [];
		});

		function generarInterfaz(punto){
			$scope.loadingCorrelatividad = false;
			let pantalla = {
				mensajeCorrelativo: '',
				tipo: '',
				titulo: '',
				resultadoCorrelativo: ''
			};
			pantalla.nroPtoVenta = punto.nroPtoVenta;
			pantalla.titulo = "Punto de Venta " + punto.nroPtoVenta;
			if (punto.totalCount > 0){
				pantalla.totalCnt = punto.totalCount;
				pantalla.tipo = "panel-info";
				pantalla.resultadoCorrelativo = punto.data;
				$scope.mostrarBotonImprimir = true;
				$scope.puntosDeVenta.push(angular.copy(pantalla));
			}
			$scope.arrayCargados.push(punto.nroPtoVenta);
			$scope.totalPuntos--
		};

		$scope.imprimirPdf = function(){
			let fechaInicio = $scope.model.fechaInicio;
			let fechaFin = $scope.model.fechaFin;
			if ($scope.model.fechaInicio == ''){
				fechaInicio = new Date(2013, 0, 1);
			}
			if ($scope.model.fechaFin == ''){
				fechaFin = new Date();
			}
			const data = {
				terminal: loginService.filterTerminal,
				resultado: $scope.puntosDeVenta,
				titulo: $scope.tipoComprob.desc + " faltantes " + $scope.totalFaltantes,
				desde: fechaInicio,
				hasta: fechaFin,
				hoy: new Date()
			};
			const nombreReporte = $scope.tipoComprob.abrev + '_faltantes_' + loginService.filterTerminal + '.pdf';
			downloadFactory.convertToPdf(data, 'correlativeResultPdf', nombreReporte).then().catch(() => {
				dialogs.error('Tarifario', 'Se ha producido un error al intentar exportar el tarifario a PDF');
			});
		};

		function controlCorrelatividad(){
			const vouchersArray = cacheService.vouchersArray;

			$scope.arrayCargados = [];
			$scope.leerData = true;
			$scope.totalFaltantes = 0;
			$scope.totalPuntos = $scope.model.nroPtoVenta.split(',').length;
			$scope.deshabilitarBuscar = true;
			$scope.loadingCorrelatividad = true;
			$scope.puntosDeVenta = [];
			$scope.tipoComprob = vouchersArray[$scope.model.codTipoComprob];
			$scope.mostrarBotonImprimir = false;

			invoiceFactory.getCorrelative($scope.model, socketIoRegister, function(dataComprob) {
				if (dataComprob.status == 'OK'){
					if ($scope.totalPuntos > 0){
						$scope.leerData = false;
						dataComprob.data.forEach(function(punto){
							if (!generalFunctions.in_array(punto.nroPtoVenta, $scope.arrayCargados)){
								generarInterfaz(punto);
							}
						});
						$scope.totalPuntos = 0;
					}
					$scope.totalFaltantes = dataComprob.totalCount;
					if (dataComprob.totalCount === 0){
						$scope.pantalla = {
							titulo:  "Correlatividad",
							tipo: "panel-info",
							mensajeCorrelativo : 'No se hallaron comprobantes faltantes.'
						};
					}
				} else {
					$scope.pantalla = {
						titulo:  "Correlatividad",
						tipo: "panel-danger",
						mensajeCorrelativo : 'Se ha producido un error al cargar los datos.'
					};
				}
				$scope.loadingCorrelatividad = false;
			});
		};

		$scope.$watch('totalPuntos', function(){
			if ($scope.totalPuntos == 0){
				$scope.deshabilitarBuscar = false;
			}
		});

		$scope.$on('socket:correlative_' + socketIoRegister, function(ev, data){
			if ($scope.leerData){
				generarInterfaz(data);
				$scope.$apply();
			}
		});

		if (loginService.isLoggedIn) traerPuntosDeVenta();

		$scope.$on('$destroy', function(){
			correlativeSocket.disconnect();
		});

}]);

myapp.controller('codigosCtrl', ['$scope', 'priceFactory', 'invoiceFactory', function($scope, priceFactory, invoiceFactory) {
	$scope.ocultarFiltros = ['nroPtoVenta', 'nroComprobante', 'codTipoComprob', 'documentoCliente', 'contenedor', 'estado', 'buque', 'rates'];

	$scope.fechaInicio = new Date();
	$scope.fechaFin = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);

	$scope.model = {
		'nroPtoVenta': '',
		'codTipoComprob': '',
		'nroComprobante': '',
		'razonSocial': '',
		'documentoCliente': '',
		'fechaInicio': $scope.fechaInicio,
		'fechaFin': $scope.fechaFin,
		'contenedor': '',
		'buqueNombre': '',
		'viaje': '',
		'estado': 'N',
		'code': '',
		'filtroOrden': 'fecha.emision',
		'filtroOrdenAnterior': '',
		'filtroOrdenReverse': false,
		'order': '',
		'itemsPerPage': 15,
		'rates': '',
		'payment': '',
		'payed': ''
	};

	$scope.currentPageCodigos = 1;
	$scope.totalItemsCodigos = 0;
	$scope.pageCodigos = {
		skip: 0,
		limit: $scope.model.itemsPerPage
	};

	$scope.codigosSinAsociar = {
		total: 0,
		codigos: []
	};
	$scope.comprobantesRotos = [];

	$scope.loadingControlCodigos = false;
	$scope.anteriorCargaCodigos = [];
	$scope.totalItemsSinFiltrar = 0;

	$scope.mostrarPtosVentas = false;

	$scope.panelMensaje = {
		titulo: 'Control de códigos',
		mensaje: 'Seleccione los parámetros y presione "Buscar" para iniciar la búsqueda.',
		tipo: 'panel-info'
	};

	$scope.$on('errorInesperado', () => {
		$scope.loadingControlCodigos = false;
		$scope.comprobantesRotos = [];
	});

	$scope.$on('cambioPagina', (event, data) => {
		$scope.currentPageCodigos = data;
		pageChangedCodigos();
	});

	$scope.$on('cambioFiltro', (event, data) => {
		$scope.currentPageCodigos = 1;
		$scope.model = data;
		controlDeCodigos();
	});

	$scope.$on('cambioOrden', (event, data) => {
		controlDeCodigos();
	});

	function getInvoices(){
		invoiceFactory.getInvoicesNoMatches($scope.model, $scope.pageCodigos).then((invoicesNoMatches) => {
			$scope.comprobantesRotos = invoicesNoMatches.data;
			$scope.totalItems = invoicesNoMatches.totalCount;
		}).catch((error) => {
			$scope.mensajeResultado = {
				titulo: 'Error',
				mensaje: 'Se produjo un error al cargar los datos. Inténtelo nuevamente más tarde o comuníquese con el soporte técnico.',
				tipo: 'panel-danger'
			};
		}).finally(() => $scope.loadingControlCodigos = false);
	}

	function controlDeCodigos(){
		const alterModel = {
			fechaInicio:	$scope.model.fechaInicio,
			fechaFin:		$scope.model.fechaFin
		};
		$scope.loadingControlCodigos = true;
		$scope.comprobantesRotos = [];
		$scope.pageCodigos.skip = (($scope.currentPageCodigos - 1) * $scope.model.itemsPerPage);
		$scope.pageCodigos.limit = $scope.model.itemsPerPage;
		priceFactory.noMatches(alterModel).then((dataNoMatches) => {
			$scope.codigosSinAsociar.total = dataNoMatches.totalCount;
			$scope.codigosSinAsociar.codigos = dataNoMatches.data;
		}).catch((error) => {
			//dialogs.error('Control de códigos', 'Se ha producido un error al cargar los datos.');
			$scope.mensajeResultado = {
				titulo: 'Error',
				mensaje: 'Se produjo un error al cargar los datos. Inténtelo nuevamente más tarde o comuníquese con el soporte técnico.',
				tipo: 'panel-danger'
			};
		}).finally(() => $scope.loadingControlCodigos = false);
		getInvoices();
	};

	function pageChangedCodigos(){
		$scope.loadingControlCodigos = true;
		$scope.comprobantesRotos = [];
		$scope.pageCodigos.skip = (($scope.currentPageCodigos - 1) * $scope.model.itemsPerPage);
		$scope.pageCodigos.limit = $scope.model.itemsPerPage;
		getInvoices();
	};

	$scope.$on('$destroy', function(){
		$scope.$emit('updateView', 'codigos', $scope.model, $scope.codigosSinAsociar, $scope.comprobantesRotos, $scope.totalItems);
	});

	if ($scope.viewsStates.codigos.used){
		$scope.model = $scope.viewsStates.codigos.model;
		$scope.codigosSinAsociar = $scope.viewsStates.codigos.codigosSinAsociar;
		$scope.comprobantesRotos = $scope.viewsStates.codigos.comprobantesRotos;
		$scope.totalItems = $scope.viewsStates.codigos.totalItems;
	}

}]);

myapp.controller('comprobantesPorEstadoCtrl', ['$rootScope', '$scope', 'invoiceFactory', 'dialogs',
	function($rootScope, $scope, invoiceFactory, dialogs ) {

		$scope.fechaFin = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);

		$scope.disableDown = false;

		const misEstados = $scope.estado.split(',');

		if (misEstados.length == 1){
			$scope.ocultarFiltros = ['nroPtoVenta', 'estado'];
		} else {
			$scope.ocultarFiltros = ['nroPtoVenta'];
		}

		$scope.fechaFin = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);

		$scope.model = {
			'nroPtoVenta': '',
			'codTipoComprob': '',
			'nroComprobante': '',
			'razonSocial': '',
			'documentoCliente': '',
			'fechaInicio': '',
			'fechaFin': $scope.fechaFin,
			'contenedor': '',
			'buqueNombre': '',
			'viaje': '',
			'estado': $scope.estado == 'E' ? 'N' : $scope.estado,
			'code': '',
			'filtroOrden': 'gateTimestamp',
			'filtroOrdenAnterior': '',
			'filtroOrdenReverse': false,
			'order': '',
			'itemsPerPage': 15,
			'rates': '',
			'payment': '',
			'payed': '',
			'resend': $scope.estado == 'E' ? 1 : undefined
		};

		$scope.page = {
			skip:0,
			limit: $scope.model.itemsPerPage
		};

		$scope.comprobantes = [];

		$scope.loadingState = true;

		$scope.recargar = true;

		function checkEstado(){
			if ($scope.estado == 'E') {
				$scope.model.resend = 1;
			} else {
				if ($scope.model.estado == 'N'){
					$scope.model.estado = $scope.estado;
				}
			}
		};

		$scope.$on('actualizarListado', (event, data) => {
			if ($scope.estado != data){
				$scope.currentPage = 1;
				traerComprobantes();
			}
		});

		$scope.$on('cambioPagina', (event, data) => {
			$scope.currentPage = data;
			traerComprobantes();
		});

		$scope.$on('cambioFiltro', () => {
			$scope.recargar = false;
			$scope.currentPage = 1;
			traerComprobantes();
		});

		$scope.$on('cambioOrden', (event, data) => {
			traerComprobantes();
		});

		$scope.$on('errorInesperado', (e, mensaje) => {
			$scope.loadingState = false;
			$scope.comprobantes = [];
			$scope.mensajeResultado = mensaje;
		});

		function traerComprobantes(){
			checkEstado();
			$scope.page.skip = (($scope.currentPage - 1) * $scope.model.itemsPerPage);
			$scope.page.limit = $scope.model.itemsPerPage;
			$scope.loadingState = true;
			invoiceFactory.getInvoices($scope.$id, $scope.model, $scope.page).then((invoiceError) => {
				$scope.comprobantes = invoiceError.data;
				$scope.totalItems = invoiceError.totalCount;
			}).catch((error) => {
				$scope.mensajeResultado = {
					titulo: 'Error',
					mensaje: 'Se produjo un error al cargar los datos. Inténtelo nuevamente más tarde o comuníquese con el soporte técnico.',
					tipo: 'panel-danger'
				};
				$scope.comprobantes = [];
			}).finally(() => $scope.loadingState = false);
		};

		$scope.descargarCSV = function(){
			$scope.disableDown = true;
			invoiceFactory.getCSV($scope.model, 'Comprobantes_erroneos.csv', (status) => {
				if (status != 'OK'){
					dialogs.error('Comprobantes', 'Se ha producido un error al exportar los datos a CSV.');
				}
				$scope.disableDown = false;
			});
		};

	}]);