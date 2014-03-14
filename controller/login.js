/**
 * Created by Diego Reyes on 1/23/14.
 */
function loginCtrl($scope, $rootScope, userService, $location){
	'use strict'

	$scope.login = function(){
		userService.loginApp($scope.email, $scope.password, function(data){
			if (data.token != null | data.token != ''){
				//Por ahora solo acceso a terminales
				$rootScope.esTerminal = true;
				$location.url('/pricelist');
			}
		})
	}

}
