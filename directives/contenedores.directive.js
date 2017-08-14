/**
 * Created by kolesnikov-a on 28/04/2017.
 */
myapp.directive('buqueViajeSearch', function(){
	return {
		restrict:		'E',
		templateUrl:	'view/contenedores/buque.viaje.search.html',
		controller: 'buqueViajeCtrl'
	}
});

myapp.directive('tableBuqueViaje', function(){
	return {
		restrict:		'E',
		templateUrl:	'view/contenedores/buque.viaje.result.html'
	}
});

myapp.directive('buqueViajeDetail', function() {
	return {
		restrict:		'E',
		templateUrl:	'view/contenedores/buque.viaje.detail.html'
	}
});

myapp.directive('tableTasasCargas', function(){
	return {
		restrict:		'E',
		templateUrl:	'view/contenedores/table.tasas.cargas.html',
		scope: {
			configPanel:		'=',
			container:			'=',
			loadingState:		'=',
			moneda:				'='
		}
	}
});

myapp.directive('tableContainerSumaria', function(){
	return {
		restrict:		'E',
		templateUrl:	'view/contenedores/container.sumaria.html',
		scope: {
			datosSumaria:	'=',
			loadingState:	'=',
			configPanel:	'='
		},
		controller: 'containerSumariaCtrl'
	}
});

myapp.directive('giroBuques', function(){
	return {
		restrict: 'E',
		templateUrl: 'view/contenedores/giroBuques.html',
		scope: {
			container: '=',
			loadingState: '='
		}
	}
});

myapp.directive('detalleManifiesto', function(){
	return {
		retrict:        'E',
		templateUrl:    'view/contenedores/container.sumaria.manifiesto.html'
	}
});