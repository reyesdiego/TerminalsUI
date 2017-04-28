/**
 * Created by kolesnikov-a on 28/04/2017.
 */
myapp.directive('vistaComprobantes', function(){
	return {
		restrict:		'E',
		templateUrl:	'view/comprobantes/comprobantes.vista.html',
		scope: {
			model:								'=',
			datosInvoices:						'=',
			ocultarFiltros:						'=',
			totalItems:							'=',
			loadingState:						'=',
			controlCodigos:						'=',
			codigosSinAsociar:					'=',
			mostrarPtosVenta:					'=',
			ocultarAccordionInvoicesSearch:		'=',
			ocultarAccordionComprobantesVistos:	'=',
			panelMensaje:						'=',
			volverAPrincipal:					'=',
			filtroEstados:						'='
		},
		controller: 'vistaComprobantesCtrl'
	}
});

myapp.directive('tableInvoices', function(){
	return {
		restrict:		'E',
		templateUrl:	'view/comprobantes/table.invoices.html'
	}
});

myapp.directive('accordionComprobantesVistos', function(){
	return {
		restrict:		'E',
		templateUrl:	'view/comprobantes/accordion.comprobantes.vistos.html',
		link: function ($scope) {
			$scope.quitarVista = function (comprobante) {
				comprobante.controlled = false;
				var pos = $scope.comprobantesVistos.indexOf(comprobante);
				$scope.comprobantesVistos.splice(pos, 1);
			};
		}
	}
});

myapp.directive('accordionInvoicesSearch', function(){
	return {
		restrict:		'E',
		templateUrl:	'view/comprobantes/accordion.invoices.search.html',
		scope: {
			model:				'=',
			ocultarFiltros:		'='
		},
		controller: 'searchController'
	}
});

myapp.directive('invoicesResult', function(){
	return {
		restrict:		'E',
		templateUrl:	'view/comprobantes/invoices.result.html'
	}
});

myapp.directive('comprobantesPorEstado', function(){
	return {
		restrict:		'E',
		templateUrl:	'view/comprobantes/comprobantesPorEstado.html',
		scope: {
			estado:								'@',
			filtroEstados:						'@'
		},
		controller: 'comprobantesPorEstadoCtrl'
	}
});