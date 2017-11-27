/**
 * Created by kolesnikov-a on 28/04/2017.
 */
myapp.directive('containersGatesSearch', function(){
    return {
        restrict:		'E',
        templateUrl:	'view/gates/accordion.gates.search.html'
    }
});

myapp.directive('tableGates', function(){
    return {
        restrict:       'E',
        templateUrl:    'view/gates/table.gates.html',
        scope: {
            ocultarBusqueda: '=',
            model: '=',
            datosGates: '=',
            totalItems: '=',
            tiempoConsulta: '=',
            itemsPerPage: '=',
            detallesGates: '=',
            ocultarFiltros: '=',
            currentPage: '=',
            configPanel: '=',
            loadingState: '=',
            chartGatesByType: '=',
            chartDiaGatesTurnos: '='
        },
        controller: 'searchController'
    }
});

myapp.directive('tableMissingGates', function(){
    return {
        restrict:       'E',
        templateUrl:    'view/gates/missing.gates.html',
        scope: {
            datoFaltante:   '=',
            savedState:     '='
        },
        controller:         'missingInfo'
    }
});

myapp.directive('tableMissingInvoices', function(){
    return {
        restrict:       'E',
        templateUrl:    'view/gates/missing.invoices.html',
        scope: {
            datoFaltante:   '=',
            savedState:     '='
        },
        controller:         'missingInfo'
    }
});

myapp.directive('tableMissingAppointments', function(){
    return {
        restrict:		'E',
        templateUrl:	'view/gates/missing.appointments.html',
        scope: {
            datoFaltante: '=',
            savedState:		'='
        },
        controller:		'missingInfo'
    }
});