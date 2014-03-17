/**
 * Created by Diego Reyes on 1/23/14.
 */
function loginCtrl($scope, $rootScope, userService, $location, $dialogs){
	'use strict'

	$scope.login = function(){
		userService.loginApp($scope.email, $scope.password, function(data){
			console.log(data);
			if (data.error == 'AuthError'){
				$rootScope.esTerminal = false;
				$dialogs.error('Los datos de inicio de sesión son incorrectos');
			} else {
				//Por ahora solo acceso a terminales
				$rootScope.esTerminal = true;
				$rootScope.dataUser = data;
				$location.url('/pricelist');
			}
		}
	)}

}
