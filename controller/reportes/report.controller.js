/**
 * Created by kolesnikov-a on 17/06/14.
 */

myapp.controller('reportsCtrl', ['$scope', function ($scope){

	$scope.active = 0;

	$scope.tabs = [
		{name: 'Tasas a las cargas', ref: 'reports.tasas'},
		{name: 'Totales por tarifas agrupadas', ref: 'reports.groups'},
		//{name: 'Totales por tarifas', ref: 'reports.tarifas'},
		{name: 'Facturación por empresa', ref: 'reports.empresas'},
		{name: 'Tarifas por terminal', ref: 'reports.terminales'},
		{name: 'Facturación contenedores', ref: 'reports.containers'}
	];

	$scope.$on('$stateChangeSuccess', function (ev, to) {
		for (var i = 0; i < $scope.tabs.length; i++){
			if (to.name == $scope.tabs[i].ref) $scope.active = i;
		}
	});


}]);
