/**
 * Created by kolesnikov-a on 28/04/2017.
 */

myapp.directive('containerDetail', function() {
	return {
		restrict:		'E',
		templateUrl:	'view/contenedores/container.detail.html',
		scope: {
			container: '='
		},
		controller: 'containerDetailCtrl as vmContainer'
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