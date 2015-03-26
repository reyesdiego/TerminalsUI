/**
 * Created by kolesnikov-a on 21/02/14.
 */

myapp.controller('tasaCargasCtrl', ['$scope', 'invoiceFactory', 'gatesFactory', 'turnosFactory', 'afipFactory', function($scope, invoiceFactory, gatesFactory, turnosFactory, afipFactory) {
	$scope.ocultarFiltros = ['nroPtoVenta', 'nroComprobante', 'codTipoComprob', 'documentoCliente', 'codigo', 'estado', 'buque', 'itemsPerPage', 'contenedor', 'comprobantes'];

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
	$scope.volverAPrincipalComprobantes = false;

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
	$scope.currentPageContainers = 1;
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
		'order': '',
		'itemsPerPage': 15
	};

	$scope.resultado = [];

	$scope.comprobantesVistosTasas = [];

	$scope.loadingTasaCargas = true;
	$scope.hayError = false;

	$scope.$on('cambioPagina', function(event, data){
		$scope.currentPage = data;
		$scope.controlTasaCargas();
	});

	$scope.$on('cambioFiltro', function(){
		$scope.currentPage = 1;
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

	$scope.clientSelected = function(selected){
		if (angular.isDefined(selected) && selected.title != $scope.model.razonSocial){
			$scope.model.razonSocial = selected.title;
			$scope.filtrado('razonSocial', selected.title);
		}
	};

	$scope.containerSelected = function(selected){
		if (angular.isDefined(selected) && selected.title != $scope.model.contenedor){
			$scope.model.contenedor = selected.title;
			$scope.filtrado('contenedor', selected.title);
		}
	};

	$scope.verContenedor = function(contenedor) {
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
		$scope.volverAPrincipalComprobantes = !$scope.volverAPrincipalComprobantes;
		$scope.cargaComprobantes();
		$scope.cargaGates();
		$scope.cargaTurnos();
		$scope.cargaSumaria();
	};

	$scope.cargaComprobantes = function(page){
		page = page || { skip:0, limit: $scope.itemsPerPage };
		if (page.skip == 0){ $scope.currentPage = 1}
		invoiceFactory.getInvoice({contenedor: $scope.model.contenedor}, page, function(data){
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
}]);

myapp.controller('correlatividadCtrl', ['$rootScope', '$scope', 'invoiceFactory', 'socket', 'vouchersArrayCache', function($rootScope, $scope, invoiceFactory, socket, vouchersArrayCache) {

	var socketIoRegister;

	$scope.hasta = new Date();
	$scope.desde = new Date($scope.hasta.getFullYear(), $scope.hasta.getMonth());
	$scope.deshabilitarBuscar = false;
	$scope.totalPuntos = 0;
	$scope.leerData = true;
	$scope.arrayCargados = [];

	$scope.loadingCorrelatividad = false;

	$scope.model = {
		'nroPtoVenta': '',
		'codTipoComprob': 0,
		'fechaInicio': $scope.desde,
		'fechaFin': $scope.hasta
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
		$scope.model = data;
		$scope.controlCorrelatividad();
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

	socket.emit('newUser', function (sess){

		socketIoRegister = sess;
		socket.on('correlative_' + sess, function (data) {
			if ($scope.leerData){
				$scope.generarInterfaz(data);
				$scope.$apply();
			}
		});
	});
}]);

myapp.controller('codigosCtrl', ['$scope', 'invoiceFactory', 'priceFactory', function($scope, invoiceFactory, priceFactory) {
	$scope.ocultarFiltros = ['nroPtoVenta', 'nroComprobante', 'codTipoComprob', 'nroPtoVenta', 'documentoCliente', 'contenedor', 'codigo', 'razonSocial', 'estado', 'buque'];

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
		'itemsPerPage': 15
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
				$scope.ocultarFiltros = ['nroPtoVenta', 'nroComprobante', 'codTipoComprob', 'nroPtoVenta', 'documentoCliente', 'contenedor', 'codigo', 'razonSocial', 'estado', 'buque'];
				$scope.controlFiltros = 'codigos';
				$scope.mostrarPtosVentas = false;
				$scope.controlDeCodigos();
			} else {
				$scope.controlCodigosFiltrados();
			}
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
		invoiceFactory.getInvoice($scope.model, $scope.pageFiltros, function(data){
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

}]);

myapp.controller('comprobantesRevisarCtrl', ['$scope', 'invoiceFactory', function($scope, invoiceFactory) {
	$scope.ocultarFiltros = ['nroPtoVenta', 'estado'];

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
		'order': '',
		'itemsPerPage': 15
	};

	$scope.comprobantesRevisar = [];

	$scope.loadingRevisar = false;

	$scope.$on('cambioPagina', function(event, data){
		$scope.currentPage = data;
		$scope.model.estado = 'C';
		$scope.traerComprobantes();
	});

	$scope.$on('cambioFiltro', function(){
		$scope.currentPage = 1;
		$scope.$broadcast('actualizarPagina', 1);
		$scope.model.estado = 'C';
		$scope.traerComprobantes();
	});

	$scope.$on('errorInesperado', function(e, mensaje){
		$scope.loadingRevisar = false;
		$scope.comprobantesRevisar = [];
		$scope.mensajeResultado = mensaje;
	});

	$scope.traerComprobantes = function(){
		$scope.loadingRevisar = true;
		$scope.page.skip = (($scope.currentPage - 1) * $scope.model.itemsPerPage);
		$scope.page.limit = $scope.model.itemsPerPage;
		$scope.comprobantesRevisar = [];
		invoiceFactory.getInvoice($scope.model, $scope.page, function(invoiceRevisar){
			if (invoiceRevisar.status == 'OK'){
				$scope.comprobantesRevisar = invoiceRevisar.data;
				$scope.totalItems = invoiceRevisar.totalCount;
			} else {
				$scope.mensajeResultado = {
					titulo: 'Error',
					mensaje: 'Se produjo un error al cargar los datos. Inténtelo nuevamente más tarde o comuníquese con el soporte técnico.',
					tipo: 'panel-danger'
				};
				$scope.comprobantesRevisar = [];
			}
			$scope.loadingRevisar = false;
		})
	};
}]);

myapp.controller('comprobantesErrorCtrl', ['$scope', 'invoiceFactory', function($scope, invoiceFactory) {
	$scope.ocultarFiltros = ['nroPtoVenta'];

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
		'order': '',
		'itemsPerPage': 15
	};

	$scope.comprobantesError = [];

	$scope.loadingError = false;

	$scope.$on('cambioPagina', function(event, data){
		$scope.currentPage = data;
		if ($scope.model.estado == 'N'){
			$scope.model.estado = 'R,T';
		}
		$scope.traerComprobantes();
	});

	$scope.$on('cambioFiltro', function(){
		$scope.currentPage = 1;
		if ($scope.model.estado == 'N'){
			$scope.model.estado = 'R,T';
		}
		$scope.$broadcast('actualizarPagina', 1);
		$scope.traerComprobantes();
	});

	$scope.$on('errorInesperado', function(e, mensaje){
		$scope.loadingError = false;
		$scope.comprobantesError = [];
		$scope.mensajeResultado = mensaje;
	});

	$scope.traerComprobantes = function(){
		$scope.page.skip = (($scope.currentPage - 1) * $scope.model.itemsPerPage);
		$scope.page.limit = $scope.model.itemsPerPage;
		$scope.loadingError = true;
		invoiceFactory.getInvoice($scope.model, $scope.page, function(invoiceError){
			if (invoiceError.status == 'OK'){
				$scope.comprobantesError = invoiceError.data;
				$scope.totalItems = invoiceError.totalCount;
				$scope.comprobantesError.forEach(function(comprobante){
					invoiceFactory.getTrackInvoice(comprobante._id, function(dataTrack){
						comprobante.lastComment = dataTrack.data[0].comment + ' - ' + dataTrack.data[0].user;
					})
				})
			} else {
				$scope.mensajeResultado = {
					titulo: 'Error',
					mensaje: 'Se produjo un error al cargar los datos. Inténtelo nuevamente más tarde o comuníquese con el soporte técnico.',
					tipo: 'panel-danger'
				};
				$scope.comprobantesError = [];
			}
			$scope.loadingError = false;
		})
	};
}]);