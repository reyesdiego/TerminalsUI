/**
 * Created by Diego Reyes on 1/23/14.
 */
function loginCtrl($scope, $rootScope, userFactory, $state, $dialogs, loginService){
	'use strict'

	$scope.login = function(){
		userFactory.login($scope.email, $scope.password, function(data){
			if (data.error == 'AuthError'){
				$rootScope.esTerminal = false;
				$dialogs.error('Los datos de inicio de sesión son incorrectos');
			} else {
				loginService.setInfo(data);
				loginService.setStatus(true);
				loginService.setType(data.role);
				loginService.setToken(data.token.token);
				loginService.setAcceso(data.acceso);
				$state.transitionTo('tarifario');

				$rootScope.esUsuario = loginService.getType();
			}
		}
	)}

}
