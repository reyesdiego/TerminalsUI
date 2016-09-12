/**
 * Created by kolesnikov-a on 17/06/14.
 */

myapp.controller('reportsCtrl', ['$scope', '$state', function ($scope, $state){

	$scope.active = 0;

	$scope.tabs = [
		{name: 'Tasas a las cargas', ref: 'reports.tasas'},
		{name: 'Totales por tarifa', ref: 'reports.tarifas'},
		{name: 'Facturación por empresa', ref: 'reports.empresas'},
		{name: 'Tarifas por terminal', ref: 'reports.terminales'}
	];

	for (var i = 0; i < $scope.tabs.length; i++){
		if ($state.$current.self.name == $scope.tabs[i].ref) $scope.active = i;
	}


}]);
