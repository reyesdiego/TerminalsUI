/**
 * Created by kolesnikov-a on 28/04/2017.
 */
myapp.directive('tableTurnos', function(){
	return {
		restrict:		'E',
		templateUrl:	'view/turnos/table.turnos.html',
		scope: {
			ocultarBusqueda:	'=',
			model:				'=',
			datosTurnos:		'=',
			totalItems:			'=',
			itemsPerPage:		'=',
			configPanel:		'=',
			currentPage:		'=',
			ocultarFiltros:		'=',
			loadingState:		'=',
			control:			'=',
			showCsv:			'=',
			terminal:			'='
		},
		controller: 'searchController'
	}
});