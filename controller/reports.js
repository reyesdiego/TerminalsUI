/**
 * Created by kolesnikov-a on 17/06/14.
 */

myapp.controller('reportsCtrl', ['$scope', '$state', function ($scope, $state){

	$scope.tabs = [
		{name: 'Tasas a las cargas', ref: 'reports.tasas', active: $state.includes('reports.tasas')},
		{name: 'Totales por tarifa', ref: 'reports.tarifas', active: $state.includes('reports.tarifas')},
		{name: 'Facturación por empresa', ref: 'reports.empresas', active: $state.includes('reports.empresas')},
		{name: 'Tarifas por terminal', ref: 'reports.terminales', active: $state.includes('reports.terminales')}
	]

}]);
