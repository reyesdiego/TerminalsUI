/**
 * Created by kolesnikov-a on 21/02/14.
 */

myapp.controller('tasaCargasCtrl', ['$scope', 'invoiceFactory', 'gatesFactory', 'turnosFactory', 'afipFactory', 'generalFunctions', 'loginService', function($scope, invoiceFactory, gatesFactory, turnosFactory, afipFactory, generalFunctions, loginService) {

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

	$scope.$on('iniciarBusqueda', function(event, data){
		controlTasaCargas()
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

	var controlTasaCargas = function(){
		/*Acá control de tasa a las cargas*/
		$scope.hayError = false;
		$scope.loadingTasaCargas = true;
		$scope.mostrarDetalle = false;
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

	if (loginService.getStatus()) controlTasaCargas();

	$scope.$on('terminoLogin', function(){
		controlTasaCargas();
	});

	$scope.$on('cambioTerminal', function(){
		controlTasaCargas();
	});

	$scope.$on('destroy', function(){
		invoiceFactory.cancelRequest();
		turnosFactory.cancelRequest();
		//Agregar las que falten
	});

}]);

myapp.controller('correlatividadCtrl', ['$rootScope', '$scope', 'invoiceFactory', 'vouchersArrayCache', 'correlativeSocket', 'loginService', 'downloadFactory', 'dialogs',
	function($rootScope, $scope, invoiceFactory, vouchersArrayCache, correlativeSocket, loginService, downloadFactory, dialogs) {

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
			'codTipoComprob': '1',
			'fechaInicio': $scope.desde,
			'fechaFin': $scope.hasta
		};

		var traerPuntosDeVenta = function(){
			invoiceFactory.getCashbox($scope.$id, {}, function(data){
				if (data.status == 'OK'){
					var i;
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

		$scope.$on('iniciarBusqueda', function(event, data){
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

		$scope.$on('errorInesperado', function(e, mensaje){
			$scope.loadingCorrelatividad = false;
			$scope.pantalla.titulo = mensaje.titulo;
			$scope.pantalla.tipo = mensaje.tipo;
			$scope.pantalla.mensajeCorrelativo = mensaje.mensaje;
			$scope.pantalla.puntosDeVenta = [];
		});

		var generarInterfaz = function(punto){
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

		$scope.imprimirPdf = function(){
			var fechaInicio = $scope.model.fechaInicio;
			var fechaFin = $scope.model.fechaFin;
			if ($scope.model.fechaInicio == ''){
				fechaInicio = new Date(2013, 0, 1);
			}
			if ($scope.model.fechaFin == ''){
				fechaFin = new Date();
			}
			var data = {
				terminal: loginService.getFiltro(),
				resultado: $scope.puntosDeVenta,
				titulo: $scope.tipoComprob.desc + " faltantes " + $scope.totalFaltantes,
				desde: fechaInicio,
				hasta: fechaFin,
				hoy: new Date()
			};
			downloadFactory.convertToPdf(data, 'correlativeResultPdf', function(data, status){
				if (status == 'OK'){

					var file = new Blob([data], {type: 'application/pdf'});
					var fileURL = URL.createObjectURL(file);

					var anchor = angular.element('<a/>');
					anchor.css({display: 'none'}); // Make sure it's not visible
					angular.element(document.body).append(anchor); // Attach to document

					anchor.attr({
						href: fileURL,
						target: '_blank',
						download: $scope.tipoComprob.abrev + '_faltantes_' + loginService.getFiltro() + '.pdf'
					})[0].click();

					anchor.remove(); // Clean it up afterwards

					//window.open(fileURL);
				} else {
					dialogs.error('Tarifario', 'Se ha producido un error al intentar exportar el tarifario a PDF');
				}
			})
		};

		var controlCorrelatividad = function(){
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

		if (loginService.getStatus()) traerPuntosDeVenta();

		$scope.$on('terminoLogin', function(){
			traerPuntosDeVenta();
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
			traerPuntosDeVenta();
		});

		$scope.$on('$destroy', function(){
			correlativeSocket.disconnect();
		});

}]);

myapp.controller('codigosCtrl', ['$scope', 'invoiceFactory', 'priceFactory', function($scope, invoiceFactory, priceFactory) {
	$scope.ocultarFiltros = ['nroPtoVenta', 'nroComprobante', 'codTipoComprob', 'nroPtoVenta', 'documentoCliente', 'contenedor', 'codigo', 'razonSocial', 'estado', 'buque', 'rates'];

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
			pageChangedCodigos();
		} else {
			$scope.currentPageFiltros = data;
			controlCodigosFiltrados();
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
				controlCodigosFiltrados();
			} else {
				controlDeCodigos();
			}
		} else {
			if ($scope.model.code == ''){
				$scope.ocultarFiltros = ['nroPtoVenta', 'nroComprobante', 'codTipoComprob', 'nroPtoVenta', 'documentoCliente', 'contenedor', 'codigo', 'razonSocial', 'estado', 'buque', 'rates'];
				$scope.controlFiltros = 'codigos';
				$scope.mostrarPtosVentas = false;
				controlDeCodigos();
			} else {
				controlCodigosFiltrados();
			}
		}
	});

	$scope.$on('cambioOrden', function(event, data){
		if ($scope.controlFiltros == 'codigos'){
			controlDeCodigos();
		} else {
			controlCodigosFiltrados();
		}
	});

	var controlDeCodigos = function(){
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

	var controlCodigosFiltrados = function(){
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

	var pageChangedCodigos = function(){
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

myapp.controller('comprobantesPorEstadoCtrl', ['$rootScope', '$scope', 'invoiceFactory', 'dialogs',
	function($rootScope, $scope, invoiceFactory, dialogs ) {

		$scope.fechaFin = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);

		$scope.disableDown = false;

		var misEstados = $scope.estado.split(',');

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
				traerComprobantes();
			}
		});

		$scope.$on('cambioPagina', function(event, data){
			$scope.currentPage = data;
			if ($scope.model.estado == 'N'){
				$scope.model.estado = $scope.estado;
			}
			traerComprobantes();
		});

		$scope.$on('cambioFiltro', function(){
			$scope.recargar = false;
			$scope.currentPage = 1;
			if ($scope.model.estado == 'N'){
				$scope.model.estado = $scope.estado;
			}
			traerComprobantes();
		});

		$scope.$on('cambioOrden', function(event, data){
			traerComprobantes();
		});

		$scope.$on('errorInesperado', function(e, mensaje){
			$scope.loadingState = false;
			$scope.comprobantes = [];
			$scope.mensajeResultado = mensaje;
		});

		var traerComprobantes = function(){
			$scope.page.skip = (($scope.currentPage - 1) * $scope.model.itemsPerPage);
			$scope.page.limit = $scope.model.itemsPerPage;
			$scope.loadingState = true;
			invoiceFactory.getInvoice($scope.$id, $scope.model, $scope.page, function(invoiceError){
				if (invoiceError.status == 'OK'){
					$scope.comprobantes = invoiceError.data;
					$scope.totalItems = invoiceError.totalCount;
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

		$scope.descargarCSV = function(){
			$scope.disableDown = true;
			invoiceFactory.getCSV($scope.model, function(data, status){
				if (status == 'OK'){
					var anchor = angular.element('<a/>');
					anchor.css({display: 'none'}); // Make sure it's not visible
					angular.element(document.body).append(anchor); // Attach to document

					anchor.attr({
						href: 'data:attachment/csv;charset=utf-8,' + encodeURI(data),
						target: '_blank',
						download: 'Comprobantes_erroneos.csv'
					})[0].click();

					anchor.remove(); // Clean it up afterwards
				} else {
					dialogs.error('Comprobantes', 'Se ha producio un error al exportar los datos a CSV.');
				}
				$scope.disableDown = false;
			});
		};


		$scope.$on('destroy', function(){
			invoiceFactory.cancelRequest();
		});

	}]);