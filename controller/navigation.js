/**
 * Created by Artiom on 14/03/14.
 */

function navigationCtrl($scope, $rootScope, $state, loginService){
	"use strict";
	$rootScope.esUsuario = '';

	$scope.acceso = '';

	$scope.$watch('esUsuario', function() {
		$scope.acceso = $rootScope.esUsuario;

	});

	$scope.salir = function(){
		$rootScope.esUsuario = '';
		$state.transitionTo('login');
		loginService.unsetLogin();
	}

}
