/**
 * Created by Artiom on 14/03/14.
 */

function navigationCtrl($scope, $rootScope, $location){
	"use strict";
	$rootScope.esTerminal = false;
	$rootScope.esControl = false;

	$scope.menuTerminal = !$rootScope.esTerminal;
	$scope.menuControl = !$rootScope.esControl;

	$scope.$watch('esTerminal', function() {
		$scope.menuTerminal = !$rootScope.esTerminal;
	});

	$scope.salir = function(){
		$rootScope.esTerminal = false;
		$location.url('/login')
	}

}
