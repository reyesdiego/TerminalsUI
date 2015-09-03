/**
 * Created by kolesnikov-a on 21/02/14.
 */

myapp.controller('tasaCargasCtrl', ['$scope', 'invoiceFactory', 'gatesFactory', 'turnosFactory', 'afipFactory', 'generalFunctions', 'loginService', function($scope, invoiceFactory, gatesFactory, turnosFactory, afipFactory, generalFunctions, loginService) {

	$scope.ocultarFiltros = ['nroPtoVenta', 'nroComprobante', 'codTipoComprob', 'documentoCliente', 'codigo', 'estado', 'buque', 'itemsPerPage', 'contenedor', 'comprobantes', 'rates'];
	$scope.filtrosComprobantes = ['codTipoComprob', 'nroComprobante', 'razonSocial', 'fechaInicio', 'nroPtoVentaOrden', 'codTipoComprobOrden', 'nroComprobOrden', 'razonOrden', 'fechaOrden', 'importeOrden', 'codigo', 'contenedor', 'comprobantes', 'buque', 'rates'];

	$scope.ocultaTasas = true;
	$scope.loadingState = false;
	$scope.invoices = [];
	$scope.loadingInvoices = false;
	$scope.gates = [];
	$scope.loadingGates = false;
	$scope.turnos = [];
	$scope.loadingTurnos = false;
	$scope.tasas = [];
	$scope.loadingTasas = false;
	$scope.detalleGates = false;
	$scope.volverAPrincipal = false;

	$scope.openDate = function(event){
		generalFunctions.openDate(event);
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
	$scope.contenedorElegido = {};

	$scope.itemsPerPage = 10;
	$scope.totalItems = 0;
	$scope.panelMensaje = {
		titulo: 'Buque - Viaje',
		mensaje: 'No se encontraron contenedores para los filtros seleccionados.',
		tipo: 'panel-info'
	};
	$scope.sumariaConfigPanel = {
		tipo: 'panel-info',
		titulo: 'A.F.I.P. sumaria',
		mensaje: 'No se encontraron datos de sumarias de A.F.I.P relacionados.'
	};

	$scope.model = {
		'nroPtoVenta': '',
		'codTipoComprob': 0,
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
		'filtroOrden': 'gateTimestamp',
		'filtroOrdenAnterior': '',
		'filtroOrdenReverse': false,
		'mov': '',
		'order': '',
		'itemsPerPage': 15,
		'rates': '',
		'payment': '',
		'payed': ''
	};

	$scope.resultado = [];

	$scope.comprobantesVistosTasas = [];

	$scope.loadingTasaCargas = true;
	$scope.hayError = false;

	$scope.currentPageComprobantes = 1;
	$scope.pageComprobantes = {
		skip: 0,
		limit: $scope.model.itemsPerPage
	};

	$scope.$on('cambioPagina', function(event, data){
		$scope.currentPageComprobantes = data;
		$scope.loadingInvoices = true;
		$scope.cargaComprobantes();
	});

	$scope.$on('cambioOrden', function(event, data){
		$scope.cargaComprobantes();
	});

	$scope.$on('cambioFiltro', function(event, data){
		$scope.controlTasaCargas()
	});

	$scope.$on('errorSinTasaCargas', function(event, error){
		$scope.mensajeResultado = {
			titulo: 'Error',
			mensaje: 'Se produjo un error al cargar los datos. Inténtelo nuevamente más tarde o comuníquese con el soporte técnico.',
			tipo: 'panel-danger'
		};
		$scope.loadingTasaCargas = false;
	});

	$scope.$on('errorInesperado', function(e, mensaje){
		$scope.hayError = true;
		$scope.loadingTasaCargas = false;
		$scope.totalContenedores = 0;
		$scope.resultado = [];
		$scope.mensajeResultado = mensaje;
	});

	$scope.filtrado = function(filtro, contenido){
		$scope.model[filtro] = contenido;
		$scope.controlTasaCargas();
	};

	$scope.verContenedor = function(contenedor) {
		$scope.volverAPrincipal = !$scope.volverAPrincipal;
		$scope.model.contenedor = contenedor;
		$scope.contenedorElegido.contenedor = contenedor;
		$scope.loadingInvoices = true;
		$scope.invoices = [];
		$scope.loadingGates = true;
		$scope.gates = [];
		$scope.loadingTurnos = true;
		$scope.turnos = [];
		$scope.detalle = true;
		$scope.currentPageContainers = 1;
		$scope.currentPageComprobantes = 1;
		$scope.cargaComprobantes();
		$scope.cargaGates();
		$scope.cargaTurnos();
		$scope.cargaSumaria();
	};

	$scope.cargaComprobantes = function(){
		var model = {};
		angular.copy($scope.model, model);
		model.fechaInicio = '';
		model.fechaFin = '';
		$scope.pageComprobantes.skip = (($scope.currentPageComprobantes - 1) * $scope.model.itemsPerPage);
		$scope.pageComprobantes.limit = $scope.model.itemsPerPage;
		invoiceFactory.getInvoice($scope.$id, model, $scope.pageComprobantes, function(data){
			if(data.status === 'OK'){
				$scope.invoices = data.data;
				$scope.invoicesTotalItems = data.totalCount;
			} else {
				$scope.mensajeResultado = {
					titulo: 'Comprobantes',
					mensaje: 'Se ha producido un error al cargar los datos de los comprobantes.',
					tipo: 'panel-danger'
				}
			}
			$scope.loadingInvoices = false;
		});
	};

	$scope.cargaGates = function(page){
		page = page || { skip: 0, limit: $scope.itemsPerPage };
		if (page.skip == 0){ $scope.currentPage = 1}
		gatesFactory.getGate({contenedor: $scope.model.contenedor}, page, function (data) {
			if (data.status === "OK") {
				$scope.gates = data.data;
				$scope.gatesTotalItems = data.totalCount;
			} else {
				$scope.configPanelGates = {
					tipo: 'panel-danger',
					titulo: 'Gates',
					mensaje: 'Se ha producido un error al cargar los datos de los gates.'
				}
			}
			$scope.loadingGates = false;
		});
	};

	$scope.cargaTurnos = function(page){
		page = page || { skip:0, limit: $scope.itemsPerPage };
		turnosFactory.getTurnos({contenedor: $scope.model.contenedor}, page, function(data){
			if (data.status === "OK"){
				$scope.turnos = data.data;
				$scope.turnosTotalItems = data.totalCount;
			} else {
				$scope.configPanelTurnos = {
					tipo: 'panel-danger',
					titulo: 'Turnos',
					mensaje: 'Se ha producido un error al cargar los datos de los turnos.'
				}
			}
			$scope.loadingTurnos = false;
		});
	};

	$scope.cargaSumaria = function(){
		$scope.cargandoSumaria = true;
		afipFactory.getContainerSumaria($scope.model.contenedor, function(data){
			if (data.status == 'OK'){
				$scope.sumariaAfip = data.data;
			} else {
				$scope.sumariaConfigPanel = {
					tipo: 'panel-danger',
					titulo: 'A.F.I.P. sumaria',
					mensaje: 'Se ha producido un error al cargar los datos de la sumaria de A.F.I.P.'
				}
			}
			$scope.cargandoSumaria = false;
		})
	};

	$scope.controlTasaCargas = function(){
		/*Acá control de tasa a las cargas*/
		$scope.hayError = false;
		$scope.loadingTasaCargas = true;
		$scope.detalle = false;
		$scope.model.contenedor = '';
		$scope.resultado = [];
		for (var elemento in $scope.model){
			if (!angular.isDefined($scope.model[elemento])) $scope.model[elemento] = '';
		}
		$scope.$broadcast('checkAutoComplete');
		invoiceFactory.getContainersSinTasaCargas($scope.model, function(data){
			if (data.status == "OK"){
				$scope.totalContenedores = data.totalCount;
				data.data.forEach(function(contenedor){
					$scope.resultado.push(contenedor.contenedor);
				});
			} else {
				$scope.hayError = true;
				$scope.mensajeResultado = {
					titulo: 'Error',
					mensaje: 'Se ha producido un error al cargar los datos.',
					tipo: 'panel-danger'
				};
			}
			$scope.loadingTasaCargas = false;
		});
	};

	if (loginService.getStatus()) $scope.controlTasaCargas();

	$scope.$on('terminoLogin', function(){
		$scope.controlTasaCargas();
	});

	$scope.$on('cambioTerminal', function(){
		$scope.controlTasaCargas();
	});

	$scope.$on('destroy', function(){
		invoiceFactory.cancelRequest();
		turnosFactory.cancelRequest();
		//Agregar las que falten
	});

}]);

myapp.controller('correlatividadCtrl', ['$rootScope', '$scope', 'invoiceFactory', 'vouchersArrayCache', 'correlativeSocket', 'loginService', function($rootScope, $scope, invoiceFactory, vouchersArrayCache, correlativeSocket, loginService) {

	var socketIoRegister = '';

	correlativeSocket.emit('newUser', function (sess){
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
		'codTipoComprob': 1,
		'fechaInicio': $scope.desde,
		'fechaFin': $scope.hasta
	};

	$scope.traerPuntosDeVenta = function(){
		invoiceFactory.getCashbox($scope.$id, {}, function(data){
			if (data.status == 'OK'){
				var i;
				$scope.terminalSellPoints = data.data;
				$scope.model.codTipoComprob = 1;
				$scope.model.nroPtoVenta = $scope.terminalSellPoints[0];
				for (i = 1; i<$scope.terminalSellPoints.length; i++){
					$scope.model.nroPtoVenta = $scope.model.nroPtoVenta + ',' + $scope.terminalSellPoints[i];
				}
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

	$scope.$on('cambioFiltro', function(event, data){
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
			$scope.controlCorrelatividad();
		}
	});

	$scope.$on('errorInesperado', function(e, mensaje){
		$scope.loadingCorrelatividad = false;
		$scope.pantalla.titulo = mensaje.titulo;
		$scope.pantalla.tipo = mensaje.tipo;
		$scope.pantalla.mensajeCorrelativo = mensaje.mensaje;
		$scope.pantalla.puntosDeVenta = [];
	});

	$scope.generarInterfaz = function(punto){
		$scope.loadingCorrelatividad = false;
		var pantalla = {
			mensajeCorrelativo: '',
			tipo: '',
			titulo: '',
			resultadoCorrelativo: ''
		};
		pantalla.nroPtoVenta = punto.nroPtoVenta;
		pantalla.titulo = "Punto de Venta " + punto.nroPtoVenta;
		if (punto.totalCount > 0){
			pantalla.totalCnt = punto.totalCount;
			pantalla.tipo = "panel-danger";
			pantalla.resultadoCorrelativo = punto.data;
			$scope.mostrarBotonImprimir = true;
			$scope.puntosDeVenta.push(angular.copy(pantalla));
		}
		$scope.arrayCargados.push(punto.nroPtoVenta);
		$scope.totalPuntos--
	};

	$scope.controlCorrelatividad = function(){
		$scope.arrayCargados = [];
		$scope.leerData = true;
		$scope.totalFaltantes = 0;
		$scope.totalPuntos = $scope.model.nroPtoVenta.split(',').length;
		$scope.deshabilitarBuscar = true;
		$scope.loadingCorrelatividad = true;
		$scope.puntosDeVenta = [];
		$scope.tipoComprob = vouchersArrayCache.get($scope.model.codTipoComprob);
		$scope.mostrarBotonImprimir = false;

		invoiceFactory.getCorrelative($scope.model, socketIoRegister, function(dataComprob) {
			if (dataComprob.status == 'OK'){
				if ($scope.totalPuntos > 0){
					$scope.leerData = false;
					dataComprob.data.forEach(function(punto){
						if (!in_array(punto.nroPtoVenta, $scope.arrayCargados)){
							$scope.generarInterfaz(punto);
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
			$scope.generarInterfaz(data);
			$scope.$apply();
		}
	});

	if (loginService.getStatus()) $scope.traerPuntosDeVenta();

	$scope.$on('terminoLogin', function(){
		$scope.traerPuntosDeVenta();
	});

	$scope.$on('cambioTerminal', function(){
		$scope.arrayCargados = [];
		$scope.totalFaltantes = 0;
		$scope.pantalla = {
			titulo:  "Correlatividad",
			tipo: "panel-info",
			mensajeCorrelativo : 'Seleccione tipo de comprobante y presione el botón "Buscar" para realizar el control.'
		};
		$scope.puntosDeVenta = [];
		$scope.traerPuntosDeVenta();
	});

	$scope.$on('$destroy', function(){
		correlativeSocket.disconnect();
	});

}]);

myapp.controller('codigosCtrl', ['$scope', 'invoiceFactory', 'priceFactory', function($scope, invoiceFactory, priceFactory) {
	$scope.ocultarFiltros = ['nroPtoVenta', 'nroComprobante', 'codTipoComprob', 'nroPtoVenta', 'documentoCliente', 'contenedor', 'codigo', 'razonSocial', 'estado', 'buque', 'rates'];

	$scope.model = {
		'nroPtoVenta': '',
		'codTipoComprob': 0,
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

	$scope.controlFiltros = 'codigos';
	$scope.hayFiltros = false;

	$scope.currentPageCodigos = 1;
	$scope.totalItemsCodigos = 0;
	$scope.pageCodigos = {
		skip: 0,
		limit: $scope.model.itemsPerPage
	};

	$scope.currentPageFiltros = 1;
	$scope.totalItemsFiltros = 0;
	$scope.pageFiltros = {
		skip:0,
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

	$scope.$on('errorInesperado', function(){
		$scope.loadingControlCodigos = false;
		$scope.comprobantesRotos = [];
	});

	$scope.$on('cambioPagina', function(event, data){
		if ($scope.controlFiltros == 'codigos'){
			$scope.currentPageCodigos = data;
			$scope.pageChangedCodigos();
		} else {
			$scope.currentPageFiltros = data;
			$scope.controlCodigosFiltrados();
		}
	});

	$scope.$on('cambioFiltro', function(event, data){
		$scope.currentPageCodigos = 1;
		$scope.currentPageFiltros = 1;
		$scope.model = data;
		if ($scope.controlFiltros == 'codigos'){
			if ($scope.model.code != ''){
				$scope.controlFiltros = 'filtros';
				$scope.ocultarFiltros = ['nroPtoVenta'];
				$scope.anteriorCargaCodigos = $scope.comprobantesRotos;
				$scope.totalItemsSinFiltrar = $scope.totalItems;
				$scope.mostrarPtosVentas = true;
				$scope.controlCodigosFiltrados();
			} else {
				$scope.controlDeCodigos();
			}
		} else {
			if ($scope.model.code == ''){
				$scope.ocultarFiltros = ['nroPtoVenta', 'nroComprobante', 'codTipoComprob', 'nroPtoVenta', 'documentoCliente', 'contenedor', 'codigo', 'razonSocial', 'estado', 'buque', 'rates'];
				$scope.controlFiltros = 'codigos';
				$scope.mostrarPtosVentas = false;
				$scope.controlDeCodigos();
			} else {
				$scope.controlCodigosFiltrados();
			}
		}
	});

	$scope.$on('cambioOrden', function(event, data){
		if ($scope.controlFiltros == 'codigos'){
			$scope.controlDeCodigos();
		} else {
			$scope.controlCodigosFiltrados();
		}
	});

	$scope.controlDeCodigos = function(){
		var model = {
			fechaInicio:	$scope.model.fechaInicio,
			fechaFin:		$scope.model.fechaFin
		};
		$scope.controlFiltros = 'codigos';
		$scope.loadingControlCodigos = true;
		$scope.hayFiltros = false;
		$scope.model.code = '';
		$scope.comprobantesRotos = [];
		$scope.pageCodigos.skip = (($scope.currentPageCodigos - 1) * $scope.model.itemsPerPage);
		$scope.pageCodigos.limit = $scope.model.itemsPerPage;
		priceFactory.noMatches(model, function(dataNoMatches){
			if (dataNoMatches.status == 'OK'){
				$scope.codigosSinAsociar.total = dataNoMatches.totalCount;
				$scope.codigosSinAsociar.codigos = dataNoMatches.data;
			} else {
				//dialogs.error('Control de códigos', 'Se ha producido un error al cargar los datos.');
				$scope.mensajeResultado = {
					titulo: 'Error',
					mensaje: 'Se produjo un error al cargar los datos. Inténtelo nuevamente más tarde o comuníquese con el soporte técnico.',
					tipo: 'panel-danger'
				};
				$scope.loadingControlCodigos = false;
			}
		});
		invoiceFactory.getInvoicesNoMatches($scope.model, $scope.pageCodigos, function(invoicesNoMatches){
			if (invoicesNoMatches.status == 'OK'){
				$scope.comprobantesRotos = invoicesNoMatches.data;
				$scope.totalItems = invoicesNoMatches.totalCount;
			} else {
				$scope.mensajeResultado = {
					titulo: 'Error',
					mensaje: 'Se produjo un error al cargar los datos. Inténtelo nuevamente más tarde o comuníquese con el soporte técnico.',
					tipo: 'panel-danger'
				};
			}
			$scope.loadingControlCodigos = false;
		});
	};

	$scope.controlCodigosFiltrados = function(){
		$scope.loadingControlCodigos = true;
		$scope.pageFiltros.skip = (($scope.currentPageFiltros - 1) * $scope.model.itemsPerPage);
		$scope.pageFiltros.limit = $scope.model.itemsPerPage;
		invoiceFactory.getInvoice($scope.$id, $scope.model, $scope.pageFiltros, function(data){
			if (data.status == 'OK'){
				$scope.totalItems = data.totalCount;
				$scope.comprobantesRotos = data.data;
			} else {
				$scope.mensajeResultado = {
					titulo: 'Error',
					mensaje: 'Se produjo un error al cargar los datos. Inténtelo nuevamente más tarde o comuníquese con el soporte técnico.',
					tipo: 'panel-danger'
				};
			}
			$scope.loadingControlCodigos = false;
		});
	};

	$scope.pageChangedCodigos = function(){
		$scope.loadingControlCodigos = true;
		$scope.comprobantesRotos = [];
		$scope.pageCodigos.skip = (($scope.currentPageCodigos - 1) * $scope.model.itemsPerPage);
		$scope.pageCodigos.limit = $scope.model.itemsPerPage;
		invoiceFactory.getInvoicesNoMatches($scope.model, $scope.pageCodigos, function(data){
			if (data.status == 'OK'){
				$scope.comprobantesRotos = data.data;
				$scope.totalItems = data.totalCount;
			} else {
				$scope.mensajeResultado = {
					titulo: 'Error',
					mensaje: 'Se produjo un error al cargar los datos. Inténtelo nuevamente más tarde o comuníquese con el soporte técnico.',
					tipo: 'panel-danger'
				};
			}
			$scope.loadingControlCodigos = false;
		});
	};

	$scope.$on('destroy', function(){
		invoiceFactory.cancelRequest();
	});

}]);

myapp.controller('comprobantesPorEstadoCtrl', ['$rootScope', '$scope', 'invoiceFactory', function($rootScope, $scope, invoiceFactory) {

	var misEstados = $scope.estado.split(',');

	if (misEstados.length == 1){
		$scope.ocultarFiltros = ['nroPtoVenta', 'estado'];
	} else {
		$scope.ocultarFiltros = ['nroPtoVenta'];
	}

	$scope.fechaFin = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);

	$scope.model = {
		'nroPtoVenta': '',
		'codTipoComprob': 0,
		'nroComprobante': '',
		'razonSocial': '',
		'documentoCliente': '',
		'fechaInicio': '',
		'fechaFin': $scope.fechaFin,
		'contenedor': '',
		'buqueNombre': '',
		'viaje': '',
		'estado': $scope.estado,
		'code': '',
		'filtroOrden': 'gateTimestamp',
		'filtroOrdenAnterior': '',
		'filtroOrdenReverse': false,
		'order': '',
		'itemsPerPage': 15,
		'rates': '',
		'payment': '',
		'payed': ''
	};

	$scope.page = {
		skip:0,
		limit: $scope.model.itemsPerPage
	};

	$scope.comprobantes = [];

	$scope.loadingState = false;

	$scope.recargar = true;

	$scope.$on('actualizarListado', function(event, data){
		if ($scope.estado != data){
			$scope.currentPage = 1;
			if ($scope.model.estado == 'N'){
				$scope.model.estado = $scope.estado;
			}
			$scope.traerComprobantes();
		}
	});

	$scope.$on('cambioPagina', function(event, data){
		$scope.currentPage = data;
		if ($scope.model.estado == 'N'){
			$scope.model.estado = $scope.estado;
		}
		$scope.traerComprobantes();
	});

	$scope.$on('cambioFiltro', function(){
		$scope.recargar = false;
		$scope.currentPage = 1;
		if ($scope.model.estado == 'N'){
			$scope.model.estado = $scope.estado;
		}
		$scope.traerComprobantes();
	});

	$scope.$on('cambioOrden', function(event, data){
		$scope.traerComprobantes();
	});

	$scope.$on('errorInesperado', function(e, mensaje){
		$scope.loadingState = false;
		$scope.comprobantes = [];
		$scope.mensajeResultado = mensaje;
	});

	$scope.traerComprobantes = function(){
		$scope.page.skip = (($scope.currentPage - 1) * $scope.model.itemsPerPage);
		$scope.page.limit = $scope.model.itemsPerPage;
		$scope.loadingState = true;
		invoiceFactory.getInvoice($scope.$id, $scope.model, $scope.page, function(invoiceError){
			if (invoiceError.status == 'OK'){
				$scope.comprobantes = invoiceError.data;
				$scope.totalItems = invoiceError.totalCount;
				/*$scope.comprobantes.forEach(function(comprobante){
					invoiceFactory.getTrackInvoice(comprobante._id, function(dataTrack){
						comprobante.lastComment = dataTrack.data[0].comment + ' - ' + dataTrack.data[0].user;
					})
				})*/
			} else {
				$scope.mensajeResultado = {
					titulo: 'Error',
					mensaje: 'Se produjo un error al cargar los datos. Inténtelo nuevamente más tarde o comuníquese con el soporte técnico.',
					tipo: 'panel-danger'
				};
				$scope.comprobantes = [];
			}
			$scope.loadingState = false;
		})
	};

	$scope.$on('destroy', function(){
		invoiceFactory.cancelRequest();
	});

}]);