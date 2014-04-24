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
				//Por ahora solo acceso a terminales
				var rutasAcceso = ['tarifario', 'invoices', 'invoices.result', 'invoices.search', 'matches', 'control', 'cfacturas', 'cfacturas.result', 'gates', 'gates.result', 'gates.result.container', 'gates.result.invoices', 'gates.result.invoices.result'];
				//var rutasTerminales = ['tarifario', 'invoices', 'invoices.result', 'matches']; // El que se utiliza en producción
				//$rootScope.esTerminal = true;
				loginService.setInfo(data);
				loginService.setStatus(true);
				loginService.setType('terminal');
				loginService.setToken(data.token.token);
				loginService.setAcceso(rutasAcceso);
				$state.transitionTo('tarifario');

				$rootScope.esUsuario = loginService.getType();
			}
		}
	)}

}
