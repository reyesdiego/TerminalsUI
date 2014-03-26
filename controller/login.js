/**
 * Created by Diego Reyes on 1/23/14.
 */
function loginCtrl($scope, $rootScope, userFactory, $location, $dialogs, loginService){
	'use strict'

	$scope.login = function(){
		userFactory.login($scope.email, $scope.password, function(data){

			if (data.error == 'AuthError'){
				$rootScope.esTerminal = true;
				$dialogs.error('Los datos de inicio de sesión son incorrectos');
			} else {
				//Por ahora solo acceso a terminales
				$rootScope.esTerminal = false;
				$rootScope.dataUser = data;
				loginService.setStatus(true);
				loginService.setToken(data.token.token);
				$location.url('/pricelist');
			}
		}
	)}

}
