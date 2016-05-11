/**
 * Created by kolesnikov-a on 17/06/14.
 */

myapp.controller('reportsCtrl', ['$scope', '$state', function ($scope, $state){

	$state.transitionTo('reports.tasas');

	$scope.tabs = [
		{name: 'Tasas a las cargas', ref: 'reports.tasas', active: true},
		{name: 'Totales por tarifa', ref: 'reports.tarifas', active: false},
		{name: 'Facturación por empresa', ref: 'reports.empresas', active: false},
		{name: 'Tarifas por terminal', ref: 'reports.terminales', active: false}
	];

}]);
