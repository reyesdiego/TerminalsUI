/**
 * Created by kolesnikov-a on 28/04/2017.
 */
myapp.directive('liquidacionesSearch', function(){
	return {
		restrict:		'E',
		templateUrl:	'view/liquidaciones/accordion.liquidacion.search.html',
		scope: {
			model:					"=",
			ocultarFiltros:			"="
		},
		controller: 'searchController'
	}
});

myapp.directive('tableSinLiquidar', ['dialogs', 'generalFunctions', 'loginService', function(dialogs, generalFunctions, loginService){
	return {
		restrict:		'E',
		templateUrl:	'view/liquidaciones/table.sinLiquidar.html',
		scope: {
			payment:				"=",
			model:					"=",
			tasaAgp:				"=",
			ocultarFiltros:			"="
		},
		link: function(scope){
			scope.acceso = loginService.type;
			scope.logoTerminal = loginService.logoTerminal;
			scope.panelMensaje = {
				titulo: 'Liquidaciones',
				mensaje: 'No se encontraron comprobantes para los filtros seleccionados.',
				tipo: 'panel-info'
			};
			scope.cargando = false;
			//scope.byContainer = false;
			scope.itemsPerPage = 15;
			scope.currentPage = 1;
			scope.mostrarResultado = false;

			function loadInvoices(){
				const page = {
					skip: (scope.currentPage - 1) * scope.itemsPerPage,
					limit: scope.itemsPerPage
				};
				scope.cargando = true;
				scope.payment.getInvoices(page).then().catch(() => {
					scope.panelMensaje = {
						titulo: 'Liquidaciones',
						mensaje: 'Se produjo un error al cargar los comprobantes.',
						tipo: 'panel-danger'
					};
				}).finally(() => scope.cargando = false);
			}

			scope.filter = function(filtro, contenido){
				if (filtro == 'date'){
					scope.model.fechaInicio = new Date(contenido);
					scope.model.fechaFin = new Date(contenido);
				} else {
					scope.model[filtro] = contenido;
				}
				scope.$emit('iniciarBusqueda', scope.model);
			};

			scope.changeView = function(){
				scope.payment.byContainer ? scope.totalCount = scope.payment.invoicesByContainer.totalCount : scope.totalCount = scope.payment.invoices.totalCount;
			};

			scope.cambioPagina = function(){
				loadInvoices();
			};

			scope.mostrarDetalle = function(invoice){
				scope.cargando = true;
				invoice.mostrarDetalle().then(() => {
					//scope.model.invoiceSelected = invoice;
					//$scope.sinLiquidar.comprobantes = response.datosInvoices;
					//$scope.commentsInvoice = response.commentsInvoice;
					scope.verDetalle = invoice;
					scope.mostrarResultado = true;
				}).catch((error) => {
					//console.log(error);
					dialogs.error('Liquidaciones', 'Se ha producido un error al cargar los datos del comprobante. ' + error.data.message);
				}).finally(() => scope.cargando = false);
			};

			scope.ocultarResultado = function(){
				scope.mostrarResultado = false;
			};

			scope.ordenar = function(filtro){
				scope.payment.searchParams = generalFunctions.filtrarOrden(scope.payment.searchParams, filtro);
				loadInvoices();
			};

			scope.verPdf = function(){
				scope.disablePdf = true;
				scope.verDetalle.verPdf().then().catch(() => {
					dialogs.error('Comprobantes', 'Se ha producido un error al procesar el comprobante');
				}).finally(() => scope.disablePdf = false);
			};

			loadInvoices();
		}
	}
}]);

myapp.directive('tablePreLiquidacion', function(){
	return {
		restrict:		'E',
		scope: {
			cargando:			'=',
			datosPagos:			'=',
			pagoSelected:		'=',
			panelMensaje:		'=',
			detalle:			'&'
		},
		templateUrl:	'view/liquidaciones/table.preLiquidacion.html'
	}
});

myapp.directive('tablePagos', function(){
	return {
		restrict:		'E',
		scope: {
			cargando:			'=',
			data:			'=',
			panelMensaje:		'=',
			detalle:			'&'
		},
		templateUrl:	'view/liquidaciones/table.pagos.html',
		controller:		'tablaAnidadaCtrl'
	}
});

myapp.directive('detalleLiquidacion', function(){
	return {
		restrict:		'E',
		templateUrl:	'view/liquidaciones/detalle.liquidacion.html',
		scope: {
			payment:	'=',
			tasaAgp:	'='
		}
	}
});