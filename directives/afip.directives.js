/**
 * Created by kolesnikov-a on 28/04/2017.
 */
myapp.directive('accordionAfipSearch', function(){
	return {
		restrict:		'E',
		templateUrl:	'view/accordion.afip.search.html'
	}
});

myapp.directive('detalleTransbordo', function(){
	return {
		restrict:		'E',
		scope: {
			data:			'='
		},
		templateUrl:	'view/afip/detalleTransbordos.html',
		controller:		'tablaAnidadaCtrl'
	}
});