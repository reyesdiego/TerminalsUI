/**
 * Created by kolesnikov-a on 28/04/2017.
 */
"use strict";

myapp.directive('vistaComprobantes', () => {
    return {
        restrict:		'E',
        templateUrl:	'view/comprobantes/comprobantes.vista.html',
        scope: {
            model: '=',
            datosInvoices: '=',
            ocultarFiltros: '=',
            totalItems: '=',
            loadingState: '=',
            controlCodigos: '=',
            codigosSinAsociar: '=',
            mostrarPtosVenta: '=',
            ocultarAccordionInvoicesSearch: '=',
            ocultarAccordionComprobantesVistos: '=',
            panelMensaje: '=',
            volverAPrincipal: '=',
            filtroEstados: '=',
            canDescargarCsv: '@',
            byContainer: '@'
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
        restrict: 'E',
        templateUrl: 'view/comprobantes/accordion.comprobantes.vistos.html',
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
        restrict: 'E',
        templateUrl: 'view/comprobantes/accordion.invoices.search.html',
        scope: {
            model: '=',
            ocultarFiltros: '=',
            canDescargarCsv: '@'
        },
        controller: 'searchController'
    }
});

myapp.directive('invoicesResult', function(){
    return {
        restrict: 'E',
        templateUrl: 'view/comprobantes/comprobantes.detalle.html'
    }
});

myapp.directive('comprobantesPorEstado', function(){
    return {
        restrict: 'E',
        templateUrl: 'view/comprobantes/comprobantesPorEstado.html',
        scope: {
            estado: '@',
            filtroEstados: '@'
        },
        controller: 'comprobantesPorEstadoCtrl'
    }
});

myapp.directive('comprobantesResumen', () => {
    return {
        restrict: 'E',
        templateUrl: 'view/comprobantes/comprobantes-resumen.html',
        scope: {
            model: '=',
            invoicesResumen: '='
        },
        controller: 'comprobantesResumenController'
    }
});
