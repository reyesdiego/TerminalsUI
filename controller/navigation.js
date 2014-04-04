/**
 * Created by Artiom on 14/03/14.
 */

function navigationCtrl($scope, $rootScope, $state, loginService){
	"use strict";
	$rootScope.esTerminal = false;
	$rootScope.esControl = false;

	$scope.menuTerminal = !$rootScope.esTerminal;
	$scope.menuControl = !$rootScope.esControl;

	if (loginService.getStatus()){
		$rootScope.esTerminal = true;
	}

	$scope.$watch('esTerminal', function() {
		$scope.menuTerminal = !$rootScope.esTerminal;
	});

	$scope.salir = function(){
		$rootScope.esTerminal = false;
		$state.transitionTo('login');
		loginService.unsetLogin();
	}

}
